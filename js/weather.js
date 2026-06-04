/* ============================================================
   weather.js — Geolocation & Weather API v2
   ============================================================ */

const WeatherModule = (() => {
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

  async function fetchWithTimeout(url, timeoutMs, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('GEOLOCATION_NOT_SUPPORTED')); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(new Error({1:'GEOLOCATION_DENIED',2:'GEOLOCATION_UNAVAILABLE',3:'GEOLOCATION_TIMEOUT'}[err.code]||'GEOLOCATION_ERROR')),
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 1800000 }
      );
    });
  }

  /** Reverse geocode — try fast Photon API first, fall back to "当前位置" */
  async function reverseGeocode(lat, lon) {
    // Photon (Komoot) — free, fast, CORS-friendly, based on OSM data
    try {
      const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=zh&limit=1`;
      const resp = await fetchWithTimeout(url, 4000);
      if (resp.ok) {
        const data = await resp.json();
        const props = (data.features && data.features[0] && data.features[0].properties) || {};
        const cityName = props.city || props.town || props.county || props.state || props.name || '';
        const provinceName = props.state || props.county || '';
        if (cityName) return { cityName, provinceName };
      }
    } catch (e) { /* fall through */ }

    // Fallback: simple coordinate-based label
    return { cityName: '当前位置', provinceName: '' };
  }

  async function forwardGeocode(cityQuery) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(cityQuery)}&count=1&language=zh`;
    const resp = await fetchWithTimeout(url, 6000);
    if (!resp.ok) throw new Error('GEOCODING_FAILED');
    const data = await resp.json();
    if (!data.results || data.results.length === 0) throw new Error('CITY_NOT_FOUND');
    const result = data.results[0];
    return {
      lat: result.latitude, lon: result.longitude,
      cityName: result.name || cityQuery,
      provinceName: result.admin1 || result.country || '',
    };
  }

  async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat.toFixed(4), longitude: lon.toFixed(4),
      current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m',
      timezone: 'auto', forecast_days: '1',
    });
    const url = `${WEATHER_API}?${params}`;
    const resp = await fetchWithTimeout(url, 8000);
    if (!resp.ok) throw new Error('WEATHER_API_FAILED');
    const data = await resp.json();
    const c = data.current;
    return {
      temperature: Math.round(c.temperature_2m), feelsLike: Math.round(c.apparent_temperature),
      weatherCode: c.weather_code, humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m, isDay: c.is_day === 1,
    };
  }

  function saveCachedCoords(coords) {
    try { localStorage.setItem('recipe_coords', JSON.stringify({ lat:coords.lat, lon:coords.lon, cachedAt:Date.now() })); } catch(e) {}
  }

  function getCachedCoords() {
    try {
      const raw = localStorage.getItem('recipe_coords');
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (Date.now() - d.cachedAt > 7*24*3600*1000) return null;
      return { lat: d.lat, lon: d.lon };
    } catch(e) { return null; }
  }

  async function getWeatherContext(options = {}) {
    let coords;
    if (options.manualCity) {
      const geo = await forwardGeocode(options.manualCity);
      coords = { lat: geo.lat, lon: geo.lon, cityName: geo.cityName, provinceName: geo.provinceName };
    } else {
      const cachedCoords = getCachedCoords();
      if (cachedCoords) {
        const revGeo = await reverseGeocode(cachedCoords.lat, cachedCoords.lon);
        coords = { ...cachedCoords, ...revGeo };
      } else {
        const pos = await getCurrentPosition();
        saveCachedCoords(pos);
        const revGeo = await reverseGeocode(pos.lat, pos.lon);
        coords = { ...pos, ...revGeo };
      }
    }

    let weather;
    try {
      weather = await fetchWeather(coords.lat, coords.lon);
    } catch (e) {
      weather = { temperature: 20, feelsLike: 20, weatherCode: 0, humidity: 50, windSpeed: 0, isDay: true };
    }

    const now = new Date();
    const tempCategory = RecipeModule.getTempCategory(weather.temperature);
    const weatherTag = RecipeModule.mapWeatherCodeToTag(weather.weatherCode);
    const season = RecipeModule.getSeason(now.getMonth()+1, now.getDate());
    const mealTime = RecipeModule.getMealTime(now.getHours());
    const region = RecipeModule.getRegionFromProvince(coords.provinceName);
    const dateStr = RecipeModule.formatDateStr(now);
    const session = getTodayRefreshCount();

    return {
      temperature: weather.temperature, feelsLike: weather.feelsLike,
      tempCategory, weatherCode: weather.weatherCode, weatherTag,
      isRainy: weatherTag==='rainy', isSnowy: weatherTag==='snowy', isExtreme: weatherTag==='extreme',
      isDay: weather.isDay, humidity: weather.humidity, windSpeed: weather.windSpeed,
      season, mealTime, region,
      cityName: coords.cityName||'未知城市', provinceName: coords.provinceName||'',
      dateStr, session,
    };
  }

  function getTodayRefreshCount() {
    try {
      const now = new Date();
      return parseInt(localStorage.getItem('recipe_refresh_'+RecipeModule.formatDateStr(now))||'0',10);
    } catch(e) { return 0; }
  }

  function incrementRefreshCount() {
    try {
      const now = new Date();
      const key = 'recipe_refresh_'+RecipeModule.formatDateStr(now);
      const count = getTodayRefreshCount() + 1;
      localStorage.setItem(key, String(count));
      return count;
    } catch(e) { return 1; }
  }

  return { getWeatherContext, getCurrentPosition, reverseGeocode, forwardGeocode, fetchWeather, getCachedCoords, saveCachedCoords, incrementRefreshCount };
})();
