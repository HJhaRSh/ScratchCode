// Python Runner Web Worker using Pyodide
export {};

let inputQueue: string[] = [];
let waitingResolver: ((value: string) => void) | null = null;
let pyodideInstance: any = null;

// Declare global Pyodide function
declare const loadPyodide: any;

self.onmessage = async (e: MessageEvent) => {
  const { type, rawCode, runId } = e.data;

  if (type === 'run') {
    (self as any).runId = runId;
    try {
      // Load Pyodide if not already loaded
      if (!pyodideInstance) {
        self.postMessage({ type: 'stdout', data: '\x1b[38;5;240m> Initializing Pyodide...\x1b[0m\r\n' });
        
        // Import pyodide using importScripts
        (self as any).importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
        
        pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
          stdout: (text: string) => {
            self.postMessage({ type: 'stdout', data: text + '\r\n' });
          },
          stderr: (text: string) => {
            self.postMessage({ type: 'stderr', data: text + '\r\n' });
          }
        });
      }

      // Expose the input function to python
      (globalThis as any).__next_stdin_py = (prompt_text: string): string => {
        if (prompt_text) {
          self.postMessage({ type: 'stdout', data: prompt_text });
        }
        self.postMessage({ type: 'waiting_for_input' });
        
        const rId = (self as any).runId || 'default';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/__sync_stdin__?runId=' + rId, false);
        xhr.send(null);
        return xhr.responseText;
      };

      // Set up the synchronous input wrapper
      pyodideInstance.runPython(`
import builtins
from js import __next_stdin_py

def sync_input(prompt=""):
    return __next_stdin_py(prompt)

builtins.input = sync_input
      `);

      // Execute user code
      pyodideInstance.runPython(rawCode);
      
      self.postMessage({ type: 'exit', code: 0 });

    } catch (err: any) {
      if (err.message && err.message.includes('SyntaxError')) {
        self.postMessage({ type: 'stderr', data: err.message });
      } else {
        self.postMessage({ type: 'stderr', data: err?.toString() || 'Unknown error' });
      }
      self.postMessage({ type: 'exit', code: 1 });
    }
  }
};
