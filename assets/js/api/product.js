import { axios } from './interceptAxios'

export function fetchAllProducts() {
  return axios.get('/products');
}

export function createProduct(product = {}) {
  return axios.post('/products', product);
}

export function fetchProduct(productId = "") {
  return axios.get(`/products/${productId}`);
}