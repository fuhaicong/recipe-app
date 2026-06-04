/* ============================================================
   weather.js — Geolocation & Weather API v3
   Hybrid: GPS + IP fallback, Open-Meteo weather
   ============================================================ */

const WeatherModule = (() => {
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

  async function fetchWithTimeout(url, timeoutMs, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try { return await fetch(url, { ...options, signal: controller.signal }); }
    finally { clearTimeout(timer); }
  }

  /* ── GPS Geolocation ── */
  function getGPSPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('GEOLOCATION_NOT_SUPPORTED')); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, source: 'gps' }),
        (err) => reject(new Error({1:'GEOLOCATION_DENIED',2:'GEOLOCATION_UNAVAILABLE',3:'GEOLOCATION_TIMEOUT'}[err.code]||'GEOLOCATION_ERROR')),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    });
  }

  /* ── IP Geolocation (fast fallback for China) ── */
  async function getIPLocation() {
    // Try multiple IP geolocation services, use first to respond
    const services = [
      async () => {
        const r = await fetchWithTimeout('https://api.ip.sb/geoip', 3000);
        if (!r.ok) throw new Error();
        const d = await r.json();
        return { lat: d.latitude||d.lat, lon: d.longitude||d.lon, cityName: d.city||'', provinceName: d.region||'', source: 'ip' };
      },
      async () => {
        const r = await fetchWithTimeout('https://ipapi.co/json/', 3000);
        if (!r.ok) throw new Error();
        const d = await r.json();
        return { lat: d.latitude, lon: d.longitude, cityName: d.city||'', provinceName: d.region||'', source: 'ip' };
      },
      async () => {
        const r = await fetchWithTimeout('https://api.ipapi.is/', 3000);
        if (!r.ok) throw new Error();
        const d = await r.json();
        const loc = d.location || {};
        return { lat: loc.latitude, lon: loc.longitude, cityName: loc.city||'', provinceName: loc.state||'', source: 'ip' };
      },
    ];

    for (const svc of services) {
      try {
        const result = await svc();
        if (result.lat && result.lon) return result;
      } catch(e) { continue; }
    }
    return null;
  }

  /* ── Reverse geocode coordinates → city name ── */
  async function reverseGeocode(lat, lon) {
    // Photon — fast OSM-based geocoder
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
    } catch(e) {}
    return null;
  }

  async function forwardGeocode(cityQuery) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(cityQuery)}&count=1&language=zh`;
    const resp = await fetchWithTimeout(url, 6000);
    if (!resp.ok) throw new Error('GEOCODING_FAILED');
    const data = await resp.json();
    if (!data.results || data.results.length === 0) throw new Error('CITY_NOT_FOUND');
    const r = data.results[0];
    return { lat: r.latitude, lon: r.longitude, cityName: r.name||cityQuery, provinceName: r.admin1||r.country||'' };
  }

  /* ── Weather ── */
  async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat.toFixed(4), longitude: lon.toFixed(4),
      current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m',
      timezone: 'auto', forecast_days: '1',
    });
    const resp = await fetchWithTimeout(`${WEATHER_API}?${params}`, 8000);
    if (!resp.ok) throw new Error('WEATHER_API_FAILED');
    const c = (await resp.json()).current;
    return {
      temperature: Math.round(c.temperature_2m), feelsLike: Math.round(c.apparent_temperature),
      weatherCode: c.weather_code, humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m, isDay: c.is_day === 1,
    };
  }

  /* ── Cache ── */
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

  /* ── Main ── */
  async function getWeatherContext(options = {}) {
    let coords = { lat: 39.9, lon: 116.4, cityName: '北京', provinceName: '北京' };

    if (options.manualCity) {
      const geo = await forwardGeocode(options.manualCity);
      coords = { lat: geo.lat, lon: geo.lon, cityName: geo.cityName, provinceName: geo.provinceName };
      saveCachedCoords(coords);
    } else {
      // Try cached coords first
      const cached = getCachedCoords();
      if (cached) {
        const revGeo = await reverseGeocode(cached.lat, cached.lon);
        coords = { lat: cached.lat, lon: cached.lon, cityName: revGeo?.cityName||'当前位置', provinceName: revGeo?.provinceName||'' };
      } else {
        // Race: GPS vs IP geolocation
        const gpsPromise = getGPSPosition().then(async (pos) => {
          const revGeo = await reverseGeocode(pos.lat, pos.lon);
          return { lat: pos.lat, lon: pos.lon, cityName: revGeo?.cityName||'当前位置', provinceName: revGeo?.provinceName||'' };
        });

        const ipPromise = getIPLocation().then(r => {
          if (!r) throw new Error('IP_FAILED');
          return { lat: r.lat, lon: r.lon, cityName: r.cityName||'当前位置', provinceName: r.provinceName||'' };
        });

        try {
          // Race GPS vs IP — whichever responds first wins
          coords = await Promise.race([gpsPromise, ipPromise]);
        } catch (e) {
          // Both failed? Try GPS one more time alone
          try {
            coords = await gpsPromise;
          } catch (e2) {
            try {
              coords = await ipPromise;
            } catch (e3) {
              // Ultimate fallback: use Beijing
            }
          }
        }
        saveCachedCoords(coords);
      }
    }

    // Weather
    let weather;
    try {
      weather = await fetchWeather(coords.lat, coords.lon);
    } catch (e) {
      weather = { temperature: 20, feelsLike: 20, weatherCode: 0, humidity: 50, windSpeed: 0, isDay: true };
    }

    const now = new Date();
    const tempCategory = RecipeModule.getTempCategory(weather.temperature);
    const weatherTag = RecipeModule.mapWeatherCodeToTag(weather.weatherCode);

    return {
      temperature: weather.temperature, feelsLike: weather.feelsLike,
      tempCategory, weatherCode: weather.weatherCode, weatherTag,
      isRainy: weatherTag==='rainy', isSnowy: weatherTag==='snowy', isExtreme: weatherTag==='extreme',
      isDay: weather.isDay, humidity: weather.humidity, windSpeed: weather.windSpeed,
      season: RecipeModule.getSeason(now.getMonth()+1, now.getDate()),
      mealTime: RecipeModule.getMealTime(now.getHours()),
      region: RecipeModule.getRegionFromProvince(coords.provinceName),
      cityName: coords.cityName||'未知城市', provinceName: coords.provinceName||'',
      dateStr: RecipeModule.formatDateStr(now),
      session: getTodayRefreshCount(),
    };
  }

  function getTodayRefreshCount() {
    try { return parseInt(localStorage.getItem('recipe_refresh_'+RecipeModule.formatDateStr(new Date()))||'0',10); } catch(e) { return 0; }
  }
  function incrementRefreshCount() {
    try { const k='recipe_refresh_'+RecipeModule.formatDateStr(new Date()); const c=getTodayRefreshCount()+1; localStorage.setItem(k,String(c)); return c; } catch(e) { return 1; }
  }

  return { getWeatherContext, getCurrentPosition: getGPSPosition, reverseGeocode, forwardGeocode, fetchWeather, getCachedCoords, saveCachedCoords, incrementRefreshCount };
})();
