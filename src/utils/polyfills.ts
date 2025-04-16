
// Polyfills for Node.js built-ins that might be required by libraries like simple-peer

// Polyfill for global
if (typeof window !== 'undefined') {
  window.global = window;
  
  // Polyfill for process
  if (!window.process) {
    window.process = {
      env: {},
      nextTick: (cb: Function, ...args: any[]) => setTimeout(() => cb(...args), 0),
      version: ''
    };
  }
  
  // Polyfill for Buffer
  if (!window.Buffer) {
    window.Buffer = {
      isBuffer: () => false,
      from: (value: any, encoding?: string) => {
        if (Array.isArray(value)) {
          return new Uint8Array(value);
        } else if (typeof value === 'string') {
          const encoder = new TextEncoder();
          return encoder.encode(value);
        }
        return new Uint8Array();
      }
    };
  }
}

export {};
