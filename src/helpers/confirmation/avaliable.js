import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";

const getCurrentConfirmatorData = () => {
  return axios
    .get(`/get_current_avaliable_manager`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmatorWeekData = (weekId, dayId, halfId) => {
  return (
    axios
      .get(`/get_avaliable_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/get_confirmation_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/avaliable_managers_list/${weekId}/${dayId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      })
  );
};

const setConfirmation = (slot_id, status, message) => {
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

const setCancelConfirmation = (slot_id, status, message) => {
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

const setPostponedConfirmation = (slot_id, appointment_id) => {
  return axios
    .post(`/set_postpone_confirmation/${slot_id}/${appointment_id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const removeSlot = (slot_id, reason, removeMessage) => {
  const authToken = localStorage.getItem("booking");
  const { id } = jwtDecode(localStorage.getItem('booking'));
  return axios
    .delete(`remove_slot/${slot_id}/${reason}/${id}`, {
      // Set the Authorization header with the retrieved token
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "removed",
        canceled_message: removeMessage,
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

export {
  setPostponedConfirmation,
  getCurrentConfirmatorData,
  getConfirmatorWeekData,
  setConfirmation,
  setCancelConfirmation,
  removeSlot,
};
