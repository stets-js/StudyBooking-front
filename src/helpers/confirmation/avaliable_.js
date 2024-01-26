import axios from "../axios-config";

const getCurrentConfirmedData = () => {
  return axios
    .get(`/avaliable_managers_list/14/2`) // /current_confirmed
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getConfirmedWeekData = (weekId, dayId) => {
  return axios
    .get(`/avaliable_managers_list/${weekId}/${dayId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAvaliableManagersData = () => {
  return axios
    .get(`/current_avaliable_managers_list`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAvaliableManagersWeekData = (weekId, dayId) => {
  return axios
    .get(`/avaliable_managers_list/${weekId}/${dayId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const setConfirmed = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_confirmation/${slot_id}/${status}/${message}`
        : `/set_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setCancelConfirmed = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_cancel_confirmation/${slot_id}/${status}/${message}`
        : `/set_cancel_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setPostponedConfirmed = (slot_id, appointment_id) => {
  return axios
    .post(`/set_postpone_confirmation/${slot_id}/${appointment_id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  setPostponedConfirmed,
  getCurrentConfirmedData,
  getConfirmedWeekData,
  setConfirmed,
  setCancelConfirmed,
  getAvaliableManagersData,
  getAvaliableManagersWeekData,
};
