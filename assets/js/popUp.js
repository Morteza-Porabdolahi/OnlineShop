import { $$ } from "./utils/utils";
import { computePosition, shift, flip, offset } from "@floating-ui/dom";

export function setupPopups() {
    const events = [["mouseenter", showPopUp], ["mouseleave", hidePopUp]];
    let popUpElem;
    let productElem;

    $$.querySelectorAll('.products__product').forEach(product => {
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

}