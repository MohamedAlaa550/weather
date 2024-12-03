let weatherData = {};
const inputSearch = document.getElementById("inputSearch");

getUserLocation();

async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await weatherInfoByCoords(lat, lon);
        }, async () => {
            await weatherInfoByName("Cairo");
        });
    } else {
        await weatherInfoByName("Cairo");
    }
}

async function weatherInfoByName(location = "Cairo") {
    try {
        let weather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e9667641f0bd403ca04185808240112&q=${location}&days=3`);
        weatherData = await weather.json();
        displayData();
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
}

async function weatherInfoByCoords(lat, lon) {
    try {
        let weather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e9667641f0bd403ca04185808240112&q=${lat},${lon}&days=3`);
        weatherData = await weather.json();
        displayData();
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
}

function displayData() {
    const today = new Date();
    const dayNames = [
        getDayName(today),
        getDayName(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
        getDayName(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
    ];

    const formattedDate = formatDate(today);

    let cartona = `
      <div class="col-lg-4">
          <div class="card first-card h-100">
              <div class="card-header d-flex justify-content-between">
                  <span>${dayNames[0]}</span>
                  <span>${formattedDate}</span>
              </div>
              <div class="card-body">
                  <h2 class="country fs-5 my-3">${weatherData.location.name}</h2>
                  <h2 class="tempreture">${weatherData.current.temp_c}<sup>o</sup>C</h2>
                  <img src="${weatherData.current.condition.icon}" class="icon-status" alt="">
                  <h3 class="status fs-6">${weatherData.current.condition.text}</h3>
                  <div class="icons">
                      <span><i class="fa-solid fa-umbrella"></i>${weatherData.current.humidity}%</span>
                      <span><i class="fa-solid fa-wind"></i>${weatherData.current.wind_kph}km/h</span>
                      <span><i class="fa-regular fa-compass"></i>${weatherData.current.wind_dir}</span>
                  </div>
              </div>
          </div>
      </div>
      <div class="col-lg-4">
          <div class="card middle-card text-center h-100">
              <div class="card-header">
                  <span>${dayNames[1]}</span>
              </div>
              <div class="card-body">
                  <img src="${weatherData.forecast.forecastday[1].day.condition.icon}" alt="">
                  <h2 class="high-tempreture">${weatherData.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>C</h2>
                  <h3 class="low-tempreture">${weatherData.forecast.forecastday[1].day.mintemp_c}<sup>o</sup>C</h3>
                  <h3 class="status fs-6">${weatherData.forecast.forecastday[1].day.condition.text}</h3>
              </div>
          </div>
      </div>
      <div class="col-lg-4">
          <div class="card last-card text-center h-100">
              <div class="card-header">
                  <span>${dayNames[2]}</span>
              </div>
              <div class="card-body">
                  <img src="${weatherData.forecast.forecastday[2].day.condition.icon}" alt="">
                  <h2 class="high-tempreture">${weatherData.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>C</h2>
                  <h3 class="low-tempreture">${weatherData.forecast.forecastday[2].day.mintemp_c}<sup>o</sup>C</h3>
                  <h3 class="status fs-6">${weatherData.forecast.forecastday[2].day.condition.text}</h3>
              </div>
          </div>
      </div>`;
    document.getElementById("rowData").innerHTML = cartona;
}

function getDayName(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function formatDate(date) {
    const day = date.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
}

inputSearch.addEventListener("input", function () {
    const term = inputSearch.value;
    weatherInfoByName(term);
});
