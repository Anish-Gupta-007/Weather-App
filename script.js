const ApiKey = `25982ae4f9d403907185434439e1f7a6`;
const DashBoard = document.querySelector(".additional-info");
const unitSelect = document.getElementById("unit-select");
let selectedUnit = "metric";
console.log(DashBoard);
async function fetchWeatherData(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${selectedUnit}&appid=${ApiKey}`
    );
    if (!response.ok) {
      swal("Invalid City!", "Please Enter a Valid City Name!", "error");
      return;
    }
    const data = await response.json();
    let tempData = data?.main?.temp;

    ThemeChanger(tempData);
    console.log(data);
    updateWeatherData(data);
  } catch (error) {
    console.log(error);
  }
}

const CityElement = document.querySelector(".city");
const TempElement = document.querySelector(".tem");
const WindElement = document.querySelector(".wind-speed");
const humidityElement = document.querySelector(".humadity");
const visibiltyElement = document.querySelector(".visiblity-distance");
const descriptionElement = document.querySelector(".description-text");
const dateElement = document.querySelector(".date");
const descriptionIcnElement = document.querySelector(".description i");
const currentDate = new Date();
const mainBG = document.getElementsByTagName("body")[0];
dateElement.textContent = currentDate.toDateString();

function updateWeatherData(data) {
  CityElement.textContent = data.name;
  TempElement.textContent = `${Math.round(data.main.temp)}°${
    selectedUnit === "metric" ? "C" : "F"
  }`;
  WindElement.textContent = `${data.wind.speed} Km/H ${
    selectedUnit === "metric" ? "Km/H" : "mph"
  }`;
  humidityElement.textContent = `${data.main.humidity} %`;
  visibiltyElement.textContent = `${data.visibility / 1000}Km`;
  descriptionElement.textContent = data.weather[0].description;
  const weatherIIconName = getWeatherIcnName(data.weather[0].main);
  descriptionIcnElement.innerHTML = `<i class="material-icons">${weatherIIconName}</i>`;
}
unitSelect.addEventListener("change", function () {
  selectedUnit = unitSelect.value;
  fetchWeatherData(document.querySelector(".city").textContent);
  ThemeChanger();
});
getLocation();
const ThemeChanger = (temp) => {
  if (temp >= 0 && temp < 15) {
    DashBoard.classList.add("blue");
    mainBG.classList.add("bluebg");
  } else if (temp >= 15 && temp <= 30) {
    DashBoard.classList.add("green");
    mainBG.classList.add("greenbg");
  } else {
    DashBoard.classList.add("red");
    mainBG.classList.add("redbg");
  }
};

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".search-input");
formElement.addEventListener("submit", function (e) {
  e.preventDefault();
  const cityName = inputElement.value;
  if (cityName !== "") {
    fetchWeatherData(cityName);
    inputElement.value = "";
  }
});

function getWeatherIcnName(weatherCondition) {
  const iconmap = {
    Clear: "wb_sunny",
    Clouds: "wb_cloudy",
    Rain: "umbrella",
    Thunderstorm: "flash_on",
    Drizzle: "grain",
    Snow: "ac_unit",
    Mist: "cloud",
    Smoke: "cloud",
    Haze: "cloud",
    Fog: "cloud",
  };
  return iconmap[weatherCondition] || "help";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("city").innerText =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "25982ae4f9d403907185434439e1f7a6";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let city = data.name;
      console.log(city);
      fetchWeatherData(city);
    })
    .catch((error) => {
      console.log(error);
    });
}

function showError(error) {
  document.getElementById("city").innerText = "Error getting location.";
}
