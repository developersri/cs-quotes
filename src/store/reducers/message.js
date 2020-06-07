import * as actionTypes from '../actions/actionTypes';

const initialState = {
  message: null,
  messageType: null,
};

const setGlobalMessage = (state, action) => {
  return {
    ...state,
    message: action.msg,
    messageType: action.msgType || 'success',
  };
};

const unsetGlobalMessage = (state, action) => {
  return {
    ...state,
    message: null,
    messageType: null,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GLOBAL_MESSAGE: return setGlobalMessage(state, action);
    case actionTypes.UNSET_GLOBAL_MESSAGE: return unsetGlobalMessage(state, action);
    default: return state;
  }
};

export default reducer;
