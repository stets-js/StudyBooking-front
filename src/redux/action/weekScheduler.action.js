export const setWeekScheduler = occupiedSlots => ({
  type: 'SET_WEEK_SCHEDULER',
  payload: occupiedSlots
});
export const addNewSlotToWeek = newSlot => ({
  type: 'ADD_NEW_SLOT_TO_WEEK',
  payload: newSlot
});

export const DeleteSlotFromWeek = slotId => ({
  type: 'DELETE_SLOT_FROM_WEEK',
  payload: slotId
});

export const updateSlotForWeek = updatedSlot => ({
  type: 'UPDATE_SLOT_FOR_WEEK',
  payload: updatedSlot
});
