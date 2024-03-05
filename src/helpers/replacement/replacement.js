import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const createReplacement = credentials => {
  return axios
    .post(`/replacement`, {
      description: credentials.description,
      SubGroupId: credentials.selectedSubGroup,
      schedule: credentials.schedule
    })
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getReplacementDetails = id => {
  return axios
    .get(`/replacement/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getReplacements = (options = '') => {
  return axios
    .get(`/replacement` + (options ? `?${options}` : ''))
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {createReplacement, getReplacementDetails, getReplacements};
