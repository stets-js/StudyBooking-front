import axios from '../axios-config';

const getLessonsForUser = ({mentorId, startDateLesson, endDateLesson}) => {
  //   start, end - start and end of the week
  return axios
    .get(
      `/lessons?mentorId=${mentorId}&startDateLesson=${startDateLesson}&endDateLesson=${endDateLesson}`
    )
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const bulkLessonCreate = credentials => {
  console.log(credentials);
  return axios.post('/lessons/bulk', credentials);
};

const patchLesson = (id, credentials) => {
  return axios.patch(`/lessons/${id}`, credentials);
};
export {getLessonsForUser, bulkLessonCreate, patchLesson};
