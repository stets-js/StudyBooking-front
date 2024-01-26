import axios from "../axios-config";

axios.create({
  withCredentials: true,
});

const updateSlotComment = (credentials) => {
  return axios
    .post("/update_slot_comment", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getSlot = ({ id }) => {
    return axios
      .get(`/slot/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

  export {
    getSlot,
    updateSlotComment
  };