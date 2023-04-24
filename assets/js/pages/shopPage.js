const minRangeInput = $.querySelector(".min-range");
const maxRangeInput = $.querySelector(".max-range");
const rangeStartPrice = $.querySelector(".start__price");
const rangeEndPrice = $.querySelector(".end__price");
const rangeInputsProgress = $.querySelector(".progress");

let maxPrice = 599000;

minRangeInput.addEventListener("input", handleMinRangeInput);
maxRangeInput.addEventListener("input", handleMaxRangeInput);

function handleMaxRangeInput() {
  maxRangeInput.min = minRangeInput.value;
  maxRangeInput.style.width = `${(maxPrice - minRangeInput.value) /
    maxPrice *
    100 +
    5}%`;

  rangeEndPrice.textContent = maxRangeInput.value;

  handleProgressWidth();

  minRangeInput.classList.remove("range-input--active");
}

function handleMinRangeInput() {
  minRangeInput.max = maxRangeInput.value;
  minRangeInput.style.width = `${maxRangeInput.value / maxPrice * 100}%`;

  rangeStartPrice.textContent = minRangeInput.value;

  handleProgressWidth();

  minRangeInput.classList.add("range-input--active");
}

function handleProgressWidth() {
  rangeInputsProgress.style.right = `${minRangeInput.value / maxPrice * 100}%`;
  rangeInputsProgress.style.left = `${(maxPrice - maxRangeInput.value) /
    maxPrice *
    100}%`;
}

// -----------------------------
const productsContainer = $.querySelector(".products-container__products");

function insertNewProducts(products) {
  const productTemplate = $.querySelector(
    ".products-container__products template"
  );

  while (productsContainer.lastChild.nodeName !== "TEMPLATE") {
    productsContainer.removeChild(productsContainer.lastChild);
  }

  products.forEach(product => {
    const cloneTemp = productTemplate.content.cloneNode(true);
    const productTitle = cloneTemp.querySelector(".prices-title__title");
    const productNewPrice = cloneTemp.querySelector(".prices__new-price");
    const productPrice = cloneTemp.querySelector(".prices__real-price");
    const productDesc = cloneTemp.querySelector(".summary__text");
    const addToCartBtn = cloneTemp.querySelector(".summary-btn__btn");

    addToCartBtn.onclick = () => addProductInCart(product._id, 1);
    productDesc.textContent = product.description;
    productTitle.textContent = product.name;
    productTitle.href = `/pages/singleProductPage.html?id=${product._id}`;
    productNewPrice.textContent = `${product[
      product.newPrice ? "newPrice" : "price"
    ].toLocaleString("fa")}تومان`;
    productPrice.textContent = product.newPrice
      ? `${product.price.toLocaleString("fa")} تومان`
      : "";

    productsContainer.append(cloneTemp);
  });
}

(async function() {
  insertNewProducts(await fetchAllProducts());
})();

// ------------- Filter Btns -------------- //

const gridBtns = $.querySelectorAll(".options__products-grid > span");
const priceFilterBtn = $.querySelector(".container__filter-btn");
const numberBtns = $.querySelectorAll(
  ".options__number-of-products > span:not(:first-child)"
);

gridBtns.forEach(gridBtn =>
  gridBtn.addEventListener("click", handleProductsGrid)
);
numberBtns.forEach(numberBtn =>
  numberBtn.addEventListener("click", handleShowingProductNumber)
);
priceFilterBtn.addEventListener("click", filterProductsByPrice);

function handleProductsGrid(e) {
  const clickedBtn = e.target.closest("span");

  gridBtns.forEach(gridBtn =>
    gridBtn.classList.remove("products-grid__square--active")
  );
  clickedBtn.classList.add("products-grid__square--active");

  if (clickedBtn.classList.contains("columns_2")) {
    productsContainer.className = "products-container__products columns_2";
  } else if (clickedBtn.classList.contains("columns_3")) {
    productsContainer.className = "products-container__products columns_3";
  } else {
    productsContainer.className = "products-container__products columns_4";
  }
}

async function handleShowingProductNumber(e) {
  const allProducts = await fetchAllProducts();
  const clickedBtn = e.target.closest("span");
  const clickedBtnNumDataset = clickedBtn.dataset.num;

  numberBtns.forEach(numberBtn =>
    numberBtn.classList.remove("number-of-products__number--active")
  );
  clickedBtn.classList.add("number-of-products__number--active");

  if (clickedBtnNumDataset === "12") {
    insertNewProducts(allProducts.slice(0, 13));
  } else if (clickedBtnNumDataset === "20") {
    insertNewProducts(allProducts.slice(0, 20));
  } else if (clickedBtnNumDataset === "30") {
    insertNewProducts(allProducts.slice(0, 30));
  } else {
    insertNewProducts(allProducts.slice());
  }
  filterProductsByPrice();
}

let allProducts;

(async function() {
  allProducts = await fetchAllProducts();
})();

function filterProductsByPrice() {
  insertNewProducts(
    allProducts.filter(
      product =>
        product.price <= maxRangeInput.value &&
        product.price >= minRangeInput.value
    )
  );
}
