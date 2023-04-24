window.onload = function() {
  handleUserToken();
  fillUserBasketModal();
};

function handleUserToken() {
  const userToken = localStorage.getItem("token");

  if (userToken) {
    const { user, exp } = parseJwt(userToken);
    const date = new Date();

    if (exp * 1000 <= date.getTime()) {
      localStorage.removeItem("token");
      location.reload();
    } else {
      changeNavBtnText(user);
    }
  }
}

function changeNavBtnText(user) {
  const navUserBtn = $.querySelector(".register-btn");
  const userAccPageLink = navUserBtn.children[1];

  userAccPageLink.href = "/pages/accountPage.html";
  userAccPageLink.textContent = user.name;
  navUserBtn.classList.remove("modal-btn");
}

function handleUserBasket() {
  const userToken = localStorage.getItem("token");
  if (userToken) {
    const response = fetch(`${apiUrl}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
    });
    return response;
  }
}

const priceSumOfBasket = $.getElementById("basket-sum");

async function fillUserBasketModal() {
  const response = await handleUserBasket();
  const { bill, items } = await response.json();

  const basketProductsContainer = $.querySelector(".modal-body__show-products");
  const basketProducts = $.querySelector(".show-products__basket-products");
  const basketNoProducts = $.querySelector(".modal-body__no-products");
  const templateBasketProduct = $.querySelector(
    ".show-products__basket-products > template"
  );

  if (items.length <= 0) {
    basketProductsContainer.style.display = "none";
    basketNoProducts.style.display = "flex";
  } else {
    items.forEach(item => {
      const tempClone = templateBasketProduct.content.cloneNode(true);
      const numberProductQuantity = tempClone.querySelector(
        ".number-of-product__number"
      );
      const productQuantity = tempClone.querySelector(".number-of-product");

      tempClone.querySelector(".number-of-product__remove").onclick = () =>
        removeProductQuantity(item, productQuantity, numberProductQuantity);
      tempClone.querySelector(".number-of-product__add").onclick = () =>
        addProductQuantity(item, productQuantity, numberProductQuantity);
      tempClone.querySelector(".title__remove").onclick = () =>
        removeProductFromBasket(item.itemId);

      productQuantity.textContent = item.quantity;
      numberProductQuantity.textContent = item.quantity;
      tempClone.querySelector(".title__text").textContent = item.name;
      tempClone.querySelector(
        ".product-price__price"
      ).textContent = item.price.toLocaleString("fa");

      basketProducts.append(tempClone);
    });

    priceSumOfBasket.textContent = bill.toLocaleString("fa");
  }
}

async function removeProductFromBasket(itemId) {
  const response = await removeProduct(itemId);
  if (response.status === 200) {
    fillUserBasketModal();
  }
}

async function addProductQuantity(
  product,
  productQuantity,
  numberProductQuantity
) {
  const response = await handleUserBasket();
  const { bill, items } = await response.json();
  const item = items.find(item => item.itemId === product.itemId);

  await addProductInCart(product.itemId, item.quantity + 1);

  numberProductQuantity.textContent = item.quantity + 1;
  productQuantity.textContent = item.quantity + 1;
  priceSumOfBasket.textContent = (bill + product.price).toLocaleString("fa");
}

async function removeProductQuantity(
  product,
  productQuantity,
  numberProductQuantity
) {
  if (+numberProductQuantity.textContent > 1) {
    const response = await handleUserBasket();
    const { bill, items } = await response.json();
    const item = items.find(item => item.itemId === product.itemId);

    await addProductInCart(product.itemId, item.quantity - 1);

    numberProductQuantity.textContent = item.quantity - 1;
    productQuantity.textContent = item.quantity - 1;
    priceSumOfBasket.textContent = (bill - product.price).toLocaleString("fa");
  }
}

function removeProduct(itemId) {
  const userToken = localStorage.getItem("token");
  if (userToken) {
    const response = fetch(`${apiUrl}/cart?itemId=${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
    });
    return response;
  }
}
