import Observable from './observable';

export default class Offer extends Observable {
  constructor() {
    super();
    this._offers = null;
  }

  set(Offers) {
    this._offers = Offers;
  }

  get() {
    return this._offers;
  }

  static adaptToModel(offers) {
    const adaptedOffers = {};

    offers.forEach((offer) => {
      adaptedOffers[offer.type] = offer.offers.slice();
    });

    return adaptedOffers;
  }
}
