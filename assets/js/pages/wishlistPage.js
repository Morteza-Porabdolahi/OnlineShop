import { deleteUserWish, getUserWishes } from '../api/wishlist';
import { fetchProduct } from '../api/product';
import { $$, formatPrice } from '../utils/utils';
import { addItemInUserCart } from '../api/cart';

async function handleUserWishes() {
	const { data } = await getUserWishes();

	createWishesElements(data);
}

handleUserWishes();

async function createWishesElements(userWishes = []) {
	if(userWishes.length <= 0) return;

	const fragment = $$.createDocumentFragment();
	let wishTemplate = $$.querySelector('.products-container__products template').content;

	for (let i = 0; i < userWishes.length; i++) {
		let { data: product } = await fetchProduct(userWishes[i].productId);

		wishTemplate.querySelector('.img-container__img').src = product.imageUrl;
		wishTemplate.querySelector('.img-container__img').alt = product.title;

		wishTemplate.querySelector('.prices-title__title').textContent = product.title;
		wishTemplate.querySelector('.prices-title__title').herf = `/pages/singleProductPage.html?productId=${product._id}`;

		if (product.discount) wishTemplate.querySelector('.prices__real-price').textContent = formatPrice(product.price);
		wishTemplate.querySelector('.prices__new-price').textContent = formatPrice(((100 - product.discount) / 100) * product.price);

		wishTemplate.querySelector('.summary-btn__summary').textContent = product.description;

		wishTemplate.querySelector('.summary-btn__btn').addEventListener('click', () => addItemInUserCart(product._id))
		wishTemplate.querySelector('.delete-btn').addEventListener('click', () => deleteUserWish(product._id))

		fragment.append(wishTemplate);
		wishTemplate = wishTemplate.cloneNode(true);
	}

	appendWishesIntoContainer(fragment);
}

function appendWishesIntoContainer(fragment) {
	const container = $$.querySelector('.products-container__products');

	container.innerHTML = '';
	container.append(fragment);
}

