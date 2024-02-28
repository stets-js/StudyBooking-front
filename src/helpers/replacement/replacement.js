import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const createReplacement = credentials => {
  return axios
    .post(`/replacement`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {createReplacement};
