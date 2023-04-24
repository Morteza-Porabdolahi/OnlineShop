let products = $.querySelectorAll('.products__product');

// Posts and Products Slider
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 4,
    spaceBetween: 20,

    // If we need pagination
    pagination: {
        el: '.my-own-pagination',
        clickable: true,
        bulletClass: "bullet",
        bulletActiveClass: "active-bullet",
        type: 'bullets',
    },
});

const scrollBarSlider = new Swiper('.scrollbar-swiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 4,
    spaceBetween: 20,

    scrollbar: {
        el: '.swiper-scrollbar',
        enabled: false,
    }
});

// --------------------------------------
let allProducts = fetchAllProducts();

// async function create() {
//     const userToken = localStorage.getItem('token');
//     if (userToken) {
//         try {
//             await fetch(`http://127.0.0.1:3000/items`, {
//                 method: 'POST',
//                 headers: {
//                     "Authorization": `Bearer ${userToken}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     name: 'قالب فروشگاهی قطعات خودرو پارتدو، Partdo',
//                     description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.',
//                     category: 'wp-template',
//                     price: 300000,
//                 })
//             });
//         } catch (err) {
//             if (err) throw err;
//         }
//     }
// }

// create()


function insertBestSellingProducts() {
    const bestSellingProductsContainer = $.querySelector('.bestselling__products');
    const productTemplate = $.querySelector('.bestselling__products template');

    allProducts.forEach(product => {
        const cloneTemp = productTemplate.content.cloneNode(true);
        const newDiv = $.createElement('div');

        const productImageLink = cloneTemp.querySelector('a');
        const productTitle = cloneTemp.querySelector('.description__title');
        const productPrice = cloneTemp.querySelector('.price__price');

        productImageLink.href = `/pages/singleProductPage.html?id=${product._id}`
        productTitle.textContent = product.name;
        productPrice.textContent = `${product[product.newPrice ? "newPrice" : 'price'].toLocaleString('fa')}`;

        newDiv.className = 'products__product';

        newDiv.append(cloneTemp);

        bestSellingProductsContainer.append(newDiv);
    });

    products = $.querySelectorAll('.products__product');
    setPopUpForProducts(products);
}

function insertNewProducts() {
    const newProductsContainer = $.querySelector('.new-temps__temps .swiper-wrapper');
    const productTemplate = $.querySelector('.new-temps__temps template');

    allProducts.forEach(product => {
        const cloneTemp = productTemplate.content.cloneNode(true);
        const newDiv = $.createElement('div');
        const productTitle = cloneTemp.querySelector('.description__title > a');
        const productNewPrice = cloneTemp.querySelector('.price__new-price');
        const productPrice = cloneTemp.querySelector('.price__price');
        const addToCartBtn = cloneTemp.querySelector('.description__add-to-basket');

        addToCartBtn.onclick = () => addProductInCart(product._id, 1);
        productTitle.textContent = product.name;
        productTitle.href = `/pages/singleProductPage.html?id=${product._id}`
        productNewPrice.textContent = `${product[product.newPrice ? "newPrice" : "price"].toLocaleString('fa')}تومان`;
        productPrice.textContent = product.newPrice ? `${product.price.toLocaleString('fa')} تومان` : '';
        newDiv.className = 'temps__temp swiper-slide';

        newDiv.append(cloneTemp);
        newProductsContainer.append(newDiv);
    });

}

