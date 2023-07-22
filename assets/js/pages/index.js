import Swiper from 'swiper';
import 'swiper/css';

import {$$, calculateRealProductPrice, formatPrice} from '../utils/utils';
import {setupPopups} from '../popUp';
import {
  fetchAllProducts,
  addUserFavourite,
  isProductFavourite,
  removeUserFavourite,
  addItemInUserCart,
} from '../api/api';
import {toast} from '../utils/toast';
import {
  appendCartItemsIntoDom,
  createUserCartElem,
  handleUserFavouritesLength,
} from './general';

(function handleHeaderInput() {
  const headerSearchIcon = $$.querySelector('.search-input__search-icon');
  const headerSearchInput = $$.querySelector('.body__search-input > input');
  const categoryTitle = $$.querySelector('.category-selector__title');
  const categoryItems = $$.querySelectorAll(
      '.list-container__list > li[data-category]',
  );

  function handleHeaderSearchInput(e) {
    const newHref = `/pages/shopPage.html?q=${
      headerSearchInput.value
    }?category=${categoryTitle.dataset.category || ''}`;

    if (e.type === 'click') {
      location.href = newHref;
    } else if (e.key === 'Enter') {
      location.href = newHref;
    }
  }

  function handleCategoryItem(e) {
    categoryTitle.textContent = e.target.childNodes[0].textContent;
    categoryTitle.setAttribute('data-category', e.target.dataset.category);
  }

  headerSearchInput.addEventListener('keydown', handleHeaderSearchInput);
  headerSearchIcon.addEventListener('click', handleHeaderSearchInput);
  categoryItems.forEach((categoryItem) =>
    categoryItem.addEventListener('click', handleCategoryItem),
  );
})();

(function initializeSliders() {
  new Swiper('.swiper', {
    direction: 'horizontal',
    slidesPerView: 4,
    spaceBetween: 20,
    pagination: {
      el: '.my-own-pagination',
      clickable: true,
      bulletClass: 'bullet',
      bulletActiveClass: 'active-bullet',
      type: 'bullets',
    },
  });
})();

async function getAllProducts() {
  // implement some endpoints for api like /products/bestselling
  const [{value}] = await Promise.allSettled([fetchAllProducts()]);

  createBestSellingElems(value);
  createNewAndEssentialElems(value, '.new-temps');
  createNewAndEssentialElems(value, '.essential-temps');
}

window.onload = getAllProducts;

function createBestSellingElems(products = []) {
  const squareTemp = $$.getElementById('squareProductTemp');
  const fragment = $$.createDocumentFragment();

  products.forEach((product) => {
    const bestSellingElem = createBestSellingElem(product, squareTemp);

    fragment.append(bestSellingElem);
  });

  appendProductsToContainer(fragment, '.bestselling__products');
}

function createBestSellingElem(product = {}, template) {
  const cloneTemp = template.content.cloneNode(true);

  cloneTemp.querySelector(
      'a[href]',
  ).href = `/pages/singleProductPage.html?productId=${product._id}`;

  cloneTemp.querySelector('.product__img').src = product.imageUrl;
  cloneTemp.querySelector('.product__img').alt = product.description;

  cloneTemp.querySelector('.description__image').src = product.imageUrl;
  cloneTemp.querySelector('.description__image').alt = product.description;

  cloneTemp.querySelector('.description__title').src = product.title;

  cloneTemp.querySelector('.price__price').textContent = product.price;

  return cloneTemp;
}

async function createNewAndEssentialElems(products = [], containerClass = '') {
  const productTemplate = $$.getElementById('productTemp');
  const fragment = $$.createDocumentFragment();

  for (const product of products) {
    const productElem = await createNewAndEssentialElem(
        product,
        productTemplate,
    );

    fragment.append(productElem);
  }

  appendProductsToContainer(fragment, containerClass);
}

async function createNewAndEssentialElem(product = {}, template) {
  const cloneTemp = template.content.cloneNode(true);
  const {_id, imageUrl, description, title, price, discount} = product;

  cloneTemp.children[0].setAttribute('data-id', _id);

  cloneTemp.querySelector('.title').textContent = title;
  cloneTemp.querySelector(
      '.title',
  ).href = `/pages/singleProductPage.html?productId=${_id}`;

  cloneTemp.querySelector('img').src = imageUrl;
  cloneTemp.querySelector('img').alt = description;

  if (discount) {
    cloneTemp.querySelector('.price__price').textContent = formatPrice(
        calculateRealProductPrice(price, discount),
    );
  }
  cloneTemp.querySelector('.price__new-price').textContent = formatPrice(price);

  if (await isProductFavourite(_id)) {
    cloneTemp.querySelector('.like-btn').classList.add('liked');
  }

  cloneTemp
      .querySelector('.add-to-basket__title')
      .addEventListener('click', () => insertItemInUserCart(_id));
  cloneTemp
      .querySelector('.like-btn')
      .addEventListener('click', (e) => handleUserFavourite(e, _id));

  return cloneTemp;
}

async function handleUserFavourite(event, productId) {
  const likeButton = event.target;

  if (!likeButton.classList.contains('liked')) {
    const data = await addUserFavourite(productId);

    if (data.error) {
      toast.error(data.error);
    } else {
      $$.querySelectorAll(`.temps__temp[data-id="${productId}"]`).forEach(
          (temp) => {
            temp.querySelector('.like-btn').classList.add('liked');
          },
      );

      toast.success(data.message);
    }
  } else {
    const data = await removeUserFavourite(productId);

    if (data.error) {
      toast.error(data.error);
    } else {
      $$.querySelectorAll(`.temps__temp[data-id="${productId}"]`).forEach(
          (temp) => {
            temp.querySelector('.like-btn').classList.remove('liked');
          },
      );

      toast.success(data.message);
    }
  }

  handleUserFavouritesLength();
}

async function insertItemInUserCart(productId = '') {
  const data = await addItemInUserCart(productId);

  if (data.error) {
    toast.error(data.error);
  } else {
    insertCartItemInDom(data.newCartItem);
    toast.success(data.message);
  }
}

function insertCartItemInDom(newItem = {}) {
  const cartItemTemp = $$.getElementById('cartItemTemp');
  const cartItemElem = createUserCartElem(newItem, cartItemTemp);

  appendCartItemsIntoDom(cartItemElem);
}

function appendProductsToContainer(fragment, containerClass = '') {
  $$.querySelector(containerClass).append(fragment);

  if (containerClass == '.bestselling__products') setupPopups();
}
