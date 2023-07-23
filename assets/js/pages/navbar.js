import {$$, handleUserToken} from '../utils/utils';
import {handleUserCartNavbar, handleUserFavouritesLength} from './general';

function positionNavbar() {
  const navContainerElem = $$.querySelector('.header__nav-container');

  function handleNavBarPosition() {
    navContainerElem.classList[
      window.scrollY > navContainerElem.offsetTop ? 'add' : 'remove'
    ]('header__nav-container--sticked');
  }

  window.addEventListener('scroll', handleNavBarPosition);
}

function handleNavbarInput() {
  const searchInput = $$.querySelector('.search-container__input');
  const searchIcon = searchInput.nextElementSibling;

  function handleHref(e) {
    const newHref = `/pages/shopPage.html?search=${searchInput.value}`;

    if (e.type === 'click') {
      location.href = newHref;
    } else if (e.key === 'Enter') {
      location.href = newHref;
    }
  }

  searchInput.addEventListener('keydown', handleHref);
  searchIcon.addEventListener('click', handleHref);
}

function handleRegisterButton() {
  const user = handleUserToken();
  const registerBtn = $$.querySelector('.register-btn');

  if (user) {
    registerBtn.classList.remove('modal-btn');
    registerBtn.querySelector('a').textContent = user.username;
    registerBtn.addEventListener('click', () => {
      location.href = `/pages/accountPage.html?userId=${user.userId}`;
    });
  }
}

window.addEventListener('load', () => {
  positionNavbar();
  handleNavbarInput();
  handleRegisterButton();
  handleUserCartNavbar();
  handleUserFavouritesLength();
});
