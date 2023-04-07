const tabButtons = $.querySelectorAll('.tab-names-list__item');
const tabs = $.querySelectorAll('.tab');
const starElems = $.querySelectorAll('.star');
const products = $.querySelectorAll('.products__product');

tabButtons.forEach(tabButton => {
    tabButton.addEventListener('click', handleSwitchTab);
});

function handleSwitchTab(e) {
    const clickedTab = e.target.closest('li');
    const clickedTabElem = $.querySelector(`#${clickedTab.dataset.tab}`);

    tabs.forEach(tab => tab.classList.remove('tab--active'));
    tabButtons.forEach(tabBtn => tabBtn.classList.remove('tab-names-list__item--active'));

    clickedTab.classList.add('tab-names-list__item--active');
    clickedTabElem.classList.add('tab--active');
}

starElems.forEach(starElem => {
    starElem.addEventListener('click', handleScoreStars);
});

function handleScoreStars(e) {
    const star = e.target;
    const starChildNumber = [...starElems].indexOf(star);

    starElems.forEach(starElem => starElem.classList.remove('star--active'));
    for (let i = starChildNumber; i < starElems.length; i++) {
        starElems[i].classList.add('star--active');
    }


}