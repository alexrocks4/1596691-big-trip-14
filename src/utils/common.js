import { MINUTES_IN_A_DAY, MINUTES_IN_A_HOUR } from './const.js';

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
  let leftMinutes = 0;

  if (daysNumber) {
    const leftHours = Math.floor((durationInMinutes - daysNumber * MINUTES_IN_A_DAY) / MINUTES_IN_A_HOUR);
    leftMinutes = durationInMinutes - daysNumber * MINUTES_IN_A_DAY - leftHours * MINUTES_IN_A_HOUR;
    formattedDuration = `${padNumberWithZeros(daysNumber)}D ${padNumberWithZeros(leftHours)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else if (hoursNumber) {
    leftMinutes = durationInMinutes - hoursNumber * MINUTES_IN_A_HOUR;
    formattedDuration = `${padNumberWithZeros(hoursNumber)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else {
    formattedDuration = `${padNumberWithZeros(durationInMinutes)}M`;
  }

  return formattedDuration;
};

const isOnline = () => {
  return window.navigator.onLine;
};

export {
  isEscKeyPressed,
  setToInteger,
  formatDuration,
  isOnline
};
