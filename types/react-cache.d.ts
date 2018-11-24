declare module 'react-cache' {
  interface Resource<K, V> {
    read(key: K): V;
    preload(key: K): void;
  }

  export function unstable_createResource<K, V>(
    loadResource: (key: K) => Promise<V>,
    hash?: (key: K) => string | number
  ): Resource<K, V>;
}
