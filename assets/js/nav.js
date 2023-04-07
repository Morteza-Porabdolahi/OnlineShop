const navContainerElem = $.querySelector('.header__nav-container');

function handleNavBarPosition() {
    navContainerElem.classList[window.scrollY > navContainerElem.offsetTop ? 'add' : 'remove']('header__nav-container--sticked')
}

window.addEventListener('scroll', handleNavBarPosition);
