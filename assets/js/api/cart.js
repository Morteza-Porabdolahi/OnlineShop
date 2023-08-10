import { axios } from './interceptAxios';

export async function addItemInUserCart(productId = '') {
  try {
    const response = await axios.post(`/cart/${productId}`);

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}

export async function removeItemFromUserCart(itemId = '') {
  try {
    const response = await axios.delete(`/cart/${itemId}`);

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}

export async function getUserCart() {
  try {
    const response = await axios.get('/cart');

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response?.data.message || err.message };
  }
}

export async function modernizeUserCartItem(data) {
  try {
    const response = await axios.put(`/cart`, data);

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}
