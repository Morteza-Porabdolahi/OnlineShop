import { axios } from "./interceptAxios";

export function toggleUserWish(productId = ""){
	return axios.post(`/users/user/wishlist/${productId}`);
}

export function getUserWishes(){
	return axios.get('/users/user/wishlist');
}

export function deleteUserWish(productId = ""){
	return axios.delete(`/users/user/wishlist/${productId}`);
}