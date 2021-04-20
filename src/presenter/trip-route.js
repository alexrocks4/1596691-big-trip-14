import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { SortType, updateItem } from '../utils/common.js';
import { sortStartDateUp, sortPriceDown, sortTimeDown } from '../utils/trip-point.js';

export default class TripRoute {
  constructor(tripEventsContainer = null) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointPresenter =  {};
    this._currentSortType = SortType.DEFAULT;

    this._changeTripPoint = this._changeTripPoint.bind(this);
    this._changeAllTripPointsMode = this._changeAllTripPointsMode.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
  }

  init(tripPoints = []) {
    this._tripPoints = tripPoints.slice().sort(sortStartDateUp);
    this._sourceTripPoints = this._tripPoints.slice();

    this._tripEventsListComponent = new TripEventsListView();
    this._tripEventsListContainer = new Container(this._tripEventsListComponent);

    this._renderSort();
    this._renderTripPoints();
  }

  _renderTripPoint(tripPoint) {
    const tripPointPresenter = new TripPointPresenter(this._tripEventsListContainer, this._changeTripPoint, this._changeAllTripPointsMode);
    tripPointPresenter.init(tripPoint);
    this._tripPointPresenter[tripPoint.id] = tripPointPresenter;
  }

  _renderTripPoints() {
    this._tripPoints.forEach((tripPoint) => {
      this._renderTripPoint(tripPoint);
    });

    this._tripEventsContainer.append(this._tripEventsListComponent);
  }

  _renderSort() {
    this._tripSortComponent = new TripSortView();
    this._tripSortComponent.setSortClickHandler(this._handleSortClick);
    this._tripEventsContainer.append(this._tripSortComponent);
  }

  _sortTripPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE_DOWN:
        this._tripPoints.sort(sortPriceDown);
        break;
      case SortType.TIME_DOWN:
        this._tripPoints.sort(sortTimeDown);
        break;
      default:
        this._tripPoints = this._sourceTripPoints.slice();
    }

    this._currentSortType = sortType;
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

  _changeAllTripPointsMode() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetMode());
  }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTripPoints(sortType);
    this._clearTripPoints();
    this._renderTripPoints();
  }
}
