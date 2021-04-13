import { createElement } from '../util.js';
import dayjs from 'dayjs';

const MAX_PATH_DISPLAY_LENGTH = 3;

const createTripInfoTemplate = (tripPoints) => {
  let totalCost = 0;

  const generateTripInfoDatesContent = () => {
    const tripStartDate = dayjs(tripPoints[0].startDate).format('MMM D');
    const tripEndDate = dayjs(tripPoints[tripPoints.length - 1].startDate).format('MMM D');

    return `${tripStartDate}&nbsp;&mdash;&nbsp;${tripEndDate}`;
  };

  const tripPath = tripPoints.reduce((path, point, index) => {
    const { destination, offers, price } = point;

    // Calculate total cost
    totalCost += price;

    if (offers) {
      offers.forEach((offer) => totalCost += offer.price);
    }

    // Collect unique points names
    if (index === 0 || path[path.length - 1] !== destination.name) {
      path.push(destination.name);
    }

    return path;
  }, []);

  const tripPathString = tripPath.length > MAX_PATH_DISPLAY_LENGTH
    ? `${tripPath[0]} ... ${tripPath[tripPath.length - 1]}`
    : tripPath.join(' &mdash; ');

  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripPathString}</h1>

        <p class="trip-info__dates">${tripPoints.length ? generateTripInfoDatesContent() : ''}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`;
};

export default class TripInfo {
  constructor(tripPoints) {
    this._element = null;
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripPoints);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
