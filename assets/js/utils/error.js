export function showError(error, container) {
  const containerElement = document.querySelector(container);
  
  const errorElement = document.createElement('div');
  const errorPara = document.createElement('p');

  errorElement.classList.add('error')
  errorPara.classList.add('error__text')

  containerElement.innerHTML = '';
  errorPara.textContent = error;
  
  errorElement.append(errorPara)
  containerElement.append(errorElement)
}

export function hideError(container) {
  const containerElement = document.querySelector(container);
  const errorElement = containerElement.querySelector('.error');

  if(errorElement) {
    errorElement.remove();
  }
}
