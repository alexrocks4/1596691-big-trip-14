import Container from '../utils/container.js';
import TripEventsListItemView from '../view/trip-events-list-item.js';
import TripEventView from '../view/trip-event.js';
import TripEventFormView from '../view/trip-event-form.js';
import { TRIP_TYPES } from '../mock/trip-type.js';
import { destinations } from '../mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from '../mock/offer.js';
import { isEscKeyPressed } from '../utils/common.js';
import { UserAction, UpdateType } from '../utils/const.js';
import { isDatesChanged } from '../utils/trip-point.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class TripPoint {
  constructor(listContainer, handleViewAction, changeMode) {
    this._listContainer = listContainer;
    this._handleViewAction = handleViewAction;
    this._tripEventComponent = null;
    this._editFormComponent = null;
    this._listItemComponent = null;
    this._mode = Mode.DEFAULT;
    this._changeMode = changeMode;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

  }

  init(tripPoint) {
    this._prevTripEventComponent = this._tripEventComponent;
    this._prevEditFormComponent = this._editFormComponent;
    this._prevlistItemComponent = this._listItemComponent;
    this._tripPoint = tripPoint;
    this._editFormOptions = {
      TRIP_TYPES,
      destinations,
      tripPoint,
      allOffers: POINT_TYPE_TO_OFFERS,
    };
    this._tripEventComponent = new TripEventView(tripPoint);
    this._editFormComponent = new TripEventFormView(this._editFormOptions);
    this._listItemComponent = new TripEventsListItemView();
    this._listItemContainer = new Container(this._listItemComponent);
    this._editFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editFormComponent.setRollupClickHandler(this._handleRollupClick);
    this._editFormComponent.setResetClickHandler(this._handleDeleteClick);
    this._tripEventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEventComponent.setEditClickHandler(this._handleEditClick);

    if (this._mode === Mode.DEFAULT) {
      this._listItemContainer.append(this._tripEventComponent);
    } else if (this._mode === Mode.EDITING) {
      this._listItemContainer.append(this._editFormComponent);
    }

    if (!this._prevlistItemComponent) {
      this._listContainer.append(this._listItemComponent);
      return;
    }

    if (this._listContainer.contains(this._prevlistItemComponent)) {
      this._listContainer.replace(this._listItemComponent, this._prevlistItemComponent);
    }

    this._prevTripEventComponent.remove();
    this._prevEditFormComponent.remove();
    this._prevlistItemComponent.remove();
  }

  resetMode() {
    if (this._mode === Mode.EDITING) {
      this._replaceEditFormToTripEvent();
    }
  }

  destroy() {
    this._mode = Mode.DEFAULT;
    this._tripEventComponent.remove();
    this._editFormComponent.remove();
    this._listItemComponent.remove();
  }

  _replaceTripEventToEditForm() {
    this._changeMode();
    this._listItemContainer.replace(this._editFormComponent, this._tripEventComponent);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToTripEvent() {
    this._listItemContainer.replace(this._tripEventComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceTripEventToEditForm();
  }

  _handleFormSubmit(data) {
    this._editFormComponent.reset(this._editFormOptions);
    this._replaceEditFormToTripEvent();
    this._handleViewAction(
      UserAction.UPDATE_POINT,
      isDatesChanged(data, this._tripPoint) || data.price !== this._tripPoint.price ? UpdateType.MINOR : UpdateType.PATCH,
      data,
    );
  }

  _handleDeleteClick() {
    this._replaceEditFormToTripEvent();
    this._handleViewAction(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this._tripPoint,
    );
  }

  _handleRollupClick() {
    this._editFormComponent.reset(this._editFormOptions);
    this._replaceEditFormToTripEvent();
  }

  _handleFavoriteClick() {
    this._handleViewAction(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this._tripPoint, ...{ isFavorite: !this._tripPoint.isFavorite } },
    );
  }

  _onEscKeyDown(evt) {
    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this._editFormComponent.reset(this._editFormOptions);
      this._replaceEditFormToTripEvent();
    }
  }
}
