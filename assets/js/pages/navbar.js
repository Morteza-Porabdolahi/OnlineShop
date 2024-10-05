import { $$, getUserToken, handleUserToken } from '../utils/utils';
import {
  handleUserCartNavbar,
  handleUserFavouritesLength,
  handleUserLogin,
} from './general';

const navbarLoginForm = $$.querySelector('.modal-body__form');

navbarLoginForm.addEventListener('submit', handleUserLogin);

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
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set('q', searchInput.value);

    if (e.type === 'click' || e.key === 'Enter') {
      location.href = `${location.origin}/pages/shopPage.html?${urlSearchParams.toString()}`;
    }
  }

  searchInput.addEventListener('keydown', handleHref);
  searchIcon.addEventListener('click', handleHref);
}

function handleRegisterButton() {
  const user = handleUserToken();
  const registerBtn = $$.querySelector('.register-btn');

  if (user) {
    registerBtn.setAttribute('disabled', true);
    registerBtn.querySelector('a').textContent = user.username;
    registerBtn.style.opacity = '.5';
  } else {
    $$.querySelector('.additional-icons__heart-icon').classList.add('disabled');
    $$.querySelector('.additional-icons__heart-icon').setAttribute(
      'aria-disabled',
      'true'
    );
  }
}

function handleLogoutBtn() {
  const logoutBtn = $$.getElementById('logout-btn')

  logoutBtn.style.display = 'block';
  
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('access_token')
    location.href = '/pages/accountPage.html'
  })
}

window.addEventListener('load', () => {
  positionNavbar();
  handleNavbarInput();
  handleRegisterButton();

  if (getUserToken()) {
    handleUserCartNavbar();
    handleUserFavouritesLength();
    handleLogoutBtn();
  }
});
