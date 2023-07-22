import { axios } from "./interceptAxios";

export async function addUserFavourite(productId = "") {
	try {
		const response = await axios.post(`/users/user/wishlist/${productId}`);

		return response.data;
	} catch (e) {
		console.log(e);
	}
}

export async function removeUserFavourite(productId = "") {
	try {
		const response = await axios.delete(`/users/user/wishlist/${productId}`);

		return response.data;
	} catch (e) {
		console.log(e);
	}
}

export async function isProductFavourite(productId = "") {
	const userFavourites = await getUserWishes();

	return userFavourites.some(favourite => favourite.productId == productId);
}

export async function getUserWishes() {
	try {
		const response = await axios.get('/users/user/wishlist');

		return response.data;
	} catch (e) {
		console.log(e);
	}
}
