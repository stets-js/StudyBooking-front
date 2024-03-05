import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const postSubGroup = (credentials, userId) => {
  console.log(credentials);
  const data = {};
  try {
    data.link = credentials.link;
    data.name = credentials.subGroup;
    data.description = credentials.description;
    data.adminId = credentials.selectedAdmin;
    data.CourseId = credentials.selectedCourse;
    data.startDate = new Date(credentials.startDate);
    data.endDate = new Date(credentials.endDate);
    data.schedule = credentials.schedule;
    data.userId = userId;
    data.mentorId = userId;
  } catch (error) {}
  console.log(data);
  return axios
    .post('/subgroups', data)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getSlotDetails = id => {
  return axios
    .get(`/subgroups/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getSubGroups = (options = '') => {
  return axios
    .get(`/subgroups` + (options ? `?${options}` : ''))
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const deleteSubGroup = id => {
  return axios
    .delete(`/subgroups/${id}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const updateSubGroup = (id, body) => {
  return axios
    .patch(`/subgroups/${id}`, body)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {updateSubGroup, postSubGroup, getSubGroups, getSlotDetails, deleteSubGroup};
