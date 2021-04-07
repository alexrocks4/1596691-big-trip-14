import { createSiteNavigationTemplate } from './view/site-navigation.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createTripFilterTemplate } from './view/trip-filter.js';
import { createTripSortTemplate } from './view/trip-sort.js';
import { createTripEventsListTemplate } from './view/trip-events-list.js';
import { createTripEventsListItemTemplate } from './view/trip-events-list-item.js';
import { createTripEventEditTemplate } from './view/trip-event-edit.js';
import { createTripEventTemplate } from './view/trip-event.js';
import { generateTripPoint } from './mock/trip-point.js';
import { tripTypes } from './mock/trip-type.js';
import { destinations } from './mock/destination.js';
import { pointTypeToOffers } from './mock/offer.js';
import dayjs from 'dayjs';

const MAX_EVENTS_COUNT = 20;

const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);

const tripMainElement = document.querySelector('.trip-main');
const tripInfoElement = tripMainElement.querySelector('.trip-info');
const siteNavigationContainerElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFilterContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, template, place = 'beforeend') => {
  if (container) {
    container.insertAdjacentHTML(place, template);
  }
};

const sortTripPointsByStartDate = (tripPoints) => {
  return tripPoints
    .slice()
    .sort((pointA, pointB) => dayjs(pointA.startDate).diff(pointB.startDate));
};

render(tripInfoElement, createTripInfoTemplate());
render(tripInfoElement, createTripCostTemplate());
render(siteNavigationContainerElement, createSiteNavigationTemplate());
render(tripFilterContainerElement, createTripFilterTemplate());
render(tripEventsElement, createTripSortTemplate());
render(tripEventsElement, createTripEventsListTemplate());
const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

const tripEventEditFormOptions = {
  tripTypes,
  destinations,
  tripPoint: generateTripPoint(),
  allOffers: pointTypeToOffers,
};
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventEditTemplate(tripEventEditFormOptions)));

const tripEventAddFormOptions = {
  tripTypes,
  destinations,
  allOffers: pointTypeToOffers,
};
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventEditTemplate(tripEventAddFormOptions)));

const tripPointsSortedByStartDate = sortTripPointsByStartDate(tripPoints);
const tripPointsTemplate = tripPointsSortedByStartDate.reduce((generalTemplate, tripPoint) => {
  return generalTemplate + createTripEventsListItemTemplate(createTripEventTemplate(tripPoint));
}, '');

render(tripEventsListElement, tripPointsTemplate);


