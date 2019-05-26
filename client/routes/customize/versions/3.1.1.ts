import { BuildBindings, Version, Binding, Preset, NATIVE_NO_ARM, BindingDefinition } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL311,
  byId: {
    ...prev.byId,
    [Binding.ASSIMP]: {
      id: Binding.ASSIMP,
      title: 'Assimp',
      description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
      natives: NATIVE_NO_ARM,
      website: 'http://www.assimp.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.OPENGL]: {
      ...(prev.byId[Binding.OPENGL] as BindingDefinition),
      natives: NATIVE_NO_ARM,
    },
    [Binding.OPENGLES]: {
      ...(prev.byId[Binding.OPENGLES] as BindingDefinition),
      natives: NATIVE_NO_ARM,
    },
  },
});
