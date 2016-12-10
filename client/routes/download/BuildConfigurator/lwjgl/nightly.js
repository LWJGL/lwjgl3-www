import {
  NATIVE_ALL
} from '../constants'

export default (stable) => {

  const artifacts = {...stable};

  artifacts.byId['lwjgl-opengl'] = {
    ...artifacts.byId['lwjgl-opengl'],
    natives: NATIVE_ALL,
  };

  artifacts.byId['lwjgl-opengles'] = {
    ...artifacts.byId['lwjgl-opengles'],
    natives: NATIVE_ALL,
  };

  return artifacts;
};
