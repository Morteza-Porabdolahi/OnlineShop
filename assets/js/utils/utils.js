export const $$ = document;

export const getUserToken = () => localStorage.getItem('token');

export const parseJwt = (token) => {
	let base64Url = token.split(".")[1];
	let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	let jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

export function formatPrice(price) {
	return new Intl.NumberFormat('fa-IR', { currency: 'IRR', style: 'currency' }).format(price);
}


