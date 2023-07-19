import { deleteUserWish, getUserWishes } from '../api/wishlist';
import { fetchProduct } from '../api/product';
import { $$, formatPrice } from '../utils/utils';
import { addItemInUserCart } from '../api/cart';
import { generateElementsForProducts } from '../utils/htmlGeneration';

async function handleUserWishes() {
	const { data } = await getUserWishes();

	createWishesElements(data);
}

handleUserWishes();

async function createWishesElements(userWishes = []) {
	if (userWishes.length <= 0) return;

	const fragment = $$.createDocumentFragment();
	const wishTemplate = $$.querySelector('.products-container__products template');

	let wishElem;

	for (let i = 0; i < userWishes.length; i++) {
		let { data: product } = await fetchProduct(userWishes[i].productId);

		wishElem = generateElementsForProducts(product, wishTemplate)
		fragment.append(wishElem);
	}

	appendWishesIntoContainer(fragment);
}

function appendWishesIntoContainer(fragment) {
	const container = $$.querySelector('.products-container__products');

	container.innerHTML = '';
	container.append(fragment);
}

