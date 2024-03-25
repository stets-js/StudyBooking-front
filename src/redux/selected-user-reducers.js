const initialState = {
  id: null
};

const selectedUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SELECTED_USER':
      return {
        ...state,
        id: action.payload.id
      };
    case 'REMOVE_SELECTED_USER':
      return {
        ...state,
        id: null
      };
    default:
      return state;
  }
};

export default selectedUserReducer;
