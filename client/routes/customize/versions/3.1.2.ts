import { BuildBindings, Version, Binding, NATIVE_ALL } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL312,
  byId: {
    ...prev.byId,
    [Binding.OpenVR]: {
      id: Binding.OpenVR,
      title: 'OpenVR',
      description:
        'OpenVR is an API and runtime that allows access to VR hardware from multiple vendors without requiring that applications have specific knowledge of the hardware they are targeting.',
      natives: NATIVE_ALL,
      website: 'https://github.com/ValveSoftware/openvr',
    },
    [Binding.TinyEXR]: {
      id: Binding.TinyEXR,
      title: 'Tiny OpenEXR',
      description: 'A small library to load and save OpenEXR(.exr) images.',
      natives: NATIVE_ALL,
      website: 'https://github.com/syoyo/tinyexr',
    },
    [Binding.Yoga]: {
      id: Binding.Yoga,
      title: 'Yoga',
      description: 'An open-source, cross-platform layout library that implements Flexbox.',
      natives: NATIVE_ALL,
      website: 'https://facebook.github.io/yoga/',
    },
  },
});
