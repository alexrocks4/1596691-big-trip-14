const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  FILTER_CHANGED: 'FILTER_CHANGED',
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
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export {
  UserAction,
  UpdateType,
  FilterType,
  SortType,
  SiteMenu
};
