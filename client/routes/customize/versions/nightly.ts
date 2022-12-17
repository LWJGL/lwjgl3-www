import { Binding, BuildBindings, NATIVE_ALL, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL332,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
    [Binding.FMOD]: {
      id: Binding.FMOD,
      title: 'FMOD',
      description: 'An end-to-end solution for adding sound and music to any game.',
      website: 'https://www.fmod.com',
    },
    [Binding.FREETYPE]: {
      id: Binding.FREETYPE,
      title: 'FreeType',
      description: 'A freely available software library to render fonts.',
      website: 'https://freetype.org/',
      natives: NATIVE_ALL,
    },
    [Binding.HARFBUZZ]: {
      id: Binding.HARFBUZZ,
      title: 'HarfBuzz',
      description:
        'A text shaping library that allows programs to convert a sequence of Unicode input into properly formatted and positioned glyph output — for any writing system and language.',
      website: 'https://harfbuzz.github.io/',
      natives: NATIVE_ALL,
    },
    [Binding.KTX]: {
      id: Binding.KTX,
      title: 'KTX (Khronos Texture)',
      description: 'A lightweight container for textures for OpenGL®, Vulkan® and other GPU APIs.',
      website: 'https://www.khronos.org/ktx/',
      natives: NATIVE_ALL,
    },
  },
});
