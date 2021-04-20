import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';
import { updateItem } from '../utils/common.js';

export default class TripRoute {
  constructor(tripEventsContainer = null) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointPresenter =  {};

    this._changeTripPoint = this._changeTripPoint.bind(this);
    this._changeAllTripPointsMode = this._changeAllTripPointsMode.bind(this);
  }

  init(tripPoints = []) {
    this._tripPoints = tripPoints.slice();
    this._tripEventsListComponent = new TripEventsListView();
    this._tripEventsListContainer = new Container(this._tripEventsListComponent);

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

  _changeTripPoint(newTripPointData) {
    this._tripPoints = updateItem(this._tripPoints, newTripPointData);
    this._tripPointPresenter[newTripPointData.id].init(newTripPointData);
  }

  _changeAllTripPointsMode() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetMode());
  }
}
