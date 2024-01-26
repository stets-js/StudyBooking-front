import axios from "../axios-config";

const getCurrentConfirmedData = () => {
  return axios
    .get(`/current_confirmed`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmedWeekData = (weekId, dayId, halfId) => {
  return axios
    .get(`/get_confirmed/${weekId}/${dayId}/${halfId}/`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setConfirmed = (slot_id, status, message) => {
  const authToken = localStorage.getItem("booking");
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const url = message
  ? `/set_confirmation/${slot_id}/${status}/${message}`
        : `/set_confirmation/${slot_id}/${status}`;
  return axios
    .post(url, null, { headers })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setCancelConfirmed = (slot_id, status, message) => {
  const authToken = localStorage.getItem("booking");
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const url = message
  ? `/set_cancel_confirmation/${slot_id}/${status}/${message}`
  : `/set_cancel_confirmation/${slot_id}/${status}`;
  return axios
    .post(url, null, { headers })
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
};
