const dateObj = new Date();

const getDayName = (dayType, dateVal = dateObj) => dateVal.toLocaleDateString('en-US', {weekday: dayType})


function fetchWeatherData(location) {
  const apiKey = "476a288f4a5e4a5fa53185734242005";
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5`;


  const currentDay = getDayName('long');
  const fullDateStr = dateObj.toLocaleDateString('en-US',{day: "numeric", month: "short", year: "numeric"});
  document.querySelector(".date-day").textContent = fullDateStr;
  document.querySelector(".date-dayname").textContent = currentDay;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      document.querySelector('.location').textContent = data.location.name + ', ' + data.location.country;
      document.querySelector('.weather-temp').textContent = data.current.temp_c + '°C';
      document.querySelector('.weather-desc').textContent = data.current.condition.text;
      document.querySelector(".wind .value").textContent = `${data.current.wind_kph} km/h`;
      document.querySelector(".humidity .value").textContent = `${data.current.humidity} %`;
      document.querySelector(".precipitation .value").textContent = `${data.current.precip_in} in`;
      console.log(data);
      if(data.current.is_day){
        document.querySelector(".weather-side").classList.replace("night", "day")
      }else{
        document.querySelector(".weather-side").classList.replace("day", "night")
      }

      updateForecastData(data.forecast)
    })
    .catch(error => {
      console.log('Error fetching weather data:', error);
    });
}

function updateForecastData(forecastData){
  const weekContainer = document.querySelector(".week-list");
  weekContainer.innerHTML = "";
  forecastData.forecastday.forEach(dayObj => {
    const currentDate = new Date(dayObj.date)
    if(currentDate.toDateString() !== dateObj.toDateString()){
      const liEl = document.createElement("li");
      liEl.innerHTML = `
        <img class="day-icon" src="https:${dayObj.day.condition.icon}" alt="${dayObj.day.condition.text}">
        <span class="day-name">${getDayName('short', currentDate)}</span><span class="day-temp">${dayObj.day.maxtemp_c}°C</span>
      `
      weekContainer.appendChild(liEl)
    }
  });
  weekContainer.insertAdjacentHTML('beforeend', `<div class="clear"></div>`)
}

document.querySelector('.location-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchLocation = document.getElementById('search-input').value;
  if(searchLocation){
    fetchWeatherData(searchLocation);
  }
});

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const location = `${latitude},${longitude}`;
  fetchWeatherData(location);
}, error => {
  console.log('Error getting location:', error);
});
