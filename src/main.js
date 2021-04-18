import SiteNavigationView from './view/site-navigation.js';
import TripInfoView from './view/trip-info.js';
import TripFilterView from './view/trip-filter.js';
import TripSortView from './view/trip-sort.js';
import NoTripEventView from './view/no-trip-event.js';
import Container from './utils/container.js';
import { generateTripPoint } from './mock/trip-point.js';
import { sortTripPointsByStartDate } from './utils/trip-point.js';
import TripRoutePresenter from './presenter/trip-route.js';

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
  const tripSortComponent = new TripSortView();
  tripEventsContainer.append(tripSortComponent);

  const tripRoutePresenter = new TripRoutePresenter(tripEventsContainer);
  tripRoutePresenter.init(tripPointsSortedByStartDate);
} else {
  tripEventsContainer.append(new NoTripEventView());
}
