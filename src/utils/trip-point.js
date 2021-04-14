import dayjs from 'dayjs';

const sortTripPointsByStartDate = (tripPoints) => {
  return tripPoints
    .slice()
    .sort((pointA, pointB) => dayjs(pointA.startDate).diff(pointB.startDate));
};

export { sortTripPointsByStartDate };
