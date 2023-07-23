import {$$, formatPrice} from '../utils/utils';
import {fetchProduct} from '../api/api';
import {toast} from '../utils/toast';
import {handleUserCartNavbar, insertItemInUserCart} from './general';

const tabButtons = $$.querySelectorAll('.tab-names-list__item');
const tabs = $$.querySelectorAll('.tab');
const starElems = $$.querySelectorAll('.star');

tabButtons.forEach((tabButton) =>
  tabButton.addEventListener('click', handleSwitchTab),
);
starElems.forEach((starElem) =>
  starElem.addEventListener('click', handleScoreStars),
);

function handleSwitchTab(e) {
  const clickedTab = e.target.closest('li');
  const clickedTabElem = $$.querySelector(`#${clickedTab.dataset.tab}`);

  tabs.forEach((tab) => tab.classList.remove('tab--active'));
  tabButtons.forEach((tabBtn) =>
    tabBtn.classList.remove('tab-names-list__item--active'),
  );

  clickedTab.classList.add('tab-names-list__item--active');
  clickedTabElem.classList.add('tab--active');
}

function handleScoreStars(e) {
  const star = e.target;
  const starChildNumber = [...starElems].indexOf(star);

  starElems.forEach((starElem) => starElem.classList.remove('star--active'));
  for (let i = starChildNumber; i < starElems.length; i++) {
    starElems[i].classList.add('star--active');
  }
}

async function getSingleProduct() {
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');

  const data = await fetchProduct(productId);

  if (data.error) {
    toast.error(data.error);
  } else {
    insertProductDatasIntoPage(data);
  }
}

window.addEventListener('load', getSingleProduct);

function insertProductDatasIntoPage(product = {}) {
  $$.querySelector('.intro__breadcrumb > .item--active').textContent =
    product.title;
  $$.querySelector('.intro__title').textContent = product.title;

  $$.querySelectorAll('.product-additional-desc__price').forEach(
      (priceElem) => {
        priceElem.textContent = formatPrice(product.price);
      },
  );

  $$.querySelector('.list-item__text > a').textContent = product?.category;

  $$.querySelector('.product-img-container__img').src = product.imageUrl;
  $$.querySelector('.product-img-container__img').alt = product.title;

  $$.querySelectorAll('.product-additional-desc__add-to-basket-btn').forEach(
      (addToBasket) => {
        addToBasket.addEventListener('click', () =>
          insertItemInUserCart(product._id, handleUserCartNavbar),
        );
      },
  );
}
