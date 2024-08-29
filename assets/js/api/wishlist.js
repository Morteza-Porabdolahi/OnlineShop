import { axios } from './interceptAxios';

export async function addUserFavourite(productId = '') {
  try {
    const response = await axios.post(`/wishlist/${productId}`);

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response?.data.message || err.message };
  }
}

export async function removeUserFavourite(productId = '') {
  try {
    const response = await axios.delete(`/wishlist/${productId}`);

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}

export async function isProductFavourite(productId = '') {
  try {
    const userFavourites = await getUserFavourites();

    return userFavourites.some((favourite) => favourite.productId == productId);
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}

export async function getUserFavourites() {
  try {
    const response = await axios.get('/wishlist');

    return response.data;
  } catch (err) {
    throw err;
  }
}
