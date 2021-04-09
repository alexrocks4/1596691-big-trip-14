import { createElement } from '../util.js';

export const createTripEventsListItemTemplate = () => {
  return '<li class="trip-events__item"></li>';
};

export default class TripEventsListItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsListItemTemplate();
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
