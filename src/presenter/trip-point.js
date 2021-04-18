import Container from '../utils/container.js';
import TripEventsListItemView from '../view/trip-events-list-item.js';
import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import { TRIP_TYPES } from '../mock/trip-type.js';
import { destinations } from '../mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from '../mock/offer.js';
import { isEscKeyPressed } from '../utils/common.js';

export default class TripPoint {
  constructor(tripEventsListContainer) {
    this._tripEventsListContainer = tripEventsListContainer;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
  }

  init(tripPoint) {
    const tripEventEditFormOptions = {
      TRIP_TYPES,
      destinations,
      tripPoint,
      allOffers: POINT_TYPE_TO_OFFERS,
    };
    this._tripPoint = tripPoint;
    this._tripEventListItemComponent = new TripEventsListItemView();
    this._tripEventComponent = new TripEventView(tripPoint);
    this._tripEventEditFormComponent = new TripEventEditView(tripEventEditFormOptions);
    this._tripEventListItemContainer = new Container(this._tripEventListItemComponent);

    this._tripEventComponent.setEditClickHandler(this._handleEditClick);
    this._tripEventEditFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditFormComponent.setRollupClickHandler(this._handleRollupClick);

    this._tripEventListItemContainer.append(this._tripEventComponent);
    this._tripEventsListContainer.append(this._tripEventListItemComponent);
  }

  _onEscKeyDown(evt) {
    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this._replaceEditFormToTripEvent();
    }
  }

  _replaceTripEventToEditForm() {
    this._tripEventListItemContainer.replace(this._tripEventEditFormComponent, this._tripEventComponent);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _replaceEditFormToTripEvent() {
    this._tripEventListItemContainer.replace(this._tripEventComponent, this._tripEventEditFormComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleEditClick() {
    this._replaceTripEventToEditForm();
  }

  _handleFormSubmit() {
    this._replaceEditFormToTripEvent();
  }

  _handleRollupClick() {
    this._replaceEditFormToTripEvent();
  }
}
