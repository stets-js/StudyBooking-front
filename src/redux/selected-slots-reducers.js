const initialState = {
	selectedSlots: Array.from({ length: 7 }, () => [0]),
};

const selectedSlotsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SELECTED_SLOTS':
			return { ...state, selectedSlots: Array.from({ length: 7 }, () => [0]) };

		case 'ADD_SELECTED_SLOTS':
			const { weekDay, slot } = action.payload;
			return {
				...state,
				selectedSlots: state.selectedSlots.map((daySlots, index) => {
					if (index === weekDay) {
						return [...daySlots, slot];
					}
					return daySlots;
				}),
			};
		case 'CLEAN_SELECTED_SLOTS':
			return { ...state, selectedSlots: Array.from({ length: 7 }, () => []) };

		default:
			return state;
	}
};

export default selectedSlotsReducer;
