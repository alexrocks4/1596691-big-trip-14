import TripSortView from '../view/trip-sort.js';
import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import TripPointModel from '../model/trip-point.js';

export default class TripRoute {
  constructor(tripEventsContainer = null, tripPointModel) {
    if (!(tripPointModel instanceof TripPointModel)) {
      new Error('tripPointModel must be instanceof TripPointModel');
      return;
    }

    this._tripEventsContainer = tripEventsContainer;
    this._tripPointModel = tripPointModel;
    this._tripPointPresenter =  {};
    //Current sort type is determined by this._sortTripPoints which equals
    //the corrensponding sort method of the tripPointModel
    this._sortTripPoints = this._tripPointModel.sortDateUp;

    this._changeTripPoint = this._changeTripPoint.bind(this);
    this._changeMode = this._changeMode.bind(this);
    this._handleSortDateUpClick = this._getSortClickHandler(this._tripPointModel.sortDateUp).bind(this);
    this._handleSortPriceDownClick = this._getSortClickHandler(this._tripPointModel.sortPriceDown).bind(this);
    this._handleSortTimeDownClick = this._getSortClickHandler(this._tripPointModel.sortTimeDown).bind(this);
  }

  init() {
    this._listComponent = new TripEventsListView();
    this._listContainer = new Container(this._listComponent);

    this._renderSort();
    this._renderTripPoints();
  }

  _renderTripPoint(tripPoint) {
    const tripPointPresenter = new TripPointPresenter(this._listContainer, this._changeTripPoint, this._changeMode);
    tripPointPresenter.init(tripPoint);
    this._tripPointPresenter[tripPoint.id] = tripPointPresenter;
  }

  _renderTripPoints() {
    this._sortTripPoints().forEach((tripPoint) => {
      this._renderTripPoint(tripPoint);
    });

    this._tripEventsContainer.append(this._listComponent);
  }

  _rerenderTripPoints() {
    this._clearTripPoints();
    this._renderTripPoints();
  }

  _renderSort() {
    this._tripSortComponent = new TripSortView();
    this._tripSortComponent.setSortDateUpClickHandler(this._handleSortDateUpClick);
    this._tripSortComponent.setSortPriceDownClickHandler(this._handleSortPriceDownClick);
    this._tripSortComponent.setSortTimeDownClickHandler(this._handleSortTimeDownClick);
    this._tripEventsContainer.append(this._tripSortComponent);
  }

  _clearTripPoints() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }

  _changeTripPoint(newTripPointData) {
    this._tripPointModel.updatePoint(newTripPointData);
    this._tripPointPresenter[newTripPointData.id].init(newTripPointData);
  }

  _changeMode() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetMode());
  }

  _getSortClickHandler(sortTypeAlgorithm) {
    return function() {
      if (this._sortTripPoints === sortTypeAlgorithm) {
        return;
      }

      //Change current sort type
      this._sortTripPoints = sortTypeAlgorithm;
      this._rerenderTripPoints();
    };
  }
}
