let navTopElem = $.querySelector('.nav__top');
let navBottomElem = $.querySelector('.nav__bottom');
let headerSocial = $.querySelector('.header__social');


function fixNavBar() {
    let scrollCondition = window.scrollY >= navTopElem.scrollHeight;

    navTopElem.style.cssText = scrollCondition ? 'z-index: 1; position: fixed; top: 0; right: 0; left: 0;border-radius: 0; padding: 1rem' : '';
    headerSocial.style.display = scrollCondition ? 'none' : '';
    navBottomElem.style.display = scrollCondition ? 'none' : '';
}

window.addEventListener('scroll', fixNavBar);