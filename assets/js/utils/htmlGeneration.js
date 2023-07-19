import { addItemInUserCart } from "../api/cart";
import { deleteUserWish } from "../api/wishlist";
import { formatPrice } from "./utils";

export function generateElementsForProducts(product = {}, template) {
	const cloneTemplate = template.content.cloneNode(true);

	let deleteWishBtn = cloneTemplate.querySelector('.delete-btn');

	cloneTemplate.querySelector('.img-container__img').src = product.imageUrl;
	cloneTemplate.querySelector('.img-container__img').alt = product.title;

	cloneTemplate.querySelector('.prices-title__title').textContent = product.title;
	cloneTemplate.querySelector('.prices-title__title').herf = `/pages/singleProductPage.html?productId=${product._id}`;

	if (product.discount) cloneTemplate.querySelector('.prices__real-price').textContent = formatPrice(product.price);
	cloneTemplate.querySelector('.prices__new-price').textContent = formatPrice(((100 - product.discount) / 100) * product.price);

	cloneTemplate.querySelector('.summary-btn__summary').textContent = product.description;

	cloneTemplate.querySelector('.summary-btn__btn').addEventListener('click', () => addItemInUserCart(product._id))
	if(deleteWishBtn) deleteWishBtn.addEventListener('click', () => deleteUserWish(product._id))

	return cloneTemplate;
}