import SiteNavigationView from './view/site-navigation.js';
import NoTripEventView from './view/no-trip-event.js';
import StatsView from './view/stats.js';
import Container from './utils/container.js';
import { generateTripPoint } from './mock/trip-point.js';
import TripRoutePresenter from './presenter/trip-route.js';
import TripPointModel from './model/trip-point.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import InfoPresenter from './presenter/info.js';
import { SiteMenu } from './utils/const.js';

const MAX_EVENTS_COUNT = 4;

//Select DOM elements
const tripMainElement = document.querySelector('.trip-main');
const createTripPointElement = tripMainElement.querySelector('.trip-main__event-add-btn');

//Containers
const siteNavigationContainer = new Container(tripMainElement.querySelector('.trip-controls__navigation'));
const tripFilterContainer = new Container(tripMainElement.querySelector('.trip-controls__filters'));
const tripMainContainer = new Container(tripMainElement);
const tripEventsContainer = new Container(document.querySelector('.trip-events'));
const statsContainer = new Container(document.querySelector('.page-main .page-body__container'));

//Models
const tripPoints = Array.from({ length: MAX_EVENTS_COUNT }, generateTripPoint);
const tripPointModel = new TripPointModel();
const filterModel = new FilterModel();

//Presenters
const tripRoutePresenter = new TripRoutePresenter(tripEventsContainer, tripPointModel, filterModel);
const filterPresenter = new FilterPresenter(tripFilterContainer, filterModel, tripPointModel);
const infoPresenter = new InfoPresenter(tripMainContainer, tripPointModel);

//Views
const siteNavigationComponent = new SiteNavigationView();
const statsComponent = new StatsView();

const handleNavigationClick = (menuItem) => {
  switch(menuItem) {
    case SiteMenu.TABLE:
      //Destroy Stats
      statsComponent.remove();
      //Render route
      tripRoutePresenter.init();
      //Activate New Button
      createTripPointElement.disabled = false;
      break;
    case SiteMenu.STATS:
      //Destroy Table
      tripRoutePresenter.destroy();
      //Deactivate New Button
      createTripPointElement.disabled = true;
      //Render Stats
      statsContainer.append(statsComponent);
      break;
  }
};

const handleCreateFormClose = () => {
  createTripPointElement.disabled = false;
};

const handleCreateTripPointClick = (evt) => {
  tripRoutePresenter.destroy();
  tripRoutePresenter.init();
  tripRoutePresenter.createTripPoint(handleCreateFormClose);
  evt.target.disabled = true;
};

siteNavigationComponent.setNavigationClickHandler(handleNavigationClick);
createTripPointElement.addEventListener('click', handleCreateTripPointClick);

tripPointModel.setTripPoints(tripPoints);
infoPresenter.init();
siteNavigationContainer.append(siteNavigationComponent);
filterPresenter.init();

if (tripPoints.length) {
  tripRoutePresenter.init();
} else {
  tripEventsContainer.append(new NoTripEventView());
}
