import { FilterType } from '../utils/const.js';

const filter = {
  [FilterType.FUTURE]: (point) => {
    const currentDate = Date.now();
    const isInFuture = point.startDate.getTime() >= currentDate;
    const isContinuing = point.startDate.getTime() < currentDate && point.endDate.getTime() > currentDate;

    return isInFuture || isContinuing;
  },
  [FilterType.PAST]: (point) => {
    const currentDate = Date.now();

    return point.endDate.getTime() < currentDate;
  },

};

export { filter };
