import AbstractView from './abstract.js';

export const createNoTripEventTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class NoTripEvent extends AbstractView {
  getTemplate() {
    return createNoTripEventTemplate();
  }
}
