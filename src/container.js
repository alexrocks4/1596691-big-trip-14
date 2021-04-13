export default class Container {
  constructor(container) {
    this._container = container;
  }

  appendElement(element) {
    this._container.append(element);
  }

  prependElement(element) {
    this._container.prepend(element);
  }
}
