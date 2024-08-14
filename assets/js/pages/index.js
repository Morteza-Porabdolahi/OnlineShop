import Swiper from 'swiper';
import 'swiper/css';

import {
  $$,
  calculateProductRealPrice,
  formatPrice,
  handleUserToken,
  toast,
} from '../utils/utils';
import { showSpinner, hideSpinner } from '../utils/spinner';
import { setupPopups } from '../popUp';
import {
  fetchAllProducts,
  addUserFavourite,
  isProductFavourite,
  removeUserFavourite,
} from '../api/api';
import {
  handleUserCartNavbar,
  handleUserFavouritesLength,
  insertItemInUserCart,
} from './general';

/**
 * Sets events for header search input
 */
function handleHeaderInput() {
  const headerSearchIcon = $$.querySelector('.search-input__search-icon');
  const headerSearchInput = $$.querySelector('.body__search-input > input');
  const categoryTitle = $$.querySelector('.category-selector__title');
  const categoryItems = $$.querySelectorAll(
    '.list-container__list > li[data-category]'
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
    categoryItem.addEventListener('click', handleCategoryItem)
  );
}

function initializeSliders() {
  new Swiper('.swiper', {
    direction: 'horizontal',
    slidesPerView: 2,
    breakpoints: {
      480: {
        slidesPerView: 3,
      },
      800: {
        slidesPerView: 4,
      },
    },
    spaceBetween: 20,
    pagination: {
      el: '.my-own-pagination',
      clickable: true,
      bulletClass: 'bullet',
      bulletActiveClass: 'active-bullet',
      type: 'bullets',
    },
  });
}

window.onload = function () {
  handleHeaderInput();
  initializeSliders();
  getAllProducts();
};

async function getAllProducts() {
  // implement some endpoints for api like /products/bestselling
  const [bestSellingProducts, newProducts, essentialProducts] =
    await Promise.allSettled([
      fetchAllProducts(),
      fetchAllProducts(),
      fetchAllProducts(), // to be changed
    ]);

  console.log(bestSellingProducts, newProducts, essentialProducts);
  if (data.error) {
    toast.error(data.error);
  } else {
    createNewAndEssentialElems(data, '.new-temps');
    createNewAndEssentialElems(data, '.essential-temps');
  }
}

function createBestSellingElems(products = []) {
  const squareTemp = $$.getElementById('squareProductTemp');
  const fragment = $$.createDocumentFragment();

  let cloneTemp;
  let bestSellingElem;

  products.forEach((product) => {
    cloneTemp = squareTemp.content.cloneNode(true);

    bestSellingElem = createBestSellingElem(product, cloneTemp);
    fragment.append(bestSellingElem);
  });

  hideSpinner('.bestselling__products');
  appendProductsToContainer(fragment, '.bestselling__products');
}

function createBestSellingElem(product = {}, cloneTemp) {
  cloneTemp.querySelector(
    'a[href]'
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

  let cloneTemp;
  let productElem;

  for (const product of products) {
    cloneTemp = productTemplate.content.cloneNode(true);

    productElem = await createNewAndEssentialElem(product, cloneTemp);
    fragment.append(productElem);
  }

  appendProductsToContainer(fragment, containerClass);
}

async function createNewAndEssentialElem(product = {}, cloneTemp) {
  const { _id, imageUrl, description, title, price, discount } = product;

  cloneTemp.children[0].setAttribute('data-id', _id);

  cloneTemp.querySelector('.title').textContent = title;
  cloneTemp.querySelector(
    '.title'
  ).href = `/pages/singleProductPage.html?productId=${_id}`;

  cloneTemp.querySelector('img').src = imageUrl;
  cloneTemp.querySelector('img').alt = description;

  if (discount) {
    cloneTemp.querySelector('.price__price').textContent = formatPrice(
      calculateProductRealPrice(price, discount)
    );
  }
  cloneTemp.querySelector('.price__new-price').textContent = formatPrice(price);

  if (handleUserToken() && (await isProductFavourite(_id))) {
    cloneTemp.querySelector('.like-btn').classList.add('liked');
  }

  cloneTemp
    .querySelector('.add-to-basket__title')
    .addEventListener('click', () =>
      insertItemInUserCart(_id, handleUserCartNavbar)
    );
  cloneTemp
    .querySelector('.like-btn')
    .addEventListener('click', (e) => handleUserFavourite(e, _id));

  return cloneTemp;
}

/**
 * Runs when user adds/removes his/her favourite product
 *
 * @param {object} event The event object
 * @param {string} productId The id of the product
 */
async function handleUserFavourite(event, productId) {
  const likeButton = event.target;
  const hasLiked = likeButton.classList.contains('liked');
  const data = await (hasLiked ? removeUserFavourite : addUserFavourite)(
    productId
  );

  if (data.error) {
    toast.error(data.error);
  } else {
    $$.querySelectorAll(`.temps__temp[data-id="${productId}"]`).forEach(
      (temp) => {
        temp
          .querySelector('.like-btn')
          .classList[hasLiked ? 'remove' : 'add']('liked');
      }
    );

    toast.success(data.message);
    handleUserFavouritesLength();
  }
}

function appendProductsToContainer(fragment, containerClass = '') {
  $$.querySelector(containerClass).append(fragment);

  // setup popups just for bestselling products
  if (containerClass == '.bestselling__products' && window.innerWidth >= 1024)
    setupPopups();
}
