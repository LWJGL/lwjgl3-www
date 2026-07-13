import { Binding, BuildBindings, NATIVE_ALL, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL342,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
    [Binding.MIMALLOC]: {
      id: Binding.MIMALLOC,
      title: 'mimalloc',
      description: 'A compact general purpose allocator with excellent performance.',
      natives: NATIVE_ALL,
      website: 'https://microsoft.github.io/mimalloc/',
    },
  },
});
