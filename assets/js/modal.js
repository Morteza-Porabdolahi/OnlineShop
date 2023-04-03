const showModalBtns = $.querySelectorAll('.modal-btn');

let modalContainer, modal, isModalLeft, closeModalBtn;

showModalBtns.forEach(showModalBtn => showModalBtn.addEventListener('click', findClickedModal));

function findClickedModal(e) {
    const modalId = e.target.closest('.modal-btn').dataset.modal;

    showModal(modalId);
}

function showModal(modalId) {
    modalContainer = $.querySelector(`#${modalId}`);
    modal = modalContainer.firstElementChild;
    isModalLeft = modal.classList.contains('modal-left');
    closeModalBtn = modal.querySelector('.close-btn');

    modalContainer.style.display = 'block';
    modal.style[isModalLeft ? 'left' : 'right'] = '0';
    closeModalBtn.addEventListener('click', hideModal);
}

function hideModal() {
    modalContainer.style.display = 'none';
    modal.style[isModalLeft ? 'left' : 'right'] = '-70rem';
    closeModalBtn.removeEventListener('click', hideModal);
}
