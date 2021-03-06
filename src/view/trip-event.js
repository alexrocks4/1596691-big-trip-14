import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import he from 'he';
import { formatDuration } from '../utils/common.js';

const createTripEventTemplate = (tripPoint) => {
  const {
    type,
    destination,
    offers,
    price,
    isFavorite,
  } = tripPoint;

  let {
    startDate,
    endDate,
  } = tripPoint;

  const createEventOfferListItemTemplate = (offer) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
  };

  const setFavoriteClass = () => isFavorite ? 'event__favorite-btn--active' : '';

  startDate = dayjs(startDate);
  endDate = dayjs(endDate);
  const formattedTripEventDuration = formatDuration(endDate.diff(startDate, 'minute'));
  const offersListItemsTemplate = offers
    ? offers.reduce((template, offer) => template + createEventOfferListItemTemplate(offer), '')
    : '';

  return `<div class="event">
      <time class="event__date" datetime="${startDate.format('YYYY-MM-DD')}">${startDate.format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDate.format('YYYY-MM-DDTHH:mm')}">${startDate.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate.format('YYYY-MM-DDTHH:mm')}">${endDate.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${formattedTripEventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${he.encode(price.toString())}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersListItemsTemplate}
      </ul>
      <button class="event__favorite-btn ${setFavoriteClass()}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};

export default class TripEvent extends AbstractView {
  constructor(tripPoint) {
    super();
    this._tripPoint = tripPoint;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._tripPoint);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
