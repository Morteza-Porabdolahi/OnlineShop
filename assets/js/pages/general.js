import { parseJwt, $$ } from '../utils/utils';
import { getUserCart, removeItemFromUserCart, manipulateQuantity } from '../api/cart';
import { formatPrice } from '../utils/utils';

(function () {
  const searchInputElem = $$.querySelector('.search-container__input');
  const searchIconElem = searchInputElem.nextElementSibling;

  searchInputElem.addEventListener('keydown', handleUserSearch);
  searchIconElem.addEventListener('click', handleUserSearch);

  const userToken = localStorage.getItem("token");

  if (userToken) {
    const { user, exp } = parseJwt(userToken);
    const date = new Date();

    if (exp * 1000 <= date.getTime()) {
      localStorage.removeItem("token");
      location.reload();
    } else {
      changeNavBtnText(user);
      getUserBasketItems();
    }
  }
})()

function handleUserSearch(e){
  if(e.type === 'click'){
    location.href = `/pages/shopPage.html?q=${e.target.previousElementSibling.value}`;
  }else if(e.key === 'Enter'){
    location.href = `/pages/shopPage.html?q=${e.target.value}`;
  }
}

function changeNavBtnText(user) {
  const navUserBtn = $$.querySelector(".register-btn");
  const userAccPageLink = navUserBtn.children[1];

  userAccPageLink.href = `/pages/accountPage.html?userId=${user.userId}`;
  userAccPageLink.textContent = user.username;

  navUserBtn.classList.remove("modal-btn");
}

async function getUserBasketItems() {
  try {
    const { data } = await getUserCart();

    createBasketElements(data)
  } catch (e) {
    console.log(e);
  }
}

function createBasketElements(items = []) {
  if (items.length <= 0) {
    return;
  }

  const basketProductsContainer = $$.querySelector(".modal-body__show-products");

  let basketProductTemplate = basketProductsContainer.querySelector("template").content;

  const fragment = $$.createDocumentFragment();

  items.forEach(({ quantity, price, name, _id: itemId, imageUrl }) => {
    basketProductTemplate.querySelector(".number-of-product__remove").addEventListener('click', () => handleItemQuantity(quantity - 1, price, itemId))
    basketProductTemplate.querySelector(".number-of-product__add").addEventListener('click', () => handleItemQuantity(quantity + 1, price, itemId))
    basketProductTemplate.querySelector(".title__remove").addEventListener('click', () => removeItemFromUserCart(itemId));

    basketProductTemplate.querySelector('.img-container__img').src = imageUrl;
    basketProductTemplate.querySelector('.img-container__img').alt = name;

    basketProductTemplate.querySelector(".number-of-product__number").textContent = quantity;
    basketProductTemplate.querySelector(".number-of-product").textContent = quantity;

    basketProductTemplate.querySelector(".title__text").textContent = name;

    basketProductTemplate.querySelector(".product-price__price").textContent = formatPrice(price);

    fragment.append(basketProductTemplate);
    basketProductTemplate = basketProductTemplate.cloneNode(true);
  });

  $$.querySelector('.price-sum__price').textContent = formatPrice(sumCartProductsPrice(items));
  appendProductsIntoCart(fragment);
}

function sumCartProductsPrice(items = []) {
  return items.reduce((acc, curr) => acc + curr.bill, 0);
}

function appendProductsIntoCart(fragment) {
  const basketProductsElem = $$.querySelector('.show-products__basket-products');
  const basketNoProducts = $$.querySelector(".modal-body__no-products");

  basketProductsElem.innerHTML = '';
  basketProductsElem.append(fragment);

  basketNoProducts.style.display = 'none';
  basketProductsElem.style.display = 'flex';
}

async function removeProductFromBasket(itemId = "") {
  try {
    const { data } = await removeProductFromCart(itemId);

    getUserBasketItems();
  } catch (e) {
    console.log(e);
  }
}

async function handleItemQuantity(quantity, price, itemId = "") {
  try {
    if (quantity <= 0) return await removeItemFromUserCart(itemId);

    await manipulateQuantity(itemId, { quantity, bill: quantity * price });
  } catch (e) {
    console.log(e);
  }
}
