import Swiper from "swiper"
import { createProduct, fetchAllProducts } from "../api/product";
import { $$, getUserToken, formatPrice } from '../utils/utils';
import { setupPopupsForProducts } from '../popUp';
import { addItemInUserCart } from "../api/cart";
import { toggleUserWish, getUserWishes } from "../api/wishlist";

(function () {
    const sameSwiperSettings = {
        direction: 'horizontal',
        slidesPerView: 4,
        spaceBetween: 20,
    }

    // Posts and Products Slider
    new Swiper('.swiper', {
        ...sameSwiperSettings,
        pagination: {
            el: '.my-own-pagination',
            clickable: true,
            bulletClass: "bullet",
            bulletActiveClass: "active-bullet",
            type: 'bullets',
        },
    });

    async function getAllProducts() {
        const [{ value: response }] = await Promise.allSettled([fetchAllProducts()]);

        createBestSellingElements(response.data);
        createNewAndEssentialElems(response.data, '.new-temps');
        createNewAndEssentialElems(response.data, '.essential-temps');
    }

    function createBestSellingElements(products = []) {
        let productTemplate = $$.querySelector(`.bestselling__products template`).content.cloneNode(true);
        const fragment = $$.createDocumentFragment();

        products.forEach(({ imageUrl, title, description, price, _id }) => {
            productTemplate.querySelector('a[href]').href = `/pages/singleProductPage.html?id=${_id}`;
            productTemplate.querySelector('.product__img').src = imageUrl;
            productTemplate.querySelector('.product__img').alt = description;
            productTemplate.querySelector('.description__image').src = imageUrl;
            productTemplate.querySelector('.description__image').alt = description;
            productTemplate.querySelector('.description__title').src = title;
            productTemplate.querySelector('.price__price').textContent = price;

            productTemplate = productTemplate.cloneNode(true);
            fragment.append(productTemplate);
        });

        appendProductsToContainer(fragment, '.bestselling__products');
    }

    function createNewAndEssentialElems(products = [], containerClass = "") {
        let productTemplate = $$.querySelector(`${containerClass} template`).content.cloneNode(true);
        const fragment = $$.createDocumentFragment();

        let isProductWishlisted;

        products.forEach(({ discount, price, imageUrl, description, title, _id }) => {
            productTemplate.querySelector('.title').href = `/pages/singleProductPage.html?id=${_id}`;
            productTemplate.querySelector('.title').textContent = title;

            productTemplate.querySelector('img').src = imageUrl;
            productTemplate.querySelector('img').alt = description;

            if (discount) productTemplate.querySelector('.price__price').textContent = formatPrice(((100 - discount) / 100) * price);
            productTemplate.querySelector('.price__new-price').textContent = formatPrice(price);

            productTemplate.querySelector('.add-to-basket__title').addEventListener('click', () => addItemInUserCart(_id));
            productTemplate.querySelector('.like-btn').addEventListener('click', () => toggleUserWish(_id));

            isProductInWishlist(_id).then(boolean => {
                if (boolean) $$.querySelector(`${containerClass} .like-btn:last-of-type`).classList.add('liked');
            })

            fragment.append(productTemplate);
            productTemplate = productTemplate.cloneNode(true);            
        });

        appendProductsToContainer(fragment, containerClass);
    }

    function isProductInWishlist(productId = "") {
        const response = getUserWishes();

        return response.then(({ data }) => data.some(wishlist => wishlist.productId == productId));
    }

    function appendProductsToContainer(fragment, containerClass = "") {
        $$.querySelector(containerClass).append(fragment);        

        if (containerClass == '.bestselling__products') setupPopupsForProducts();
    }

    getAllProducts();
})()
