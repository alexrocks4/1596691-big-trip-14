import dayjs from 'dayjs';
import { setToInteger } from './common.js';
import { SortType } from './const.js';

const sortStartDateUp = (pointA, pointB) => {
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

const sortTripPoints = (sortType, tripPoints) => {
  switch (sortType) {
    case SortType.PRICE_DOWN:
      return tripPoints.slice().sort(sortPriceDown);
    case SortType.TIME_DOWN:
      return tripPoints.slice().sort(sortTimeDown);
    case SortType.DEFAULT:
      return tripPoints.slice().sort(sortStartDateUp);
  }
};

const isDatesChanged = (pointA, pointB) => {
  return pointA.startDate.getTime() !== pointB.startDate.getTime() || pointA.endDate.getTime() !== pointB.endDate.getTime();
};

export {
  sortStartDateUp,
  sortPriceDown,
  sortTimeDown,
  sortTripPoints,
  isDatesChanged
};
