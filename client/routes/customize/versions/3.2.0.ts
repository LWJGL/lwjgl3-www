import { BuildBindings, Binding, BindingDefinition, Native, NATIVE_ALL, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL320,
  byId: {
    ...prev.byId,
    [Binding.VMA]: {
      id: Binding.VMA,
      title: 'Vulkan Memory Allocator',
      description: 'An easy to integrate Vulkan memory allocation library.',
      natives: NATIVE_ALL,
      website: 'https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator',
    },
    [Binding.Vulkan]: {
      ...(prev.byId[Binding.Vulkan] as BindingDefinition),
      natives: [Native.MacOS],
      nativesOptional: true,
    },
  },
});
