import { $$, formatPrice, toast } from '../utils/utils';
import {
  getUserCart,
  modernizeUserCartItem,
  removeItemFromUserCart,
  getUserFavourites,
  addItemInUserCart,
  removeUserFavourite,
  loginUser,
  addComment,
  sendEmail,
} from '../api/api';

export async function handleUserCartNavbar() {
  const userCart = await getUserCart();

  if (userCart.length <= 0) {
    showNoProducts();
    handleUserCartItemsLength();
    return;
  }

  const fragment = $$.createDocumentFragment();
  const template = $$.getElementById('cartItemTemp');

  let cloneTemp;
  let cartItemElem;

  userCart.forEach((cartItem) => {
    cloneTemp = template.content.cloneNode(true);

    cartItemElem = createUserCartElem(cartItem, cloneTemp);
    fragment.append(cartItemElem);
  });

  appendCartItemsIntoDom(fragment);
}

function createUserCartElem(cartItem = {}, cloneTemp) {
  cloneTemp.querySelector('img').src = cartItem.imageUrl;
  cloneTemp.querySelector('img').alt = cartItem.title;

  cloneTemp.querySelector('.title__text').textContent = cartItem.title;
  cloneTemp.querySelector('.title__text').href =
    `/pages/singleProductPage.html?productId=${cartItem.productId}`;

  cloneTemp.querySelector('.number-of-product__number').textContent =
    cartItem.quantity;
  cloneTemp.querySelector('.number-of-product').textContent = cartItem.quantity;

  cloneTemp.querySelector('.product-price__price').textContent = formatPrice(
    cartItem.price
  );

  cloneTemp
    .querySelector('.title__remove')
    .addEventListener('click', (event) =>
      removeCartItem(cartItem._id, handleUserCartNavbar)
    );

  cloneTemp
    .querySelector('.number-of-product__remove')
    .addEventListener('click', () =>
      updateUserCartItem(cartItem, 'decrease', handleUserCartNavbar)
    );
  cloneTemp
    .querySelector('.number-of-product__add')
    .addEventListener('click', () =>
      updateUserCartItem(cartItem, 'increase', handleUserCartNavbar)
    );

  return cloneTemp;
}

function appendCartItemsIntoDom(fragment) {
  const cartItemsContainer = $$.querySelector(
    '.show-products__basket-products'
  );

  cartItemsContainer.innerHTML = '';
  cartItemsContainer.append(fragment);

  calculateSumOfTheCart();
  handleUserCartItemsLength();
  hideNoProducts();
}

function showNoProducts() {
  const noProducts = $$.querySelector('.modal-body__no-products');
  const cartContainer = $$.querySelector('.modal-body__show-products');

  cartContainer.style.display = 'none';
  noProducts.style.display = 'flex';
}

function hideNoProducts() {
  const noProducts = $$.querySelector('.modal-body__no-products');
  const cartContainer = $$.querySelector('.modal-body__show-products');

  cartContainer.style.display = 'block';
  noProducts.style.display = 'none';
}

async function calculateSumOfTheCart() {
  const userCart = await getUserCart();
  const sumElem = $$.getElementById('basket-sum');
  const sumPrice = userCart.reduce((acc, curr) => acc + curr.bill, 0);

  sumElem.textContent = formatPrice(sumPrice);
}

export async function removeCartItem(itemId = '', callback) {
  const data = await removeItemFromUserCart(itemId);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);

    callback();
  }
}

/**
 * Updates cart item quantity
 *
 * @param {object} cartItem The cart item
 * @param {string} mode Increase or decrease quantity of item
 * @param {function} callback Callback for the dom update
 */
export async function updateUserCartItem(cartItem, mode = '', callback) {
  if (mode === 'decrease' && cartItem.quantity > 1) {
    cartItem.quantity -= 1;
  } else if (mode === 'increase') {
    cartItem.quantity += 1;
  }

  cartItem.bill = cartItem.quantity * cartItem.price;

  const data = await modernizeUserCartItem({ cartItem });

  if (data.error) {
    toast.error(data.err);
  } else {
    callback();
  }
}

export async function handleUserCartItemsLength() {
  const basketNumberIcon = $$.querySelector(
    '.additional-icons__basket-icon > sup'
  );
  const userCart = await getUserCart();

  basketNumberIcon.textContent = userCart.length;
}

export async function handleUserFavouritesLength() {
  const favouritesNumberIcon = $$.querySelector(
    '.additional-icons__heart-icon > sup'
  );
  const userFavourites = await getUserFavourites();

  favouritesNumberIcon.textContent = userFavourites.length;
}

export async function insertItemInUserCart(productId = '', callback) {
  const data = await addItemInUserCart(productId);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);
    callback();
  }
}

export async function removeFavourite(productId = '', callback) {
  const data = await removeUserFavourite(productId);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);

    callback();
  }
}

export async function handleUserLogin(e) {
  e.preventDefault();

  toast.loading();

  const user = {
    email: e.target.emailOrName.value,
    password: e.target.password.value,
  };

  const data = await loginUser(user);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);

    const token = data.token;
    localStorage.setItem('access_token', token);

    setTimeout(() => {
      location.href = '/';
    }, 2000);
  }
}

export async function insertComment(comment = {}) {
  const data = await addComment(comment);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);
  }
}

// implement email functionality
export async function handleSendEmail(e) {
  e.preventDefault();

  const emailInput = $$.getElementById('email-input');

  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(emailInput.value)) {
    return toast.error('لطفا ایمیل معتبر وارد کنید');
  }

  const data = await sendEmail(emailInput.value);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);
  }
}
