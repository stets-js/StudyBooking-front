import axios from '../axios-config';

const getCourses = () => {
  return axios
    .get('/courses')
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getCourseIdByName = id => {
  return;
};

const getCourseById = id => {
  return axios
    .get(`/courses/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postCourse = credentials => {
  const cours = {
    name: credentials.get('name'),
    group_amount: credentials.get('group_number'),
    teamLeadId: credentials.get('team_lead_id')
  };

  return axios
    .post('/courses', cours)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const patchCourse = (credentials, id) => {
  return axios
    .patch(`/courses/${id}`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteCourse = id => {
  return axios
    .delete(`/courses/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getManagerCourses = id => {
  return axios
    .get(`/manager/courses/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postManagerCourses = (id, coursesList) => {
  return axios
    .post(`/manager/courses/${id}`, coursesList)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {
  getCourses,
  postManagerCourses,
  postCourse,
  patchCourse,
  deleteCourse,
  getManagerCourses,
  getCourseIdByName,
  getCourseById
};
