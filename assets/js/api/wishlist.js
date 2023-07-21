import { axios } from "./interceptAxios";

export async function addUserWish(productId = "") {
	try {
		const { data } = await axios.post(`/users/user/wishlist/${productId}`);
		console.log(data)

	} catch (e) {
		console.log(e);
	}
}

export async function deleteUserWish(productId = "") {
	try {
		const { data } = await axios.delete(`/users/user/wishlist/${productId}`);
		console.log(data)

	} catch (e) {
		console.log(e);
	}
}

export async function isProductInWishlist(productId = "") {
	try {
		const { data } = await getUserWishes();

		return data.some(wishlist => wishlist.productId == productId);
	} catch (e) {
		console.log(e);
	}
}

export function getUserWishes() {
	return axios.get('/users/user/wishlist');
}
