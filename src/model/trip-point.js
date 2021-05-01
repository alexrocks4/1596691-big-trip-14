import Observable from './observable.js';
import dayjs from 'dayjs';
import { setToInteger } from '../utils/common.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._tripPoints = [];
    this.sortDateUp = this.sortDateUp.bind(this);
    this.sortPriceDown = this.sortPriceDown.bind(this);
    this.sortTimeDown = this.sortTimeDown.bind(this);
  }

  getPoints() {
    return this._tripPoints;
  }

  setPoints(tripPoints) {
    this._tripPoints = tripPoints.slice();
  }

  updatePoint(data) {
    const index = this._tripPoints.findIndex((point) => data.id === point.id);

    if (index === -1) {
      new Error('Can\'t update unexisted tripPoint');
      return;
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      { ...this._tripPoints[index], ...data},
      ...this._tripPoints.slice(index + 1),
    ];
  }

  sortDateUp() {
    return this._tripPoints.slice().sort((pointA, pointB) => {
      return dayjs(pointA.startDate).diff(pointB.startDate);
    });
  }

  sortPriceDown() {
    return this._tripPoints.slice().sort((pointA, pointB) => {
      return setToInteger(pointB.price) - setToInteger(pointA.price);
    });
  }

  sortTimeDown() {
    return this._tripPoints.slice().sort((pointA, pointB) => {
      let timeA, timeB = -1;

      if (pointA.startDate && pointA.endDate) {
        timeA = dayjs(pointA.endDate).diff(pointA.startDate);
      }

      if (pointB.startDate && pointB.endDate) {
        timeB = dayjs(pointB.endDate).diff(pointB.startDate);
      }

      return timeB - timeA;
    });
  }
}
