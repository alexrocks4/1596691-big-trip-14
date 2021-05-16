import FilterView from '../view/trip-filter.js';
import { UpdateType } from '../utils/const.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../utils/const.js';

export default class Filter {
  constructor(container, filterModel, tripPointModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._tripPointModel = tripPointModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._tripPointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      this._container.append(this._filterComponent);
      return;
    }

    this._container.replace(this._filterComponent, prevFilterComponent);
    prevFilterComponent.remove();
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.updateFilter(UpdateType.MINOR_RESET_SORT, filterType);
  }

  _getFilters() {
    const tripPoints = this._tripPointModel.getTripPoints();

    return {
      [FilterType.EVERYTHING]: tripPoints.length,
      [FilterType.FUTURE]: tripPoints.filter(filter[FilterType.FUTURE]).length,
      [FilterType.PAST]: tripPoints.filter(filter[FilterType.PAST]).length,
    };
  }
}
