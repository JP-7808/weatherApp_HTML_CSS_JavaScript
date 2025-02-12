const API_KEY = '576b4efd0emsh08fdce5bfd390fbp1a4975jsn7c321e2d6130';
const API_HOST = 'visual-crossing-weather.p.rapidapi.com';

document.getElementById('searchBtn').addEventListener('click', fetchWeather);

async function fetchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert('Please enter a city name');

  const url = `https://${API_HOST}/forecast`;
  const params = new URLSearchParams({
    aggregateHours: '24',
    location: city,
    contentType: 'json',
    unitGroup: 'metric',
    shortColumnNames: '0',
  });

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    const weather = Object.values(data.locations)[0].values[0];

    updateWeatherDetails(city, weather);
  } catch (error) {
    showError();
  }
}

function updateWeatherDetails(city, weather) {
  document.getElementById('location').textContent = city;
  document.getElementById('description').textContent = `Weather: ${weather.conditions}`;
  document.getElementById('temperature').textContent = `Temperature: ${weather.temp}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${weather.wspd} km/h`;

  // Assign the local image based on the weather condition
  document.getElementById('weatherIcon').src = `./icons/${getWeatherIcon(weather.icon)}`;
  document.getElementById('weatherIcon').alt = weather.conditions;

  const weatherDetails = document.getElementById('weatherDetails');
  weatherDetails.classList.remove('hidden');
  document.getElementById('errorMessage').classList.add('hidden');

  setupTemperatureToggle(weather.temp);
}

function setupTemperatureToggle(tempCelsius) {
  const toggleButton = document.getElementById('toggleTemp');
  let isCelsius = true;

  toggleButton.onclick = () => {
    const tempElement = document.getElementById('temperature');
    if (isCelsius) {
      const tempFahrenheit = (tempCelsius * 9) / 5 + 32;
      tempElement.textContent = `Temperature: ${tempFahrenheit.toFixed(1)}°F`;
    } else {
      tempElement.textContent = `Temperature: ${tempCelsius}°C`;
    }
    isCelsius = !isCelsius;
  };
}

function showError() {
  document.getElementById('errorMessage').classList.remove('hidden');
  document.getElementById('weatherDetails').classList.add('hidden');
}

function getWeatherIcon(condition) {
  // Map the weather condition to the appropriate icon file
  const icons = {
    "Clear": "sun.png",
    "cloudy": "cloud.png",
    "fog": "fog.png",
    "rain": "rain.png",
    "snow": "snow.png",
    "thunder": "storm.png",
    "wind": "windy.png",
  };

  // Default icon if condition is not recognized
  return icons[condition] || "cloud.png";
}
