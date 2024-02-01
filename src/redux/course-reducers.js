const SET_DEFAULT_TL = 'SET_DEFAULT_TL';
const CLEAR_DEFAULT_TL = 'CLEAR_DEFAULT_TL';
export const setDefaultTL = defaultTL => ({
  type: SET_DEFAULT_TL,
  payload: defaultTL
});

const initialState = {
  defaultTL: {label: '', value: 0}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEFAULT_TL:
      return {
        ...state,
        defaultTL: action.payload
      };
    case CLEAR_DEFAULT_TL:
      return {...state, defaultTL: {label: '', value: 0}};

    default:
      return state;
  }
};

export default reducer;
