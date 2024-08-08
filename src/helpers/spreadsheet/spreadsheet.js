import {format} from 'date-fns';
import axios from '../axios-config';

axios.create({
  withCredentials: true
});

const updateTable = () => {
  return axios.get('/spreadsheet');
};
const resizeTable = () => {
  return axios.get('/spreadsheet/resize');
};
const addBorders = () => {
  return axios.get('/spreadsheet/borders');
};

const allUsersStatsByCourse = (data, selectedCourse) => {
  console.log(selectedCourse);
  return axios.get(`/users/allUsersByCourse?${selectedCourse ? `courseId=${selectedCourse}` : ''}`);
};

const allUsersStats = () => {
  return axios.get('/users/allUsers');
};

const referalSheet = () => {
  return axios.get('/users/referals');
};

const usersActivity = dates => {
  const {start, end} = dates;

  console.log(start, end);
  return axios.get(
    `/spreadsheet/activity?start=${format(start, 'yyyy-MM-dd')}&end=${format(end, 'yyyy-MM-dd')}`
  );
};

const usersActivityByCourse = (dates, selectedCourse) => {
  const {start, end} = dates;

  return axios.get(
    `/spreadsheet/activityByCourse?${
      selectedCourse ? `courseId=${selectedCourse}` : ''
    }&start=${format(start, 'yyyy-MM-dd')}&end=${format(end, 'yyyy-MM-dd')}`
  );
};

const getSheets = spreadsheetId => {
  return axios.get(`/spreadsheet/${spreadsheetId}`);
};

const fetchReports = (spreadsheetId, sheet) => {
  return axios.get(`/spreadsheet/${spreadsheetId}/reports/${sheet}`);
};
const addReports = (spreadsheetId, sheet, data) => {
  return axios.post(`/spreadsheet/${spreadsheetId}/reports/${sheet}`, data);
};
export {
  updateTable,
  fetchReports,
  addReports,
  getSheets,
  resizeTable,
  addBorders,
  referalSheet,
  allUsersStats,
  allUsersStatsByCourse,
  usersActivity,
  usersActivityByCourse
};
