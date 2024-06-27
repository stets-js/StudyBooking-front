import axios from '../axios-config';

const getUserDocuments = userId => {
  return axios
    .get(`/user-document/${userId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const addUserDocument = body => {
  return axios
    .post(`/user-document/${body.userId}`, body)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const updateUserDocument = body => {
  return axios
    .patch(`/user-document/${body.UserId}`, body)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {updateUserDocument, getUserDocuments, addUserDocument};
