import { createElement } from '../util.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Abstract class ${new.target.name} can not be instantiated`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error('Abstract method not implented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
