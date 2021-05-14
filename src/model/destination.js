import Observable from './observable';

export default class Destination extends Observable {
  constructor() {
    super();
    this._destinations = null;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }
}
