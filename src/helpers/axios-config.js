import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.headers.common['Accept'] = 'application/json';
if (process.env.REACT_APP_ENV === 'local') {
  axios.defaults.baseURL = 'http://127.0.0.1:8080/api';
} else {
  axios.defaults.baseURL = 'https://dolphin-app-b3fkw.ondigitalocean.app/api';
}
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: error => {
    return error.response && error.response.status === 400;
  }
});
// axios.defaults.headers.authorization = 'Bearer ' + localStorage.getItem('booking');

export default axios;
