import AbstractView from './abstract.js';

export const createTripEventsListItemTemplate = () => {
  return '<li class="trip-events__item"></li>';
};

export default class TripEventsListItem extends AbstractView {
  getTemplate() {
    return createTripEventsListItemTemplate();
  }
}
