// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.2.1',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-bullet': {
      id: 'lwjgl-bullet',
      title: 'Bullet Physics',
      description: 'Real-time collision detection and multi-physics simulation for VR, games, visual effects, robotics, machine learning etc.',
      natives: NATIVE_ALL,
      website: 'http://bulletphysics.org/',
    },
    'lwjgl-libdivide': {
      id: 'lwjgl-libdivide',
      title: 'libdivide',
      description: 'A library that replaces expensive integer divides with comparatively cheap multiplication and bitshifts.',
      natives: NATIVE_ALL,
      website: 'https://libdivide.com/',
    },
    'lwjgl-opus': {
      id: 'lwjgl-opus',
      title: 'Opus',
      description: 'Opus is a totally open, royalty-free, highly versatile audio codec.',
      natives: NATIVE_ALL,
      website: 'https://opus-codec.org/',
    },
  },
});
