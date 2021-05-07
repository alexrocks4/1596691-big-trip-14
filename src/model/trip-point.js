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

  updateTripPoint(updateType, update) {
    const index = this._tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      update,
      ...this._tripPoints.slice(index + 1),
    ];

    this.notifyObservers(updateType, update);
  }

  addTripPoint(updateType, update) {
    this._tripPoints = [
      update,
      ...this._tripPoints,
    ];

    this.notifyObservers(updateType, update);
  }

  deleteTripPoint(updateType, update) {
    const index = this._tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      ...this._tripPoints.slice(index + 1),
    ];

    this.notifyObservers(updateType);
  }

}
