export const setOccupiedSlots = occupiedSlots => ({
  type: 'SET_OCCUPIED_SLOTS',
  payload: occupiedSlots
});
export const addNewSlot = newSlot => ({
  type: 'ADD_NEW_SLOT',
  payload: newSlot
});

export const cleanOccupiedSlots = () => ({
  type: 'CLEAN_OCCUPIED_SLOTS',
  payload: []
});
