import { Version, Binding, Preset, NATIVE_LTE_322 } from '../types';
import type { BuildBindings } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL310,
  byId: {
    ...prev.byId,
    [Binding.BGFX]: {
      id: Binding.BGFX,
      title: 'bgfx',
      description:
        'A cross-platform, graphics API agnostic rendering library. It provides a high performance, low level abstraction for common platform graphics APIs like OpenGL, Direct3D and Apple Metal.',
      natives: NATIVE_LTE_322,
      website: 'https://github.com/bkaradzic/bgfx',
      presets: [Preset.GettingStarted],
    },
    [Binding.LMDB]: {
      id: Binding.LMDB,
      title: 'LMDB',
      description:
        'A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API.',
      natives: NATIVE_LTE_322,
      website: 'https://symas.com/products/lightning-memory-mapped-database/',
    },
    [Binding.NUKLEAR]: {
      id: Binding.NUKLEAR,
      title: 'Nuklear',
      description: 'A minimal state immediate mode graphical user interface toolkit.',
      natives: NATIVE_LTE_322,
      website: 'https://github.com/vurtun/nuklear',
      presets: [Preset.GettingStarted],
    },
    [Binding.TINYFD]: {
      id: Binding.TINYFD,
      title: 'Tiny File Dialogs',
      description: 'Provides basic modal dialogs.',
      natives: NATIVE_LTE_322,
      website: 'https://sourceforge.net/projects/tinyfiledialogs/files/',
    },
  },
});
