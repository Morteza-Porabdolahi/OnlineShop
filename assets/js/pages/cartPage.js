import { $$, formatPrice, handleItemQuantity } from '../utils/utils';
import { getUserCart, removeItemFromUserCart } from '../api/cart';

(function () {
	async function fetchUserCart() {
		try {
			const { data: cart } = await getUserCart();

			createElementsFromCart(cart);
		} catch (e) {
			console.log(e);
		}
	}

	function createElementsFromCart(cart = []) {
		if (cart.length <= 0) {
			const noProducts = $$.querySelector('.body__no-products');
			const cartContainer = $$.querySelector('.body__cart-products-container');

			cartContainer.style.display = 'none';
			noProducts.style.display = 'block';

			return;
		}

		let cartItemTemp = $$.querySelector('.cart-products__cart-products-table template').content;
		const fragment = $$.createDocumentFragment();
		let sumOfThePrices = 0;

		cart.forEach(({ imageUrl, name, price, quantity, bill, _id: itemId, productId }) => {
			cartItemTemp.querySelector('.product-col__remove-btn').addEventListener('click', () => removeItemFromUserCart(itemId));

			cartItemTemp.querySelector('.number-of-product__number').textContent = quantity;

			cartItemTemp.querySelector('.product-col__product-img').src = imageUrl;
			cartItemTemp.querySelector('.product-col__product-img').alt = name;

			cartItemTemp.querySelector('.product-col__product-title').textContent = name;
			cartItemTemp.querySelector('.product-col__product-title').href = `/pages/singleProductPage.html?productId=${productId}`;

			cartItemTemp.querySelector('.product-price__price').textContent = formatPrice(price);

			cartItemTemp.querySelector('.product-sum-price__price').textContent = formatPrice(bill);

			cartItemTemp.querySelector(".number-of-product__remove").addEventListener('click', () => handleItemQuantity(quantity - 1, price, itemId));
			cartItemTemp.querySelector(".number-of-product__add").addEventListener('click', () => handleItemQuantity(quantity + 1, price, itemId));
				
			sumOfThePrices += bill;

			fragment.append(cartItemTemp);
			cartItemTemp = cartItemTemp.cloneNode(true);
		});

		showTheSumPrice(sumOfThePrices);
		appendFragmentToTable(fragment);
	}

	function showTheSumPrice(sumOfThePrices = 0) {
		$$.querySelector('.sum-number__sum').textContent = formatPrice(sumOfThePrices);
	}

	function appendFragmentToTable(fragment) {
		const cartTableBody = $$.querySelector('.cart-products__cart-products-table tbody');

		cartTableBody.innerHTML = '';
		cartTableBody.append(fragment);
	}

	fetchUserCart();

})()