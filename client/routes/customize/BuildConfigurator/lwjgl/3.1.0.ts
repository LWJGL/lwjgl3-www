import { NATIVE_ALL } from '../constants';
import { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.0',
  byId: {
    ...prev.byId,
    'lwjgl-bgfx': {
      id: 'lwjgl-bgfx',
      title: 'bgfx',
      description:
        'A cross-platform, graphics API agnostic rendering library. It provides a high performance, low level abstraction for common platform graphics APIs like OpenGL, Direct3D and Apple Metal.',
      natives: NATIVE_ALL,
      website: 'https://github.com/bkaradzic/bgfx',
      presets: ['getting-started'],
    },
    'lwjgl-lmdb': {
      id: 'lwjgl-lmdb',
      title: 'LMDB',
      description:
        'A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API.',
      natives: NATIVE_ALL,
      website: 'https://symas.com/products/lightning-memory-mapped-database/',
    },
    'lwjgl-nuklear': {
      id: 'lwjgl-nuklear',
      title: 'Nuklear',
      description: 'A minimal state immediate mode graphical user interface toolkit.',
      natives: NATIVE_ALL,
      website: 'https://github.com/vurtun/nuklear',
      presets: ['getting-started'],
    },
    'lwjgl-tinyfd': {
      id: 'lwjgl-tinyfd',
      title: 'Tiny File Dialogs',
      description: 'Provides basic modal dialogs.',
      natives: NATIVE_ALL,
      website: 'https://sourceforge.net/projects/tinyfiledialogs/files/',
    },
  },
});
