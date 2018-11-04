import { BuildBindings, Version, Binding, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL313,
  byId: {
    ...prev.byId,
    [Binding.Rpmalloc]: {
      id: Binding.Rpmalloc,
      title: 'rpmalloc',
      description:
        'A public domain cross platform lock free thread caching 16-byte aligned memory allocator implemented in C.',
      natives: NATIVE_ALL,
      website: 'https://github.com/rampantpixels/rpmalloc',
    },
  },
});
