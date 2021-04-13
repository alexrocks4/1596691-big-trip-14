import SiteNavigationView from './view/site-navigation.js';
import TripInfoView from './view/trip-info.js';
import TripFilterView from './view/trip-filter.js';
import TripSortView from './view/trip-sort.js';
import TripEventsListView from './view/trip-events-list.js';
import TripEventsListItemView from './view/trip-events-list-item.js';
import TripEventEditView from './view/trip-event-edit.js';
import TripEventView from './view/trip-event.js';
import { generateTripPoint } from './mock/trip-point.js';
import { TRIP_TYPES } from './mock/trip-type.js';
import { destinations } from './mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from './mock/offer.js';
import Container from './container.js';
import dayjs from 'dayjs';

const MAX_EVENTS_COUNT = 3;

const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);

const tripMainElement = document.querySelector('.trip-main');

const tripEventsListComponent = new TripEventsListView();
const tripSortComponent = new TripSortView();

const siteNavigationContainer = new Container(tripMainElement.querySelector('.trip-controls__navigation'));
const tripFilterContainer = new Container(tripMainElement.querySelector('.trip-controls__filters'));
const tripMainContainer = new Container(tripMainElement);
const tripEventsContainer = new Container(document.querySelector('.trip-events'));
const tripEventsListContainer = new Container(tripEventsListComponent.getElement());

const sortTripPointsByStartDate = (tripPoints) => {
  return tripPoints
    .slice()
    .sort((pointA, pointB) => dayjs(pointA.startDate).diff(pointB.startDate));
};

const tripPointsSortedByStartDate = sortTripPointsByStartDate(tripPoints);

tripMainContainer.prependElement(new TripInfoView(tripPointsSortedByStartDate).getElement());
siteNavigationContainer.appendElement(new SiteNavigationView().getElement());
tripFilterContainer.appendElement(new TripFilterView().getElement());
tripEventsContainer.appendElement(tripSortComponent.getElement());

tripPointsSortedByStartDate.forEach((tripPoint) => {
  const tripEventEditFormOptions = {
    TRIP_TYPES,
    destinations,
    tripPoint,
    allOffers: POINT_TYPE_TO_OFFERS,
  };
  const tripEventListItemElement = new TripEventsListItemView().getElement();
  const tripEventElement = new TripEventView(tripPoint).getElement();
  const tripEventEditFormElement = new TripEventEditView(tripEventEditFormOptions).getElement();
  const tripEventListItemContainer = new Container(tripEventListItemElement);

  const replaceTripEventToEditForm = () => {
    tripEventListItemElement.replaceChild(tripEventEditFormElement, tripEventElement);
  };

  const replaceEditFormToTripEvent = () => {
    tripEventListItemElement.replaceChild(tripEventElement, tripEventEditFormElement);
  };

  tripEventElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceTripEventToEditForm();
  });

  tripEventEditFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditFormToTripEvent();
  });

  tripEventListItemContainer.appendElement(tripEventElement);
  tripEventsListContainer.appendElement(tripEventListItemElement);
});

tripEventsContainer.appendElement(tripEventsListComponent.getElement());
