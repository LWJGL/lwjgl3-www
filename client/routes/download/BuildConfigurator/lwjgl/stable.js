import {
  NATIVE_ALL
} from '../constants'

export default (prev) => ({
  ...prev,
  version: '3.1.1',
  alias: 'stable',
  byId: {
    ...prev.byId,
    'lwjgl-assimp': {
      id: 'lwjgl-assimp',
      title: 'Assimp bindings',
      description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
      natives: NATIVE_ALL,
      website: 'http://www.assimp.org/',
    },
  }
})
