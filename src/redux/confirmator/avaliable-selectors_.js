const getConfirmatorError = (state) => state.confirmator.error;
const getConfirmatorLoadings = (state) => state.confirmator.loading;
const getConfirmedAppointments = (state) => { 

return state.confirmator.appointments;
}

const getConfirmedManagersList = (state) => {
  return state.avaliable.managers_list;
}
const getConfirmatorDate = (state) => state.confirmator.date.date;
const getConfirmatorWeekId = (state) => state.confirmator.date.week_id;
const getConfirmatorDay = (state) => state.confirmator.date.day;
const getConfirmatorHalf = (state) => state.confirmator.date.half;

export {
  getConfirmatorError,
  getConfirmatorHalf,
  getConfirmatorDay,
  getConfirmatorWeekId,
  getConfirmatorDate,
  getConfirmedAppointments,
  getConfirmedManagersList,
  getConfirmatorLoadings,
};
