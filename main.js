const ApiKey = `25982ae4f9d403907185434439e1f7a6`;
const DashBoard = document.querySelector(".additional-info");
const unitSelect = document.getElementById("unit-select");
const mainBG = document.body;

let selectedUnit = "metric";

const CityElement = document.querySelector(".city");
const TempElement = document.querySelector(".tem");
const WindElement = document.querySelector(".wind-speed");
const HumidityElement = document.querySelector(".humadity");
const VisibilityElement = document.querySelector(".visiblity-distance");
const DescriptionElement = document.querySelector(".description-text");
const DescriptionIconElement = document.querySelector(".description i");
const DateElement = document.querySelector(".date");

DateElement.textContent = new Date().toDateString();

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
    updateWeatherData(data);
    updateTheme(data.main.temp);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function updateWeatherData(data) {
  const tempUnit = selectedUnit === "metric" ? "°C" : "°F";
  const windUnit = selectedUnit === "metric" ? "Km/H" : "mph";

  CityElement.textContent = data.name;
  TempElement.textContent = `${Math.round(data.main.temp)}${tempUnit}`;
  WindElement.textContent = `${data.wind.speed} ${windUnit}`;
  HumidityElement.textContent = `${data.main.humidity} %`;
  VisibilityElement.textContent = `${data.visibility / 1000} Km`;
  DescriptionElement.textContent = data.weather[0].description;

  const weatherIconName = getWeatherIconName(data.weather[0].main);
  DescriptionIconElement.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}

function updateTheme(temp) {
  DashBoard.classList.remove(
    "blue",
    "green",
    "red",
    "dark-blue",
    "orange",
    "dark-red"
  );
  mainBG.classList.remove(
    "bluebg",
    "greenbg",
    "redbg",
    "dark-blue",
    "orange",
    "dark-red"
  );

  if (selectedUnit === "metric") {
    if (temp < 15) {
      DashBoard.classList.add("blue");
      mainBG.classList.add("bluebg");
    } else if (temp <= 30) {
      DashBoard.classList.add("green");
      mainBG.classList.add("greenbg");
    } else {
      DashBoard.classList.add("red");
      mainBG.classList.add("redbg");
    }
  } else {
    if (temp < 59) {
      DashBoard.classList.add("dark-blue");
      mainBG.classList.add("dark-blue");
    } else if (temp <= 86) {
      DashBoard.classList.add("orange");
      mainBG.classList.add("orange");
    } else {
      DashBoard.classList.add("dark-red");
      mainBG.classList.add("dark-red");
    }
  }
}

function getWeatherIconName(weatherCondition) {
  const iconMap = {
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
  return iconMap[weatherCondition] || "help";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    CityElement.textContent = "Geolocation not supported";
  }
}

function showPosition(position) {
  const { latitude, longitude } = position.coords;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${selectedUnit}&appid=${ApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      fetchWeatherData(data.name);
    })
    .catch((error) => console.error("Error getting location:", error));
}

function showError() {
  CityElement.textContent = "Error getting location.";
}

unitSelect.addEventListener("change", function () {
  selectedUnit = unitSelect.value;
  fetchWeatherData(CityElement.textContent);
});

document.querySelector(".search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const cityName = document.querySelector(".search-input").value.trim();
  if (cityName) {
    fetchWeatherData(cityName);
    document.querySelector(".search-input").value = "";
  }
});

getLocation();
