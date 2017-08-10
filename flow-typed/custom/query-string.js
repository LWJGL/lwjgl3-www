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

  declare type ParseValues = {
    [key: string]: string | string[],
  };

  declare export var parse: (query: string, options?: ParseOptions) => ParseValues;

  declare export var stringify: (object: {}, options?: StringifyOptions) => string;

  declare export var extract: (url: string) => string;
}
