const argv = require('yargs').argv;
const axios = require('axios');

const {city} = argv;

const displayError = error => {
    console.error(`Sorry, there was a problem fetching the weather for ${city}`);
    console.error(error);
};

const displayMinMaxTemperatures = ({min, max}) => {
    console.log(`The average five day forecast temperatures for ${city} are
  Minimum: ${min} degrees C
  Maximum: ${max} degrees C`);
};

async function fetchLocationDetails(city) {
    try {
        const response = await axios.get(`https://www.metaweather.com/api/location/search/?query=${city}`);
        return response.data[0];
    } catch (error) {
        displayError(error);
    }
}

fetchLocationDetails(city)
    .then(extractLocationId => extractLocationId.woeid)
    .then(async fetchFiveDayWeather => {
    let locationData = await axios.get(`https://www.metaweather.com/api/location/${fetchFiveDayWeather}`)
//     console.log(locationData.data.consolidated_weather);
    return locationData.data.consolidated_weather;
    })
    .then(extractFiveDayAverageMinMaxTemperatures => {
//         console.log(extractFiveDayAverageMinMaxTemperatures);
        minTempTotal = extractFiveDayAverageMinMaxTemperatures.reduce((tot, weatherDay) => tot + weatherDay.min_temp, 0)
        maxTempTotal = extractFiveDayAverageMinMaxTemperatures.reduce((tot, weatherDay) => tot + weatherDay.max_temp, 0)
        return {
            avgMinTemp: (minTempTotal / extractFiveDayAverageMinMaxTemperatures.length).toFixed(2),
            avgMaxTemp: (maxTempTotal / extractFiveDayAverageMinMaxTemperatures.length).toFixed(2)
        }
    })
    .then(displayMinMaxTemperatures => {
        console.log(`Average minimum temperature in the next five days for ${city}:\n${displayMinMaxTemperatures.avgMinTemp}°C`)
        console.log(`Average maximum temperature in the next five days for ${city}:\n${displayMinMaxTemperatures.avgMaxTemp}°C`)
    })
    .catch(displayError);
