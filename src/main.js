import SiteNavigationView from './view/site-navigation.js';
import TripInfoView from './view/trip-info.js';
import TripFilterView from './view/trip-filter.js';
import NoTripEventView from './view/no-trip-event.js';
import Container from './utils/container.js';
import { generateTripPoint } from './mock/trip-point.js';
import TripRoutePresenter from './presenter/trip-route.js';

const MAX_EVENTS_COUNT = 20;

const tripMainElement = document.querySelector('.trip-main');
const siteNavigationContainer = new Container(tripMainElement.querySelector('.trip-controls__navigation'));
const tripFilterContainer = new Container(tripMainElement.querySelector('.trip-controls__filters'));
const tripMainContainer = new Container(tripMainElement);
const tripEventsContainer = new Container(document.querySelector('.trip-events'));
const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);

tripMainContainer.prepend(new TripInfoView(tripPoints));
siteNavigationContainer.append(new SiteNavigationView());
tripFilterContainer.append(new TripFilterView());

if (tripPoints.length) {
  const tripRoutePresenter = new TripRoutePresenter(tripEventsContainer);
  tripRoutePresenter.init(tripPoints);
} else {
  tripEventsContainer.append(new NoTripEventView());
}
