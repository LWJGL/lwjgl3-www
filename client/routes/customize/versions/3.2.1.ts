import { BuildBindings, Binding, NATIVE_LTE_322, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL321,
  byId: {
    ...prev.byId,
    [Binding.CUDA]: {
      id: Binding.CUDA,
      title: 'CUDA',
      description:
        'A parallel computing platform and programming model developed by NVIDIA for general computing on GPUs.',
      website: 'https://developer.nvidia.com/cuda-zone/',
    },
    [Binding.LIBDIVIDE]: {
      id: Binding.LIBDIVIDE,
      title: 'libdivide',
      description:
        'A library that replaces expensive integer divides with comparatively cheap multiplication and bitshifts.',
      natives: NATIVE_LTE_322,
      website: 'https://libdivide.com/',
    },
    [Binding.LLVM]: {
      id: Binding.LLVM,
      title: 'LLVM',
      description: 'A collection of modular and reusable compiler and toolchain technologies.',
      natives: NATIVE_LTE_322,
      website: 'https://llvm.org/',
    },
    [Binding.MEOW]: {
      id: Binding.MEOW,
      title: 'Meow hash',
      description: 'An extremely fast non-cryptographic hash.',
      natives: NATIVE_LTE_322,
      website: 'https://github.com/cmuratori/meow_hash/',
    },
    [Binding.OPUS]: {
      id: Binding.OPUS,
      title: 'Opus',
      description: 'Opus is a totally open, royalty-free, highly versatile audio codec.',
      natives: NATIVE_LTE_322,
      website: 'https://opus-codec.org/',
    },
  },
});
