export default class Observable {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  notifyObservers(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
