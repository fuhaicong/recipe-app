/* ============================================================
   weather.js v5 — Zero foreign geolocation APIs
   GPS only (browser built-in) → Open-Meteo weather
   无GPS则默认北京,用户可手动输入任意城市
   ============================================================ */

const WeatherModule = (() => {

  /* ── Simple fetch with timeout ── */
  async function fetchJSON(url, timeoutMs = 5000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }

  /* ── Browser GPS (on Chinese phones uses Baidu/AMap via system) ── */
  function getGPSPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('no_gps'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(new Error('denied')),
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    });
  }

  /* ── City name → coordinates (Open-Meteo geocoding — one fast request) ── */
  async function cityToCoords(cityName) {
    const url = 'https://geocoding-api.open-meteo.com/v1/search?name='
      + encodeURIComponent(cityName) + '&count=1&language=zh';
    const d = await fetchJSON(url, 5000);
    if (!d?.results?.length) throw new Error('city_not_found');
    const r = d.results[0];
    return { lat: r.latitude, lon: r.longitude, cityName: r.name||cityName, provinceName: r.admin1||r.country||'' };
  }

  /* ── Reverse geocode: coordinates → city name (non-blocking, best-effort) ── */
  async function reverseCityName(lat, lon) {
    // Nominatim (OpenStreetMap) — free, open-source, no key needed
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh&zoom=10`;
      const d = await fetchJSON(url, 3000);
      const addr = d?.address || {};
      const city = addr.city || addr.town || addr.county || addr.state_district || addr.state || '';
      const prov = addr.state || addr.province || '';
      return city ? { cityName: city, provinceName: prov } : null;
    } catch(e) { return null; }
  }

  /* ── Weather from Open-Meteo ── */
  async function fetchWeather(lat, lon) {
    const p = new URLSearchParams({
      latitude: lat.toFixed(4), longitude: lon.toFixed(4),
      current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,is_day',
      timezone: 'auto', forecast_days: '1',
    });
    try {
      const d = await fetchJSON('https://api.open-meteo.com/v1/forecast?' + p, 6000);
      const c = d.current;
      return { temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), code: c.weather_code, humidity: c.relative_humidity_2m, isDay: c.is_day===1 };
    } catch(e) {
      return { temp: 20, feels: 20, code: 0, humidity: 50, isDay: true };
    }
  }

  /* ── LocalStorage cache (7 days) ── */
  function loadCache() {
    try {
      const r = localStorage.getItem('rc2');
      if (!r) return null;
      const d = JSON.parse(r);
      return (Date.now()-d.t < 7*86400000) ? { lat:d.lat, lon:d.lon, city:d.city, prov:d.prov } : null;
    } catch(e) { return null; }
  }
  function saveCache(lat, lon, city, prov) {
    try { localStorage.setItem('rc2', JSON.stringify({ lat, lon, city, prov, t: Date.now() })); } catch(e) {}
  }

  /* ==========================================================
     Main entry
     ========================================================== */
  async function getWeatherContext(opts = {}) {
    const DEFAULT = { lat: 39.9042, lon: 116.4074, cityName: '北京', provinceName: '北京' };
    let coord = DEFAULT;

    // ── Resolve coordinates ──
    if (opts.manualCity) {
      // User typed a city — geocode it
      try {
        const g = await cityToCoords(opts.manualCity);
        coord = { lat: g.lat, lon: g.lon, cityName: g.cityName, provinceName: g.provinceName };
        saveCache(coord.lat, coord.lon, coord.cityName, coord.provinceName);
      } catch(e) {
        // City not found → keep default
        coord = { ...DEFAULT, cityName: opts.manualCity, provinceName: '' };
      }
    } else {
      // Try GPS first (triggers browser permission prompt if state is "prompt")
      // Only fall back to cache if GPS fails
      let gpsSuccess = false;
      try {
        const pos = await getGPSPosition();
        coord = { lat: pos.lat, lon: pos.lon, cityName: '获取位置中…', provinceName: '' };
        saveCache(pos.lat, pos.lon, '获取位置中…', '');
        gpsSuccess = true;

        // Non-blocking: try to get city name from coordinates
        reverseCityName(pos.lat, pos.lon).then(name => {
          if (name) {
            saveCache(pos.lat, pos.lon, name.cityName, name.provinceName);
            // Update UI if still on this location
            const cn = document.getElementById('city-name');
            if (cn && cn.textContent.includes('获取位置中') || cn.textContent.includes('当前位置')) {
              cn.textContent = name.cityName;
            }
          }
        }).catch(() => {});
      } catch(e) {
        // GPS failed — try cache
        const cached = loadCache();
        if (cached) {
          coord = { lat: cached.lat, lon: cached.lon, cityName: cached.city||'当前位置', provinceName: cached.prov||'' };
        } else {
          coord = DEFAULT;
        }
      }
    }

    // ── Fetch weather ──
    const w = await fetchWeather(coord.lat, coord.lon);

    // ── Build context ──
    const now = new Date();
    const tempCat = RecipeModule.getTempCategory(w.temp);
    const wTag = RecipeModule.mapWeatherCodeToTag(w.code);

    return {
      temperature: w.temp,
      feelsLike: w.feels,
      tempCategory: tempCat,
      weatherCode: w.code,
      weatherTag: wTag,
      isRainy: wTag === 'rainy',
      isSnowy: wTag === 'snowy',
      isExtreme: wTag === 'extreme',
      isDay: w.isDay,
      humidity: w.humidity,
      season: RecipeModule.getSeason(now.getMonth()+1, now.getDate()),
      mealTime: RecipeModule.getMealTime(now.getHours()),
      region: RecipeModule.getRegionFromProvince(coord.provinceName),
      cityName: coord.cityName || '未知城市',
      provinceName: coord.provinceName || '',
      dateStr: RecipeModule.formatDateStr(now),
      session: getRefreshCount(),
    };
  }

  function getRefreshCount() {
    try { return parseInt(localStorage.getItem('rf2_'+RecipeModule.formatDateStr(new Date()))||'0',10); } catch(e) { return 0; }
  }
  function incrementRefreshCount() {
    try { const k='rf2_'+RecipeModule.formatDateStr(new Date()); const n=getRefreshCount()+1; localStorage.setItem(k,String(n)); return n; } catch(e) { return 1; }
  }

  return { getWeatherContext, getCurrentPosition: getGPSPosition, cityToCoords, fetchWeather, incrementRefreshCount, saveCachedCoords: saveCache };
})();
