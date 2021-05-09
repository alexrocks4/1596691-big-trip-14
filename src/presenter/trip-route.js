import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { SortType } from '../utils/const.js';
import { sortTripPoints } from '../utils/trip-point.js';
import { UserAction, UpdateType, FilterType } from '../utils/const.js';
import { filter } from '../utils/filter.js';

export default class TripRoute {
  constructor(tripEventsContainer = null, tripPointModel, filterModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointModel = tripPointModel;
    this._filterModel = filterModel;
    this._tripPointPresenter =  {};
    this._currentSortType = SortType.DEFAULT;

    this._changeMode = this._changeMode.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._tripPointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._listComponent = new TripEventsListView();
    this._listContainer = new Container(this._listComponent);

    this._renderSort();
    this._renderTripPoints();
  }

  _getTripPoints() {
    return sortTripPoints(this._currentSortType, this._filterTripPoints());
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

  _filterTripPoints() {
    const currentFilter = this._filterModel.getFilter();
    const tripPoints = this._tripPointModel.getTripPoints();

    return currentFilter === FilterType.EVERYTHING ? tripPoints : tripPoints.filter(filter[this._filterModel.getFilter()]);
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
      //Sort trip points by default when filter has been changed
      case UpdateType.FILTER_CHANGED:
        this._rerenderTripRoute({ resetSortType: true });
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
