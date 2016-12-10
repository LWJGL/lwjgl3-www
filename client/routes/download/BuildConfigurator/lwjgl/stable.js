import {
  NATIVE_ALL
} from '../constants'

export default (release) => {

  const artifacts = {...release};

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

  artifacts.allIds = Object.keys(artifacts.byId).sort();

  return artifacts;
};
