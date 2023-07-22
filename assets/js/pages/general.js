import {
  getUserCart,
  modernizeUserCartItem,
  removeItemFromUserCart,
  getUserFavourites,
} from '../api/api';
import {$$, formatPrice, handleUserToken} from '../utils/utils';
import {toast} from '../utils/toast';

(function positionNavbar() {
  const navContainerElem = $$.querySelector('.header__nav-container');

  function handleNavBarPosition() {
    navContainerElem.classList[
      window.scrollY > navContainerElem.offsetTop ? 'add' : 'remove'
    ]('header__nav-container--sticked');
  }

  window.addEventListener('scroll', handleNavBarPosition);
})();

(function handleNavbarInput() {
  const searchInput = $$.querySelector('.search-container__input');
  const searchIcon = searchInput.nextElementSibling;

  function handleHref(e) {
    const newHref = `/pages/shopPage.html?search=${searchInput.value}`;

    if (e.type === 'click') {
      location.href = newHref;
    } else if (e.key === 'Enter') {
      location.href = newHref;
    }
  }

  searchInput.addEventListener('keydown', handleHref);
  searchIcon.addEventListener('click', handleHref);
})();

(function handleRegisterButton() {
  const user = handleUserToken();
  const registerBtn = $$.querySelector('.register-btn');

  if (user) {
    registerBtn.classList.remove('modal-btn');
    registerBtn.querySelector('a').textContent = user.username;
    registerBtn.addEventListener('click', () => {
      location.href = `/pages/accountPage.html?userId=${user.userId}`;
    });

    handleUserCart();
    handleUserFavouritesLength();
  }
})();

async function handleUserCart() {
  const userCart = await getUserCart();

  if (userCart.length <= 0) return;

  const fragment = $$.createDocumentFragment();
  const template = $$.getElementById('cartItemTemp');

  let cartItemElem;

  userCart.forEach((cartItem) => {
    cartItemElem = createUserCartElem(cartItem, template);
    fragment.append(cartItemElem);
  });

  appendCartItemsIntoDom(fragment);
}

async function calculateSumOfTheCart() {
  const userCart = await getUserCart();
  const sumElem = $$.getElementById('basket-sum');
  const sumPrice = userCart.reduce((acc, curr) => acc + curr.bill, 0);

  sumElem.textContent = formatPrice(sumPrice);
}

export function createUserCartElem(cartItem = {}, template) {
  const cloneTemplate = template.content.cloneNode(true);

  cloneTemplate.querySelector('img').src = cartItem.imageUrl;
  cloneTemplate.querySelector('img').alt = cartItem.title;

  cloneTemplate.querySelector('.title__text').textContent = cartItem.title;
  cloneTemplate.querySelector(
      '.title__text',
  ).href = `/pages/singleProductPage.html?productId=${cartItem.productId}`;

  cloneTemplate.querySelector('.number-of-product__number').textContent =
    cartItem.quantity;
  cloneTemplate.querySelector('.number-of-product').textContent =
    cartItem.quantity;

  cloneTemplate.querySelector('.product-price__price').textContent =
    formatPrice(cartItem.price);

  cloneTemplate
      .querySelector('.title__remove')
      .addEventListener('click', (event) => removeCartItem(event, cartItem._id));

  cloneTemplate
      .querySelector('.number-of-product__remove')
      .addEventListener('click', (event) =>
        updateUserCartItem(event, cartItem, 'decrease'),
      );
  cloneTemplate
      .querySelector('.number-of-product__add')
      .addEventListener('click', (event) =>
        updateUserCartItem(event, cartItem, 'increase'),
      );

  return cloneTemplate;
}

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
    event.target.parentElement.nextElementSibling.querySelector(
        '.number-of-product',
    ).textContent = cartItem.quantity;

    calculateSumOfTheCart();
  }
}

async function removeCartItem(event, itemId = '') {
  const data = await removeItemFromUserCart(itemId);

  if (data.error) {
    toast.error(data.error);
  } else {
    event.target.closest('.basket-products__basket-product').remove();

    toast.success(data.message);
    handleCartContainerClass();
    calculateSumOfTheCart();
    handleUserCartItemsLength();
  }
}

function handleCartContainerClass() {
  const cartContainer = $$.querySelector('.modal-body__show-products');
  const noProducts = $$.querySelector('.modal-body__no-products');
  const cartItems = cartContainer.children[1].children.length;

  if (cartItems > 0) {
    cartContainer.style.display = 'block';
    noProducts.style.display = 'none';
  } else {
    cartContainer.style.display = 'none';
    noProducts.style.display = 'flex';
  }
}

export function appendCartItemsIntoDom(fragment) {
  const cartItemsContainer = $$.querySelector(
      '.show-products__basket-products',
  );

  cartItemsContainer.append(fragment);

  handleCartContainerClass();
  calculateSumOfTheCart();
  handleUserCartItemsLength();
}

export async function handleUserCartItemsLength() {
  const basketNumberIcon = $$.querySelector(
      '.additional-icons__basket-icon > sup',
  );
  const userCart = await getUserCart();

  basketNumberIcon.textContent = userCart.length;
}

export async function handleUserFavouritesLength() {
  const favouritesNumberIcon = $$.querySelector(
      '.additional-icons__heart-icon > sup',
  );
  const userFavourites = await getUserFavourites();

  favouritesNumberIcon.textContent = userFavourites.length;
}
