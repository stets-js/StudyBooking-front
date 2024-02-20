import axios from '../axios-config';
import {error} from '@pnotify/core';

const getRoles = () => {
  return axios

    .get('/roles')
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getFreeUsers = (selectedCourse, selectedWeekDay) => {
  console.log(selectedCourse, selectedWeekDay);
  return axios
    .get(`/users/available-teachers/${selectedWeekDay}/${selectedCourse}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getUsers = (options = '') => {
  return axios
    .get('/users' + (options ? `?${options}` : ''))
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getUserById = id => {
  return axios
    .get(`/users/${id}`)
    .then(res => res.data)
    .catch(err => {
      error(`${err.response.data.message}`);
      throw err;
    });
};
const getUsersByRole = roleName => {
  return axios
    .get(`/users/${roleName}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getUserByName = name => {
  return axios
    .get(`/user/${name}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postUser = credentials => {
  return axios
    .post('/users', credentials)
    .then(res => res)
    .catch(error => {
      throw error;
    });
};

const patchUser = (credentials, id) => {
  return axios
    .put(`/users/${id}`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteUser = id => {
  return axios
    .delete(`/remove_user/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteManager = id => {
  return axios
    .delete(`/remove_manager/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {
  getRoles,
  getUsersByRole,
  postUser,
  deleteUser,
  patchUser,
  getUserById,
  getUserByName,
  getUsers,
  deleteManager,
  getFreeUsers
};
