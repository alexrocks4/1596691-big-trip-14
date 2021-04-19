import Container from '../utils/container.js';
import TripEventsListItemView from '../view/trip-events-list-item.js';
import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import { TRIP_TYPES } from '../mock/trip-type.js';
import { destinations } from '../mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from '../mock/offer.js';
import { isEscKeyPressed } from '../utils/common.js';

export default class TripPoint {
  constructor(tripEventsListContainer, changeTripPointData) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._changeTripPointData = changeTripPointData;
    this._tripEventComponent = null;
    this._tripEventEditFormComponent = null;
    this._tripEventListItemComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(tripPoint) {
    const tripEventEditFormOptions = {
      TRIP_TYPES,
      destinations,
      tripPoint,
      allOffers: POINT_TYPE_TO_OFFERS,
    };
    this._prevTripEventComponent = this._tripEventComponent;
    this._prevTripEventEditFormComponent = this._tripEventEditFormComponent;
    this._prevTripEventListItemComponent = this._tripEventListItemComponent;
    this._tripPoint = tripPoint;
    this._tripEventComponent = new TripEventView(tripPoint);
    this._tripEventEditFormComponent = new TripEventEditView(tripEventEditFormOptions);
    this._tripEventListItemComponent = new TripEventsListItemView();
    this._tripEventListItemContainer = new Container(this._tripEventListItemComponent);
    this._tripEventComponent.setEditClickHandler(this._handleEditClick);
    this._tripEventEditFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditFormComponent.setRollupClickHandler(this._handleRollupClick);
    this._tripEventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._tripEventListItemContainer.append(this._tripEventComponent);

    if (!this._prevTripEventListItemComponent) {
      this._tripEventsListContainer.append(this._tripEventListItemComponent);
      return;
    }

    if (this._tripEventsListContainer.contains(this._prevTripEventListItemComponent)) {
      this._tripEventsListContainer.replace(this._tripEventListItemComponent, this._prevTripEventListItemComponent);
    }

    this._prevTripEventComponent.remove();
    this._prevTripEventEditFormComponent.remove();
    this._prevTripEventListItemComponent.remove();
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

  _handleFavoriteClick() {
    this._changeTripPointData(Object.assign(
      {}, this._tripPoint, { isFavorite: !this._tripPoint.isFavorite }));
  }

  _destroy() {
    this._tripEventComponent.remove();
    this._tripEventEditFormComponent.remove();
    this._tripEventListItemComponent.remove();
  }
}
