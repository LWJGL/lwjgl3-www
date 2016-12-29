import {
  NATIVE_ALL
} from '../constants'

export default (prev) => ({
  ...prev,
  version: '3.1.2',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-yoga': {
      id: 'lwjgl-yoga',
      title: 'Yoga bindings',
      description: 'An open-source, cross-platform layout library that implements Flexbox.',
      natives: NATIVE_ALL,
      website: 'https://facebook.github.io/yoga/',
    }
  }
})
