type Resolver<K, T> = (key: K) => Promise<T>;

enum Status {
  Pending,
  Resolved,
  Rejected,
}

export class Resource<K, T> {
  status: Status = Status.Pending;
  resolver: Promise<T>;
  data: T | null = null;
  err: Error | null = null;

  constructor(key: K, resolver: Resolver<K, T>) {
    this.resolver = resolver(key);
    this.resolver
      .then((data) => {
        this.data = data;
        this.status = Status.Resolved;
      })
      .catch((err) => {
        this.err = err;
        this.status = Status.Rejected;
      });
  }

  read(): T {
    if (this.status === Status.Pending) {
      throw this.resolver;
    }
    if (this.status === Status.Rejected) {
      throw this.err;
    }
    return this.data as T;
  }
}

export class ResourceCache<K, T> {
  cache = new Map<K, Resource<K, T>>();
  maxItems: number;
  resolver: Resolver<K, T>;

  /**
   *
   * @param resolver - Async function that resolves K key to T value
   * @param maxItems - The maximum number of items to cache. 0 means Infinite.
   */
  constructor(resolver: Resolver<K, T>, maxItems: number = 0) {
    this.resolver = resolver;
    this.maxItems = maxItems > 0 ? maxItems : 0;
  }

  get(key: K) {
    let resource = this.cache.get(key);

    if (resource === undefined) {
      resource = new Resource(key, this.resolver);
      this.cache.set(key, resource);

      if (this.maxItems > 0 && this.cache.size > this.maxItems) {
        this.cache.delete(this.cache.keys().next().value);
      }
    }

    return resource;
  }

  load(key: K) {
    this.get(key);
  }

  read(key: K) {
    return this.get(key).read();
  }
}
