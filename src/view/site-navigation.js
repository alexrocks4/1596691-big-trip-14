import AbstractView from './abstract.js';
import { SiteMenu } from '../utils/const.js';

export const createSiteNavigationTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${SiteMenu.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${SiteMenu.STATS}">Stats</a>
    </nav>`;
};

export default class SiteNavigation extends AbstractView {
  constructor() {
    super();
    this._navigatioClickHandler = this._navigatioClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteNavigationTemplate();
  }

  setNavigationClickHandler(callback) {
    this._callback.navigationClick = callback;
    this.getElement().addEventListener('click', this._navigatioClickHandler);
  }

  _navigatioClickHandler(evt) {
    const target = evt.target.closest('.trip-tabs__btn');
    const activeItem = this.getElement().querySelector('.trip-tabs__btn--active');

    //Ensure click was on non-active menu item element.
    if (!target || target === activeItem) {
      return;
    }

    evt.preventDefault();
    activeItem.classList.remove('trip-tabs__btn--active');
    target.classList.add('trip-tabs__btn--active');
    this._callback.navigationClick(target.dataset.menuItem);
  }
}
