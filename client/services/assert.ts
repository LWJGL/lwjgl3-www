export class AssertionError extends Error {
  constructor(message: string = 'Assertion error!', options?: ErrorOptions) {
    super(message, options);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError);
    }

    this.name = 'AssertionError';
  }
}

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(`Expected 'val' to be defined, but received ${val}`);
  }
}

// export function assertIsString(val: any): asserts val is string {
//   if (typeof val !== 'string') {
//     throw new AssertionError('Not a string!');
//   }
// }

// export function assertIsArrayOfStrings(obj: any): asserts obj is string[] {
//   if (!Array.isArray(obj) || obj.some((val) => typeof val !== 'string')) {
//     throw new AssertionError(`Expected 'obj' to be array of strings`);
//   }
// }
