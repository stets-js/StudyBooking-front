import axios from '../axios-config';

const createReport = credentials => {
  return axios
    .post('reports/', credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getReports = () => {
  return axios
    .get('reports/')
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {createReport, getReports};
