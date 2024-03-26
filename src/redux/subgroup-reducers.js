const initialState = {
  subgroups: []
};

const subgroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SUBGROUP':
      return {
        ...state,
        subgroups: [...state.subgroups, action.payload]
      };

    default:
      return state;
  }
};

export default subgroupReducer;
