import {
  NATIVE_ALL
} from '../constants'

export default (prev) => ({
  ...prev,
  version: '3.1.2',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-tinyexr': {
      id: 'lwjgl-tinyexr',
      title: 'Tiny OpenEXR bindings',
      description: 'A small library to load and save OpenEXR(.exr) images.',
      natives: NATIVE_ALL,
      website: 'https://github.com/syoyo/tinyexr',
    },
    'lwjgl-yoga': {
      id: 'lwjgl-yoga',
      title: 'Yoga bindings',
      description: 'An open-source, cross-platform layout library that implements Flexbox.',
      natives: NATIVE_ALL,
      website: 'https://facebook.github.io/yoga/',
    }
  }
})
