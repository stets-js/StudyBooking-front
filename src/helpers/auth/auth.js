import axios from "../axios-config";

const getAuthLogs = () => {
    return axios
      .get(`/login_log`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

export {
    getAuthLogs,
}