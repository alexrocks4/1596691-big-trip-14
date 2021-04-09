// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
const getRandomIntegerInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

const getRandomArrayElement = (elements) => {
  const randomArrayIndex = getRandomIntegerInclusive(0, elements.length - 1);

  return elements[randomArrayIndex];
};

export { getRandomIntegerInclusive, getRandomArrayElement };
