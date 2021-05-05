import Observable from './observable.js';
import { sortDateUp } from '../utils/trip-point.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._observers.onUpdate = new Set();
    this._observers.onSort = new Set();
    this._observers.onFilter = new Set();
    this._sourceTripPoints = [];
    this._tripPoints = [];
    this._currentSortAlgorithm = null;
    this._currentFilterAlgorithm = null;
  }

  init(tripPoints) {
    this.setPoints(tripPoints);
    this.sort({ callback: this._getDefaultSortAlgorithm()});
  }

  getPoints() {
    return this._tripPoints;
  }

  setPoints(tripPoints) {
    this._sourceTripPoints = tripPoints.slice();
    this._tripPoints = tripPoints.slice();
  }

  updatePoint(data) {
    const index = this._sourceTripPoints.findIndex((point) => data.id === point.id);

    if (index === -1) {
      new Error('Can\'t update unexisted tripPoint');
      return;
    }

    this._sourceTripPoints = [
      ...this._sourceTripPoints.slice(0, index),
      { ...this._sourceTripPoints[index], ...data},
      ...this._sourceTripPoints.slice(index + 1),
    ];

    this._tripPoints = [...this._sourceTripPoints.slice()];

    this.sort({ notify: false });
    this.filter({ notify: false });
    this._notifyObservers('onUpdate');
  }

  sort({ callback, notify = true }) {
    if (callback) {
      this._currentSortAlgorithm = callback;
    }

    this._tripPoints = this.getPoints().slice().sort(this._currentSortAlgorithm);

    if (notify) {
      this._notifyObservers('onSort');
    }
  }

  filter({ callback, notify = true }) {
    if (callback) {
      this._currentFilterAlgorithm = callback;
    }

    this._tripPoints = this._sourceTripPoints.filter(this._currentFilterAlgorithm);
    this.sort({ callback: this._getDefaultSortAlgorithm(), notify: false});

    if (notify) {
      this._notifyObservers('onFilter');
    }
  }

  resetFilter() {
    this._currentFilterAlgorithm = null;
    this._tripPoints = [...this._sourceTripPoints.slice()];
    this.sort({ callback: this._getDefaultSortAlgorithm(), notify: false});
    this._notifyObservers('onFilter');
  }

  getSortAlgorithm() {
    return this._currentSortAlgorithm;
  }

  getFilterAlgorithm() {
    return this._currentFilterAlgorithm;
  }

  _getDefaultSortAlgorithm() {
    return sortDateUp;
  }
}
