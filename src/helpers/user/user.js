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

const patchUser = credentials => {
  console.log(credentials);
  return axios
    .patch(`/users/${credentials.id}`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteUser = id => {
  return axios
    .delete(`/users/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getUsersForSubGroupReplacements = (subGroupId, courseId) => {
  return axios
    .get(`/users/${subGroupId}/mentorsForReplacement?courseId=${courseId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteUserSlots = ({id, subgroupId}) => {
  return axios.delete(`/users/${id}/slots?subgroupId=${subgroupId}`);
};

const loginMIC = credentials => {
  const formData = new FormData();

  for (const key in credentials) {
    formData.append(key, credentials[key]);
  }

  return axios.post('https://king-prawn-app-hnaei.ondigitalocean.app/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export {
  loginMIC,
  getRoles,
  getUsersByRole,
  postUser,
  deleteUser,
  patchUser,
  getUserById,
  getUserByName,
  getUsers,
  getUsersForSubGroupReplacements,
  getFreeUsers,
  deleteUserSlots
};
