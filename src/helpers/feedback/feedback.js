import axios from '../axios-config';

const postFeedback = body => {
  return axios.post('/feedback', body);
};

export {postFeedback};
