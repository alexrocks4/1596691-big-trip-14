import SiteNavigationView from './view/site-navigation.js';
import TripInfoView from './view/trip-info.js';
import TripFilterView from './view/trip-filter.js';
import TripSortView from './view/trip-sort.js';
import TripEventsListView from './view/trip-events-list.js';
import TripEventsListItemView from './view/trip-events-list-item.js';
import TripEventEditView from './view/trip-event-edit.js';
import TripEventView from './view/trip-event.js';
import NoTripEventView from './view/no-trip-event.js';
import Container from './utils/container.js';
import { generateTripPoint } from './mock/trip-point.js';
import { TRIP_TYPES } from './mock/trip-type.js';
import { destinations } from './mock/destination.js';
import { POINT_TYPE_TO_OFFERS } from './mock/offer.js';
import { sortTripPointsByStartDate } from './utils/trip-point.js';

const MAX_EVENTS_COUNT = 3;

const tripMainElement = document.querySelector('.trip-main');
const siteNavigationContainer = new Container(tripMainElement.querySelector('.trip-controls__navigation'));
const tripFilterContainer = new Container(tripMainElement.querySelector('.trip-controls__filters'));
const tripMainContainer = new Container(tripMainElement);
const tripEventsContainer = new Container(document.querySelector('.trip-events'));
const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);
const tripPointsSortedByStartDate = sortTripPointsByStartDate(tripPoints);

tripMainContainer.prepend(new TripInfoView(tripPointsSortedByStartDate));
siteNavigationContainer.append(new SiteNavigationView());
tripFilterContainer.append(new TripFilterView());

if (tripPointsSortedByStartDate.length) {
  const tripEventsListComponent = new TripEventsListView();
  const tripSortComponent = new TripSortView();
  const tripEventsListContainer = new Container(tripEventsListComponent);

  tripEventsContainer.append(tripSortComponent);

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
      tripEventListItemContainer.replace(tripEventEditFormElement, tripEventElement);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const replaceEditFormToTripEvent = () => {
      tripEventListItemContainer.replace(tripEventElement, tripEventEditFormElement);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToTripEvent();
      }
    };

    tripEventElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceTripEventToEditForm();
    });

    tripEventEditFormElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToTripEvent();
    });

    tripEventEditFormElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditFormToTripEvent();
    });

    tripEventListItemContainer.append(tripEventElement);
    tripEventsListContainer.append(tripEventListItemElement);
  });

  tripEventsContainer.append(tripEventsListComponent);
} else {
  tripEventsContainer.append(new NoTripEventView());
}
