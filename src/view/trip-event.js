import dayjs from 'dayjs';
import { createElement } from '../util.js';

const MINUTES_IN_A_DAY = 1440;
const MINUTES_IN_A_HOUR = 60;

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

  const padNumberWithZeros = (number, padCount = 2) => {
    return Number(number).toString(10).padStart(padCount, '0');
  };

  const formatTripEventDuration = (durationInMinutes) => {
    let formattedDuration = '';
    const daysNumber = Math.floor(durationInMinutes / MINUTES_IN_A_DAY);
    const hoursNumber = Math.floor(durationInMinutes / MINUTES_IN_A_HOUR);
    let leftMinutes;

    if (daysNumber) {
      const leftHours = Math.floor((durationInMinutes - daysNumber * MINUTES_IN_A_DAY) / MINUTES_IN_A_HOUR);
      leftMinutes = durationInMinutes - daysNumber * MINUTES_IN_A_DAY - leftHours * MINUTES_IN_A_HOUR;
      formattedDuration = `${padNumberWithZeros(daysNumber)}D ${padNumberWithZeros(leftHours)}H ${padNumberWithZeros(leftMinutes)}M`;
    } else if (hoursNumber) {
      leftMinutes = durationInMinutes - hoursNumber * MINUTES_IN_A_HOUR;
      formattedDuration = `${padNumberWithZeros(hoursNumber)}H ${padNumberWithZeros(leftMinutes)}M`;
    } else {
      formattedDuration = `${padNumberWithZeros(leftMinutes)}M`;
    }

    return formattedDuration;
  };

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
  const formattedTripEventDuration = formatTripEventDuration(endDate.diff(startDate, 'minute'));
  const offersListItemsTemplate = offers
    ? offers.reduce((template, offer) => template + createEventOfferListItemTemplate(offer), '')
    : '';

  return `<div class="event">
      <time class="event__date" datetime="${startDate.format('YYYY-MM-DD')}">${startDate.format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDate.format('YYYY-MM-DDTHH:mm')}">${startDate.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate.format('YYYY-MM-DDTHH:mm')}">${endDate.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${formattedTripEventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
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

export default class TripEvent {
  constructor(tripPoint) {
    this._element = null;
    this._tripPoint = tripPoint;
  }

  getTemplate() {
    return createTripEventTemplate(this._tripPoint);
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
