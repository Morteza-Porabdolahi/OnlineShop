import { getUserFavourites, fetchProduct } from '../api/api';
import { $$, formatPrice } from '../utils/utils';
import {
  handleUserCartNavbar,
  handleUserFavouritesLength,
  insertItemInUserCart,
  removeFavourite,
} from './general';

export async function handleUserWishes() {
  const data = await getUserFavourites();

  if (data.error) {
    toast.error(data.error);
  } else if (data.length <= 0) {
    showNoFavourites();
  } else {
    createWishesElements(data);
  }
}

function showNoFavourites() {
  const cartContainer = $$.querySelector('.body__favorite-products');
  const noProducts = $$.querySelector('.body__no-products');

  cartContainer.style.display = 'none';
  noProducts.style.display = 'block';
}

window.addEventListener('load', handleUserWishes);

async function createWishesElements(userWishes = []) {
  if (userWishes.length <= 0) return;

  const fragment = $$.createDocumentFragment();
  const wishTemplate = $$.querySelector(
    '.favorite-products__products-container template'
  );

  let cloneTemp;
  let wishElem;
  let data;

  for (let i = 0; i < userWishes.length; i++) {
    data = await fetchProduct(userWishes[i].productId);

    if (data.error) {
      toast.error(data.error);
    } else {
      cloneTemp = wishTemplate.content.cloneNode(true);

      wishElem = createElementForFavourite(data, cloneTemp);
      fragment.append(wishElem);
    }
  }

  appendWishesIntoContainer(fragment);
}

function createElementForFavourite(product = {}, cloneTemp) {
  cloneTemp.querySelector('.img-container__img').src = product.imageUrl;
  cloneTemp.querySelector('.img-container__img').alt = product.title;

  cloneTemp.querySelector('.prices-title__title').textContent = product.title;
  cloneTemp.querySelector('.prices-title__title').herf =
    `/pages/singleProductPage.html?productId=${product._id}`;

  if (product.discount) {
    cloneTemp.querySelector('.prices__real-price').textContent = formatPrice(
      product.price
    );
  }
  cloneTemp.querySelector('.prices__new-price').textContent = formatPrice(
    ((100 - product.discount) / 100) * product.price
  );

  cloneTemp.querySelector('.summary-btn__summary').textContent =
    product.description;

  cloneTemp
    .querySelector('.summary-btn__btn')
    .addEventListener('click', () =>
      insertItemInUserCart(product._id, handleUserCartNavbar)
    );
  cloneTemp
    .querySelector('.delete-btn')
    .addEventListener('click', () =>
      removeFavourite(product._id, updateCallback)
    );

  return cloneTemp;
}

function updateCallback() {
  handleUserWishes();
  handleUserFavouritesLength();
}

function appendWishesIntoContainer(fragment) {
  const container = $$.querySelector('.products-container__products');

  container.innerHTML = '';
  container.append(fragment);
}
