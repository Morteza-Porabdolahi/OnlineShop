export function showSpinner(container) {
  const spinner = document.createElement('div');
  const spinnerIcon = document.createElement('i');

  spinner.classList.add('spinner');
  spinnerIcon.classList.add('ri-loader-4-fill', 'spinner__icon');

  spinner.appendChild(spinnerIcon);

  if (container instanceof HTMLElement) {
    container.classList.add(`spinner-${container.id}`);
    container.appendChild(spinner);
  } else {
    const containerElement = document.querySelector(container);

    containerElement.classList.add(`spinner-${containerElement.id}`);
    containerElement.appendChild(spinner);
  }
}

export function hideSpinner(container) {
  if (container instanceof HTMLElement) {
    if (document.querySelector(`.spinner-${container.id}`)) {
      container.querySelector(`.spinner-${container.id}`)?.remove();
    }
  } else {
    const containerElement = document.querySelector(container);

    if (document.querySelector(`.spinner-${containerElement.id}`)) {
      containerElement
        .querySelector(`.spinner-${containerElement.id}`)
        ?.remove();
    }
  }
}
