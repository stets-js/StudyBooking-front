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

export {updateTable, resizeTable, addBorders};
