const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const suggestions = document.getElementById('suggestions');
const currentWeather = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const demoAlert = document.getElementById('demoAlert');

// Weather icon mapping
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '🌪️',
    'Fog': '🌫️',
    'Sand': '🌪️',
    'Ash': '💨',
    'Squall': '💨',
    'Tornado': '🌪️'
};

// Initialize
checkAPIStatus();
loadWeather('London');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

cityInput.addEventListener('input', debounce(handleAutocomplete, 300));
locationBtn.addEventListener('click', useGeolocation);

// Search weather for a city
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        loadWeather(city);
        suggestions.classList.remove('active');
    }
}

// Load weather data
async function loadWeather(city) {
    try {
        currentWeather.innerHTML = '<div class="loading">Loading weather...</div>';
        
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            displayWeather(data.data);
            loadForecast(city);
            cityInput.value = data.data.name;
            
            if (data.demo_mode) {
                showDemoAlert();
            }
        } else {
            currentWeather.innerHTML = `<div class="error">❌ ${data.message}</div>`;
        }
    } catch (error) {
        currentWeather.innerHTML = `<div class="error">❌ Error loading weather: ${error.message}</div>`;
    }
}

// Display current weather
function displayWeather(data) {
    const weather = data.weather[0];
    const main = data.main;
    const wind = data.wind;
    
    const icon = weatherIcons[weather.main] || '🌤️';
    
    currentWeather.innerHTML = `
        <div class="weather-main">
            <div>
                <div class="city-name">${data.name}, ${data.sys?.country || ''}</div>
                <div class="weather-description">${weather.description}</div>
            </div>
            <div class="weather-icon">${icon}</div>
        </div>
        <div class="temperature">${Math.round(main.temp)}°C</div>
        <div style="color: #666; font-size: 16px;">Feels like ${Math.round(main.feels_like)}°C</div>
    `;
    
    // Update details
    document.getElementById('humidity').textContent = main.humidity + '%';
    document.getElementById('windSpeed').textContent = wind.speed + ' m/s';
    document.getElementById('feelsLike').textContent = Math.round(main.feels_like) + '°C';
    document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1) + ' km';
    document.getElementById('minTemp').textContent = Math.round(main.temp_min) + '°C';
    document.getElementById('maxTemp').textContent = Math.round(main.temp_max) + '°C';
    document.getElementById('clouds').textContent = data.clouds.all + '%';
    document.getElementById('pressure').textContent = main.pressure + ' hPa';
}

// Load forecast
async function loadForecast(city) {
    try {
        forecastDiv.innerHTML = '<div class="loading">Loading forecast...</div>';
        
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            displayForecast(data.data.list);
        }
    } catch (error) {
        forecastDiv.innerHTML = `<div class="error">❌ Error loading forecast</div>`;
    }
}

// Display 5-day forecast
function displayForecast(forecastList) {
    // Get one forecast per day (every 8 entries = 24 hours)
    const dailyForecasts = [];
    let lastDate = null;
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (date !== lastDate) {
            dailyForecasts.push(forecast);
            lastDate = date;
        }
    });
    
    // Display first 5 days
    forecastDiv.innerHTML = dailyForecasts.slice(0, 5).map(forecast => {
        const weather = forecast.weather[0];
        const date = new Date(forecast.dt * 1000);
        const icon = weatherIcons[weather.main] || '🌤️';
        
        return `
            <div class="forecast-card">
                <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-description">${weather.description}</div>
                <div class="forecast-wind">💨 ${forecast.wind.speed} m/s</div>
            </div>
        `;
    }).join('');
}

// Autocomplete
async function handleAutocomplete(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestions.classList.remove('active');
        return;
    }
    
    try {
        const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.suggestions.length > 0) {
            suggestions.innerHTML = data.suggestions.map(city => 
                `<div class="suggestion-item">${city}</div>`
            ).join('');
            suggestions.classList.add('active');
            
            // Add click handlers
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    cityInput.value = item.textContent;
                    suggestions.classList.remove('active');
                    searchWeather();
                });
            });
        } else {
            suggestions.classList.remove('active');
        }
    } catch (error) {
        console.error('Autocomplete error:', error);
    }
}

// Use geolocation
function useGeolocation() {
    if ('geolocation' in navigator) {
        locationBtn.textContent = '📍 Getting location...';
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                try {
                    // Use reverse geocoding via OpenWeatherMap API
                    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        displayWeather(data.data);
                        loadForecast(data.data.name);
                        cityInput.value = data.data.name;
                    }
                } catch (error) {
                    alert('Could not fetch weather for your location');
                }
                locationBtn.textContent = '📍 Use My Location';
            },
            (error) => {
                alert('Error getting location: ' + error.message);
                locationBtn.textContent = '📍 Use My Location';
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Check API status
async function checkAPIStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.demo_mode) {
            showDemoAlert();
        }
    } catch (error) {
        console.error('Status check error:', error);
    }
}

// Show demo alert
function showDemoAlert() {
    demoAlert.style.display = 'block';
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== cityInput) {
        suggestions.classList.remove('active');
    }
});