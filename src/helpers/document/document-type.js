import axios from '../axios-config';

const getDocumentType = () => {
  return axios
    .get(`/document-type`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getDocumentType};
