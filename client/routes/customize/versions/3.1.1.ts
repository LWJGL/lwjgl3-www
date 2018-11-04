import { BuildBindings, Version, Binding, Preset, NATIVE_ALL, BindingDefinition } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL311,
  byId: {
    ...prev.byId,
    [Binding.Assimp]: {
      id: Binding.Assimp,
      title: 'Assimp',
      description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
      natives: NATIVE_ALL,
      website: 'http://www.assimp.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.OpenGL]: {
      ...(prev.byId[Binding.OpenGL] as BindingDefinition),
      natives: NATIVE_ALL,
    },
    [Binding.OpenGLES]: {
      ...(prev.byId[Binding.OpenGLES] as BindingDefinition),
      natives: NATIVE_ALL,
    },
  },
});
