import { MINUTES_IN_A_DAY, MINUTES_IN_A_HOUR } from './const.js';

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

const isEscKeyPressed = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

const setToInteger = (value) => {
  value = parseInt(value);

  return Number.isNaN(value) ? 0 : value;
};

const padNumberWithZeros = (number, padCount = 2) => {
  return Number(number).toString(10).padStart(padCount, '0');
};

const formatDuration = (durationInMinutes) => {
  let formattedDuration = '';
  const daysNumber = Math.floor(durationInMinutes / MINUTES_IN_A_DAY);
  const hoursNumber = Math.floor(durationInMinutes / MINUTES_IN_A_HOUR);
  let leftMinutes;

  if (daysNumber) {
    const leftHours = Math.floor((durationInMinutes - daysNumber * MINUTES_IN_A_DAY) / MINUTES_IN_A_HOUR);
    leftMinutes = durationInMinutes - daysNumber * MINUTES_IN_A_DAY - leftHours * MINUTES_IN_A_HOUR;
    formattedDuration = `${padNumberWithZeros(daysNumber)}D ${padNumberWithZeros(leftHours)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else if (hoursNumber) {
    leftMinutes = durationInMinutes - hoursNumber * MINUTES_IN_A_HOUR;
    formattedDuration = `${padNumberWithZeros(hoursNumber)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else {
    formattedDuration = `${padNumberWithZeros(leftMinutes)}M`;
  }

  return formattedDuration;
};

export {
  getRandomIntegerInclusive,
  getRandomArrayElement,
  isEscKeyPressed,
  setToInteger,
  formatDuration
};
