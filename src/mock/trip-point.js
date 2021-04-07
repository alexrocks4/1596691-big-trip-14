import { getRandomIntegerInclusive, getRandomArrayElement } from '../util.js';
import { destinations } from './destination.js';
import { tripTypes } from './trip-type.js';
import { pointTypeToOffers } from './offer.js';
import dayjs from 'dayjs';

const HOURS_GAP = 24;
const MIN_EVENT_DURATION_IN_MINUTES = 60;
const MAX_EVENT_DURATION_IN_MINUTES = 10080; // 7 days
const MIN_PRICE = 10;
const MAX_PRICE = 600;
let idsCounter = 1;

const generateTripPointOffers = (tripType) => {
  let result = null;
  const selectedOffers = pointTypeToOffers[tripType]; // can be undefined if there is no such offers type

  if (selectedOffers) {
    const slicedArray = selectedOffers.slice(getRandomIntegerInclusive(0, selectedOffers.length));
    result = slicedArray.length ? slicedArray : null;
  }

  return result;
};

const generateTripPoint = () => {
  const tripType = getRandomArrayElement(tripTypes);
  const startDate = dayjs()
    .add(getRandomIntegerInclusive(-HOURS_GAP, HOURS_GAP), 'hour')
    .toDate();
  const endDate = dayjs(startDate)
    .add(getRandomIntegerInclusive(MIN_EVENT_DURATION_IN_MINUTES, MAX_EVENT_DURATION_IN_MINUTES), 'minute')
    .toDate();

  return {
    id: idsCounter++,
    type: tripType,
    destination: getRandomArrayElement(destinations),
    offers: generateTripPointOffers(tripType),
    startDate,
    endDate,
    price: getRandomIntegerInclusive(MIN_PRICE, MAX_PRICE),
    isFavorite: !!getRandomIntegerInclusive(0, 1),
  };
};

export { generateTripPoint };
