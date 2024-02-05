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
    case 'DELETE_SLOT':
      return {
        ...state,
        occupiedSlots: state.occupiedSlots.filter(el => el.id !== action.payload)
      };
    case 'UPDATE_SLOT':
      console.log(state.occupiedSlots.length);
      console.log(state.occupiedSlots.filter(el => el.id !== action.payload.id).length);
      console.log(action.payload);
      return {
        ...state,
        occupiedSlots: [
          ...state.occupiedSlots.filter(el => el.id !== action.payload.id),
          action.payload
        ]
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
