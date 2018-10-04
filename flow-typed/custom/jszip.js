declare module 'jszip' {
  declare export type COMPRESSION = 'STORE' | 'DEFLATE';
  declare export type ZIP_TYPES = 'base64' | 'binarystring' | 'uint8array' | 'arraybuffer' | 'blob' | 'nodebuffer';
  declare export type PLATFORMS = 'DOS' | 'UNIX';

  declare export type CompressionOptions = {
    level: number,
  };

  declare export type ZipObject = {
    name: string,
    dir: boolean,
    date: Date,
    comment: string,
    unixPermissions: number,
    dosPermissions: number,
    options: {
      compression: COMPRESSION,
      compressionOptions: null | CompressionOptions,
    },
  };

  declare export type Options = {
    base64?: boolean,
    binary?: boolean,
    date?: Date,
    compression?: COMPRESSION,
    compressionOptions?: CompressionOptions,
    comment?: string,
    optimizedBinaryString?: boolean,
    createFolders?: boolean,
    unixPermissions?: number,
    dosPermissions?: number,
    dir?: boolean,
  };

  declare export type GenerateOptions = {
    compression?: COMPRESSION,
    compressionOptions?: CompressionOptions,
    type?: ZIP_TYPES,
    comment?: string,
    mimeType?: string,
    platform?: PLATFORMS,
    encodeFileName?: (name: string) => Uint8Array,
    streamFiles?: boolean,
  };

  declare export type Metadata = {
    percent: number,
    currentFile: string,
  };

  declare export type StreamHelperEvent = 'data' | 'end' | 'error';

  declare class StreamHelper {
    on(event: StreamHelperEvent, callback: (chunk: Uint8Array, metadata: Metadata) => void): StreamHelper;
    on(event: StreamHelperEvent, callback: (e: Error) => void): StreamHelper;
    on(event: StreamHelperEvent, callback: () => void): StreamHelper;
    accumulate(updateCallback: (metadata: Metadata) => void): Promise<any>;
    resume(): StreamHelper;
    pause(): StreamHelper;
  }

  declare type LoadOptions = {
    base64?: boolean,
    checkCRC32?: boolean,
    optimizedBinaryString?: boolean,
    createFolders?: boolean,
    decodeFileName?: (name: Uint8Array) => string,
    decodeFileName?: (name: Array<string>) => string,
  };

  declare class JSZip {
    constructor(): void;
    file(name: string): ZipObject;
    file(regex: RegExp): Array<ZipObject>;
    file(name: string, data: string, options?: Options): this;
    file(name: string, data: ArrayBuffer, options?: Options): this;
    file(name: string, data: Uint8Array, options?: Options): this;
    file(name: string, data: Buffer, options?: Options): this;
    file(name: string, data: Blob, options?: Options): this;
    file(name: string, data: Promise<any>, options?: Options): this;

    folder(name: string): this;
    folder(name: RegExp): Array<ZipObject>;

    forEach(callback: (relativePath: string, file: ZipObject) => void): void;
    filter(predicate: (relativePath: string, file: ZipObject) => void): Array<ZipObject>;

    remove(name: string): this;

    generateAsync(options: GenerateOptions, onUpdate?: (metadata: Metadata) => void): Promise<any>;
    generateInternalStream(options: GenerateOptions): StreamHelper;

    loadAsync(data: string, options: LoadOptions): Promise<any>;

    static loadAsync(data: string, options: LoadOptions): Promise<any>;

    static support: {
      +arraybuffer: boolean,
      +uint8array: boolean,
      +blob: boolean,
      +nodebuffer: boolean,
      +nodestream: boolean,
    };

    static external: {
      Promise: any,
    };

    static +version: string;
  }

  declare export default Class<JSZip>;
}
