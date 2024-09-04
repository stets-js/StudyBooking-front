import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const getSurvey = id => {
  return axios
    .get(`/survey/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const sendAnswers = (userId, answers, SurveyId) => {
  return axios.post(`/survey/answers/bulk`, {userId, SurveyId, answers});
};

export {getSurvey, sendAnswers};
