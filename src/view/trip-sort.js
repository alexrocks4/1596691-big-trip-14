import AbstractView from './abstract.js';

const createTripSortTemplate = () => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`;
};

export default class TripSort extends AbstractView {
  constructor() {
    super();
    this._sortDateUpClickHandler = this._sortDateUpClickHandler.bind(this);
    this._sortPriceDownClickHandler = this._sortPriceDownClickHandler.bind(this);
    this._sortTimeDownClickHandler = this._sortTimeDownClickHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  setSortDateUpClickHandler(callback) {
    this._callback.sortDateUpClick = callback;
    this.getElement()
      .querySelector('label[for="sort-day"]')
      .addEventListener('click', this._sortDateUpClickHandler);
  }

  setSortPriceDownClickHandler(callback) {
    this._callback.sortPriceDownClick = callback;
    this.getElement()
      .querySelector('label[for="sort-price"]')
      .addEventListener('click', this._sortPriceDownClickHandler);
  }

  setSortTimeDownClickHandler(callback) {
    this._callback.sortTimeDownClick = callback;
    this.getElement()
      .querySelector('label[for="sort-time"]')
      .addEventListener('click', this._sortTimeDownClickHandler);
  }

  _sortDateUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.sortDateUpClick();
  }

  _sortPriceDownClickHandler(evt) {
    evt.preventDefault();
    this._callback.sortPriceDownClick();
  }

  _sortTimeDownClickHandler(evt) {
    evt.preventDefault();
    this._callback.sortTimeDownClick();
  }
}
