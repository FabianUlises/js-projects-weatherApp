// Selectors
const searchInput = document.querySelector('.weather__search');
const city = document.querySelector('.weather__city');
const day = document.querySelector('.weather__day');
const humidity = document.querySelector('.weather__indicator--humidity');
const wind = document.querySelector('.weather__indicator--wind>.value');
const pressure = document.querySelector('.weather__indicator--pressure>.value');
const image = document.querySelector('.weather__image');
const temperature = document.querySelector('.weather__temperature>.value');
const weatherAPIKey = '6f0ddb9b2341d8c05fa0f41837915cc1';
const weatherBaseEndpoint = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${weatherAPIKey}`;
const forecastBaseEndpoint = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${weatherAPIKey}`;
const foreCastBlock = document.querySelector('.weather__forecast');
const dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'});
};
// Function to get searched data back
const getWeatherByCityName = async (city) => {
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    const weather = await response.json();
    return weather;
};
let getForecastByCityId = async (id) => {
    let endpoint = `${forecastBaseEndpoint}&id=${id}`;
    let result = await fetch(endpoint);
    let forecast = await result.json();
    let forecastList = forecast.list;
    let daily = [];
    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', 'T'));;
        let hours = date.getHours();
        if(hours === 12) {
            daily.push(day);
        }
    })
    return daily;

};
const updateForecast = (forecast) => {
    foreCastBlock.innerHTML = '';
    forecast.forEach(day => {
        let iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        let dayName = dayOfWeek(day.dt * 1000);
        let temp = day.main.temp > 0 ? '+' + Math.round(day.main.temp) : Math.round(day.main.temp);
        let forecastItem = `
            <article class="weather__forecast__item">
                <!-- Forecast image -->
                <img class="weather__forecast__icon" src='${iconUrl}' alt=${day.weather[0].description}>
                <!-- Forecast day -->
                <h3 class="weather__forecast__day">${dayName}</h3>
                <!-- Forecast temperature -->
                <p class="weather__forecast__temperature"><span class='value'>${temp}</span>&deg;C</p>
            </article>
        `
        foreCastBlock.insertAdjacentHTML('beforeend', forecastItem);
    });
};

// Function to update dom
const updateCurrentWeather = (data) => {
    city.textContent = `${data.name}, ${data.sys.country}`;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    temperature.textContent = data.main.temp > 0 ? + Math.round(data.main.temp) : Math.round(data.main.temp);
    let windDirection;
    let deg = data.wind.deg;
    if(deg > 45 && deg <=135) {
        windDirection = 'East';
    } else if(deg > 135 && deg <= 225) {
        windDirection = 'South';
    } else if(deg > 225 && deg <= 315) {
        windDirection = 'West';
    } else {
        windDirection = 'North';
    }
    wind.textContent = `${windDirection}, ${data.wind.speed}`;

};
// Eventlistener to search to city
searchInput.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInput.value);
        let cityId = weather.id;
        updateCurrentWeather(weather);
        let forecast = await getForecastByCityId(cityId);
        updateForecast(forecast);
        // console.log(foreCastBlock, forecast)
    }
});