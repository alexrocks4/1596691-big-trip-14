export default class Observable {
  constructor() {
    this._observers = new Set();
  }

  addObserver(callback) {
    this._observers.add(callback);
  }

  removeObserver(callback) {
    this._observers.delete(callback);
  }

  _notifyObservers() {
    this._observers.forEach((observer) => observer());
  }
}
