import { formatPrice } from './utils';
import {
  handleUserCartNavbar,
  handleUserFavouritesLength,
  insertItemInUserCart,
  removeFavourite,
} from '../pages/general';

export function generateElementsForProducts(product = {}, template) {
  const cloneTemplate = template.content.cloneNode(true);

  const deleteWishBtn = cloneTemplate.querySelector('.delete-btn');

  cloneTemplate.querySelector('.img-container__img').src = product.imageUrl;
  cloneTemplate.querySelector('.img-container__img').alt = product.title;

  cloneTemplate.querySelector('.prices-title__title').textContent =
    product.title;
  cloneTemplate.querySelector('.prices-title__title').herf =
    `/pages/singleProductPage.html?productId=${product._id}`;

  if (product.discount) {
    cloneTemplate.querySelector('.prices__real-price').textContent =
      formatPrice(product.price);
  }
  cloneTemplate.querySelector('.prices__new-price').textContent = formatPrice(
    ((100 - product.discount) / 100) * product.price
  );

  cloneTemplate.querySelector('.summary-btn__summary').textContent =
    product.description;

  cloneTemplate
    .querySelector('.summary-btn__btn')
    .addEventListener('click', () =>
      insertItemInUserCart(product._id, handleUserCartNavbar)
    );
  if (deleteWishBtn) {
    deleteWishBtn.addEventListener('click', () =>
      removeFavourite(product._id, updateCallback)
    );
  }

  return cloneTemplate;
}

function updateCallback() {
  handleUserFavouritesLength();
  import('../pages/wishlistPage').then(({ handleUserWishes }) =>
    handleUserWishes()
  );
}
