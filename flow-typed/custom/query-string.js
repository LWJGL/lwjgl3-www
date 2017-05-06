declare module 'query-string' {
  declare type ArrayFormat = 'none' | 'bracket' | 'index';

  declare type ParseOptions = {
    arrayFormat: ArrayFormat,
  };

  declare type StringifyOptions = {
    strict: boolean,
    encode: boolean,
    arrayFormat: ArrayFormat,
  };

  declare export var parse: (query: string, options?: ParseOptions) => {};

  declare export var stringify: (object: {}, options?: StringifyOptions) => string;

  declare export var extract: (url: string) => string;
}
