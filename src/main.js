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
import { isEscKeyPressed } from './utils/common.js';

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
    const tripEventListItemComponent = new TripEventsListItemView();
    const tripEventComponent = new TripEventView(tripPoint);
    const tripEventEditFormComponent = new TripEventEditView(tripEventEditFormOptions);
    const tripEventListItemContainer = new Container(tripEventListItemComponent);

    const replaceTripEventToEditForm = () => {
      tripEventListItemContainer.replace(tripEventEditFormComponent, tripEventComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const replaceEditFormToTripEvent = () => {
      tripEventListItemContainer.replace(tripEventComponent, tripEventEditFormComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscKeyPressed(evt)) {
        evt.preventDefault();
        replaceEditFormToTripEvent();
      }
    };

    tripEventComponent.setEditClickHandler(() => replaceTripEventToEditForm());
    tripEventEditFormComponent.setFormSubmitHandler(() => replaceEditFormToTripEvent());
    tripEventEditFormComponent.setRollupClickHandler(() => replaceEditFormToTripEvent());
    tripEventListItemContainer.append(tripEventComponent);
    tripEventsListContainer.append(tripEventListItemComponent);
  });

  tripEventsContainer.append(tripEventsListComponent);
} else {
  tripEventsContainer.append(new NoTripEventView());
}
