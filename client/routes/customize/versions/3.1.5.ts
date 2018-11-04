import { BuildBindings, Version, Binding, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL315,
  byId: {
    ...prev.byId,
    [Binding.Tootle]: {
      id: Binding.Tootle,
      title: 'AMD Tootle',
      description:
        'AMD Tootle (Triangle Order Optimization Tool) is a 3D triangle mesh optimization library that improves on existing mesh preprocessing techniques.',
      natives: NATIVE_ALL,
      website: 'https://github.com/GPUOpen-Tools/amd-tootle',
    },
  },
});
