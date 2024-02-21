import axios from 'axios';
// axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = 'https://iteen-back.onrender.com/api';

axios.defaults.headers.authorization = 'Bearer ' + localStorage.getItem('booking');

export default axios;
