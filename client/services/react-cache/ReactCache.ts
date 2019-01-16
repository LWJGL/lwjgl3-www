import { createLRU } from './LRU';

interface Thenable<T> {
  then(resolve: (value: T) => any, reject: (reason: any) => any): any;
}

interface Suspender {
  then(resolve: () => any, reject: () => any): any;
}

interface PendingResult {
  status: 0;
  value: Suspender;
}

interface PendingResult {
  status: 0;
  value: Suspender;
}

interface ResolvedResult<V> {
  status: 1;
  value: V;
}

interface RejectedResult {
  status: 2;
  value: any;
}

type Result<V> = PendingResult | ResolvedResult<V> | RejectedResult;

interface Resource<I, V> {
  read(key: I): V;
  preload(key: I): void;
}

const Pending = 0;
const Resolved = 1;
const Rejected = 2;

function identityHashFn(input: any): string | number {
  return input;
}

const CACHE_LIMIT = 500;
const lru = createLRU(CACHE_LIMIT);
const entries: Map<Resource<any, any>, Map<any, any>> = new Map();

function accessResult<I, K, V>(resource: any, fetch: (key: I) => Thenable<V>, input: I, key: K): Result<V> {
  let entriesForResource = entries.get(resource);
  if (entriesForResource === undefined) {
    entriesForResource = new Map();
    entries.set(resource, entriesForResource);
  }
  let entry = entriesForResource.get(key);
  if (entry === undefined) {
    const thenable = fetch(input);
    thenable.then(
      value => {
        if (newResult.status === Pending) {
          const resolvedResult: ResolvedResult<V> = newResult as any;
          resolvedResult.status = Resolved;
          resolvedResult.value = value;
        }
      },
      error => {
        if (newResult.status === Pending) {
          const rejectedResult: RejectedResult = newResult as any;
          rejectedResult.status = Rejected;
          rejectedResult.value = error;
        }
      }
    );
    const newResult: PendingResult = {
      status: Pending,
      value: thenable,
    };
    const newEntry = lru.add(newResult, deleteEntry.bind(null, resource, key));
    entriesForResource.set(key, newEntry);
    return newResult;
  } else {
    return lru.access(entry) as Result<V>;
  }
}

function deleteEntry(resource: any, key: string | number) {
  const entriesForResource = entries.get(resource);
  if (entriesForResource !== undefined) {
    entriesForResource.delete(key);
    if (entriesForResource.size === 0) {
      entries.delete(resource);
    }
  }
}

export function unstable_createResource<I, V>(
  fetch: (key: I) => Thenable<V>,
  maybeHashInput?: (key: I) => string | number
): Resource<I, V> {
  const hashInput: (key: I) => string | number = maybeHashInput !== undefined ? maybeHashInput : identityHashFn;

  const resource = {
    read(input: I): V {
      const key = hashInput(input);
      const result: Result<V> = accessResult(resource, fetch, input, key);
      switch (result.status) {
        case Pending: {
          const suspender = result.value;
          throw suspender;
        }
        case Resolved: {
          const value = result.value;
          return value;
        }
        case Rejected: {
          const error = result.value;
          throw error;
        }
        default:
          // Should be unreachable
          return undefined as never;
      }
    },

    preload(input: I): void {
      const key = hashInput(input);
      accessResult(resource, fetch, input, key);
    },
  };
  return resource;
}

export function unstable_setGlobalCacheLimit(limit: number) {
  lru.setLimit(limit);
}
