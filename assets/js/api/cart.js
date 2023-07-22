import { axios } from "./interceptAxios";


export async function addItemInUserCart(productId = "") {
  try {
    const response = await axios.post(`/cart/${productId}`);

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function removeItemFromUserCart(itemId = "") {
  try {
    const response = await axios.delete(`/cart/${itemId}`);

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function getUserCart() {
  try {
    const response = await axios.get('/cart');

    return response.data;
  } catch (e) {
    console.log(e);
  }
}