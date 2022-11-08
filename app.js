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
// Function to get searched data back
const getWeatherByCityName = async (city) => {
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    const weather = await response.json();
    return weather;
};
const dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'});
}
// Function to update dom
const updateCurrentWeather = (data) => {
    city.textContent = `${data.name}, ${data.sys.country}`;
    day.textContent = dayOfWeek();
};
// Eventlistener to search to city
searchInput.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInput.value);
        updateCurrentWeather(weather);
    }
});