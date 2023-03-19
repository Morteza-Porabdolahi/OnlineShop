let $ = document;
let headerCategorySelector = $.querySelector('.search-input__category-selector');
let headerCategoryList = $.querySelector('.category-selector__list');

function showHideCategoryList() {
    let checkCategoryListState = headerCategoryList.classList.contains('hidden');

    if (checkCategoryListState) {
        headerCategoryList.classList.replace('hidden', 'show-block');
    } else {
        headerCategoryList.classList.replace('show-block', 'hidden');
    }
}

headerCategorySelector.addEventListener('click', showHideCategoryList);