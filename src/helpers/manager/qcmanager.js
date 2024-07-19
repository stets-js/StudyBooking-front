import axios from '../axios-config';

const createReport = credentials => {
  return axios
    .post('reports/', credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getReports = options => {
  return axios
    .get(`reports${options ? options : ''}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const updateReport = (id, data) => {
  return axios
    .patch(`reports/${id}`, {...data, status: data?.status ? data.status : 'Погодження'})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {createReport, updateReport, getReports};
