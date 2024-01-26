import axios from "../axios-config";

axios.create({
  withCredentials: true,
});

const getAvaliable = ({ week, day }) => {
  return axios
    .get(`/avaliable_managers_list/${week}/${day}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAvaliableWeek = ({ week, day }) => {
  return axios
    .get(`/avaliable_managers_list/${week}/${day}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export { getAvaliable, getAvaliableWeek };
