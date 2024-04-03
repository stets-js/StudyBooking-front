import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = 'http://127.0.0.1:3000/api';
// axios.defaults.baseURL = 'https://racoon-app-zk3wu.ondigitalocean.app/api';
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: error => {
    return error.response && error.response.status === 400;
  }
});
// axios.defaults.headers.authorization = 'Bearer ' + localStorage.getItem('booking');

export default axios;
