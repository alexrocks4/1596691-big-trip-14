import Observable from './observable.js';
import { sortDateUp } from '../utils/trip-point.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._observers.onSort = new Set();
    this._observers.onFilter = new Set();
    this._sourceTripPoints = [];
    this._tripPoints = [];
    this._currentSortAlgorithm = null;
  }

  getPoints() {
    return this._tripPoints;
  }

  setPoints(tripPoints) {
    this._sourceTripPoints = tripPoints.slice();
    this._tripPoints = tripPoints.slice();
  }

  init(tripPoints) {
    this.setPoints(tripPoints);
    this.sort(sortDateUp, false);
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

  getSortAlgorithm() {
    return this._currentSortAlgorithm;
  }

  sort(callback) {
    this._currentSortAlgorithm = callback;
    this._tripPoints = this.getPoints().slice().sort(this._currentSortAlgorithm);
    this._notifyObservers('onSort');
  }
}
