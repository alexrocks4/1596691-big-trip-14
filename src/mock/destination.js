import sampleSize from 'lodash.samplesize';
import { getRandomIntegerInclusive } from '../utils/common.js';

const MIN_SENTENCES_COUNT = 1;
const MAX_SENTENCES_COUNT = 5;
const MIN_PICTURES_COUNT = 1;
const MAX_PICTURES_COUNT = 4;

const POINT_NAMES = ['Amsterdam','Chamonix','Geneva','Paris'];
const TEXT_TEMPLATE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.
Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis.
Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDescription = (sentencesCount) => {
  return sampleSize(TEXT_TEMPLATE.split(/\.\s/), sentencesCount).join('. ') + '.';
};

const generatePictures = () => {
  return Array.from({ length: getRandomIntegerInclusive(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT) }, () => {
    return {
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: 'Some beautiful place',
    };
  });
};

const generateDestination = (pointName) => {
  const sentencesCount = getRandomIntegerInclusive(MIN_SENTENCES_COUNT, MAX_SENTENCES_COUNT);
  const description = getRandomIntegerInclusive(0, 1) ? generateDescription(sentencesCount) : null;
  const pictures = getRandomIntegerInclusive(0, 1) ? generatePictures() : null;

  return {
    name: pointName,
    description,
    pictures,
  };
};

const destinations = POINT_NAMES.map((name) => generateDestination(name));

export { destinations };
