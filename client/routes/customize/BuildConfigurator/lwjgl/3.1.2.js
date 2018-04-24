// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.2',
  byId: {
    ...prev.byId,
    'lwjgl-openvr': {
      id: 'lwjgl-openvr',
      title: 'OpenVR',
      description:
        'OpenVR is an API and runtime that allows access to VR hardware from multiple vendors without requiring that applications have specific knowledge of the hardware they are targeting.',
      natives: NATIVE_ALL,
      website: 'https://github.com/ValveSoftware/openvr',
    },
    'lwjgl-tinyexr': {
      id: 'lwjgl-tinyexr',
      title: 'Tiny OpenEXR',
      description: 'A small library to load and save OpenEXR(.exr) images.',
      natives: NATIVE_ALL,
      website: 'https://github.com/syoyo/tinyexr',
    },
    'lwjgl-yoga': {
      id: 'lwjgl-yoga',
      title: 'Yoga',
      description: 'An open-source, cross-platform layout library that implements Flexbox.',
      natives: NATIVE_ALL,
      website: 'https://facebook.github.io/yoga/',
    },
  },
});
