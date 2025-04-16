
// Polyfills for Node.js built-ins that might be required by libraries like simple-peer

// Declare the types we'll be augmenting
declare global {
  interface Window {
    global: typeof globalThis;
    process: any; // Using 'any' to avoid complex Process type implementation
    Buffer: any; // Using 'any' to avoid complex Buffer type implementation
  }
}

// Polyfill for global
if (typeof window !== 'undefined') {
  window.global = window;
  
  // Polyfill for process with minimal implementation
  // Using 'any' type to bypass TypeScript's Process interface requirements
  if (!window.process) {
    window.process = {
      env: {},
      nextTick: (cb: Function, ...args: any[]) => setTimeout(() => cb(...args), 0),
      version: ''
    } as any;
  }
  
  // Polyfill for Buffer with minimal implementation
  // Using 'any' type to bypass TypeScript's Buffer interface requirements
  if (!window.Buffer) {
    window.Buffer = {
      // Using 'as any' to bypass the type predicate requirement
      isBuffer: ((obj: any) => false) as any,
      // Using 'as any' to bypass the complex function signature requirement
      from: ((value: any, encoding?: string) => {
        if (Array.isArray(value)) {
          return new Uint8Array(value);
        } else if (typeof value === 'string') {
          const encoder = new TextEncoder();
          return encoder.encode(value);
        }
        return new Uint8Array();
      }) as any
    };
  }
}

export {};
