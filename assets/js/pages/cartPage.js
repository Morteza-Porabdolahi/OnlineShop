import {$$, formatPrice} from '../utils/utils';
import {
  getUserCart,
  modernizeUserCartItem,
  removeItemFromUserCart,
} from '../api/api';
import {toast} from '../utils/toast';
import {handleUserCart} from './general';

(async function() {
  const userCart = await getUserCart();

  if (userCart.length <= 0) return;

  const template = $$.getElementById('cartTableTemp');
  const fragment = $$.createDocumentFragment();

  let cartItemElem;

  userCart.forEach((cartItem) => {
    cartItemElem = createUserCartElem(cartItem, template);
    fragment.append(cartItemElem);
  });

  appendCartItemsIntoDom(fragment);
})();

function createUserCartElem(cartItem = {}, template) {
  const cloneTemp = template.content.cloneNode(true);

  cloneTemp
      .querySelector('.product-col__remove-btn')
      .addEventListener('click', (event) => removeCartItem(event, cartItem._id));

  cloneTemp.querySelector('.product-col__product-img').src = cartItem.imageUrl;
  cloneTemp.querySelector('.product-col__product-img').alt = cartItem.title;

  cloneTemp.querySelector('.product-col__product-title').textContent =
    cartItem.title;
  cloneTemp.querySelector('.product-price__price').textContent = formatPrice(
      cartItem.price,
  );

  cloneTemp.querySelector('.product-sum-price__price').textContent =
    formatPrice(cartItem.bill);

  cloneTemp.querySelector('.number-of-product__number').textContent =
    cartItem.quantity;

  cloneTemp
      .querySelector('.number-of-product__remove')
      .addEventListener('click', (event) =>
        updateUserCartItem(event, cartItem, 'decrease'),
      );
  cloneTemp
      .querySelector('.number-of-product__add')
      .addEventListener('click', (event) =>
        updateUserCartItem(event, cartItem, 'increase'),
      );

  return cloneTemp;
}

// DRY --> general.js
async function updateUserCartItem(event, cartItem, mode = '') {
  if (mode === 'decrease' && cartItem.quantity > 1) {
    cartItem.quantity -= 1;
  } else if (mode === 'increase') {
    cartItem.quantity += 1;
  }

  cartItem.bill = cartItem.quantity * cartItem.price;
  const data = await modernizeUserCartItem({cartItem});

  if (data.error) {
    toast.error(data.err);
  } else {
    event.target.parentElement.children[1].textContent = cartItem.quantity;
    event.target
        .closest('td')
        .nextElementSibling.querySelector(
            '.product-sum-price__price',
        ).textContent = formatPrice(cartItem.bill);

    calculateSumOfTheCart();
  }
}

async function calculateSumOfTheCart() {
  const userCart = await getUserCart();
  const totalSumElem = $$.querySelector('.sum-number__sum');

  const sumPrice = userCart.reduce((acc, curr) => acc + curr.bill, 0);

  totalSumElem.textContent = formatPrice(sumPrice);
}

// DRY --> general.js
async function removeCartItem(event, itemId = '') {
  const data = await removeItemFromUserCart(itemId);

  if (data.error) {
    toast.error(data.error);
  } else {
    event.target.closest('tr').remove();

    toast.success(data.message);

    handleCartContainerClass();
    calculateSumOfTheCart();
    handleUserCart();
  }
}

function handleCartContainerClass() {
  const cartContainer = $$.querySelector('.body__cart-products-container');
  const noProducts = $$.querySelector('.body__no-products');
  const cartItems = cartContainer.querySelector(
      '.cart-products__cart-products-table > tbody',
  ).children.length;

  if (cartItems > 0) {
    cartContainer.style.display = 'flex';
    noProducts.style.display = 'none';
  } else {
    cartContainer.style.display = 'none';
    noProducts.style.display = 'block';
  }
}

function appendCartItemsIntoDom(fragment) {
  const cartItemsContainer = $$.querySelector(
      '.cart-products__cart-products-table > tbody',
  );

  cartItemsContainer.append(fragment);

  handleCartContainerClass();
  calculateSumOfTheCart();
}
