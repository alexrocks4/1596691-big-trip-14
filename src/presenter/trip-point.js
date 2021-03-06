import Container from '../utils/container.js';
import TripEventsListItemView from '../view/trip-events-list-item.js';
import TripEventView from '../view/trip-event.js';
import TripEventFormView from '../view/trip-event-form.js';
import { isEscKeyPressed } from '../utils/common.js';
import { UserAction, UpdateType } from '../utils/const.js';
import { isDatesChanged } from '../utils/trip-point.js';
import { toast, Message } from '../utils/toast.js';
import { isOnline } from '../utils/common.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class TripPoint {
  constructor(
    listContainer,
    handleViewAction,
    changeMode,
    tripTypeModel,
    destinationModel,
    offerModel,
  ) {
    this._listContainer = listContainer;
    this._handleViewAction = handleViewAction;
    this._tripEventComponent = null;
    this._editFormComponent = null;
    this._listItemComponent = null;
    this._mode = Mode.DEFAULT;
    this._changeMode = changeMode;
    this._tripTypeModel = tripTypeModel;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._clearViewState = this._clearViewState.bind(this);
  }

  init(tripPoint) {
    this._prevTripEventComponent = this._tripEventComponent;
    this._prevEditFormComponent = this._editFormComponent;
    this._prevlistItemComponent = this._listItemComponent;
    this._tripPoint = tripPoint;
    this._editFormOptions = {
      TRIP_TYPES: this._tripTypeModel.get(),
      destinations: this._destinationModel.get(),
      tripPoint,
      allOffers: this._offerModel.get(),
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

  closeEditForm() {
    if (this._mode === Mode.EDITING) {
      this._editFormComponent.reset(this._editFormOptions);
      this._replaceEditFormToTripEvent();
    }
  }

  setAbortingViewState() {
    this._editFormComponent.shake(this._clearViewState);
  }

  _clearViewState() {
    this._editFormComponent.updateState({
      isSaving: false,
      isDeleting: false,
    });
  }

  _setSavingViewState() {
    this._editFormComponent.updateState({
      isSaving: true,
    });
  }

  _setDeletingViewState() {
    this._editFormComponent.updateState({
      isDeleting: true,
    });
  }

  _replaceTripEventToEditForm() {
    this._changeMode();
    this._listItemContainer.replace(this._editFormComponent, this._tripEventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToTripEvent() {
    this._listItemContainer.replace(this._tripEventComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(Message.NOEDIT);
      return;
    }

    this._replaceTripEventToEditForm();
  }

  _handleFormSubmit(data) {
    if (!isOnline()) {
      toast(Message.NOEDIT);
      this.setAbortingViewState();

      return;
    }

    this._setSavingViewState();
    this._handleViewAction(
      UserAction.UPDATE_POINT,
      isDatesChanged(data, this._tripPoint) || data.price !== this._tripPoint.price ? UpdateType.MINOR : UpdateType.PATCH,
      data,
    );
  }

  _handleDeleteClick() {
    if (!isOnline()) {
      toast(Message.NODELETE);
      this.setAbortingViewState();

      return;
    }

    this._setDeletingViewState();
    this._handleViewAction(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this._tripPoint,
    );
  }

  _handleRollupClick() {
    this.closeEditForm();
  }

  _handleFavoriteClick() {
    this._handleViewAction(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this._tripPoint, ...{ isFavorite: !this._tripPoint.isFavorite } },
    );
  }

  _escKeyDownHandler(evt) {
    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this.closeEditForm();
    }
  }
}
