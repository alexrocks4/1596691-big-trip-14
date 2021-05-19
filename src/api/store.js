export default class Store {
  constructor(key, store) {
    this._key = key;
    this._store = store;
  }

  setTripPoints(tripPoints) {
    const storeData = this._get();

    this._set({ ...storeData, ...{ tripPoint: tripPoints } });
  }

  getTripPoints() {
    return this._get().tripPoint;
  }

  updateTripPoint(tripPoint) {
    const storeData = this._get();

    storeData.tripPoint = {
      ...storeData.tripPoint,
      ...{ [tripPoint.id]: tripPoint },
    };

    this._set(storeData);
  }

  deleteTripPoint(tripPoint) {
    const storeData = { ...this._get() };
    storeData.tripPoint = {
      ...storeData.tripPoint,
    };

    delete storeData.tripPoint[tripPoint.id];

    this._set(storeData);
  }

  getDestinations() {
    return this._get().destinations;
  }

  setDestinations(destinations) {
    const storeData = this._get();

    this._set({
      ...storeData,
      ...{ destinations },
    });
  }

  getOffers() {
    return this._get().offers;
  }

  setOffers(offers) {
    const storeData = this._get();

    this._set({
      ...storeData,
      ...{ offers },
    });
  }

  _get() {
    try {
      return JSON.parse(this._store.getItem(this._key) || {});
    } catch(error) {
      return {};
    }
  }

  _set(value) {
    this._store.setItem(this._key, JSON.stringify(value));
  }
}
