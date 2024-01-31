import axios from '../axios-config';

const getCourses = () => {
  return axios
    .get('/courses')
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getCourseIdByName = name => {
  return axios
    .get(`/get_course_id/${name}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postCourse = credentials => {
  for (var pair of credentials.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
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

const putCourse = (credentials, id) => {
  return axios
    .put(`/courses/${id}`, credentials)
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
  putCourse,
  deleteCourse,
  getManagerCourses,
  getCourseIdByName
};
