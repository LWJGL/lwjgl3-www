import { BuildBindings, Version, Binding, NATIVE_NO_ARM } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL312,
  byId: {
    ...prev.byId,
    [Binding.OPENVR]: {
      id: Binding.OPENVR,
      title: 'OpenVR',
      description:
        'OpenVR is an API and runtime that allows access to VR hardware from multiple vendors without requiring that applications have specific knowledge of the hardware they are targeting.',
      natives: NATIVE_NO_ARM,
      website: 'https://github.com/ValveSoftware/openvr',
    },
    [Binding.TINYEXR]: {
      id: Binding.TINYEXR,
      title: 'Tiny OpenEXR',
      description: 'A small library to load and save OpenEXR(.exr) images.',
      natives: NATIVE_NO_ARM,
      website: 'https://github.com/syoyo/tinyexr',
    },
    [Binding.YOGA]: {
      id: Binding.YOGA,
      title: 'Yoga',
      description: 'An open-source, cross-platform layout library that implements Flexbox.',
      natives: NATIVE_NO_ARM,
      website: 'https://facebook.github.io/yoga/',
    },
  },
});
