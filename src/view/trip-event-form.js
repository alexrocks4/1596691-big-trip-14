import SmartView from './smart.js';
import { FormMode } from '../utils/trip-event-form.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const TextColor = {
  WARNING: 'red',
};
const FormErrorMessage = {
  END_DATE: 'End date must be after start date',
};

const createFormTemplate = (state) => {
  const { isEditing, isOffersAvailable, isDestinationVisible } = state;
  const { TRIP_TYPES, tripPoint = {}, destinations, allOffers } = state.data;

  const { type = TRIP_TYPES[0],
    destination = destinations[0],
    offers: tripPointOffers,
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
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${isSelected ? 'checked' : ''} value="${id}">
          <label class="event__offer-label" for="event-offer-${name}-1">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
    }, '');
  };

  const generateOffersSectionTemplate = () => {
    return isOffersAvailable
      ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${generateOffersBlocksTemplate()}
            </div>
          </section>`
      : '';
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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEditing ? 'Delete' : 'Cancel'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${generateOffersSectionTemplate()}
        ${isDestinationVisible ? generateDestinationSectionTemplate() : ''}
      </section>
    </form>`;
};

export default class TripEventForm extends SmartView {
  constructor(option) {
    super();
    this._state = TripEventForm.parseDataToState(option);
    this._startDatePicker = null;
    this._endDatePicker = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._resetClickHandler = this._resetClickHandler.bind(this);
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatePicker();
    this._submitElement = this.getElement().querySelector('.event__save-btn');
  }

  getTemplate() {
    return createFormTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setResetClickHandler(this._callback.resetClick);
    this._setDatePicker();
  }

  restoreElements() {
    this._submitElement = this.getElement().querySelector('.event__save-btn');
  }

  reset(option) {
    this.updateState(TripEventForm.parseDataToState(option));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setResetClickHandler(callback) {
    this._callback.resetClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._resetClickHandler);
  }

  _setDatePicker() {
    const startDate = this._state.data.tripPoint.startDate;
    const endDate = this._state.data.tripPoint.endDate;

    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._startDatePicker = flatpickr(this.getElement().querySelector('#event-start-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      defaultDate: startDate,
      onChange: this._startDateChangeHandler,
      time_24hr: true,
    });

    this._endDatePicker = flatpickr(this.getElement().querySelector('#event-end-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      defaultDate: endDate,
      onChange: this._endDateChangeHandler,
      time_24hr: true,
    });
  }

  _clearSubmitError() {
    this._submitElement.setCustomValidity('');
    this._submitElement.reportValidity();
  }

  _renderEndDateError() {
    if (this._state.isEndDateValid) {
      this._clearSubmitError();
      this._endDatePicker.input.style.color = 'inherit';
    } else {
      this._submitElement.setCustomValidity(FormErrorMessage.END_DATE);
      this._endDatePicker.input.style.color = TextColor.WARNING;
    }
  }

  _getCheckedOffers() {
    const checkedOffers = [];
    const checkedCheckboxes = this.getElement().querySelectorAll('.event__offer-checkbox:checked');
    const allOffers = this._state.data.allOffers[this._state.data.tripPoint.type];

    if (allOffers) {
      checkedCheckboxes.forEach((checkbox) => {
        const offer = allOffers.find((offer) => offer.id === +checkbox.value);

        if (offer) {
          checkedOffers.push({ ...offer });
        }
      });
    }

    return checkedOffers.length ? checkedOffers : null;
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);

    if(this._state.isOffersAvailable) {
      this.getElement().querySelector('.event__section--offers').addEventListener('change', this._offersChangeHandler);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    //Notify user if endDate is before startDate
    if (!this._state.isEndDateValid) {
      this._submitElement.reportValidity();
      return;
    }

    this._clearSubmitError();
    this._callback.formSubmit(TripEventForm.parseStateToData(this._state));
  }

  _resetClickHandler(evt) {
    evt.preventDefault();
    this._callback.resetClick();
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.updateState({
      isOffersAvailable: !!this._state.data.allOffers[evt.target.value],
      data: {
        tripPoint: {
          ...this._state.data.tripPoint,
          ...{
            type: evt.target.value,
            offers: null,
          },
        },
      },
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const data = this._state.data;
    const destination = data.destinations.find((destination) => destination.name === evt.target.value);

    if (!destination) {
      new Error(`No such destination ${evt.target.value}!`);
      return;
    }

    this.updateState({
      isDestinationVisible: !!destination.description || !!destination.pictures,
      data: {
        tripPoint: {
          ...data.tripPoint,
          ...{ destination },
        },
      },
    });
  }

  _startDateChangeHandler([newStartDate]) {
    this.updateState({
      isEndDateValid: TripEventForm.isEndDateValid(newStartDate, this._state.data.tripPoint.endDate),
      data: {
        tripPoint: {
          ...this._state.data.tripPoint,
          ...{ startDate: newStartDate },
        },
      },
    }, false);

    this._renderEndDateError();
  }

  _endDateChangeHandler([newEndDate]) {
    this.updateState({
      isEndDateValid: TripEventForm.isEndDateValid(this._state.data.tripPoint.startDate, newEndDate),
      data: {
        tripPoint: {
          ...this._state.data.tripPoint,
          ...{ endDate: newEndDate },
        },
      },
    }, false);

    this._renderEndDateError();
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    const price = parseInt(evt.target.value, 10);

    if (!(Number.isInteger(price) && price > 0)) {
      evt.target.setCustomValidity('Price must be integer greater than 0!');
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');
    evt.target.reportValidity();

    this.updateState({
      data: {
        tripPoint: {
          ...this._state.data.tripPoint,
          ...{ price },
        },
      },
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    this.updateState({
      data: {
        tripPoint: {
          ...this._state.data.tripPoint,
          ...{ offers: this._getCheckedOffers() },
        },
      },
    });
  }

  static parseDataToState(option) {
    const { mode = FormMode.EDIT, tripPoint } = option;

    return {
      data: { ...option },
      isEditing: mode === FormMode.EDIT,
      isOffersAvailable: !!option.allOffers[tripPoint.type],
      isDestinationVisible: !!tripPoint.destination.description || !!tripPoint.destination.pictures,
      isEndDateValid: TripEventForm.isEndDateValid(tripPoint.startDate, tripPoint.endDate),
    };
  }

  static parseStateToData(state) {
    return { ...state.data.tripPoint };
  }

  static isEndDateValid(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      new Error('startDate or endDate is not Date objects.');
      return;
    }

    return endDate.getTime() >= startDate.getTime();
  }
}
