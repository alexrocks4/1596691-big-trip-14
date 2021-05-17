import { FilterType } from '../utils/const.js';
import Observable from './observable';

export default class Filter extends Observable {
  constructor() {
    super();
    this._filter = FilterType.EVERYTHING;
  }

  update(updateType, filter) {
    this._filter = filter;
    this.notifyObservers(updateType, filter);
  }

  getFilter() {
    return this._filter;
  }
}
