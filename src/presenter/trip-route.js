import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { SortType, updateItem } from '../utils/common.js';
import { sortStartDateUp, sortPriceDown, sortTimeDown } from '../utils/trip-point.js';

export default class TripRoute {
  constructor(tripEventsContainer = null, tripPointModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointModel = tripPointModel;
    this._tripPointPresenter =  {};
    this._currentSortType = SortType.DEFAULT;

    this._changeTripPoint = this._changeTripPoint.bind(this);
    this._changeMode = this._changeMode.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
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
    const tripPointPresenter = new TripPointPresenter(this._listContainer, this._changeTripPoint, this._changeMode);
    tripPointPresenter.init(tripPoint);
    this._tripPointPresenter[tripPoint.id] = tripPointPresenter;
  }

  _renderTripPoints() {
    this._getTripPoints().forEach((tripPoint) => {
      this._renderTripPoint(tripPoint);
    });

    this._tripEventsContainer.append(this._listComponent);
  }

  _renderSort() {
    this._tripSortComponent = new TripSortView();
    this._tripSortComponent.setSortClickHandler(this._handleSortClick);
    this._tripEventsContainer.append(this._tripSortComponent);
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

  _clearTripPoints() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }

  _changeTripPoint(newTripPointData) {
    this._tripPoints = updateItem(this._tripPoints, newTripPointData);
    this._sourceTripPoints = updateItem(this._sourceTripPoints, newTripPointData);
    this._tripPointPresenter[newTripPointData.id].init(newTripPointData);
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
    this._clearTripPoints();
    this._renderTripPoints();
  }
}
