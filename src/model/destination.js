import Observable from './observable';

export default class Destination extends Observable {
  constructor() {
    super();
    this._destinations = null;
  }

  set(destinations) {
    this._destinations = destinations;
  }

  get() {
    return this._destinations;
  }
}
