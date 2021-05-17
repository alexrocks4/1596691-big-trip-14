const TRIP_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export default class TripType {
  constructor() {
    this._tripTypes = TRIP_TYPES;
  }

  get() {
    return this._tripTypes;
  }
}
