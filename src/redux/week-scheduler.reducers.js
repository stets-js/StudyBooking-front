const initialState = {
  weekScheduler: [Array.from({length: 7}, () => [])]
};

const weekScheduler = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WEEK_SCHEDULER':
      return {
        ...state,
        weekScheduler: action.payload
      };
    case 'ADD_NEW_SLOT_TO_WEEK':
      return {
        ...state,
        weekScheduler: state.weekScheduler.map((daySlots, index) => {
          if (index === action.payload.weekDay) {
            return [...daySlots, action.payload];
          }
          return daySlots;
        })
      };

    case 'UPDATE_SLOT_FOR_WEEK':
      console.log(action.payload);
      return {
        ...state,
        weekScheduler: state.weekScheduler.map((daySlots, index) => {
          if (index === action.payload.weekDay) {
            return daySlots.map(slot => {
              console.log(slot);

              return slot.id === action.payload.id ? action.payload : slot;
            });
          }
          return daySlots;
        })
      };
    case 'DELETE_SLOT_FROM_WEEK':
      console.log('deleting');
      console.log(action.payload);
      return {
        ...state,
        weekScheduler: state.weekScheduler.map((daySlots, index) => {
          return daySlots.filter(slot => slot.id !== action.payload);
        })
      };
    default:
      return state;
  }
};

export default weekScheduler;
