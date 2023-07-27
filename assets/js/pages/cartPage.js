import {$$, formatPrice} from '../utils/utils';
import {getUserCart} from '../api/api';
import {
  handleUserCartNavbar,
  removeCartItem,
  updateUserCartItem,
} from './general';

const upgradeCartBtn = $$.getElementById('upgrade-btn');

upgradeCartBtn.addEventListener('click', handleUserCartTable);

async function handleUserCartTable() {
  const userCart = await getUserCart();

  if (userCart.length <= 0) {
    showNoProducts();
    return;
  }

  const template = $$.getElementById('cartTableTemp');
  const fragment = $$.createDocumentFragment();

  let cartItemElem;
  let cloneTemp;

  userCart.forEach((cartItem) => {
    cloneTemp = template.content.cloneNode(true);

    cartItemElem = createUserCartElem(cartItem, cloneTemp);
    fragment.append(cartItemElem);
  });

  appendCartItemsIntoDom(fragment);
}

window.addEventListener('load', handleUserCartTable);

/**
 * Shows no product alert
 */
function showNoProducts() {
  const cartContainer = $$.querySelector('.body__cart-products-container');
  const noProducts = $$.querySelector('.body__no-products');

  cartContainer.style.display = 'none';
  noProducts.style.display = 'block';
}

/**
 * Hides no product alert
 */
function hideNoProducts() {
  const cartContainer = $$.querySelector('.body__cart-products-container');
  const noProducts = $$.querySelector('.body__no-products');

  cartContainer.style.display = 'flex';
  noProducts.style.display = 'none';
}

function createUserCartElem(cartItem = {}, cloneTemp) {
  cloneTemp
      .querySelector('.product-col__remove-btn')
      .addEventListener('click', () =>
        removeCartItem(cartItem._id, updateCallback),
      );

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
      .addEventListener('click', () =>
        updateUserCartItem(cartItem, 'decrease', updateCallback),
      );
  cloneTemp
      .querySelector('.number-of-product__add')
      .addEventListener('click', () =>
        updateUserCartItem(cartItem, 'increase', updateCallback),
      );

  return cloneTemp;
}

function updateCallback() {
  handleUserCartTable();
  handleUserCartNavbar();
}

async function calculateSumOfTheCart() {
  const userCart = await getUserCart();
  const totalSumElem = $$.querySelector('.sum-number__sum');

  const sumPrice = userCart.reduce((acc, curr) => acc + curr.bill, 0);

  totalSumElem.textContent = formatPrice(sumPrice);
}

function appendCartItemsIntoDom(fragment) {
  const cartItemsContainer = $$.querySelector(
      '.cart-products__cart-products-table > tbody',
  );

  cartItemsContainer.innerHTML = '';
  cartItemsContainer.append(fragment);

  calculateSumOfTheCart();
  hideNoProducts();
}
