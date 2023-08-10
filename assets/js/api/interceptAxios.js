import axios from 'axios';

import {getUserToken} from '../utils/utils';

const API_URL = 'http://127.0.0.1:3000/api';
const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(function(config){
  const userToken = getUserToken();

  if(userToken){
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  
  return config;
}, function (err) {
  return Promise.reject(err);
});

export {instance as axios};
