export function showSpinner(container) {
  const spinner = document.createElement('div');
  const spinnerIcon = document.createElement('i');

  spinner.classList.add('spinner');
  spinnerIcon.classList.add('ri-loader-4-fill', 'spinner__icon');

  spinner.appendChild(spinnerIcon);

  if (container instanceof HTMLElement) {
    spinner.classList.add(`spinner-${container.id}`);
    container.appendChild(spinner);
  } else {
    const containerElement = document.querySelector(container);

    spinner.classList.add(`spinner-${containerElement.id}`);
    containerElement.appendChild(spinner);
  }
}

export function hideSpinner(container) {
  if (container instanceof HTMLElement) {
    const spinner = container.querySelector(`.spinner-${container.id}`);

    if (spinner) {
      spinner.remove();
    }
  } else {
    const containerElement = document.querySelector(container);

    const spinner = containerElement.querySelector(
      `.spinner-${containerElement.id}`
    );

    if (spinner) {
      spinner.remove();
    }
  }
}
