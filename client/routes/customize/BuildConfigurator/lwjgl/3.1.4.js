// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.4',
  byId: {
    ...prev.byId,
    'lwjgl-lz4': {
      id: 'lwjgl-lz4',
      title: 'LZ4',
      description:
        'LZ4 is a lossless data compression algorithm that is focused on compression and decompression speed.',
      natives: NATIVE_ALL,
      website: 'http://lz4.github.io/lz4/',
    },
    'lwjgl-odbc': {
      id: 'lwjgl-odbc',
      title: 'ODBC',
      description:
        'A C programming language interface that makes it possible for applications to access data from a variety of database management systems (DBMSs).',
      website: 'https://docs.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc',
    },
    'lwjgl-remotery': {
      id: 'lwjgl-remotery',
      title: 'Remotery',
      description: 'A realtime CPU/GPU profiler hosted in a single C file with a viewer that runs in a web browser.',
      natives: NATIVE_ALL,
      website: 'https://github.com/Celtoys/Remotery',
    },
    'lwjgl-zstd': {
      id: 'lwjgl-zstd',
      title: 'Zstandard',
      description:
        'Zstandard (zstd) is a fast lossless compression algorithm, targeting real-time compression scenarios at zlib-level and better compression ratios.',
      natives: NATIVE_ALL,
      website: 'http://facebook.github.io/zstd/',
    },
  },
});
