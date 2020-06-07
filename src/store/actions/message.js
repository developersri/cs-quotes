import * as actionTypes from './actionTypes';

export const setGlobalMessage = (msg, msgType) => {
  return {
    type: actionTypes.SET_GLOBAL_MESSAGE,
    msg,
    msgType,
  };
}

export const unsetGlobalMessage = () => {
  return {
    type: actionTypes.UNSET_GLOBAL_MESSAGE,
  };
}
