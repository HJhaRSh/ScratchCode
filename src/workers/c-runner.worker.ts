self.onmessage = async function (e) {
  if (e.data.type === 'run') {
    const { transpiledJS } = e.data;
    
    let resolveInput: ((val: string) => void) | null = null;
    
    // Replace the outer onmessage with one that listens for input data
    self.onmessage = (msg) => {
      if (msg.data.type === 'stdin' && resolveInput) {
        resolveInput(msg.data.input_data);
        resolveInput = null;
      }
    };

    (self as any).__printf = function (format: string, args: any[]) {
      let out = format;
      for (let i = 0; i < args.length; i++) {
        out = out.replace(/%[-+0 #.0123456789]*[diuoxXfFeEgGaAcspn]/, String(args[i]));
      }
      out = out.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      self.postMessage({ type: 'stdout', data: out });
    };

    (self as any).__next_stdin = function (type: string) {
      self.postMessage({ type: 'waiting_for_input' });
      return new Promise((resolve) => {
        resolveInput = resolve;
      });
    };

    (self as any).__exit = function (code: number) {
      self.postMessage({ type: 'exit', code });
    };

    (self as any).__error = function (err: any) {
      self.postMessage({ type: 'error', message: err.message || err.toString() });
    };

    try {
      // Execute the async program
      eval(transpiledJS);
    } catch (err: any) {
      self.postMessage({ type: 'error', message: err.message || err.toString() });
    }
  }
};
