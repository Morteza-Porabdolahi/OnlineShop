const minRangeInput = $.querySelector('.min-range');
const maxRangeInput = $.querySelector('.max-range');
const rangeStartPrice = $.querySelector('.start__price');
const rangeEndPrice = $.querySelector('.end__price');
const rangeInputsProgress = $.querySelector('.progress');

let maxPrice = 599000;

minRangeInput.addEventListener('input', handleMinRangeInput);
maxRangeInput.addEventListener('input', handleMaxRangeInput);

function handleMaxRangeInput() {
    maxRangeInput.min = minRangeInput.value;
    maxRangeInput.style.width = `${(((maxPrice - minRangeInput.value) / maxPrice) * 100) + 5}%`;

    rangeEndPrice.textContent = maxRangeInput.value;

    handleProgressWidth();

    minRangeInput.classList.remove('range-input--active');
}

function handleMinRangeInput() {
    minRangeInput.max = maxRangeInput.value;
    minRangeInput.style.width = `${(maxRangeInput.value / maxPrice) * 100}%`;

    rangeStartPrice.textContent = minRangeInput.value;

    handleProgressWidth();

    minRangeInput.classList.add('range-input--active');
}

function handleProgressWidth() {
    rangeInputsProgress.style.right = `${(minRangeInput.value / maxPrice) * 100}%`
    rangeInputsProgress.style.left = `${((maxPrice - maxRangeInput.value) / maxPrice) * 100}%`

}