import { BuildBindings, Version, Binding, Preset, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL310,
  byId: {
    ...prev.byId,
    [Binding.Bgfx]: {
      id: Binding.Bgfx,
      title: 'bgfx',
      description:
        'A cross-platform, graphics API agnostic rendering library. It provides a high performance, low level abstraction for common platform graphics APIs like OpenGL, Direct3D and Apple Metal.',
      natives: NATIVE_ALL,
      website: 'https://github.com/bkaradzic/bgfx',
      presets: [Preset.GettingStarted],
    },
    [Binding.LMDB]: {
      id: Binding.LMDB,
      title: 'LMDB',
      description:
        'A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API.',
      natives: NATIVE_ALL,
      website: 'https://symas.com/products/lightning-memory-mapped-database/',
    },
    [Binding.Nuklear]: {
      id: Binding.Nuklear,
      title: 'Nuklear',
      description: 'A minimal state immediate mode graphical user interface toolkit.',
      natives: NATIVE_ALL,
      website: 'https://github.com/vurtun/nuklear',
      presets: [Preset.GettingStarted],
    },
    [Binding.TinyFD]: {
      id: Binding.TinyFD,
      title: 'Tiny File Dialogs',
      description: 'Provides basic modal dialogs.',
      natives: NATIVE_ALL,
      website: 'https://sourceforge.net/projects/tinyfiledialogs/files/',
    },
  },
});
