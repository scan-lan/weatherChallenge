const argv = require('yargs')["argv"];
const axios = require('axios');

const {city} = argv;

const sumTemperatureArray = (fiveDaysWeatherData, minOrMax) => fiveDaysWeatherData.reduce((tot, weatherDay) => tot + weatherDay[`${minOrMax}_temp`], 0);

const displayError = error => {
    console.error(`Sorry, there was a problem fetching the weather for ${city}`);
    console.error(error);
};

const displayMinMaxTemperatures = ({min, max}) => {
    console.log(`The average five day forecast temperatures for ${city} are:
  Minimum: ${min}°C
  Maximum: ${max}°C`);
};

const fetchLocationDetails = async city => {
    const locationDetails = await axios.get(`https://www.metaweather.com/api/location/search/?query=${city}`);
    return locationDetails.data[0];
};

const extractLocationId = locationDetails => locationDetails["woeid"];

const fetchFiveDayWeather = async locationId => {
    let fiveDayWeather = await axios.get(`https://www.metaweather.com/api/location/${locationId}`);
    return fiveDayWeather.data["consolidated_weather"];
};

const extractFiveDayAverageMinMaxTemperatures = fiveDaysWeatherData => ({
    min: (sumTemperatureArray(fiveDaysWeatherData, "min") / fiveDaysWeatherData.length).toFixed(2),
    max: (sumTemperatureArray(fiveDaysWeatherData, "max") / fiveDaysWeatherData.length).toFixed(2)
});

fetchLocationDetails(city)
    .then(extractLocationId)
    .then(fetchFiveDayWeather)
    .then(extractFiveDayAverageMinMaxTemperatures)
    .then(displayMinMaxTemperatures)
    .catch(displayError);
