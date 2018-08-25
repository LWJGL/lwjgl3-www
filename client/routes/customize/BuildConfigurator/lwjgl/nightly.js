// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.2.1',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-opus': {
      id: 'lwjgl-opus',
      title: 'Opus bindings',
      description: 'Opus is a totally open, royalty-free, highly versatile audio codec.',
      natives: NATIVE_ALL,
      website: 'https://opus-codec.org/',
    },
  },
});
