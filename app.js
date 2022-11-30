// Selectors
const searchInput = document.querySelector('.weather__search');
const city = document.querySelector('.weather__city');
const day = document.querySelector('.weather__day');
const humidity = document.querySelector('.weather__indicator--humidity');
const wind = document.querySelector('.weather__indicator--wind>.value');
const pressure = document.querySelector('.weather__indicator--pressure>.value');
const image = document.querySelector('.weather__img');
const temperature = document.querySelector('.weather__temperature>.value');
const weatherAPIKey = '6f0ddb9b2341d8c05fa0f41837915cc1';
const weatherBaseEndpoint = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${weatherAPIKey}`;
const forecastBaseEndpoint = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${weatherAPIKey}`;
const foreCastBlock = document.querySelector('.weather__forecast');
const cityBase =  'https://api.teleport.org/api/cities/?search=';
const citySuggestionsCtn = document.querySelector('#citysuggestions');
// Array for weather images
let weatherImages = [
    {
        url: 'images/clear-sky.png',
        ids: [800]
    },
    {
        url: 'images/broken-clouds.png',
        ids: [803, 804]
    },
    {
        url: 'images/few-clouds.png',
        ids: [801]
    },
    {
        url: 'images/mist.png',
        ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
    },
    {
        url: 'images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },
    {
        url: 'images/scattered-clouds.png',
        ids: [802]
    },
    {
        url: 'images/shower-rain.png',
        ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
    },
    {
        url: 'images/snow.png',
        ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url: 'images/thnderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    }
]
// Function to search by city
const weatherForCity =  async(city) => {
    let weather = await getWeatherByCityName(city);
    if(!weather) {
        return;
    }
    let cityId = weather.id;
    updateCurrentWeather(weather);
    let forecast = await getForecastByCityId(cityId);
    updateForecast(forecast);
    // console.log(foreCastBlock, forecast)
}
// Functino to load default city on page
const init = () => {
    weatherForCity('mexico city').then(() => document.body.style.filter = 'blur(0)');
}
// Function to get day of the week
const dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'});
};
// Function to get searched data back
const getWeatherByCityName = async (cityString) => {
    let city;
    if(cityString.includes(',')) {
        city = cityString.substring(0, cityString.indexOf(',')) + cityString.substring(cityString.lastIndexOf(','));
    } else {
        city = cityString;
    }
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    if(response.status !== 200) {
        alert('City not found!');
        return;
    }
    const weather = await response.json();
    return weather;
};
// Functin to Getting city forecast 
const getForecastByCityId = async (id) => {
    let endpoint = `${forecastBaseEndpoint}&id=${id}`;
    let result = await fetch(endpoint);
    let forecast = await result.json();
    let forecastList = forecast.list;
    // Adding forecast to array
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
// Function to update forecast ondom
const updateForecast = (forecast) => {
    foreCastBlock.innerHTML = '';
    // Inserting html to dom
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
    temperature.textContent = data.main.temp > 0 ? + Math.round(data.main.temp) : Math.round(data.main.temp);
    let imgID = data.weather[0].id;
    // Updating header weather img on dom
    weatherImages.forEach(img => {
        console.log(image.src)
        if(img.ids.includes(imgID)) {
            image.src = img.url;
        }
    })

};
// Eventlistener to search to city
searchInput.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13) {
        weatherForCity(searchInput.value);
    }
});
// Autofill search with valid city
searchInput.addEventListener('input', async() => {
    let endPoint = cityBase + searchInput.value;
    let result = await (await fetch(endPoint)).json();
    citySuggestionsCtn.innerHTML = '';
    let cities = result._embedded['city:search-results'];
    let length = cities.length > 5 ? 5 : cities.length;
    for(let i = 0; i < length; i++) {
        let option = document.createElement('option')
        option.value = cities[i].matching_full_name;
        citySuggestionsCtn.appendChild(option);
    }
    console.log(result);
});
init();