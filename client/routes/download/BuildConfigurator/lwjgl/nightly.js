import {
  NATIVE_ALL
} from '../constants'

export default (prev) => ({
  ...prev,
  version: '3.1.1',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-opengl': {
      ...prev.byId['lwjgl-opengl'],
      natives: NATIVE_ALL,
    },
    'lwjgl-opengles': {
        ...prev.byId['lwjgl-opengles'],
        natives: NATIVE_ALL,
    }
  }
})
