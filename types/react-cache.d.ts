declare module 'react-cache' {
  interface Cache {
    invalidate(): void;
    read<K, V, A>(resourceType: any, key: K, miss: (missArg: A) => Promise<V>, missArg: A): V;
    preload<K, V, A>(resourceType: any, key: K, miss: (missArg: A) => Promise<V>, missArg: A): void;
  }

  interface Resource<K, V> {
    read(cache: Cache, key: K): V;
    preload(cache: Cache, key: K): void;
  }

  export function createCache(invalidator?: () => any): Cache;
  export function createResource<K, V>(
    loadResource: (key: K) => Promise<V>,
    hash?: (key: K) => string | number
  ): Resource<K, V>;
}
