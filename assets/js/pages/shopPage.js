import { fetchAllProducts } from '../api/product';
import { generateElementsForProducts } from '../utils/htmlGeneration';
import { $$ } from '../utils/utils';

(function () {
	let products = [];

	const stockInputs = $$.querySelectorAll('.stock-input');

	const orderSelector = $$.querySelector('.products-filtering__select');

	const minRangeInput = $$.querySelector(".min-range");
	const maxRangeInput = $$.querySelector(".max-range");

	const rangeStartPrice = $$.querySelector(".start__price");
	const rangeEndPrice = $$.querySelector(".end__price");

	const rangeInputsProgress = $$.querySelector(".progress");

	let maxPrice = 5990000;

	minRangeInput.addEventListener("input", handleMinRangeInput);
	maxRangeInput.addEventListener("input", handleMaxRangeInput);

	orderSelector.addEventListener('change', handleProductsOrder);

	stockInputs.forEach(stockInput => stockInput.addEventListener('change', handleProductsByDiscounts));

	function handleProductsByDiscounts(e) {
		const { filterByAvailability, filterSpecialSales } = filterProducts(products);
		let isChecked = e.target.checked;

		if (isChecked) {
			if (e.target.value === 'available') {
				createElementsForProducts(filterByAvailability());
			} else {
				createElementsForProducts(filterSpecialSales());
			}
		} else {
			createElementsForProducts(products);
		}
	}	

	function handleProductsOrder(e) {
		const { filterLowToHighPrice, filterHighToLowPrice, filterByLatest, filterByScore, filterByPopularity } = filterProducts(products);

		switch (e.target.value) {
			case "popularity": {
				createElementsForProducts(filterByPopularity());
				break;
			}
			case "score": {
				createElementsForProducts(filterByScore());
				break;
			}
			case "last": {
				createElementsForProducts(filterByLatest());
				break;
			}
			case "expensive": {
				createElementsForProducts(filterHighToLowPrice());
				break;
			}
			case "cheap": {
				createElementsForProducts(filterLowToHighPrice());
				break;
			}
		}
	}

	function filterProducts(products = []) {
		return {
			filterLowToHighPrice() {
				return products.sort((a, b) => a.price - b.price);
			},
			filterHighToLowPrice() {
				return products.sort((a, b) => b.price - a.price);
			},
			filterByPopularity() {
				return products.sort((a, b) => a.popular ? 1 : -1);
			},
			filterByScore() {
				return products.sort((a, b) => b.rating - a.rating);
			},
			filterByLatest() {
				// needs to be checked in mongodb
				return products.sort((a, b) => b.createdDate - a.createdDate);
			},
			filterByAvailability() {
				return products.filter((product) => product.stock > 0);
			},
			filterSpecialSales() {
				return products.filter((product) => product.discount >= 70);
			},
			filterByPrice(start, end) {
				return products.filter(product => product.price <= end && product.price >= start);
			},
			filterByCategory(category = "") {
				return products.filter(product => product.categories.includes(category));
			}
		}
	}

	async function getAllProducts(limit, category = "", query = "") {
		const { data } = await fetchAllProducts(limit, category, query);

		products = data;
		createElementsForProducts(products);
	} 

	window.addEventListener('load', () => {
		const params = new URLSearchParams(location.search);

		getAllProducts(12, params.get('category') || "", params.get('q') || "");
	})

	function createElementsForProducts(products = []) {
		const fragment = $$.createDocumentFragment();
		const productTemp = $$.querySelector('.body__products-container > template');

		let productElem;

		products.forEach(product => {
			productElem = generateElementsForProducts(product, productTemp);
			fragment.append(productElem);
		});

		appendProductsIntoContainer(fragment);
	}

	function appendProductsIntoContainer(fragment) {
		const productsContainer = $$.querySelector('.products-container__products');

		productsContainer.innerHTML = '';
		productsContainer.append(fragment);
	}

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

	function handleClickEvents(e) {
		let targetEl = e.target;

		const squareBtn = targetEl.closest('span.products-grid__square');
		const productNumberBtn = targetEl.closest('span.number-of-products__number');
		
		if (squareBtn) {
			handleProductsGrid(squareBtn);
		} else if (productNumberBtn) {
			limitProductsNumber(productNumberBtn);
		} else if (targetEl.classList.contains('container__filter-btn')) {
			const { filterByPrice } = filterProducts(products);
			const filteredProducts = filterByPrice(minRangeInput.value, maxRangeInput.value);

			createElementsForProducts(filteredProducts);
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

		$$.querySelector(`.${activeClass}`).classList.remove(activeClass);
		productNumberBtn.classList.add(activeClass);

		getAllProducts(parseInt(productNumberBtn.dataset.num))
	}

	document.documentElement.addEventListener('click', handleClickEvents);
})()