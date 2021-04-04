import { createSiteNavigationTemplate } from './view/site-navigation.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createTripFilterTemplate } from './view/trip-filter.js';
import { createTripSortTemplate } from './view/trip-sort.js';
import { createTripEventsListTemplate } from './view/trip-events-list.js';
import { createTripEventsListItemTemplate } from './view/trip-events-list-item.js';
import { createTripEventEditTemplate } from './view/trip-event-edit.js';
import { createTripEventAddTemplate } from './view/trip-event-add.js';
import { createTripEventTemplate } from './view/trip-event.js';
import { generateTripPoint } from './mock/trip-point.js';

const MAX_EVENTS_COUNT = 20;

const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);
console.log(tripPoints);

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

render(tripInfoElement, createTripInfoTemplate());
render(tripInfoElement, createTripCostTemplate());
render(siteNavigationContainerElement, createSiteNavigationTemplate());
render(tripFilterContainerElement, createTripFilterTemplate());
render(tripEventsElement, createTripSortTemplate());
render(tripEventsElement, createTripEventsListTemplate());
const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventEditTemplate()));
render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventAddTemplate()));

for (let i = 0; i < MAX_EVENTS_COUNT; i++) {
  render(tripEventsListElement, createTripEventsListItemTemplate(createTripEventTemplate()));
}
