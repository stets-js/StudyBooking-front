import axios from 'axios';
// axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = 'http://127.0.0.1:3000/api';

axios.defaults.headers.authorization = 'Bearer ' + localStorage.getItem('booking');

export default axios;
