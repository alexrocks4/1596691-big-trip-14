import { createSiteNavigationTemplate } from './view/site-navigation.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripFilterTemplate } from './view/trip-filter.js';
import { createTripSortTemplate } from './view/trip-sort.js';
import { createTripEventsListTemplate } from './view/trip-events-list.js';
import { createTripEventsListItemTemplate } from './view/trip-events-list-item.js';
import { createTripEventEditTemplate } from './view/trip-event-edit.js';
import { createTripEventTemplate } from './view/trip-event.js';
import { generateTripPoint } from './mock/trip-point.js';
import { TRIP_TYPES } from './mock/trip-type.js';
import { destinations } from './mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from './mock/offer.js';
import dayjs from 'dayjs';

const MAX_EVENTS_COUNT = 3;

const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);

const tripMainElement = document.querySelector('.trip-main');
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

const tripPointsSortedByStartDate = sortTripPointsByStartDate(tripPoints);

render(tripMainElement, createTripInfoTemplate(tripPointsSortedByStartDate), 'afterbegin');
render(siteNavigationContainerElement, createSiteNavigationTemplate());
render(tripFilterContainerElement, createTripFilterTemplate());
render(tripEventsElement, createTripSortTemplate());
render(tripEventsElement, createTripEventsListTemplate());
const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

const tripEventEditFormOptions = {
  TRIP_TYPES,
  destinations,
  tripPoint: generateTripPoint(),
  allOffers: POINT_TYPE_TO_OFFERS,
};
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventEditTemplate(tripEventEditFormOptions)));

const tripEventAddFormOptions = {
  TRIP_TYPES,
  destinations,
  allOffers: POINT_TYPE_TO_OFFERS,
};
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventEditTemplate(tripEventAddFormOptions)));

const tripPointsTemplate = tripPointsSortedByStartDate.reduce((generalTemplate, tripPoint) => {
  return generalTemplate + createTripEventsListItemTemplate(createTripEventTemplate(tripPoint));
}, '');

render(tripEventsListElement, tripPointsTemplate);


