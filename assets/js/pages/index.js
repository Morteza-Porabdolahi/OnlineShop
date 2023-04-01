let $ = document;

// Pop Up for Products Descriptions
const products = $.querySelectorAll('.products__product');

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
