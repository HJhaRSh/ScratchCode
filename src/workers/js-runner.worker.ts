// JS Runner Web Worker
export {};

let inputQueue: string[] = [];
let waitingResolver: ((value: string) => void) | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, rawCode, runId, input_data } = e.data;

  if (type === 'run') {
    (self as any).runId = runId;
    try {
      // Define global functions for the transpiled JS
      (globalThis as any).__printf = (text: string, args: any[]) => {
        // We ignore args here since JS prompt doesn't format
        self.postMessage({ type: 'stdout', data: text });
      };

      (globalThis as any).__error = (err: any) => {
        self.postMessage({ type: 'stderr', data: err?.toString() || 'Unknown error' });
      };

      (globalThis as any).__exit = (code: number) => {
        self.postMessage({ type: 'exit', code });
      };

      (globalThis as any).__next_stdin = (typeInfo: string): string => {
        self.postMessage({ type: 'waiting_for_input' });
        const runId = (self as any).runId || 'default';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/__sync_stdin__?runId=' + runId, false);
        xhr.send(null);
        return xhr.responseText;
      };

      // Wrap prompt
      const originalPrompt = globalThis.prompt;
      globalThis.prompt = function(msg?: string) {
        if (msg) {
          self.postMessage({ type: 'stdout', data: msg + ' ' });
        }
        return (globalThis as any).__next_stdin('string');
      };

      try {
        const execute = new Function(rawCode);
        execute();
        self.postMessage({ type: 'exit', code: 0 });
      } finally {
        globalThis.prompt = originalPrompt;
      }

    } catch (err: any) {
      self.postMessage({ type: 'stderr', data: err?.toString() || 'Unknown error' });
      self.postMessage({ type: 'exit', code: 1 });
    }
  } else if (type === 'stdin') {
    const data = input_data as string;
    // Echo the input back so it looks like the user typed it
    self.postMessage({ type: 'stdout', data: data + '\r\n' });

    if (waitingResolver) {
      const resolve = waitingResolver;
      waitingResolver = null;
      resolve(data);
    } else {
      inputQueue.push(data);
    }
  }
};
