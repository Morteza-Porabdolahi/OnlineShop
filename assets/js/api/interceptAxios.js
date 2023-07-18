import axios from 'axios';
import { getUserToken } from '../utils/utils';

const API_URL = "http://127.0.0.1:3000/api";
const instance = axios.create({
  baseURL: API_URL,
});

instance.defaults.headers.common['Authorization'] = `Bearer ${getUserToken()}`;

export { instance as axios };
