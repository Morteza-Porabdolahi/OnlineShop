import { axios } from './interceptAxios'

export function fetchAllProducts() {
  return axios.get('/products');
}

export async function createProduct(product = {}) {
  return axios.post('/products', product);
}