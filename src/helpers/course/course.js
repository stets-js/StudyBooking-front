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

const postCourse = ({credentials}) => {
  const cours = {
    name: credentials.get('name'),
    teamLeadId: credentials.get('team_lead_id'),
    shortening: credentials.get('shortening')
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

const getTeacherCourses = id => {
  return axios
    .get(`/users/${id}/courses`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getTeachersByCourse = (id, teacherType) => {
  return axios
    .get(`/courses/${id}/users${teacherType ? '?TeacherTypeId=' + teacherType : ''}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postTeacherCourse = (userId, courseId) => {
  return axios
    .post(`/users/${userId}/courses/${courseId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const patchTeacherCourse = (userId, courseId, TeacherTypeId) => {
  return axios
    .patch(`/users/${userId}/courses/${courseId}`, TeacherTypeId)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const deleteTeacherCourse = (userId, courseId) => {
  return axios
    .delete(`/users/${userId}/courses/${courseId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {
  getCourses,
  postTeacherCourse,
  postCourse,
  patchCourse,
  deleteCourse,
  getTeacherCourses,
  getCourseIdByName,
  getCourseById,
  deleteTeacherCourse,
  getTeachersByCourse,
  patchTeacherCourse
};
