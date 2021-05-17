import FormView from '../view/trip-event-form.js';
import { FormMode } from '../utils/trip-event-form.js';
import { isEscKeyPressed } from '../utils/common.js';
import { UserAction, UpdateType } from '../utils/const.js';
import TripEventsListItemView from '../view/trip-events-list-item.js';
import Container from '../utils/container.js';

const getBlankTripPoint = (tripTypes, destinations) => {
  return {
    type: tripTypes[0],
    destination: destinations[0],
    offers: null,
    startDate: new Date(),
    endDate: new Date(),
    price: 0,
    isFavorite: false,
  };
};

export default class CreateForm {
  constructor(
    container,
    handleViewAction,
    tripTypeModel,
    destinationModel,
    offerModel,
  ) {
    this._container = container;
    this._handleViewAction = handleViewAction;
    this._tripTypeModel = tripTypeModel;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._clearViewState = this._clearViewState.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    this._createFormOptions = {
      mode: FormMode.CREATE,
      TRIP_TYPES: this._tripTypeModel.get(),
      destinations: this._destinationModel.get(),
      tripPoint: getBlankTripPoint(this._tripTypeModel.get(), this._destinationModel.get()),
      allOffers: this._offerModel.get(),
    };
    this._formComponent = new FormView(this._createFormOptions);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setRollupClickHandler(this._handleRollupClick);
    this._formComponent.setResetClickHandler(this._handleCancelClick);
    document.addEventListener('keydown', this._onEscKeyDown);

    this._listItemComponent = new TripEventsListItemView();
    this._listItemContainer = new Container(this._listItemComponent);
    this._listItemContainer.append(this._formComponent);
    this._container.prepend(this._listItemComponent);
  }

  destroy() {
    this._formComponent.remove();
    this._listItemComponent.remove();
    document.removeEventListener('keydown', this._onEscKeyDown);

    if (this._destroyCallback) {
      this._destroyCallback();
    }
  }

  setAbortingViewState() {
    this._formComponent.shake(this._clearViewState);
  }

  _clearViewState() {
    this._formComponent.updateState({
      isSaving: false,
    });
  }

  _setSavingViewState() {
    this._formComponent.updateState({
      isSaving: true,
    });
  }

  _handleFormSubmit(data) {
    this._setSavingViewState();
    this._handleViewAction(
      UserAction.ADD_POINT,
      UpdateType.MINOR_RESET_SORT,
      data,
    );
  }

  _handleRollupClick() {
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (isEscKeyPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
