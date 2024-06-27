const h1 = document.querySelector("span");
const day = document.querySelector(".date");
const time = document.querySelector(".time");
const add = document.querySelector("button");
const main = document.querySelector("main");
const icon = document.querySelector(".icon");
const hourly = document.querySelector(".hourly");
const daily = document.querySelector(".daily");
const places = document.querySelector(".places");
const input = document.querySelector("input");
const refresh = document.querySelector(".adjust");
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const weatherCode = [
  {
    0: '<i class="fa-regular fa-sun"></i>',
  },
  {
    1: '<i class="fa-regular fa-sun"></i>',
  },
  {
    2: '<i class="fa-solid fa-cloud-sun"></i>',
  },
  {
    3: '<i class="fa-solid fa-cloud"></i>',
  },
  {
    61: '<i class="fa-solid fa-cloud-rain"></i>',
  },

  {
    63: '<i class="fa-solid fa-cloud-rain"></i>',
  },
  {
    65: '<i class="fa-solid fa-cloud-rain"></i>',
  },
  {
    71: '<i class="fa-solid fa-cloud-meatball"></i>',
  },
  {
    73: '<i class="fa-solid fa-cloud-meatball"></i>',
  },
  {
    75: '<i class="fa-solid fa-cloud-meatball"></i>',
  },
  {
    80: '<i class="fa-solid fa-cloud-rain"></i>',
  },
  {
    81: '<i class="fa-solid fa-cloud-rain"></i>',
  },
  {
    82: '<i class="fa-solid fa-cloud-rain"></i>',
  },
];

let requestedData;
function request() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.open-meteo.com/v1/forecast?latitude=41.6941&longitude=44.8337&current=apparent_temperature,weather_code&minutely_15=apparent_temperature&hourly=apparent_temperature&daily=weather_code,apparent_temperature_max,apparent_temperature_min&timezone=auto&past_minutely_15=1&forecast_minutely_15=4`
  );
  xhr.onload = () => {
    requestedData = JSON.parse(xhr.response);
    console.log(requestedData);
    h1.innerHTML = requestedData.current.apparent_temperature;

    icons(icon, requestedData.current);
    for (let i = 0; i < 24; i++) {
      const temp = requestedData.hourly.apparent_temperature[i];
      const time = requestedData.hourly.time[i];
      const date = new Date(time);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${hour < 10 ? "0" : ""}${hour}:${
        minutes < 10 ? "0" : ""
      }${minutes}</h3>
        <h2>${temp}°C</h2>
        `;
      hourly.appendChild(div);
    }
    for (let i = 0; i < 7; i++) {
      const max = requestedData.daily.apparent_temperature_max[i];
      const min = requestedData.daily.apparent_temperature_min[i];
      const time = requestedData.daily.time[i];
      const date = new Date(time);
      const day = date.getDay();
      const future = daysOfWeek[day];
      const div = document.createElement("div");
      const code = requestedData.daily.weather_code[i];
      let icon = "";
      weatherCode.forEach((obj) => {
        const key = Object.keys(obj)[0];
        if (parseInt(key) === code) {
          icon = obj[key];
        }
      });

      div.innerHTML = `
        <h2>${future}</h2>
        <h3>${max}°C - ${min}°C</h3>
        <h2>${icon}</h2>
        `;

      daily.appendChild(div);
    }
  };
  xhr.send();
}
request();
let num = 0;
function newPlaces() {
  const value = input.value;
  const xhr1 = new XMLHttpRequest();
  xhr1.open(
    "GET",
    `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
  );
  xhr1.onload = () => {
    const response = JSON.parse(xhr1.response);
    console.log(response);
    const longitude = response[0].lon;
    const latitude = response[0].lat;
    const xhr2 = new XMLHttpRequest();
    xhr2.open(
      "GET",
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,is_day,weather_code&minutely_15=apparent_temperature&hourly=apparent_temperature,weather_code,is_day&daily=weather_code,apparent_temperature_max,apparent_temperature_min&timezone=auto&past_minutely_15=1&forecast_days=1&forecast_hours=1&forecast_minutely_15=4`
    );
    xhr2.onload = () => {
      const response = JSON.parse(xhr2.response);

      const temp = response.current.apparent_temperature;

      const time = response.current.time;
      const date = new Date(time);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDay();
      const future = daysOfWeek[day];
      const div = document.createElement("div");
      div.innerHTML = `<div style="display: flex"><h1>${temp}°C</h1><h2 class="day${num}"></h2></div>
      <div> <h2>${value.toUpperCase()}</h2>
      <h3>${future}</h3>
      <h3 class="newTime">${hour < 10 ? "0" : ""}${hour}:${
        minutes < 10 ? "0" : ""
      }${minutes} <span style="font-size: 1rem">(time is rounded to quarters)</span></h3></div>`;

      places.append(div);
      const newIcon = document.querySelector(`.day${num}`);

      icons(newIcon, response.current);
      num++;
      input.value = "";
      refresh.style.visibility = "visible";
    };
    xhr2.send();
  };
  xhr1.send();
}

add.addEventListener("click", newPlaces);

const localTime = new Date();
const date = localTime.getDay();
day.innerHTML = daysOfWeek[date];
setInterval(() => {
  const localTime = new Date();
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes();
  time.innerHTML = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}, 1000);
function icons(where, when) {
  if (when.weather_code === 0 || when.weather_code === 1) {
    where.innerHTML = '<i class="fa-regular fa-sun"></i>';
  } else if (when.weather_code === 2) {
    where.innerHTML = '<i class="fa-solid fa-cloud-sun"></i>';
  } else if (when.weather_code === 3) {
    where.innerHTML = '<i class="fa-solid fa-cloud"></i>';
  } else if (
    when.weather_code === 61 ||
    when.weather_code === 63 ||
    when.weather_code === 65
  ) {
    where.innerHTML = '<i class="fa-solid fa-cloud-rain"></i>';
  } else if (
    when.weather_code === 71 ||
    when.weather_code === 73 ||
    when.weather_code === 75
  ) {
    where.innerHTML = '<i class="fa-solid fa-cloud-meatball"></i>';
  }
}
