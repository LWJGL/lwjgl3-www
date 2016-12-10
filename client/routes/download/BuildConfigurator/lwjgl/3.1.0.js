import {
  NATIVE_ALL
} from '../constants'

export default (prev) => {

  const artifacts = {...prev};

  artifacts.byId = {
    ...artifacts.byId,
    'lwjgl-bgfx': {
      id: 'lwjgl-bgfx',
      title: 'bgfx bindings',
      description: 'A cross-platform, graphics API agnostic rendering library. It provides a high performance, low level abstraction for common platform graphics APIs like OpenGL, Direct3D and Apple Metal.',
      natives: NATIVE_ALL,
      website: 'https://github.com/bkaradzic/bgfx',
    },
    'lwjgl-lmdb': {
      id: 'lwjgl-lmdb',
      title: 'LMDB bindings',
      description: 'A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API.',
      natives: NATIVE_ALL,
      website: 'https://symas.com/products/lightning-memory-mapped-database/',
    },
    'lwjgl-nuklear': {
      id: 'lwjgl-nuklear',
      title: 'Nuklear bindings',
      description: 'A minimal state immediate mode graphical user interface toolkit.',
      natives: NATIVE_ALL,
      website: 'https://github.com/vurtun/nuklear',
    },
    'lwjgl-tinyfd': {
      id: 'lwjgl-tinyfd',
      title: 'Tiny File Dialogs bindings',
      description: 'Provides basic modal dialogs.',
      natives: NATIVE_ALL,
      website: 'https://sourceforge.net/projects/tinyfiledialogs/files/',
    }
  };

  artifacts.allIds = Object.keys(artifacts.byId).sort();

  return artifacts;
};
