import { Version, Binding, NATIVE_LTE_322 } from '../types';
import type { BuildBindings } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL313,
  byId: {
    ...prev.byId,
    [Binding.RPMALLOC]: {
      id: Binding.RPMALLOC,
      title: 'rpmalloc',
      description:
        'A public domain cross platform lock free thread caching 16-byte aligned memory allocator implemented in C.',
      natives: NATIVE_LTE_322,
      website: 'https://github.com/rampantpixels/rpmalloc',
    },
  },
});
