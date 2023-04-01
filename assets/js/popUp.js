const events = [["mouseenter", showPopUp], ["mouseleave", hidePopUp]];
const { computePosition, shift, flip, offset } = window.FloatingUIDOM;
let popUpElem;
let productElem;

products.forEach(product => {
    events.forEach(([evName, callback]) => {
        product.addEventListener(evName, callback);
    });
});

function update(refrenceEl, floatingEl) {
    computePosition(refrenceEl, floatingEl, {
        placement: 'bottom',
        middleware: [offset(3), flip(), shift({ padding: 100 })]
    }).then(({ x, y }) => {
        floatingEl.style.left = `${x}px`;
        floatingEl.style.top = `${y}px`;
    });

}

function showPopUp(e) {
    productElem = e.target.closest('.products__product');
    popUpElem = productElem.children[1];

    popUpElem.style.display = 'block';

    update(productElem, popUpElem);
}

function hidePopUp(e) {
    popUpElem = e.target.closest('.products__product').children[1];

    popUpElem.style.display = 'none';
}
