import TripPointModel from '../model/trip-point.js';
import OfferModel from '../model/offer.js';
import { isOnline } from '../utils/common.js';

const getTripPointStoreStructure = (tripPoints) => {
  return tripPoints.reduce((structure, point) => {
    return {
      ...structure,
      [point.id]: point,
    };
  }, {});
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTripPoints() {
    if (isOnline()) {
      return this._api.getTripPoints()
        .then((tripPoints) => {
          const storeTripPoints = getTripPointStoreStructure(tripPoints.map((point) => TripPointModel.adaptToServer(point)));
          this._store.setTripPoints(storeTripPoints);
          return tripPoints;
        });
    }

    const storeTripPoints = Object.values(this._store.getTripPoints());
    return Promise.resolve(storeTripPoints.map((point) => TripPointModel.adaptToModel(point)));
  }

  updateTripPoint(tripPoint) {
    if (isOnline()) {
      return this._api.updateTripPoint(tripPoint)
        .then((tripPoint) => {
          this._store.updateTripPoint(TripPointModel.adaptToServer(tripPoint));

          return tripPoint;
        });
    }

    this._store.updateTripPoint(TripPointModel.adaptToServer(tripPoint));

    return Promise.resolve(tripPoint);
  }

  createTripPoint(tripPoint) {
    if (isOnline()) {
      return this._api.createTripPoint(tripPoint)
        .then((newTripPoint) => {
          this._store.updateTripPoint(TripPointModel.adaptToServer(newTripPoint));

          return newTripPoint;
        });
    }

    return Promise.reject(new Error('Create trip point failed'));
  }

  deleteTripPoint(tripPoint) {
    if (isOnline()) {
      return this._api.deleteTripPoint(tripPoint)
        .then(() => {
          this._store.deleteTripPoint(tripPoint);
        });
    }

    return Promise.reject(new Error('Delete trip point failed'));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);

          return destinations;
        });
    }

    return Promise.resolve(this._store.getDestinations());
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(OfferModel.adaptToServer(offers));

          return offers;
        });
    }

    return Promise.resolve(OfferModel.adaptToModel(this._store.getOffers()));
  }

  sync() {
    if (isOnline()) {
      const storeTripPoints = Object.values(this._store.getTripPoints());

      return this._api.sync(storeTripPoints)
        .then((response) => {

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = getTripPointStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setTripPoints(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
