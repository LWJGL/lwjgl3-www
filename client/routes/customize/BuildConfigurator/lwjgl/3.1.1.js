// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.1',
  byId: {
    ...prev.byId,
    'lwjgl-assimp': {
      id: 'lwjgl-assimp',
      title: 'Assimp bindings',
      description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
      natives: NATIVE_ALL,
      website: 'http://www.assimp.org/',
      presets: ['getting-started', 'minimal-opengl', 'minimal-opengles', 'minimal-vulkan'],
    },
    'lwjgl-opengl': {
      ...prev.byId['lwjgl-opengl'],
      natives: NATIVE_ALL,
    },
    'lwjgl-opengles': {
      ...prev.byId['lwjgl-opengles'],
      natives: NATIVE_ALL,
    },
  },
});
