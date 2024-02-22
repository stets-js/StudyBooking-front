import axios from '../axios-config';
import {error} from '@pnotify/core';

const getSlotsForUser = ({userId, startDate, endDate}) => {
  return axios
    .get(`/users/${userId}/slots${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`)
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};
const getSlotsForUsers = ({userIds, startDate, endDate}) => {
  return axios
    .post(`/slots${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, {userIds})
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};
const createSlotForUser = ({userId, appointmentTypeId, weekDay, time, startDate}) => {
  return axios
    .post(`/users/${userId}/slots`, {
      appointmentTypeId: appointmentTypeId,
      weekDay: weekDay,
      time: time,
      startDate: startDate
    })
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

export {getSlotsForUser, createSlotForUser, deleteSlotForUser, updateSlot, getSlotsForUsers};
