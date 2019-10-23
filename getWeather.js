const argv = require('yargs').argv;
const axios = require('axios');

const {city} = argv;

const displayError = error => {
    console.error(`Sorry, there was a problem fetching the weather for ${city}`);
    console.error(error);
};

const displayMinMaxTemperatures = ({min, max}) => {
    console.log(`The average five day forecast temperatures for ${city} are
  Minimum: ${min} degrees °C
  Maximum: ${max} degrees °C`);
};

async function fetchLocationDetails(city) {
    try {
        const locationDetails = await axios.get(`https://www.metaweather.com/api/location/search/?query=${city}`);
        return locationDetails.data[0];
    } catch (error) {
        displayError(error);
    }
}

const extractLocationId = locationDetails => locationDetails.woeid;

const fetchFiveDayWeather = async locationId => {
    let fiveDayWeather = await axios.get(`https://www.metaweather.com/api/location/${locationId}`)
    return fiveDayWeather.data.consolidated_weather;
}

const extractFiveDayAverageMinMaxTemperatures = fiveDaysWeatherData => {
    minTempTotal = fiveDaysWeatherData.reduce((tot, weatherDay) => tot + weatherDay.min_temp, 0)
    maxTempTotal = fiveDaysWeatherData.reduce((tot, weatherDay) => tot + weatherDay.max_temp, 0)
    return {
        min: (minTempTotal / fiveDaysWeatherData.length).toFixed(2),
        max: (maxTempTotal / fiveDaysWeatherData.length).toFixed(2)
    }
}

fetchLocationDetails(city)
    .then(extractLocationId)
    .then(fetchFiveDayWeather)
    .then(extractFiveDayAverageMinMaxTemperatures)
    .then(displayMinMaxTemperatures)
    .catch(displayError);
