export default class Observable {
  constructor() {
    // Observers is the object with properties names as obesrvers type name
    // and value as the Set of callbacks
    this._observers = {};
  }

  addObserver(type, callback) {
    if(this._observers[type]) {
      this._observers[type].add(callback);
    }
  }

  removeObserver(type, callback) {
    if(this._observers[type]) {
      this._observers[type].delete(callback);
    }
  }

  _notifyObservers(type, payload) {
    if(this._observers[type]) {
      this._observers[type].forEach((observer) => observer(payload));
    }
  }
}
