import {Binding, BuildBindings, Native, Version} from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL331,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
    [Binding.OPENXR]: {
      id: Binding.OPENXR,
      title: 'OpenXR',
      description: 'A royalty-free, open standard that provides high-performance access to Augmented Reality (AR) and Virtual Reality (VR)—collectively known as XR—platforms and devices.',
      website: 'https://www.khronos.org/openxr/',
      natives: [Native.Linux, Native.LinuxARM64, Native.LinuxARM32, Native.Windows, Native.WindowsX86, Native.WindowsARM64]},
  },
});
