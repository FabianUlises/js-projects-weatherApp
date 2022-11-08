const weatherAPIKey = '6f0ddb9b2341d8c05fa0f41837915cc1';
const weatherBaseEndpoint = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${weatherAPIKey}`;
const getWeatherByCityName = async (city) => {
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    const weather = await response.json();
    console.log(weather);
};
getWeatherByCityName('New York');