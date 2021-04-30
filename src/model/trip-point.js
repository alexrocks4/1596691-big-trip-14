import Observable from './observable.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._tripPoints = [];
  }

  get() {
    return this._tripPoints;
  }

  set(tripPoints) {
    this._tripPoints = tripPoints.slice();
  }

  update(data) {
    const index = this._tripPoints.findIndex((point) => data.id === point.id);

    if (index === -1) {
      new Error('Can\'t update unexisted tripPoint');
      return;
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      { ...this._tripPoints[index], ...data},
      ...this.tripPoints.slice(index + 1),
    ];
  }
}
