import { sortTripPoints } from '../utils/trip-point.js';
import { SortType } from '../utils/const.js';
import InfoView from '../view/trip-info.js';

export default class Info {
  constructor(container, tripPointModel) {
    this._container = container;
    this._tripPointModel = tripPointModel;
    this._infoComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._tripPointModel.addObserver(this._handleModelEvent);
  }

  init() {
    const sortedTripPoints = sortTripPoints(SortType.DEFAULT, this._tripPointModel.getTripPoints());
    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new InfoView(sortedTripPoints);

    if (prevInfoComponent === null) {
      this._container.prepend(this._infoComponent);
      return;
    }

    this._container.replace(this._infoComponent, prevInfoComponent);
    prevInfoComponent.remove();
  }

  _handleModelEvent() {
    this.init();
  }
}
