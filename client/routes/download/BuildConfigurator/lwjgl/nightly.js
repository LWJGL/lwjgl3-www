import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.3',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-rpmalloc': {
      id: 'lwjgl-rpmalloc',
      title: 'rpmalloc bindings',
      description:
        'A public domain cross platform lock free thread caching 16-byte aligned memory allocator implemented in C.',
      natives: NATIVE_ALL,
      website: 'https://github.com/rampantpixels/rpmalloc',
    },
  },
});
