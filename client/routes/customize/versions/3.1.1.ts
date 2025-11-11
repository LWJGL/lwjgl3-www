import { Version, Binding, Preset, NATIVE_LTE_322 } from '../types';
import type { BuildBindings, BindingDefinition } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL311,
  byId: {
    ...prev.byId,
    [Binding.ASSIMP]: {
      id: Binding.ASSIMP,
      title: 'Assimp',
      description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
      natives: NATIVE_LTE_322,
      website: 'https://www.assimp.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.OPENGL]: {
      ...(prev.byId[Binding.OPENGL] as BindingDefinition),
      natives: NATIVE_LTE_322,
    },
    [Binding.OPENGLES]: {
      ...(prev.byId[Binding.OPENGLES] as BindingDefinition),
      natives: NATIVE_LTE_322,
    },
  },
});
