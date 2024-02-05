const initialState = {
  occupiedSlots: []
};

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_OCCUPIED_SLOTS':
      return {
        ...state,
        occupiedSlots: action.payload
      };
    case 'ADD_NEW_SLOT':
      return {
        ...state,
        occupiedSlots: [...state.occupiedSlots, action.payload]
      };
    case 'CLEAN_OCCUPIED_SLOTS': {
      return {
        ...state,
        occupiedSlots: action.payload
      };
    }
    default:
      return state;
  }
};

export default teacherReducer;
