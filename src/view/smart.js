import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._state = {};
  }

  rerender() {
    const prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();

    prevElement.parentNode.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    new Error('Abstract method called!');
  }

  updateState(newState, isRerendering = true) {
    if (newState) {
      return;
    }

    this._state = { ...this._state, ...newState };

    if (isRerendering) {
      this.rerender();
    }
  }

}
