const argv = require('yargs').argv;
const axios = require('axios');

const { city } = argv;

const displayError = () => {
  console.error(`Sorry, there was a problem fetching the weather for ${city}`);
  console.error(error);
};

const displayMinMaxTemperatures = ({ min, max }) => {
  console.log(`The average five day forecast temperatures for ${city} are
  Minimum: ${min} degrees C
  Maximum: ${max} degreees C`);
};

fetchLocationDetails(city)
  .then(extractLocationId)
  .then(fetchFiveDayWeather)
  .then(extractFiveDayAverageMinMaxTemperatures)
  .then(displayMinMaxTemperatures)
  .catch(displayError);