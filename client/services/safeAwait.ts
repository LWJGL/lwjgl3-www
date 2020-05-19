const nativeExceptions = [EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].filter(
  (except) => typeof except === 'function'
);

/* Throw native errors. ref: https://bit.ly/2VsoCGE */
function throwNative(error: Error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) {
      throw error;
    }
  }
}

function emptyFn() {}

type SafePromiseError = [Error, null];
type SafePromiseResolve<T> = [null, T];
type SafePromise<T> = Promise<SafePromiseError | SafePromiseResolve<T>>;

export function safeAwait<T>(promise: Promise<T>, finallyFunc = emptyFn): SafePromise<T> {
  return promise
    .then((data) => {
      if (data instanceof Error) {
        throwNative(data);
        return [data, null] as SafePromiseError;
      }
      return [null, data] as SafePromiseResolve<T>;
    })
    .catch((error) => {
      throwNative(error);
      return [error, null] as SafePromiseError;
    })
    .finally(finallyFunc);
}
