/* ============================================================
   weather.js — Geolocation & Weather API Integration
   Uses: Open-Meteo (weather, no API key), Nominatim (reverse geocode)
   ============================================================ */

const WeatherModule = (() => {
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

  // Default to 'unknown' user agent for Nominatim (politeness)
  const NOMINATIM_HEADERS = { 'Accept-Language': 'zh' };

  /** Fetch with timeout */
  async function fetchWithTimeout(url, timeoutMs, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      return resp;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Get current position via browser Geolocation API */
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          const errorMap = {
            1: 'GEOLOCATION_DENIED',
            2: 'GEOLOCATION_UNAVAILABLE',
            3: 'GEOLOCATION_TIMEOUT',
          };
          reject(new Error(errorMap[err.code] || 'GEOLOCATION_ERROR'));
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 1800000 }
      );
    });
  }

  /** Reverse geocode coordinates to city + province using Nominatim */
  async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh&zoom=10`;
    try {
      const resp = await fetchWithTimeout(url, 8000, { headers: NOMINATIM_HEADERS });
      if (!resp.ok) throw new Error('REVERSE_GEO_FAILED');
      const data = await resp.json();
      const addr = data.address || {};
      // Try multiple levels: city > town > county > state
      const cityName = addr.city || addr.town || addr.county || addr.state_district || addr.state || '未知城市';
      const provinceName = addr.state || addr.province || '';
      return { cityName, provinceName };
    } catch (e) {
      // If Nominatim fails, return generic names
      return { cityName: '当前位置', provinceName: '' };
    }
  }

  /** Forward geocode a city name to coordinates */
  async function forwardGeocode(cityQuery) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(cityQuery)}&count=1&language=zh`;
    const resp = await fetchWithTimeout(url, 8000);
    if (!resp.ok) throw new Error('GEOCODING_FAILED');
    const data = await resp.json();
    if (!data.results || data.results.length === 0) throw new Error('CITY_NOT_FOUND');
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      cityName: result.name || cityQuery,
      provinceName: result.admin1 || result.country || '',
    };
  }

  /** Fetch current weather from Open-Meteo */
  async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat.toFixed(4),
      longitude: lon.toFixed(4),
      current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m',
      timezone: 'auto',
      forecast_days: '1',
    });
    const url = `${WEATHER_API}?${params}`;
    const resp = await fetchWithTimeout(url, 10000);
    if (!resp.ok) throw new Error('WEATHER_API_FAILED');
    const data = await resp.json();
    const current = data.current;
    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      weatherCode: current.weather_code,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      isDay: current.is_day === 1,
    };
  }

  /** Save coordinates to LocalStorage */
  function saveCachedCoords(coords) {
    try {
      localStorage.setItem('recipe_coords', JSON.stringify({
        lat: coords.lat,
        lon: coords.lon,
        cachedAt: Date.now(),
      }));
    } catch (e) { /* ignore */ }
  }

  /** Get cached coordinates if fresh (within 7 days) */
  function getCachedCoords() {
    try {
      const raw = localStorage.getItem('recipe_coords');
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.cachedAt > 7 * 24 * 3600 * 1000) return null;
      return { lat: data.lat, lon: data.lon };
    } catch (e) { return null; }
  }

  /**
   * Main entry: assemble complete WeatherContext.
   * @param {Object} options
   * @param {string} [options.manualCity] - Manual city name override
   * @returns {Promise<Object>} WeatherContext
   */
  async function getWeatherContext(options = {}) {
    let coords;

    if (options.manualCity) {
      // Manual city input path
      const geo = await forwardGeocode(options.manualCity);
      coords = { lat: geo.lat, lon: geo.lon, cityName: geo.cityName, provinceName: geo.provinceName };
    } else {
      // Try cached coordinates first, then fresh geolocation
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

    // Fetch weather
    let weather;
    try {
      weather = await fetchWeather(coords.lat, coords.lon);
    } catch (e) {
      // Weather API failed: use neutral defaults
      weather = {
        temperature: 20,
        feelsLike: 20,
        weatherCode: 0,
        humidity: 50,
        windSpeed: 0,
        isDay: true,
      };
    }

    // Build context using RecipeModule helpers
    const now = new Date();
    const tempCategory = RecipeModule.getTempCategory(weather.temperature);
    const weatherTag = RecipeModule.mapWeatherCodeToTag(weather.weatherCode);
    const season = RecipeModule.getSeason(now.getMonth() + 1, now.getDate());
    const mealTime = RecipeModule.getMealTime(now.getHours());
    const region = RecipeModule.getRegionFromProvince(coords.provinceName);
    const dateStr = RecipeModule.formatDateStr(now);
    const session = getTodayRefreshCount();

    return {
      temperature: weather.temperature,
      feelsLike: weather.feelsLike,
      tempCategory,
      weatherCode: weather.weatherCode,
      weatherTag,
      isRainy: weatherTag === 'rainy',
      isSnowy: weatherTag === 'snowy',
      isExtreme: weatherTag === 'extreme',
      isDay: weather.isDay,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      season,
      mealTime,
      region,
      cityName: coords.cityName || '未知城市',
      provinceName: coords.provinceName || '',
      dateStr,
      session,
    };
  }

  /** Get today's refresh count from LocalStorage */
  function getTodayRefreshCount() {
    try {
      const now = new Date();
      const key = 'recipe_refresh_' + RecipeModule.formatDateStr(now);
      return parseInt(localStorage.getItem(key) || '0', 10);
    } catch (e) { return 0; }
  }

  /** Increment today's refresh count */
  function incrementRefreshCount() {
    try {
      const now = new Date();
      const key = 'recipe_refresh_' + RecipeModule.formatDateStr(now);
      const count = getTodayRefreshCount() + 1;
      localStorage.setItem(key, String(count));
      return count;
    } catch (e) { return 1; }
  }

  return {
    getWeatherContext,
    getCurrentPosition,
    reverseGeocode,
    forwardGeocode,
    fetchWeather,
    getCachedCoords,
    saveCachedCoords,
    incrementRefreshCount,
  };
})();
