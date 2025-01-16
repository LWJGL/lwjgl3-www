import {Binding, BuildBindings, NATIVE_ALL, Version} from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL340,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
    [Binding.SDL]: {
      id: Binding.SDL,
      title: 'SDL (Simple DirectMedia Layer)',
      description: 'A cross-platform development library designed to provide low level access to audio, keyboard, mouse, joystick, and graphics hardware via OpenGL/Direct3D/Metal/Vulkan.',
      natives: NATIVE_ALL,
      website: 'https://www.libsdl.org/',
    },
  },
});
