const input = document.getElementById('input');
const btn = document.getElementById('search');
const weatherCards = document.querySelector('.weather-cards');
const currentWeather = document.querySelector('.current-weather');
const userLocation = document.getElementById('userLoc');
const API_KEY = '6f51f8e62bc866fe0e156acb51e3d7d5';


const createWeatherCard = (weatherItem, name, index) => {

    if (index === 0) {
        return `
       <div class="deatils">
       <h2>${name} (${weatherItem.dt_txt.split(" ")[0]})</h2>
       <h4>Tempreature: ${(weatherItem.main.temp - 273.15).toFixed(2)}&#176;c</h4>
       <h4>Wind :${weatherItem.wind.speed}  M/S</h4>
       <h4>Humid : ${weatherItem.main.humidity}%</h4>
     </div>
     <div class="icon">
     <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="" />
       <h4>${weatherItem.weather[0].description}</h4>
     </div>
       `
    }
    else {
        return `
        <li class="card">
        <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="" />
        <h4>Tempreature:${(weatherItem.main.temp - 273.15).toFixed(2)} &#176;c</h4>
        <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
        <h4>Humid : ${weatherItem.main.humidity}%</h4>
      </li>`;
    }

}

const getWeather = (name, lat, lon) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const getWeatherData = async () => {

        try {
            const res = await fetch(weatherUrl)
            const data = await res.json()
            const uniqueforeCasteDate = [];
            // to filter date
            const fiveDays = data.list.filter(forecast => {
                const foreCasteDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueforeCasteDate.includes(foreCasteDate)) {
                    return uniqueforeCasteDate.push(foreCasteDate);
                }

            });
            // console.log(fiveDays);
            input.value = '';
            weatherCards.innerHTML = '';
            currentWeather.innerHTML = '';
            fiveDays.forEach((weatherItem, index) => {

                if (index === 0) {
                    currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, name, index));
                }
                else {
                    weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, name, index));
                }


            })
        } catch (error) {
            alert("An error occured try again later!");
        }

    }
    getWeatherData()
}



const getCityCords = () => {
    const cityName = input.value.trim();
    if (!cityName) return;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    const getData = async () => {
        try {
            const res = await fetch(url)
            const data = await res.json()
            // console.log(data);
            const { name, lat, lon } = data[0]; //destructure
            getWeather(name, lat, lon);
        } catch (error) {
            alert("City Not Found ! Enter Correct Name");
        }
    }

    getData();
}

const userCordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const getUserLocationUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

            const getData = async () => {
                try {
                    const res = await fetch(getUserLocationUrl)
                    const data = await res.json()
                    const { name } = data[0]; //destructure
                    getWeather(name, latitude, longitude);
                    // console.log(data);
                } catch (error) {
                    alert("An error occured while fetching the city!");
                }

            }
            getData();
        },
        error => {
            if (error.PERMISSION_DENIED) {
                alert('Please Give Permission To Access!')
            }
        }
    )
}


btn.addEventListener('click', getCityCords);
userLocation.addEventListener('click', userCordinates)
input.addEventListener('keyup', e => e.key === 'Enter' && getCityCords());
