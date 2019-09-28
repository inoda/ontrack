import axios from 'axios';

const apiAxiosInstance = axios.create({
  baseURL: '/api/v1',
  responseType: 'json',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

const Base = {
  makeRequest(requestObj, requestOpts) {
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    apiAxiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken;

    requestObj.data = JSON.stringify(requestObj.data);

    return new Promise((resolve, reject) => {
      apiAxiosInstance(requestObj).then(
        (success) => { resolve(success.data) },
        (error) => { reject(error.response) }
      );
    })
  },
  get(path, params, opts) {
    return this.makeRequest({ url: path, method: 'GET', params: params }, opts)
  },
  delete(path, params, opts) {
    return this.makeRequest({ url: path, method: 'DELETE', params: params }, opts)
  },
  post(path, data, opts) {
    return this.makeRequest({ url: path, data: data, method: 'POST' }, opts)
  },
  put(path, data, opts) {
    return this.makeRequest({ url: path, data: data, method: 'PUT' }, opts)
  },
}

export default Base;
