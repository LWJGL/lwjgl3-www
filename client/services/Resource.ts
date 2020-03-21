type Status = 0 | 1 | 2;
type Resolver<K, T> = (key: K) => Promise<T>;

const Pending: Status = 0;
const Resolved: Status = 1;
const Rejected: Status = 2;

export class Resource<K, T> {
  status: Status = Pending;
  resolver: Promise<T>;
  data: T | null | Error = null;

  constructor(key: K, resolver: Resolver<K, T>) {
    this.resolver = resolver(key);
    this.resolver
      .then((data) => {
        this.data = data;
        this.status = Resolved;
      })
      .catch((err) => {
        this.data = err;
        this.status = Rejected;
      });
  }

  read(): T {
    if (this.status === Pending) {
      throw this.resolver;
    }
    if (this.status === Rejected) {
      throw this.data as Error;
    }
    return this.data as T;
  }
}

export class ResourceCached<K, T> {
  cache = new Map<K, Resource<K, T>>();
  resolver: Resolver<K, T>;

  constructor(resolver: Resolver<K, T>) {
    this.resolver = resolver;
  }

  get(key: K) {
    let resource = this.cache.get(key);

    if (resource === undefined) {
      resource = new Resource(key, this.resolver);
      this.cache.set(key, resource);
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
