import { NATIVE_ALL } from '../constants';
import { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.2.1',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-bullet': {
      id: 'lwjgl-bullet',
      title: 'Bullet Physics',
      description:
        'Real-time collision detection and multi-physics simulation for VR, games, visual effects, robotics, machine learning etc.',
      natives: NATIVE_ALL,
      website: 'http://bulletphysics.org/',
    },
    'lwjgl-cuda': {
      id: 'lwjgl-cuda',
      title: 'CUDA',
      description:
        'A parallel computing platform and programming model developed by NVIDIA for general computing on GPUs.',
      website: 'https://developer.nvidia.com/cuda-zone/',
    },
    'lwjgl-libdivide': {
      id: 'lwjgl-libdivide',
      title: 'libdivide',
      description:
        'A library that replaces expensive integer divides with comparatively cheap multiplication and bitshifts.',
      natives: NATIVE_ALL,
      website: 'https://libdivide.com/',
    },
    'lwjgl-meow': {
      id: 'lwjgl-meow',
      title: 'Meow hash',
      description: 'An extremely fast non-cryptographic hash.',
      natives: NATIVE_ALL,
      website: 'https://github.com/cmuratori/meow_hash/',
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
