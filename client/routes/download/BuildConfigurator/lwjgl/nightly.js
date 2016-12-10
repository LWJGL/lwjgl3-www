import {
  NATIVE_ALL
} from '../constants'

export default (stable) => {

  const artifacts = {...stable};

  artifacts.byId = {
    ...artifacts.byId,
    'lwjgl-assimp': {
        id: 'lwjgl-assimp',
        title: 'Assimp bindings',
        description: 'A portable Open Source library to import various well-known 3D model formats in a uniform manner.',
        natives: NATIVE_ALL,
        website: 'http://www.assimp.org/',
    },
  };

  artifacts.byId['lwjgl-opengl'] = {
    ...artifacts.byId['lwjgl-opengl'],
    natives: NATIVE_ALL,
  };

  artifacts.byId['lwjgl-opengles'] = {
    ...artifacts.byId['lwjgl-opengles'],
    natives: NATIVE_ALL,
  };

  artifacts.allIds = Object.keys(artifacts.byId).sort();

  return artifacts;
};
