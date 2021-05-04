import dayjs from 'dayjs';
import { setToInteger } from './common.js';

const sortDateUp = (pointA, pointB) => {
  return dayjs(pointA.startDate).diff(pointB.startDate);
};

const sortPriceDown = (pointA, pointB) => {
  return setToInteger(pointB.price) - setToInteger(pointA.price);
};

const sortTimeDown = (pointA, pointB) => {
  let timeA, timeB = -1;

  if (pointA.startDate && pointA.endDate) {
    timeA = dayjs(pointA.endDate).diff(pointA.startDate);
  }

  if (pointB.startDate && pointB.endDate) {
    timeB = dayjs(pointB.endDate).diff(pointB.startDate);
  }

  return timeB - timeA;
};

export {
  sortDateUp,
  sortPriceDown,
  sortTimeDown
};
