// @flow
import { NATIVE_MAC, NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.2.0',
  byId: {
    ...prev.byId,
    'lwjgl-vma': {
      id: 'lwjgl-vma',
      title: 'Vulkan Memory Allocator',
      description: 'An easy to integrate Vulkan memory allocation library.',
      natives: NATIVE_ALL,
      website: 'https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator',
    },
    'lwjgl-vulkan': {
      ...prev.byId['lwjgl-vulkan'],
      natives: [NATIVE_MAC],
      nativesOptional: true,
    },
  },
});
