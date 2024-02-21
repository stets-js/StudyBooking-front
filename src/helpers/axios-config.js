import axios from 'axios';
import axiosRetry from 'axios-retry';

// axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = 'https://iteen-back.onrender.com/api';
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: error => {
    return error.response && error.response.status === 400;
  }
});
axios.defaults.headers.authorization = 'Bearer ' + localStorage.getItem('booking');

export default axios;
