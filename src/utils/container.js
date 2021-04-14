import AbstractView from '../view/abstract.js';

export default class Container {
  constructor(container) {
    this._container = this._convertToElement(container);
  }

  _convertToElement(instance) {
    return instance instanceof AbstractView
      ? instance.getElement()
      : instance;
  }

  append(newChild) {
    this._container.append(this._convertToElement(newChild));
  }

  prepend(newChild) {
    this._container.prepend(this._convertToElement(newChild));
  }

  replace(newChild, oldChild) {
    const newElement = this._convertToElement(newChild);
    const oldElement = this._convertToElement(oldChild);
    this._container.replaceChild(newElement, oldElement);
  }
}
