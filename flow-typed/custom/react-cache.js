declare module 'react-cache' {
  declare export type Cache = {
    invalidate(): void,
    read<K, V, A>(resourceType: mixed, key: K, miss: (A) => Promise<V>, missArg: A): V,
    preload<K, V, A>(resourceType: mixed, key: K, miss: (A) => Promise<V>, missArg: A): void,
  };

  declare export type Resource<K, V> = {|
    read(Cache, K): V,
    preload(cache: Cache, key: K): void,
  |};

  declare type primitive = string | number | boolean | void | null;

  declare export function createCache(invalidator?: () => mixed): Cache;
  declare export function createResource<V, K, H: primitive>(
    loadResource: (K) => Promise<V>,
    hash?: (K) => H
  ): Resource<K, V>;
}
