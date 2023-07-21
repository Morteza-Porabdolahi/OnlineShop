import { axios } from "./interceptAxios";

import { getUserBasketItems, handleNavbarNumbers } from "../pages/general";

export async function addItemInUserCart(productId = "") {
  try {
    const { data } = await axios.post(`/users/user/cart?productId=${productId}`);
    console.log(data)
    getUserBasketItems();
    handleNavbarNumbers('cart');
  } catch (e) {
    console.log(e);
  }
}

export async function removeItemFromUserCart(itemId = "") {
  try {
    const { data } = await axios.delete(`/users/user/cart/${itemId}`);
    console.log(data)

    handleNavbarNumbers('cart');
    getUserBasketItems();
  } catch (e) {
    console.log(e);
  }
}

export async function manipulateQuantity(itemId = "", newData = {}) {
  try {
    const { data } = await axios.patch(`/users/user/cart/${itemId}`, newData);
    console.log(data)

    handleNavbarNumbers('cart');
    getUserBasketItems();
  } catch (e) {
    console.log(e);
  }
}

export function getUserCart() {
  return axios.get('/users/user/cart');
}