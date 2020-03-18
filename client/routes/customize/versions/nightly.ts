import { Binding, BuildBindings, NATIVE_ALL, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL324,
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
    [Binding.DRIFTFX]: {
      id: Binding.DRIFTFX,
      title: 'DriftFX',
      description: 'A library that allows you to render any OpenGL content directly into JavaFX nodes.',
      natives: NATIVE_ALL,
      website: 'http://bulletphysics.org/',
    },
    [Binding.MESHOPTIMIZER]: {
      id: Binding.MESHOPTIMIZER,
      title: 'meshoptimizer',
      description: 'A mesh optimization library that makes meshes smaller and faster to render.',
      natives: NATIVE_ALL,
      website: 'http://bulletphysics.org/',
    },
    [Binding.SPVC]: {
      id: Binding.SPVC,
      title: 'SPIRV-Cross',
      description:
        'A library for performing reflection on SPIR-V and disassembling SPIR-V back to high level languages.',
      natives: NATIVE_ALL,
      website: 'https://github.com/KhronosGroup/SPIRV-Cross',
    },
  },
});
