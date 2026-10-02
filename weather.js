(() => {
  "use strict";

  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const RECENT_KEY = "weather-recent-cities";
  const UNIT_KEY = "weather-unit";
  const DEFAULT_CITY = "Chennai";
  const TIMEOUT_MS = 10000;

  const form = document.querySelector("#weather-form");
  const input = document.querySelector("#city-input");
  const locateBtn = document.querySelector("#locate-btn");
  const statusBox = document.querySelector("#weather-status");
  const output = document.querySelector("#weather-output");
  const recentBox = document.querySelector("#recent-searches");
  const unitButtons = document.querySelectorAll("[data-unit]");
  const forecastList = document.querySelector("#forecast-list");

  if (!form) return;

  // WMO weather codes -> description + emoji
  const WEATHER_CODES = {
    0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
    56: ["Freezing drizzle", "🌧️"], 57: ["Freezing drizzle", "🌧️"],
    61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
    66: ["Freezing rain", "🌧️"], 67: ["Freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"], 77: ["Snow grains", "❄️"],
    80: ["Rain showers", "🌦️"], 81: ["Rain showers", "🌧️"], 82: ["Violent showers", "⛈️"],
    85: ["Snow showers", "🌨️"], 86: ["Snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with hail", "⛈️"]
  };

  let unit = readStorage(UNIT_KEY) === "fahrenheit" ? "fahrenheit" : "celsius";
  let lastPlace = null;
  let requestId = 0;

  // ---------- Storage helpers ----------
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { /* ignore */ }
  }
  function getRecent() {
    try {
      const data = JSON.parse(readStorage(RECENT_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }
  function addRecent(name) {
    const list = [name, ...getRecent().filter(city => city.toLowerCase() !== name.toLowerCase())].slice(0, 5);
    writeStorage(RECENT_KEY, JSON.stringify(list));
    renderRecent();
  }

  // ---------- API layer (async / await + error handling) ----------
  async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("The weather service returned an error (" + response.status + "). Please try again.");
      }
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("The request timed out. Check your connection and try again.");
      if (error instanceof TypeError) throw new Error("Network error. Please check your internet connection.");
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async function geocodeCity(city) {
    const url = GEO_URL + "?name=" + encodeURIComponent(city) + "&count=1&language=en&format=json";
    const data = await fetchJSON(url);
    if (!data.results || data.results.length === 0) {
      throw new Error("City \"" + city + "\" was not found. Check the spelling and try again.");
    }
    const place = data.results[0];
    return { name: place.name, region: place.admin1, country: place.country, latitude: place.latitude, longitude: place.longitude };
  }

  async function fetchWeather(place) {
    const params = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,pressure_msl,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit: unit,
      wind_speed_unit: "kmh",
      timezone: "auto",
      forecast_days: "5"
    });
    return fetchJSON(FORECAST_URL + "?" + params.toString());
  }

  async function loadPlace(place) {
    const id = ++requestId;
    setStatus("Loading weather for " + place.name + "…", "loading");
    try {
      const data = await fetchWeather(place);
      if (id !== requestId) return; // a newer request replaced this one
      lastPlace = place;
      renderWeather(place, data);
      addRecent(place.name);
      setStatus("");
    } catch (error) {
      if (id !== requestId) return;
      setStatus(error.message, "error");
    }
  }

  async function searchCity(city) {
    const name = city.trim();
    if (!name) {
      setStatus("Please enter a city name.", "error");
      input.focus();
      return;
    }
    const id = requestId + 1;
    setStatus("Searching for " + name + "…", "loading");
    try {
      const place = await geocodeCity(name);
      if (id <= requestId) return;
      await loadPlace(place);
    } catch (error) {
      setStatus(error.message, "error");
    }
  }

  // ---------- Rendering ----------
  function setStatus(message, type = "") {
    statusBox.textContent = message;
    statusBox.className = "weather-status" + (type ? " is-" + type : "");
  }

  function degree() { return unit === "fahrenheit" ? "°F" : "°C"; }
  function describe(code) { return WEATHER_CODES[code] || ["Unknown", "🌡️"]; }

  function renderWeather(place, data) {
    const current = data.current;
    const units = data.current_units;
    const [text, icon] = describe(current.weather_code);

    document.querySelector("#weather-place").textContent =
      [place.name, place.region, place.country].filter(Boolean).join(", ");
    document.querySelector("#weather-time").textContent =
      "Updated " + new Date(current.time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    document.querySelector("#weather-desc").textContent = text;
    document.querySelector("#weather-icon").textContent = icon;
    document.querySelector("#weather-temp").textContent = Math.round(current.temperature_2m) + degree();
    document.querySelector("#m-feels").textContent = Math.round(current.apparent_temperature) + degree();
    document.querySelector("#m-humidity").textContent = current.relative_humidity_2m + " " + units.relative_humidity_2m;
    document.querySelector("#m-wind").textContent = Math.round(current.wind_speed_10m) + " " + units.wind_speed_10m;
    document.querySelector("#m-pressure").textContent = Math.round(current.pressure_msl) + " " + units.pressure_msl;

    const daily = data.daily;
    const items = daily.time.map((date, i) => {
      const [dayText, dayIcon] = describe(daily.weather_code[i]);
      const item = document.createElement("li");
      item.className = "forecast-item";

      const day = document.createElement("span");
      day.className = "forecast-day";
      day.textContent = i === 0 ? "Today" : new Date(date + "T00:00").toLocaleDateString([], { weekday: "short", day: "numeric" });

      const emoji = document.createElement("span");
      emoji.className = "forecast-icon";
      emoji.setAttribute("role", "img");
      emoji.setAttribute("aria-label", dayText);
      emoji.textContent = dayIcon;

      const range = document.createElement("span");
      range.className = "forecast-range";
      range.textContent = Math.round(daily.temperature_2m_max[i]) + "° / " + Math.round(daily.temperature_2m_min[i]) + "°";

      const rain = document.createElement("span");
      rain.className = "forecast-rain";
      rain.textContent = "💧 " + (daily.precipitation_probability_max[i] ?? 0) + "%";

      item.append(day, emoji, range, rain);
      return item;
    });
    forecastList.replaceChildren(...items);
    output.hidden = false;
  }

  function renderRecent() {
    const cities = getRecent();
    recentBox.replaceChildren(...cities.map(city => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.dataset.city = city;
      chip.textContent = city;
      return chip;
    }));
  }

  function renderUnitButtons() {
    unitButtons.forEach(button => {
      const selected = button.dataset.unit === unit;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  // ---------- Events ----------
  form.addEventListener("submit", event => {
    event.preventDefault();
    searchCity(input.value);
  });

  recentBox.addEventListener("click", event => {
    const chip = event.target.closest("[data-city]");
    if (!chip) return;
    input.value = chip.dataset.city;
    searchCity(chip.dataset.city);
  });

  unitButtons.forEach(button => {
    button.addEventListener("click", () => {
      unit = button.dataset.unit;
      writeStorage(UNIT_KEY, unit);
      renderUnitButtons();
      if (lastPlace) loadPlace(lastPlace);
    });
  });

  locateBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation is not supported by this browser.", "error");
      return;
    }
    setStatus("Getting your location…", "loading");
    navigator.geolocation.getCurrentPosition(
      position => loadPlace({
        name: "Your location",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      () => setStatus("Could not get your location. Allow location access or search by city name.", "error"),
      { timeout: 10000 }
    );
  });

  renderUnitButtons();
  renderRecent();
  const recent = getRecent();
  searchCity(recent[0] || DEFAULT_CITY);
})();
