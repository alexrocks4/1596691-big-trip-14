import TripPointModel from './model/trip-point.js';
import OfferModel from './model/offer.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(host, authorizationString) {
    this._host = host;
    this._authorizationString = authorizationString;
  }

  _sendRequest({
    path = '',
    method = Method.GET,
    headers = {},
    body = null,
  }) {
    const init = {
      method,
      headers,
    };

    init.headers['Authorization'] = `Basic ${this._authorizationString}`;

    if (body) {
      init.body = body;
    }

    return fetch(`${this._host}${path}`, init)
      .then((response) => Api.checkStatus(response));
  }

  getTripPoints() {
    return this._sendRequest({
      path: '/points',
    })
      .then(Api.toJSON)
      .then((tripPoints) => tripPoints.map(TripPointModel.adaptToModel));
  }

  updateTripPoint(tripPoint) {
    return this._sendRequest({
      method: Method.PUT,
      path: `/points/${tripPoint.id}`,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(TripPointModel.adaptToServer(tripPoint)),
    })
      .then(Api.toJSON)
      .then(TripPointModel.adaptToModel);
  }

  createTripPoint(tripPoint) {
    return this._sendRequest({
      method: Method.POST,
      path: '/points',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(TripPointModel.adaptToServer(tripPoint)),
    })
      .then(Api.toJSON)
      .then(TripPointModel.adaptToModel);
  }

  deleteTripPoint(tripPoint) {
    return this._sendRequest({
      method: Method.DELETE,
      path: `/points/${tripPoint.id}`,
    });
  }

  getDestinations() {
    return this._sendRequest({
      path: '/destinations',
    })
      .then(Api.toJSON);
  }

  getOffers() {
    return this._sendRequest({
      path: '/offers',
    })
      .then(Api.toJSON)
      .then(OfferModel.adaptToModel);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}
