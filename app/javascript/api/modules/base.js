import axios from 'axios';

const apiAxiosInstance = axios.create({
  baseURL: '/api/v1',
  responseType: 'json',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const Base = {
  makeRequest(requestObj) {
    const csrfToken = document.querySelector('meta[name=csrf-token]').content;
    apiAxiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken;

    return new Promise((resolve, reject) => {
      apiAxiosInstance(requestObj).then(
        (success) => { resolve(success.data); },
        (error) => { reject(error.response); },
      );
    });
  },
  get(path, params, opts) {
    return this.makeRequest({ url: path, method: 'GET', params }, opts);
  },
  delete(path, params, opts) {
    return this.makeRequest({ url: path, method: 'DELETE', params }, opts);
  },
  post(path, data, opts) {
    return this.makeRequest({ url: path, data, method: 'POST' }, opts);
  },
  put(path, data, opts) {
    return this.makeRequest({ url: path, data, method: 'PUT' }, opts);
  },
};

export default Base;
