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

const filterFuture = (point) => {
  const currentDate = Date.now();
  const isInFuture = point.startDate.getTime() >= currentDate;
  const isContinuing = point.startDate.getTime() < currentDate && point.endDate.getTime() > currentDate;

  return isInFuture || isContinuing;
};

const filterPast = (point) => {
  const currentDate = Date.now();

  return point.endDate.getTime() < currentDate;
};

export {
  sortDateUp,
  sortPriceDown,
  sortTimeDown,
  filterFuture,
  filterPast
};
