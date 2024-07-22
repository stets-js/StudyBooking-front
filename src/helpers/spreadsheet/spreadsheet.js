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

const allUsersStatsByCourse = () => {
  return axios.get('/users/allUsersByCourse');
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

const usersActivityByCourse = dates => {
  const {start, end} = dates;

  return axios.get(
    `/spreadsheet/activityByCourse?start=${format(start, 'yyyy-MM-dd')}&end=${format(
      end,
      'yyyy-MM-dd'
    )}`
  );
};
export {
  updateTable,
  resizeTable,
  addBorders,
  referalSheet,
  allUsersStats,
  allUsersStatsByCourse,
  usersActivity,
  usersActivityByCourse
};
