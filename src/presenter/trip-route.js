import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { SortType } from '../utils/common.js';
import { sortStartDateUp, sortPriceDown, sortTimeDown } from '../utils/trip-point.js';
import { UserAction, UpdateType } from '../utils/const.js';

export default class TripRoute {
  constructor(tripEventsContainer = null, tripPointModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointModel = tripPointModel;
    this._tripPointPresenter =  {};
    this._currentSortType = SortType.DEFAULT;

    this._changeMode = this._changeMode.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._tripPointModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._listComponent = new TripEventsListView();
    this._listContainer = new Container(this._listComponent);

    this._renderSort();
    this._renderTripPoints();
  }

  _getTripPoints() {
    return this._sortTripPoints(this._currentSortType);
  }

  _renderTripPoint(tripPoint) {
    const tripPointPresenter = new TripPointPresenter(this._listContainer, this._handleViewAction, this._changeMode);
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

  _rerenderSort() {
    this._tripSortComponent.remove();
    this._renderSort();
  }

  _rerenderTripRoute({ resetSortType = false } = {}) {

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._rerenderSort();
    this._rerenderTripPoints();

  }

  _sortTripPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE_DOWN:
        return this._tripPointModel.getTripPoints().slice().sort(sortPriceDown);
      case SortType.TIME_DOWN:
        return this._tripPointModel.getTripPoints().slice().sort(sortTimeDown);
    }

    return this._tripPointModel.getTripPoints().slice().sort(sortStartDateUp);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._tripPointModel.updateTripPoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._tripPointModel.addTripPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._tripPointModel.deleteTripPoint(updateType, update);
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
    }
  }

  _changeMode() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetMode());
  }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._rerenderTripRoute();
  }
}
