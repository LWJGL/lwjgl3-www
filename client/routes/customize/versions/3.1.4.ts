import { BuildBindings, Version, Binding, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL314,
  byId: {
    ...prev.byId,
    [Binding.LZ4]: {
      id: Binding.LZ4,
      title: 'LZ4',
      description:
        'LZ4 is a lossless data compression algorithm that is focused on compression and decompression speed.',
      natives: NATIVE_ALL,
      website: 'http://lz4.github.io/lz4/',
    },
    [Binding.ODBC]: {
      id: Binding.ODBC,
      title: 'ODBC',
      description:
        'A C programming language interface that makes it possible for applications to access data from a variety of database management systems (DBMSs).',
      website: 'https://docs.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc',
    },
    [Binding.Remotery]: {
      id: Binding.Remotery,
      title: 'Remotery',
      description: 'A realtime CPU/GPU profiler hosted in a single C file with a viewer that runs in a web browser.',
      natives: NATIVE_ALL,
      website: 'https://github.com/Celtoys/Remotery',
    },
    [Binding.Zstandard]: {
      id: Binding.Zstandard,
      title: 'Zstandard',
      description:
        'Zstandard (zstd) is a fast lossless compression algorithm, targeting real-time compression scenarios at zlib-level and better compression ratios.',
      natives: NATIVE_ALL,
      website: 'http://facebook.github.io/zstd/',
    },
  },
});
