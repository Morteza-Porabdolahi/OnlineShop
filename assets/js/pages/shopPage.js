import { $$, formatPrice, handleUserToken, toast } from '../utils/utils';
import {
  addUserFavourite,
  isProductFavourite,
  removeUserFavourite,
  fetchAllProducts,
} from '../api/api';
import {
  handleUserCartNavbar,
  handleUserFavouritesLength,
  insertItemInUserCart,
} from './general';
import { showSpinner, hideSpinner } from '../utils/spinner';

const stockInputs = $$.querySelectorAll('.stock-input');

const orderSelector = $$.querySelector('.products-filtering__select');

const minRangeInput = $$.querySelector('.min-range');
const maxRangeInput = $$.querySelector('.max-range');

const rangeStartPrice = $$.querySelector('.start__price');
const rangeEndPrice = $$.querySelector('.end__price');

const rangeInputsProgress = $$.querySelector('.progress');

const maxPrice = 599000;

minRangeInput.addEventListener('input', handleMinRangeInput);
maxRangeInput.addEventListener('input', handleMaxRangeInput);

orderSelector.addEventListener('change', handleSortByUrl);

stockInputs.forEach((stockInput) =>
  stockInput.addEventListener('change', handleProductsByDiscounts)
);

function handleProductsByDiscounts(e) {
  const isChecked = e.target.checked;

  if (isChecked) {
    handleFilterUrl(e.target.value);
  } else {
    removeFilterFromUrl(e.target.value);
  }
}

function removeFilterFromUrl(filter) {
  const urlSearchParams = new URLSearchParams(location.search);
  const filterByArr = urlSearchParams.get('filterBy').split(',');

  const newFilterBy = filterByArr.filter((item) => item !== filter).join(',');

  urlSearchParams.set('filterBy', newFilterBy);

  history.pushState(null, null, `?${urlSearchParams.toString()}`);
  getAllProducts();
}

function handleSortByUrl(e) {
  const urlSearchParams = new URLSearchParams(location.search);

  switch (e.target.value) {
    case 'popularity': {
      urlSearchParams.set('sortBy', 'popularity');
      break;
    }
    case 'score': {
      urlSearchParams.set('sortBy', 'rating');
      break;
    }
    case 'last': {
      urlSearchParams.set('sortBy', 'latest');
      break;
    }
    case 'expensive': {
      urlSearchParams.set('sortBy', 'HighToLowPrice');
      break;
    }
    case 'cheap': {
      urlSearchParams.set('sortBy', 'lowToHighPrice');
      break;
    }
  }

  history.pushState(null, null, `?${urlSearchParams.toString()}`);
  getAllProducts();
}

function handleFilterUrl(filter, start, end) {
  const urlSearchParams = new URLSearchParams(location.search);

  const prevFilter = urlSearchParams.get('filterBy');
  const shouldBeCommaSeprated = prevFilter ? `${prevFilter},` : '';

  switch (filter) {
    case 'available': {
      urlSearchParams.set('filterBy', `${shouldBeCommaSeprated}available`);
      break;
    }
    case 'specialSale': {
      urlSearchParams.set('filterBy', `${shouldBeCommaSeprated}specialSale`);
      break;
    }
    case 'price': {
      if (!prevFilter.split(',').includes('price')) {
        urlSearchParams.set('filterBy', `${shouldBeCommaSeprated}price`);
      }

      if (
        urlSearchParams.get('start') === start &&
        urlSearchParams.get('end') === end
      ) {
        return;
      }

      urlSearchParams.set('start', start);
      urlSearchParams.set('end', end);
      break;
    }
  }

  history.pushState(null, null, `?${urlSearchParams.toString()}`);
  getAllProducts();
}

async function getAllProducts() {
  try {
    emptyProductsContainer();
    showSpinner('.products-container__products');

    const data = await fetchAllProducts();

    await createElementsForProducts(data);

    hideSpinner('.products-container__products');
  } catch (err) {
    toast.error(err);
  }
}

async function createElementsForProducts(products = []) {
  const fragment = $$.createDocumentFragment();
  const productTemp = $$.querySelector('.body__products-container > template');

  let productElem;
  let cloneTemp;

  for (const product of products) {
    cloneTemp = productTemp.content.cloneNode(true);

    productElem = await createElementForProduct(product, cloneTemp);
    fragment.append(productElem);
  }

  appendProductsIntoContainer(fragment);
}

async function createElementForProduct(product = {}, cloneTemp) {
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
    calculateDiscountedPrice(product.price, product.discount)
  );

  cloneTemp.querySelector('.summary-btn__summary').textContent =
    product.description;

  cloneTemp
    .querySelector('.summary-btn__btn')
    .addEventListener('click', () =>
      insertItemInUserCart(product._id, handleUserCartNavbar)
    );

  if (handleUserToken() && (await isProductFavourite(product._id))) {
    cloneTemp.querySelector('.like-btn').classList.add('liked');
  }

  cloneTemp
    .querySelector('.like-btn')
    .addEventListener('click', (e) => handleUserFavourite(e, product._id));

  return cloneTemp;
}

function calculateDiscountedPrice(price, discount) {
  return ((100 - discount) / 100) * price;
}

async function handleUserFavourite(event, productId) {
  const likeButton = event.target;
  const hasLiked = likeButton.classList.contains('liked');
  const data = await (hasLiked ? removeUserFavourite : addUserFavourite)(
    productId
  );

  if (data.error) {
    toast.error(data.error);
  } else {
    likeButton.classList[hasLiked ? 'remove' : 'add']('liked');

    toast.success(data.message);
    handleUserFavouritesLength();
  }
}

function appendProductsIntoContainer(fragment) {
  const productsContainer = $$.querySelector('.products-container__products');

  productsContainer.append(fragment);
}

function emptyProductsContainer() {
  const productsContainer = $$.querySelector('.products-container__products');

  productsContainer.innerHTML = '';
}

function handleMaxRangeInput() {
  maxRangeInput.min = minRangeInput.value;
  maxRangeInput.style.width = `${
    ((maxPrice - minRangeInput.value) / maxPrice) * 100 + 5
  }%`;

  rangeEndPrice.textContent = maxRangeInput.value;

  handleProgressWidth();
  minRangeInput.classList.remove('range-input--active');
}

function handleMinRangeInput() {
  minRangeInput.max = maxRangeInput.value;
  minRangeInput.style.width = `${(maxRangeInput.value / maxPrice) * 100}%`;

  rangeStartPrice.textContent = minRangeInput.value;

  handleProgressWidth();
  minRangeInput.classList.add('range-input--active');
}

function handleProgressWidth() {
  rangeInputsProgress.style.right = `${
    (minRangeInput.value / maxPrice) * 100
  }%`;
  rangeInputsProgress.style.left = `${
    ((maxPrice - maxRangeInput.value) / maxPrice) * 100
  }%`;
}

/**
 * handles clicks with the help of bubbling phase
 *
 * @param {object} e The event object
 */
function handleClickEvents(e) {
  const targetEl = e.target;

  const squareBtn = targetEl.closest('span.products-grid__square');
  const productNumberBtn = targetEl.closest('span.number-of-products__number');

  if (squareBtn) {
    handleProductsGrid(squareBtn);
  } else if (productNumberBtn) {
    limitProductsNumber(productNumberBtn);
  } else if (targetEl.classList.contains('container__filter-btn')) {
    handleFilterUrl('price', minRangeInput.value, maxRangeInput.value);
  }
}

function handleProductsGrid(squareBtn) {
  const contanierClass = 'products-container__products';
  const productsContainer = $$.querySelector(`.${contanierClass}`);
  const activeClass = 'products-grid__square--active';

  $$.querySelector(`.${activeClass}`).classList.remove(activeClass);
  squareBtn.classList.add(activeClass);

  productsContainer.className = contanierClass;
  productsContainer.classList.add(`columns_${squareBtn.dataset.columns}`);
}

function limitProductsNumber(productNumberBtn) {
  const activeClass = 'number-of-products__number--active';
  const urlSearchParams = new URLSearchParams(location.search);

  $$.querySelector(`.${activeClass}`).classList.remove(activeClass);
  productNumberBtn.classList.add(activeClass);

  if (productNumberBtn.dataset.num !== urlSearchParams.get('limit')) {
    urlSearchParams.set('limit', productNumberBtn.dataset.num);
    history.pushState(null, null, `?${urlSearchParams.toString()}`);

    getAllProducts();
  }
}

document.documentElement.addEventListener('click', handleClickEvents);

window.addEventListener('load', getAllProducts);
