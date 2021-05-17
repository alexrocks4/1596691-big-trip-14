const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  FILTER_CHANGED: 'FILTER_CHANGED',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const SortType = {
  DEFAULT: 'default',
  PRICE_DOWN: 'price-dowm',
  TIME_DOWN: 'time-down',
};

const SiteMenu = {
  TABLE: 'table',
  STATS: 'stats',
};

const MINUTES_IN_A_DAY = 60 * 24;
const MINUTES_IN_A_HOUR = 60;
const MILLISECONDS_IN_MINUTE = 60 * 1000;

export {
  UserAction,
  UpdateType,
  FilterType,
  SortType,
  SiteMenu,
  MINUTES_IN_A_DAY,
  MINUTES_IN_A_HOUR,
  MILLISECONDS_IN_MINUTE
};
