import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { SortType } from '../utils/const.js';
import { sortTripPoints } from '../utils/trip-point.js';
import { UserAction, UpdateType, FilterType } from '../utils/const.js';
import { filter } from '../utils/filter.js';
import CreateFormPresenter from './create-form.js';
import LoadingView from '../view/loading.js';
import NoTripEventView from '../view/no-trip-event.js';

export default class TripRoute {
  constructor(
    tripEventsContainer = null,
    tripPointModel,
    filterModel,
    tripTypeModel,
    destinationModel,
    offerModel,
    api,
  ) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointModel = tripPointModel;
    this._filterModel = filterModel;
    this._tripTypeModel = tripTypeModel;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;
    this._tripPointPresenter =  {};
    this._currentSortType = SortType.DEFAULT;
    this._createFormPresenter = null;
    this._api = api;

    this._noTripEventComponent = new NoTripEventView();
    this._loadingComponent = new LoadingView();
    this._loading = true;

    this._changeMode = this._changeMode.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    this._listComponent = new TripEventsListView();
    this._listContainer = new Container(this._listComponent);
    this._filterModel.updateFilter(UpdateType.MINOR_RESET_SORT, FilterType.EVERYTHING);
    this._tripPointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    if (this._loading) {
      this._renderLoading();
      return;
    }

    if (!this._tripPointModel.getTripPoints().length) {
      this._renderNoTripEvents();
      return;
    }

    this._renderSort();
    this._renderTripPoints();
  }

  destroy() {
    this._clearNoTripEvents();
    this._clearLoading();
    this._clearCreateTripPoint();
    this._clearTripPoints();
    this._clearSort();
    this._listComponent.remove();
    this._currentSortType = SortType.DEFAULT;
    this._tripPointModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTripPoint(callback) {
    this._createFormPresenter = new CreateFormPresenter(
      this._listContainer,
      this._handleViewAction,
      this._tripTypeModel,
      this._destinationModel,
      this._offerModel,
    );
    this._createFormPresenter.init(callback);
  }

  _clearCreateTripPoint() {
    if (this._createFormPresenter) {
      this._createFormPresenter.destroy();
    }
  }

  _renderNoTripEvents() {
    this._tripEventsContainer.append(this._noTripEventComponent);
  }

  _clearNoTripEvents() {
    this._noTripEventComponent.remove();
  }

  _renderLoading() {
    this._tripEventsContainer.append(this._loadingComponent);
  }

  _clearLoading() {
    this._loadingComponent.remove();
  }

  _getTripPoints() {
    return sortTripPoints(this._currentSortType, this._filterTripPoints());
  }

  _renderTripPoint(tripPoint) {
    const tripPointPresenter = new TripPointPresenter(
      this._listContainer,
      this._handleViewAction,
      this._changeMode,
      this._tripTypeModel,
      this._destinationModel,
      this._offerModel,
    );
    tripPointPresenter.init(tripPoint);
    this._tripPointPresenter[tripPoint.id] = tripPointPresenter;
  }

  _renderTripPoints() {
    this._getTripPoints().forEach((tripPoint) => {
      this._renderTripPoint(tripPoint);
    });

    this._tripEventsContainer.append(this._listComponent);
  }

  _clearTripPoints() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }

  _rerenderTripPoints() {
    this._clearTripPoints();
    this._renderTripPoints();
  }

  _renderSort() {
    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortClickHandler(this._handleSortClick);
    this._tripEventsContainer.append(this._tripSortComponent);
  }

  _clearSort() {
    this._tripSortComponent.remove();
  }

  _rerenderSort() {
    this._clearSort();
    this._renderSort();
  }

  _renderTripRoute() {
    if (!this._tripPointModel.getTripPoints().length) {
      this._renderNoTripEvents();

      return;
    }

    this._renderSort();
    this._renderTripPoints();
  }

  _rerenderTripRoute({ resetSortType = false } = {}) {
    this._clearNoTripEvents();
    this._clearSort();
    this._clearCreateTripPoint();
    this._clearTripPoints();

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._renderTripRoute();
  }

  _filterTripPoints() {
    const currentFilter = this._filterModel.getFilter();
    const tripPoints = this._tripPointModel.getTripPoints();

    return currentFilter === FilterType.EVERYTHING ? tripPoints : tripPoints.filter(filter[this._filterModel.getFilter()]);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updateTripPoint(update)
          .then((response) => this._tripPointModel.updateTripPoint(updateType, response));
        break;
      case UserAction.ADD_POINT:
        this._api.createTripPoint(update)
          .then((response) => {
            this._tripPointModel.addTripPoint(updateType, response);
          });
        break;
      case UserAction.DELETE_POINT:
        this._api.deleteTripPoint(update)
          .then(() => {
            this._tripPointModel.deleteTripPoint(updateType, update);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._tripPointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._rerenderTripRoute();
        break;
      //Sort trip points by default when filter has been changed
      case UpdateType.MINOR_RESET_SORT:
        this._rerenderTripRoute({ resetSortType: true });
        break;
      case UpdateType.INIT:
        this._loading = false;
        this._clearLoading();
        this._renderTripRoute();
        break;
    }
  }

  _changeMode() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetMode());

    this._clearCreateTripPoint();
  }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._rerenderTripRoute();
  }
}
