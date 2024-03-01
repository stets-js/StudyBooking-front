import axios from '../axios-config';

const getAuthLogs = () => {
  return axios
    .get(`/login_log`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const resetPassword = ({token, newPassword}) => {
  console.log(newPassword);
  return axios
    .patch(`/auth/resetPassword/${token}`, {password: newPassword})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const forgotPassword = email => {
  return axios
    .post(`/auth/forgotPassword`, {email})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getAuthLogs, resetPassword, forgotPassword};
