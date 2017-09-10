const UNIT_DEGREE = '°';
const LOCATION_URL = 'https://weathersync.herokuapp.com/ip';

//formatting condition description
function conditionFormatted(conditions) {
  return conditions.charAt(0).toUpperCase() + conditions.slice(1)
}

//convert temps from K to F and round
function tempFormatted(temp) {
  return Math.round(temp * (9/5) - 459.67);
}

//making request to location API
async function myLocation(url) {
  let myLocation;
  try {
    myLocation = await fetch(url)
    .then(res => res.json());
    return myLocation;
  } catch(e) {
    console.log("There was a problem retrieving your location informaiton. Please try again later.", e);
  }
}

//getting weather for your location
async function myWeather(myLocation) {
  let myWeather;
  try {
    myWeather = await fetch(`https://weathersync.herokuapp.com/weather/${myLocation.location.latitude},${myLocation.location.longitude}`)
    .then(res=> res.json());
    return myWeather;
  } catch(e) {
    console.log("There was a problem retrieving your weather informaiton. Please try again later.", e);
  }
}

//displaying information on page
async function main() {

  const locationResults = await myLocation(LOCATION_URL);
  const weather = await myWeather(locationResults);

  //captializing first letter of current conditions description
  const conditionCaptialized = conditionFormatted(weather.weather[0].description);

  //display weather icon
  const iconHash = weather.weather[0].icon;
  document.getElementById("icon").src = `http://openweathermap.org/img/w/${iconHash}.png`;

  //convert temps to farinheight and round
  const currentTemp = tempFormatted(weather.main.temp);
  const dailyHigh = tempFormatted(weather.main.temp_max);
  const dailyLow = tempFormatted(weather.main.temp_min);

  //display temps
  document.getElementById("temp").innerHTML = `${currentTemp} ${UNIT_DEGREE}`;
  document.getElementById("tempMax").innerHTML = `${dailyHigh} ${UNIT_DEGREE}`;
  document.getElementById("tempMin").innerHTML = `${dailyLow} ${UNIT_DEGREE}`;

  //displaying location name
  document.getElementById("location").innerHTML = `${weather.name}, ${weather.sys.country}`;

  //displaying abbreviated condition and condition description
  document.getElementById("conditions").innerHTML = weather.weather[0].main;
  document.getElementById("conditions-long").innerHTML =`${conditionCaptialized}. High of ${dailyHigh}F. Humidity at ${weather.main.humidity}%. Winds speeds of ${weather.wind.speed} mph.`;
}

main();
