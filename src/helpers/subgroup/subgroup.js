import axios from '../axios-config';

axios.create({
  withCredentials: true
});
const generateDataForReq = (credentials, userId) => {
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
  } catch (error) {}
  return data;
};
const postSubGroup = ({credentials, userId}) => {
  let data = {};
  // first case creating subgroup from button on subgroup page, second case of creating it from appointment selector
  data = JSON.parse(credentials.get('subgroup')) || generateDataForReq(credentials, userId);
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

const getMentorSubgroups = (options = '') => {
  return axios.get(`/subgroup-mentor` + (options ? `?${options}` : ''));
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
const updateSubGroup = ({id, body}) => {
  return axios
    .patch(`/subgroups/${id}`, body)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const updateSubGroupAndAddMentor = ({id, body}) => {
  return axios
    .patch(`/subgroups/${id}/creation`, body)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const deleteMentorFromSubgroup = ({mentorId, subgroupId}) => {
  return axios.delete(`/subgroup-mentor/${subgroupId}/${mentorId}`);
};
const createSubgroupMentor = ({subgroupId, mentorId, TeacherTypeId, schedule}) => {
  return axios.post(`/subgroup-mentor`, {subgroupId, mentorId, TeacherTypeId, schedule});
};
export {
  updateSubGroup,
  postSubGroup,
  getSubGroups,
  getSlotDetails,
  deleteSubGroup,
  getMentorSubgroups,
  updateSubGroupAndAddMentor,
  createSubgroupMentor,
  deleteMentorFromSubgroup
};
