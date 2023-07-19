import { axios } from './interceptAxios'

export function fetchAllProducts(limit, category = "", query = "") {
  return axios.get(`/products?limit=${limit}&category=${category}&q=${query}`);
}

export function createProduct(product = {}) {
  return axios.post('/products', product);
}

export function fetchProduct(productId = "") {
  return axios.get(`/products/${productId}`);
}