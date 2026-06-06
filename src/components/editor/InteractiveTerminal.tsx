import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { AlertTriangle } from 'lucide-react';
import { transpileCtoJS } from '@/lib/cCompiler';

interface InteractiveTerminalProps {
  code: string;
  language: string;
  runId: number;
  onExecutionComplete?: () => void;
}

export default function InteractiveTerminal({ code, language, runId, onExecutionComplete }: InteractiveTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  const [isRunning, setIsRunning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputBufferRef = useRef<string>('');
  
  // Keep refs for latest values to avoid re-running useEffect
  const latestCode = useRef(code);
  const latestLanguage = useRef(language);
  const latestOnExecutionComplete = useRef(onExecutionComplete);

  useEffect(() => {
    latestCode.current = code;
    latestLanguage.current = language;
    latestOnExecutionComplete.current = onExecutionComplete;
  }, [code, language, onExecutionComplete]);

  // Setup terminal and service worker
  useEffect(() => {
    if (!terminalRef.current) return;

    // Register Service Worker for synchronous standard input
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-stdin.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#050505',
        foreground: '#e2e8f0',
        cursor: '#38bdf8',
        selectionBackground: '#1e293b',
      },
      fontFamily: '"Fira Code", monospace',
      fontSize: 13,
      cursorBlink: true,
      convertEol: true,
    });
    xtermRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    const disposable = term.onData((data) => {
      if (!isRunning || !workerRef.current) return;
      
      if (data === '\r') {
        term.write('\r\n');
        
        // For C, send to Worker directly
        if (latestLanguage.current.toLowerCase() === 'c') {
          workerRef.current.postMessage({ type: 'stdin', input_data: inputBufferRef.current });
        } else {
          // For Python/JS, send to Service Worker to resolve sync XHR
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'STDIN_INPUT',
              runId: runId.toString(),
              data: inputBufferRef.current
            });
            // Also mirror it to worker in case it uses async input mechanism
            workerRef.current.postMessage({ type: 'stdin', input_data: inputBufferRef.current });
          } else {
            workerRef.current.postMessage({ type: 'stdin', input_data: inputBufferRef.current });
          }
        }
        inputBufferRef.current = '';
      } else if (data === '\u007F') { // Backspace
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputBufferRef.current += data;
        term.write(data);
      }
    });

    startExecution(term);

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      disposable.dispose();
      term.dispose();
    };
  }, [runId]); // ONLY re-run when runId changes!

  const startExecution = (term: Terminal) => {
    setIsRunning(true);
    setError(null);
    term.clear();
    term.writeln('\x1b[38;5;240m> Compiling and running...\x1b[0m');

    const lang = latestLanguage.current.toLowerCase();
    
    let payloadCode = latestCode.current;

    try {
      if (lang === 'c') {
        payloadCode = transpileCtoJS(latestCode.current);
      } else if (lang === 'javascript' || lang === 'js') {
        payloadCode = latestCode.current;
      }
    } catch (err: any) {
      setError(`Compilation failed: ${err.message}`);
      setIsRunning(false);
      if (latestOnExecutionComplete.current) latestOnExecutionComplete.current();
      return;
    }

    // Initialize Web Worker using standard Webpack syntax
    if (lang === 'c') {
      workerRef.current = new Worker(new URL('../../workers/c-runner.worker.ts', import.meta.url));
    } else if (lang === 'javascript' || lang === 'js') {
      workerRef.current = new Worker(new URL('../../workers/js-runner.worker.ts', import.meta.url));
    } else if (lang === 'python' || lang === 'py') {
      workerRef.current = new Worker(new URL('../../workers/python-runner.worker.ts', import.meta.url));
    } else {
      throw new Error("Worker not found");
    }

    workerRef.current.onmessage = (e) => {
      const { type, data, code: exitCode, message } = e.data;
      if (type === 'stdout') {
        term.write(data);
      } else if (type === 'stderr') {
        term.write(`\x1b[31m${data}\x1b[0m\r\n`);
      } else if (type === 'waiting_for_input') {
        term.write('\x1b[32m\x1b[0m');
      } else if (type === 'exit') {
        setIsRunning(false);
        if (exitCode === 0) {
          term.write(`\r\n\x1b[38;5;40m> Program exited successfully.\x1b[0m\r\n`);
        } else {
          term.write(`\r\n\x1b[31m> Program exited with code ${exitCode}\x1b[0m\r\n`);
        }
        if (latestOnExecutionComplete.current) latestOnExecutionComplete.current();
      } else if (type === 'error') {
        setError(message);
        setIsRunning(false);
        if (latestOnExecutionComplete.current) latestOnExecutionComplete.current();
      }
    };

    workerRef.current.onerror = (err) => {
      setError(`Worker Error: ${err.message || 'Failed to initialize execution engine'}`);
      setIsRunning(false);
      if (onExecutionComplete) onExecutionComplete();
    };

    // Start execution
    workerRef.current.postMessage({
      type: 'run',
      transpiledJS: payloadCode,
      rawCode: latestCode.current,
      runId: runId.toString()
    });
  };

  const sendInputToWorker = (inputStr: string) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'input_data', data: inputStr.trim() });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-1.5 leading-relaxed bg-[#050505] p-2 rounded border border-white/10">
      {error && (
        <div className="text-rose-500 bg-rose-950/15 p-3 border border-rose-950/30 rounded font-semibold whitespace-pre-wrap flex gap-2 mb-2 shrink-0">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
          <div>
            <strong>Compilation/Execution Error:</strong>
            <div className="mt-1 font-normal font-mono text-rose-350">{error}</div>
          </div>
        </div>
      )}
      <div 
        ref={terminalRef} 
        className="flex-1 w-full h-full overflow-hidden" 
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
