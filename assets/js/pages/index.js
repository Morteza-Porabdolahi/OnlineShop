import Swiper from 'swiper';
import {$$, formatPrice} from '../utils/utils';
import {setupPopupsForProducts} from '../popUp';
import {
  fetchAllProducts,
  addUserWish,
  isProductInWishlist,
  deleteUserWish,
  addItemInUserCart,
} from '../api/api';

const headerSearchInput = $$.querySelector('.body__search-input > input');
const categoryTitle = $$.querySelector('.category-selector__title');
const headerSearchIcon = $$.querySelector('.search-input__search-icon');
const categoryItems = $$.querySelectorAll(
    '.list-container__list > li[data-category]',
);

categoryItems.forEach((categoryItem) =>
  categoryItem.addEventListener('click', handleCategoryItem),
);

headerSearchInput.addEventListener('keydown', handleHeaderSearchInput);
headerSearchIcon.addEventListener('click', handleHeaderSearchInput);

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

function handleHeaderSearchInput(e) {
  const newHref = `/pages/shopPage.html?q=${headerSearchInput.value}?category=${
    categoryTitle.dataset.category || ''
  }`;

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

async function getAllProducts() {
  try {
    // implement some endpoints for api like /products/bestselling
    const [{value: response}] = await Promise.allSettled([
      fetchAllProducts(),
    ]);

    createBestSellingElements(response.data);
    createNewAndEssentialElems(response.data, '.new-temps');
    createNewAndEssentialElems(response.data, '.essential-temps');
  } catch (e) {
    console.log(e);
  }
}

getAllProducts();

function createBestSellingElements(products = []) {
  let productTemplate = $$.querySelector(
      `.bestselling__products template`,
  ).content.cloneNode(true);
  const fragment = $$.createDocumentFragment();

  products.forEach(({imageUrl, title, description, price, _id}) => {
    productTemplate.querySelector(
        'a[href]',
    ).href = `/pages/singleProductPage.html?productId=${_id}`;

    productTemplate.querySelector('.product__img').src = imageUrl;
    productTemplate.querySelector('.product__img').alt = description;

    productTemplate.querySelector('.description__image').src = imageUrl;
    productTemplate.querySelector('.description__image').alt = description;

    productTemplate.querySelector('.description__title').src = title;

    productTemplate.querySelector('.price__price').textContent = price;

    fragment.append(productTemplate);
    productTemplate = productTemplate.cloneNode(true);
  });

  appendProductsToContainer(fragment, '.bestselling__products');
}

function createNewAndEssentialElems(products = [], containerClass = '') {
  let productTemplate = $$.querySelector(
      `${containerClass} template`,
  ).content.cloneNode(true);
  const fragment = $$.createDocumentFragment();

  products.forEach(({discount, price, imageUrl, description, title, _id}) => {
    productTemplate.querySelector(
        '.title',
    ).href = `/pages/singleProductPage.html?productId=${_id}`;
    productTemplate.querySelector('.title').textContent = title;

    productTemplate.querySelector('img').src = imageUrl;
    productTemplate.querySelector('img').alt = description;

    if (discount) {
      productTemplate.querySelector('.price__price').textContent = formatPrice(
          ((100 - discount) / 100) * price,
      );
    }
    productTemplate.querySelector('.price__new-price').textContent =
      formatPrice(price);

    productTemplate
        .querySelector('.add-to-basket__title')
        .addEventListener('click', () => addItemInUserCart(_id));
    productTemplate
        .querySelector('.like-btn')
        .addEventListener('click', (e) => handleUserWish(e, _id, containerClass));

    handleUserWish(null, _id, containerClass);

    fragment.append(productTemplate);
    productTemplate = productTemplate.cloneNode(true);
  });

  appendProductsToContainer(fragment, containerClass);
}

function appendProductsToContainer(fragment, containerClass = '') {
  $$.querySelector(containerClass).append(fragment);

  if (containerClass == '.bestselling__products') setupPopupsForProducts();
}

async function handleUserWish(event, productId = '', containerClass = '') {
  const isLiked = await isProductInWishlist(productId);
  const likeButton = $$.querySelector(`${containerClass} .like-btn`);

  if (!event) {
    likeButton.classList[isLiked ? 'add' : 'remove']('liked');
  } else if (isLiked) {
    likeButton.classList.remove('liked');
    deleteUserWish(productId);
  } else {
    likeButton.classList.add('liked');
    addUserWish(productId);
  }

  handleNavbarNumbers('wishlist');
}
