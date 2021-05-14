import Observable from './observable.js';

export default class TripPoint extends Observable {
  constructor() {
    super();
    this._tripPoints = [];
  }

  setTripPoints(updateType, tripPoints) {
    this._tripPoints = tripPoints;

    this.notifyObservers(updateType);
  }

  getTripPoints() {
    return this._tripPoints;
  }

  updateTripPoint(updateType, update) {
    const index = this._tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      update,
      ...this._tripPoints.slice(index + 1),
    ];

    this.notifyObservers(updateType, update);
  }

  addTripPoint(updateType, update) {
    this._tripPoints = [
      update,
      ...this._tripPoints,
    ];

    this.notifyObservers(updateType, update);
  }

  deleteTripPoint(updateType, update) {
    const index = this._tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      ...this._tripPoints.slice(index + 1),
    ];

    this.notifyObservers(updateType);
  }

  static adaptToModel(tripPoint) {
    const adaptedData = {
      ...tripPoint,
      ...{
        startDate: new Date(tripPoint.date_from),
        endDate: new Date(tripPoint.date_to),
        price: tripPoint.base_price,
        isFavorite: tripPoint.is_favorite,
      },
    };

    delete adaptedData.date_from;
    delete adaptedData.date_to;
    delete adaptedData.base_price;
    delete adaptedData.is_favorite;

    return adaptedData;
  }

  static adaptToServer(tripPoint) {
    const { startDate, endDate, price, isFavorite } = tripPoint;
    const offers = tripPoint.offers === null ? [] : tripPoint.offers.slice();

    const adaptedData = {
      ...tripPoint,
      ...{
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
        base_price: price,
        is_favorite: isFavorite,
        offers,
      },
    };

    delete adaptedData.startDate;
    delete adaptedData.endDate;
    delete adaptedData.price;
    delete adaptedData.isFavorite;

    return adaptedData;
  }
}
