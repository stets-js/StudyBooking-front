import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const createReplacement = credentials => {
  console.log({
    description: credentials.description,
    SubGroupId: credentials.selectedSubGroup
  });
  return axios
    .post(`/replacement`, {
      description: credentials.description,
      SubGroupId: credentials.selectedSubGroup
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
export {createReplacement, getReplacementDetails};
