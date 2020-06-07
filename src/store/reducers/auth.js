import * as actionTypes from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
};

const authSuccess = (state, action) => {
  return {
    ...state,
    token: action.token,
    email: action.email,
  };
};

const authReset = (state, action) => {
  return {
    ...state,
    token: null,
    email: null,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_RESET: return authReset(state, action);
    default: return state;
  }
};

export default reducer;
