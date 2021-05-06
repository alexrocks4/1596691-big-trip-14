import Observable from './observable.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._tripPoints = [];
  }

  setTripPoints(tripPoints) {
    this._tripPoints = tripPoints;
  }

  getTripPoints() {
    return this._tripPoints;
  }

}
