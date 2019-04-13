declare class JSZip {
  static support: {
    blob: boolean;
  };
  file: (filename: string, payload: any, options: { binary: boolean }) => void;
  generateAsync: (options: {
    type: 'blob';
    compression?: 'DEFLATE';
    compressionOptions?: { level: number };
  }) => Promise<Blob>;
}
