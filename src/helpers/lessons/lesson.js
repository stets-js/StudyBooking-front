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

export {getLessonsForUser};
