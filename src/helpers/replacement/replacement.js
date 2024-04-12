import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const createReplacement = (credentials, userId) => {
  console.log(userId, credentials);
  return axios
    .post(`/replacement`, {
      description: credentials.description,
      SubGroupId: credentials.subgroupId,
      schedule: credentials.schedule,
      mentorId: credentials.mentorId
    })
    .then(res => res.data)
    .catch(error => {
      console.log(error);
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
const deleteReplacement = id => {
  return axios
    .delete(`/replacement/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const updateReplacement = (credentials, id) => {
  return axios
    .patch(`/replacement/${id}`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {
  deleteReplacement,
  updateReplacement,
  createReplacement,
  getReplacementDetails,
  getReplacements
};
