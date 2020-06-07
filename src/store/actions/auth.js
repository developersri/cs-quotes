import * as actionTypes from './actionTypes';

export const authSuccess = (token, email) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    email
  };
}

export const authReset = () => {
  return {
    type: actionTypes.AUTH_RESET,
  };
}
