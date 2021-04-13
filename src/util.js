import dayjs from 'dayjs';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
const getRandomIntegerInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

const getRandomArrayElement = (elements) => {
  const randomArrayIndex = getRandomIntegerInclusive(0, elements.length - 1);

  return elements[randomArrayIndex];
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const sortTripPointsByStartDate = (tripPoints) => {
  return tripPoints
    .slice()
    .sort((pointA, pointB) => dayjs(pointA.startDate).diff(pointB.startDate));
};

export {
  getRandomIntegerInclusive,
  getRandomArrayElement,
  createElement,
  sortTripPointsByStartDate
};
