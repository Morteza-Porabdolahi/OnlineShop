import {$$, getUserToken, handleUserToken} from '../utils/utils';
import {handleUserCartNavbar, handleUserFavouritesLength, handleUserLogin} from './general';

const navbarLoginForm = $$.querySelector('.modal-body__form');

navbarLoginForm.addEventListener('submit', handleUserLogin)

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
    registerBtn.style.opacity = '.5';
  }else{
    $$.querySelector('.additional-icons__heart-icon').classList.add('disabled');
    $$.querySelector('.additional-icons__heart-icon').setAttribute('aria-disabled','true')
  }
}

window.addEventListener('load', () => {
  positionNavbar();
  handleNavbarInput();
  handleRegisterButton();

  if(getUserToken()){
    handleUserCartNavbar();
    handleUserFavouritesLength();
  }
});
