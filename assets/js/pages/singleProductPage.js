import {$$, formatPrice} from '../utils/utils';
import {fetchProduct, fetchProductComments} from '../api/api';
import {toast} from '../utils/toast';
import {handleUserCartNavbar, insertComment, insertItemInUserCart} from './general';

const tabButtons = $$.querySelectorAll('.tab-names-list__item');
const tabs = $$.querySelectorAll('.tab');
const starElems = $$.querySelectorAll('.star');

const commentForm = $$.querySelector('.comment-form');

tabButtons.forEach((tabButton) =>
  tabButton.addEventListener('click', handleSwitchTab),
);
starElems.forEach((starElem) =>
  starElem.addEventListener('click', handleScoreStars),
);

function handleSwitchTab(e) {
  const clickedTab = e.target.closest('li');
  const clickedTabElem = $$.querySelector(`#${clickedTab.dataset.tab}`);

  tabs.forEach((tab) => tab.classList.remove('tab--active'));
  tabButtons.forEach((tabBtn) =>
    tabBtn.classList.remove('tab-names-list__item--active'),
  );

  clickedTab.classList.add('tab-names-list__item--active');
  clickedTabElem.classList.add('tab--active');
}

function handleScoreStars(e) {
  const star = e.target;
  const starChildNumber = [...starElems].indexOf(star);

  starElems.forEach((starElem) => starElem.classList.remove('star--active'));
  for (let i = starChildNumber; i < starElems.length; i++) {
    starElems[i].classList.add('star--active');
  }
}

async function getSingleProduct() {
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');

  const data = await fetchProduct(productId);

  if (data.error) {
    toast.error(data.error);
  } else {
    insertProductDatasIntoPage(data);
  }
}

window.addEventListener('load', getSingleProduct);

function insertProductDatasIntoPage(product = {}) {
  document.title = `متاتم || ${product.title}`
  $$.querySelector('.intro__breadcrumb > .item--active').textContent =
    product.title;
  $$.querySelector('.intro__title').textContent = product.title;

  $$.querySelectorAll('.product-additional-desc__price').forEach(
      (priceElem) => {
        priceElem.textContent = formatPrice(product.price);
      },
  );

  $$.querySelector('.list-item__text > a').textContent = product?.category;

  $$.querySelector('.product-img-container__img').src = product.imageUrl;
  $$.querySelector('.product-img-container__img').alt = product.title;

  $$.querySelectorAll('.product-additional-desc__add-to-basket-btn').forEach(
      (addToBasket) => {
        addToBasket.addEventListener('click', () =>
          insertItemInUserCart(product._id, handleUserCartNavbar),
        );
      },
  );

  getComments(product._id);
  handleCommentForm(product._id);
}

function handleCommentForm(mediaId){
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const comment = {
      text: commentForm.text.value,
      writerName: commentForm.fullName.value,
      mediaId,
      toAnswer: commentForm.dataset.toAnswer,
    }

    insertComment(comment);
  });
}

async function getComments(productId){
  const data = await fetchProductComments(productId);

  if(data.error){
    toast.error(data.error);
  }else{
    createElemFromComments(data);
  }
}

function* createIteratorFromComments(comments = []){
  for(let comment of comments){
    yield comment;
  }
}

function createElemFromComments(comments = []){
  let containerFragment = $$.createDocumentFragment();
  let commentElem = $$.getElementById('commentTemp').content.children[0];
  const iterator = createIteratorFromComments(comments);

  function createCommentElem(iterator, container){
    const step = iterator.next();

    if(step.done){
      return;
    }

    const newCommentElem = insertDatasIntoCommentElem(commentElem.cloneNode(true),step.value);
    container.append(newCommentElem);

    const replies = step.value.comments || [];

    if(replies.length > 0){
      createCommentElem(createIteratorFromComments(replies), newCommentElem);
    }

    createCommentElem(iterator,container);
  }

  createCommentElem(iterator,containerFragment);
  appendCommentsIntoDom(containerFragment);
}

function insertDatasIntoCommentElem(elem, comment = {}){
  elem.querySelector('.desc__author-name').textContent = comment.writerName;
  elem.querySelector('.desc__comment-date').textContent = new Date(comment.createdDate).toLocaleString('fa-IR',{ timeZone : 'Asia/Tehran',dateStyle: 'full', timeStyle: 'medium' });
  elem.querySelector('.comment-details__comment-text > p').textContent = comment.text;
  elem.querySelector('.comment-identity__reply-btn').addEventListener('click', () => handleToAnswer(comment));

  return elem;
}

function handleToAnswer(comment = {}){
  function cancelToAnswer(){
    $$.getElementById('toAnswer').style.display = 'none';
    commentForm.removeAttribute('data-to-answer');
  }

  $$.getElementById('toAnswerName').textContent = comment.writerName;
  $$.getElementById('toAnswer').style.display = 'block';

  commentForm.setAttribute('data-to-answer', comment._id);
  $$.getElementById('cancelToAnswer').addEventListener('click', cancelToAnswer);
}

function appendCommentsIntoDom(fragment) {
  const commentsContainer = $$.querySelector('.comments');

  commentsContainer.append(fragment);
}