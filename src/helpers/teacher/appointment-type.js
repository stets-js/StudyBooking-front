import axios from '../axios-config';
import {error} from '@pnotify/core';

const getAppointmentTypes = (options = '') => {
  return axios
    .get(`/appointment-type` + (options ? `?${options}` : ''))
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

export {getAppointmentTypes};
