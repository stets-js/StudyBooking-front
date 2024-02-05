import axios from '../axios-config';
import {error} from '@pnotify/core';

const getSlotsForUser = userId => {
  return axios
    .get(`/users/${userId}/slots`)
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

const createSlotForUser = (userId, slotData, appointmentTypeId) => {
  return axios
    .post(`/users/${userId}/slots`, {data: slotData, appointmentTypeId: appointmentTypeId})
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

const updateSlot = (userId, slotId, appointmentTypeId) => {
  return axios
    .patch(`/users/${userId}/slots/${slotId}`, {appointmentTypeId: appointmentTypeId})
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

const deleteSlotForUser = (userId, slotId) => {
  return axios
    .delete(`/users/${userId}/slots/${slotId}`)
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

export {getSlotsForUser, createSlotForUser, deleteSlotForUser, updateSlot};
