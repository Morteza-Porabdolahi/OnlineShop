import { axios } from './interceptAxios'

export function fetchAllProducts() {
  return axios.get('/products');
}

export function addProductInCart(productId, quantity) {
  return axios.post('/user/cart', {
    itemId: productId,
    quantity,
  });
}

export async function createProduct(product = {}) {
  return axios.post('/products', product);
}