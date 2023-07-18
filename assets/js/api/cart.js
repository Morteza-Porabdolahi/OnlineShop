import { axios } from "./interceptAxios";

export function addItemInUserCart(productId = "") {
  return axios.post(`/users/user/cart?productId=${productId}`);
}

export function removeItemFromUserCart(itemId = "") {
  return axios.delete(`/users/user/cart/${itemId}`);
}

export function getUserCart() {
  return axios.get('/users/user/cart');
}

export function manipulateQuantity(itemId = "", data = {}) {
  return axios.patch(`/users/user/cart/${itemId}`, data);
}