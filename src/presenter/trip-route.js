import TripEventsListView from '../view/trip-events-list.js';
import Container from '../utils/container.js';
import TripPointPresenter from './trip-point.js';

export default class TripRoute {
  constructor(tripEventsContainer = null) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripPointPresenter =  {};
  }

  init(tripPoints = []) {
    this._tripPoints = tripPoints.slice();
    this._tripEventsListComponent = new TripEventsListView();
    this._tripEventsListContainer = new Container(this._tripEventsListComponent);

    this._renderTripPoints();
  }

  _renderTripPoint(tripPoint) {
    const tripPointPresenter = new TripPointPresenter(this._tripEventsListContainer);
    tripPointPresenter.init(tripPoint);
    this._tripPointPresenter[tripPoint.id] = tripPointPresenter;
  }

  _renderTripPoints() {
    this._tripPoints.forEach((tripPoint) => {
      this._renderTripPoint(tripPoint);
    });

    this._tripEventsContainer.append(this._tripEventsListComponent);
  }
}
