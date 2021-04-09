import dayjs from 'dayjs';
import { createElement } from '../util.js';

const createTripEventEditTemplate = ({ TRIP_TYPES, tripPoint = {}, destinations, allOffers}) => {
  const { type = TRIP_TYPES[0],
    destination = destinations[0],
    offers: tripPointOffers,
    startDate = dayjs().toDate(),
    endDate = dayjs(startDate).add(1, 'hour'),
    price = 0,
  } = tripPoint;

  const generateTripTypeItemTemplate = (type, isChecked = false) => {
    return `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`;
  };

  const generateTripTypeListTemplate = (TRIP_TYPES) => {
    return TRIP_TYPES.reduce((template, tripType) => template + generateTripTypeItemTemplate(tripType, tripType === type), '');
  };

  const generateDestinationsDataListTemplate = () => {
    return `<datalist id="destination-list-1">
        ${destinations.reduce((template, destination) => template + `<option value="${destination.name}"></option>`, '')}
      </datalist>`;
  };

  const generateOffersBlocksTemplate = () => {
    return allOffers[type].reduce((template, offer) => {
      const { id, name, title, price } = offer;
      const isSelected = tripPointOffers ? tripPointOffers.some((tripPointOffer) => tripPointOffer.id === id) : false;

      return template + `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${isSelected ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${name}-1">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
    }, '');
  };

  const generateOffersSectionTemplate = () => {
    return allOffers[type]
      ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${generateOffersBlocksTemplate()}
            </div>
          </section>`
      : '';
  };

  const isDestinationSectionVisible = () => {
    return destination.description || destination.pictures;
  };

  const generateDestinationDescriptionTemplate = () => {
    return `<p class="event__destination-description">${destination.description}</p>`;
  };

  const generateDestinationPhotoImgTemplate = () => {
    return destination.pictures.reduce((template, picture) => {
      return template + `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    }, '');
  };

  const generateDestinationPhotosTemplate = () => {
    return `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${generateDestinationPhotoImgTemplate()}
        </div>
      </div>`;
  };

  const generateDestinationSectionTemplate = () => {
    return `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${destination.description ? generateDestinationDescriptionTemplate() : ''}
        ${destination.pictures ? generateDestinationPhotosTemplate() : ''}
      </section>`;
  };

  return `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${generateTripTypeListTemplate(TRIP_TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          ${generateDestinationsDataListTemplate()}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${generateOffersSectionTemplate()}
        ${isDestinationSectionVisible() ? generateDestinationSectionTemplate() : ''}
      </section>
    </form>`;
};


export default class TripEventEdit {
  constructor(option) {
    this._element = null;
    this._option = option;
  }

  getTemplate() {
    return createTripEventEditTemplate(this._option);
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
