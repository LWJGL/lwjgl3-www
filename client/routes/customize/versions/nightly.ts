import { BuildBindings, Version, Binding, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL323,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
    [Binding.BULLET]: {
      id: Binding.BULLET,
      title: 'Bullet Physics',
      description:
        'Real-time collision detection and multi-physics simulation for VR, games, visual effects, robotics, machine learning etc.',
      natives: NATIVE_ALL,
      website: 'http://bulletphysics.org/',
    },
    [Binding.SHADERC]: {
      id: Binding.SHADERC,
      title: 'Shaderc',
      description:
        'A collection of libraries for shader compilation.',
      natives: NATIVE_ALL,
      website: 'https://github.com/google/shaderc',
    },
  },
});
