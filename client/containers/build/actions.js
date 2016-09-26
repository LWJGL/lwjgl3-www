import * as actionTypes from './actionTypes'

export const changeType = type => ({
  type: actionTypes.SELECT_TYPE,
  build: type,
});

export const changeMode = mode => ({
  type: actionTypes.SELECT_MODE,
  mode,
});
