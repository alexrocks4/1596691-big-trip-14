import Observable from './observable';

export default class Offer extends Observable {
  constructor() {
    super();
    this._offers = null;
  }

  setOffers(Offers) {
    this._offers = Offers;
  }

  getOffers() {
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
