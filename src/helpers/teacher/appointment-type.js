import axios from '../axios-config';
import {error} from '@pnotify/core';

const getAppointmentTypes = () => {
  return axios
    .get(`/appointment-type`)
    .then(res => res.data)
    .catch(e => {
      throw error(e.response.data.message);
    });
};

export {getAppointmentTypes};
