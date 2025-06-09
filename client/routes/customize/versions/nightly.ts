import { Binding, BuildBindings, NATIVE_ALL, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => {
  // These bindings where removed in 3.4.0
  const {
    [Binding.CUDA]: _0,
    [Binding.LIBDIVIDE]: _1,
    [Binding.MEOW]: _2,
    [Binding.OPENVR]: _3,
    [Binding.OVR]: _4,
    [Binding.SSE]: _5,
    [Binding.TOOTLE]: _6,
    ...bindings340
  } = prev.byId;
  return {
    ...prev,
    version: Version.LWJGL340,
    alias: Version.Nightly,
    byId: {
      ...bindings340,
      [Binding.SDL]: {
        id: Binding.SDL,
        title: 'SDL (Simple DirectMedia Layer)',
        description:
          'A cross-platform development library designed to provide low level access to audio, keyboard, mouse, joystick, and graphics hardware via OpenGL/Direct3D/Metal/Vulkan.',
        natives: NATIVE_ALL,
        website: 'https://www.libsdl.org/',
      },
      [Binding.SPNG]: {
        id: Binding.SPNG,
        title: 'Simple PNG (libspng)',
        description:
          'A C library for reading and writing Portable Network Graphics (PNG) format files with a focus on security and easy of use.',
        natives: NATIVE_ALL,
        website: 'https://libspng.org/',
      },
    },
  };
};
