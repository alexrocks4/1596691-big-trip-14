import SiteNavigationView from './view/site-navigation.js';
import StatsView from './view/statistic.js';
import Container from './utils/container.js';
import TripRoutePresenter from './presenter/trip-route.js';
import TripPointModel from './model/trip-point.js';
import FilterModel from './model/filter.js';
import DestinationModel from './model/destination.js';
import OfferModel from './model/offer.js';
import TripTypeModel from './model/trip-type.js';
import FilterPresenter from './presenter/filter.js';
import InfoPresenter from './presenter/info.js';
import { SiteMenu } from './utils/const.js';
import Api from './api.js';
import { UpdateType } from './utils/const.js';

const API_HOST = 'https://14.ecmascript.pages.academy/big-trip';
const API_AUTH_STRING = 'Krojhephjiehetug';
const api = new Api(API_HOST, API_AUTH_STRING);

//Select DOM elements
const tripMainElement = document.querySelector('.trip-main');
const createTripPointElement = tripMainElement.querySelector('.trip-main__event-add-btn');
createTripPointElement.disabled = true;

//Containers
const siteNavigationContainer = new Container(tripMainElement.querySelector('.trip-controls__navigation'));
const tripFilterContainer = new Container(tripMainElement.querySelector('.trip-controls__filters'));
const tripMainContainer = new Container(tripMainElement);
const tripEventsContainer = new Container(document.querySelector('.trip-events'));
const statsContainer = new Container(document.querySelector('.page-main .page-body__container'));

//Models
const tripPointModel = new TripPointModel();
const filterModel = new FilterModel();
const offerModel = new OfferModel();
const destinationModel = new DestinationModel();
const tripTypeModel = new TripTypeModel();

//Presenters
const tripRoutePresenter = new TripRoutePresenter(
  tripEventsContainer,
  tripPointModel,
  filterModel,
  tripTypeModel,
  destinationModel,
  offerModel,
  api,
);
const filterPresenter = new FilterPresenter(tripFilterContainer, filterModel, tripPointModel);
const infoPresenter = new InfoPresenter(tripMainContainer, tripPointModel);

//Views
const siteNavigationComponent = new SiteNavigationView();
const statsComponent = new StatsView(tripPointModel.getTripPoints());

const activateCreateTripPointButton = (updateType) => {
  if (updateType === UpdateType.INIT) {
    createTripPointElement.disabled = false;
  }
};

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
      statsComponent.updateTripPoints(tripPointModel.getTripPoints());
      statsComponent.renderCharts();
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
tripPointModel.addObserver(activateCreateTripPointButton);

infoPresenter.init();
siteNavigationContainer.append(siteNavigationComponent);
filterPresenter.init();
tripRoutePresenter.init();

Promise.all([api.getTripPoints(), api.getDestinations(), api.getOffers()])
  .then(([tripPoints, destinations, offers]) => {
    destinationModel.set(destinations);
    offerModel.set(offers);
    tripPointModel.setTripPoints(UpdateType.INIT, tripPoints);
  })
  .catch(() => {
    destinationModel.set([]);
    offerModel.set([]);
    tripPointModel.setTripPoints(UpdateType.INIT, []);
  });

