let cache = {}; // Cache last searched city

function getWeather() {
    const city = document.getElementById("city").value.trim();
    const status = document.getElementById("status");
    const weatherDiv = document.getElementById("weather");

    if (!city) {
        status.textContent = "Please enter a city";
        status.className = "error";
        return;
    }

    // Cache check - case insensitive
    if (cache[city.toLowerCase()]) {
        displayWeather(cache[city.toLowerCase()], city);
        return;
    }

    status.textContent = "Loading...";
    status.className = "loading";
    weatherDiv.innerHTML = "";

    // Step 1: Geocode city name to lat/lon
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(geoData => {
            if (!geoData.results || !geoData.results[0]) {
                throw new Error("City not found");
            }

            const { latitude, longitude } = geoData.results[0];

            // Step 2: Get weather data
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&precipitation_unit=mm`;
            
            return fetch(weatherUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Weather data unavailable");
                    return res.json();
                })
                .then(weatherData => {
                    // Format data for displayWeather
                    const weatherInfo = {
                        name: geoData.results[0].name,
                        country: geoData.results[0].country || '',
                        temp: Math.round(weatherData.current_weather.temperature),
                        humidity: 'N/A', // Open-Meteo basic doesn't include humidity
                        condition: getWeatherDescription(weatherData.current_weather.weathercode),
                        windSpeed: weatherData.current_weather.windspeed
                    };

                    // Cache the result
                    cache[city.toLowerCase()] = weatherInfo;
                    displayWeather(weatherInfo, city);
                    status.textContent = "";
                    status.className = "";
                });
        })
        .catch(error => {
            console.error('Weather fetch error:', error);
            status.textContent = error.message || "Invalid city or network error";
            status.className = "error";
        });
}

function displayWeather(data, city) {
    const weatherDiv = document.getElementById("weather");
    weatherDiv.innerHTML = `
        <h3>${data.name}${data.country ? ', ' + data.country : ''}</h3>
        <p><i class="fas fa-thermometer-half"></i> Temperature: ${data.temp}°C</p>
        <p><i class="fas fa-tint"></i> Humidity: ${data.humidity}</p>
        <p><i class="fas fa-cloud-sun"></i> Condition: ${data.condition}</p>
        ${data.windSpeed ? `<p><i class="fas fa-wind"></i> Wind: ${data.windSpeed} km/h</p>` : ''}
        <small>Cached for: ${city}</small>
    `;
}

// Convert Open-Meteo weathercode to description
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };
    return weatherCodes[code] || "Unknown weather";
}
