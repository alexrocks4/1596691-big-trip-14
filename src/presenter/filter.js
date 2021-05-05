import { filterFuture, filterPast } from '../utils/trip-point.js';
import FilterView from '../view/trip-filter.js';

const FilterType = {
  FUTURE: 'future',
  PAST: 'past',
};

export default class Filter {
  constructor(container, tripPointModel) {
    this._container = container;
    this._tripPointModel = tripPointModel;

    this._handleFilterChange = this._filterChangeHandler.bind(this);
  }

  init() {
    this.filterComponent = new FilterView();
    this.filterComponent.setFilterChangeHandler(this._handleFilterChange);

    this._container.append(this.filterComponent);
  }

  _filterChangeHandler(filter) {
    switch(filter) {
      case FilterType.FUTURE:
        this._tripPointModel.filter(filterFuture);
        break;
      case FilterType.PAST:
        this._tripPointModel.filter(filterPast);
        break;
      default:
        this._tripPointModel.resetFilter();
    }
  }
}
