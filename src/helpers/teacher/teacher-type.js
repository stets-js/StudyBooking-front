import axios from '../axios-config';

const getTeacherTypes = () => {
  return axios
    .get(`/teacher-type` )
    .then(res => res.data)
    .catch(e => {
      console.log(e);
    });
};

export {getTeacherTypes};
