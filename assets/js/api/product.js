import { axios } from './interceptAxios'

export async function fetchAllProducts() {
  const locationSearch = location.search;

  try {
    const response = await axios.get(`/products${locationSearch}`, {
      headers: {},
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function createProduct(product = {}) {
  try {
    const response = await axios.post('/products', product);

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchProduct(productId = "") {
  try {
    const response = await axios.get(`/products/${productId}`);

    return response.data;
  } catch (e) {
    console.log(e);
  }
}