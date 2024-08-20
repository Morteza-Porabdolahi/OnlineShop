export function showSpinner(container) {
  if (document.querySelector('.spinner')) {
    return;
  }

  const spinner = document.createElement('div');
  const spinnerIcon = document.createElement('i');

  spinner.classList.add('spinner');
  spinnerIcon.classList.add('ri-loader-4-fill', 'spinner__icon');

  spinner.appendChild(spinnerIcon);

  if (container instanceof HTMLElement) {
    container.appendChild(spinner);
  } else {
    const containerElement = document.querySelector(container);
    containerElement.appendChild(spinner);
  }
}

export function hideSpinner(container) {
  if (!document.querySelector('.spinner')) {
    return;
  }

  if (container instanceof HTMLElement) {
    container.querySelector('.spinner').remove();
  } else {
    const containerElement = document.querySelector(container);
    containerElement.querySelector('.spinner').remove();
  }
}
