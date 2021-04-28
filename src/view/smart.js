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

    this.restore();
  }

  restore() {
    this.restoreHandlers();
    this.restoreElements();
  }

  restoreHandlers() {
    new Error('Abstract method called!');
  }

  restoreElements() {
    new Error('Abstract method called!');
  }

  updateState(newState, isRerendering = true) {
    if (!newState) {
      return;
    }

    const { data, ...state } = newState;

    this._state = { ...this._state, ...state };
    this._state.data = { ...this._state.data, ...data};

    if (isRerendering) {
      this.rerender();
    }
  }

}
