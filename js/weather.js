/* ============================================================
   weather.js v4 — Resilient geolocation for China
   Strategy: cached > GPS > IP > instant fallback. Never blocks >3s.
   ============================================================ */

const WeatherModule = (() => {

  /* ── Fetcher with timeout ── */
  async function fetchJSON(url, timeoutMs = 3000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }

  /* ── GPS ── */
  function getGPS() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('no_api'));
      const timer = setTimeout(() => reject(new Error('timeout')), 4000);
      navigator.geolocation.getCurrentPosition(
        (pos) => { clearTimeout(timer); resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }); },
        (err) => { clearTimeout(timer); reject(new Error({1:'denied',2:'unavailable',3:'timeout'}[err.code]||'error')); },
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 600000 }
      );
    });
  }

  /* ── IP geolocation (multi-service, first to respond wins) ── */
  async function getIPLocation() {
    const services = [
      // ipapi.co — reliable global, CORS-friendly
      async () => {
        const d = await fetchJSON('https://ipapi.co/json/', 3000);
        if (!d || !d.latitude) throw new Error('no_data');
        return { lat: d.latitude, lon: d.longitude, city: d.city||'', region: d.region||'' };
      },
      // ip-api.com — has CDN, CORS-friendly, free for non-commercial
      async () => {
        const d = await fetchJSON('https://ip-api.com/json/?lang=zh-CN', 3000);
        if (!d || d.status !== 'success') throw new Error('no_data');
        return { lat: d.lat, lon: d.lon, city: d.city||'', region: d.regionName||'' };
      },
      // ip.sb — Asian servers
      async () => {
        const d = await fetchJSON('https://api.ip.sb/geoip', 3000);
        if (!d || !d.latitude) throw new Error('no_data');
        return { lat: d.latitude, lon: d.longitude, city: d.city||'', region: d.region||'' };
      },
    ];

    for (const svc of services) {
      try {
        const r = await svc();
        if (r.lat != null && r.lon != null) return r;
      } catch(e) { continue; }
    }
    return null;
  }

  /* ── Reverse geocode (coords → city name) ── */
  async function reverseCity(lat, lon) {
    try {
      const d = await fetchJSON(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=zh&limit=1`, 3000);
      const p = (d?.features?.[0]?.properties) || {};
      const name = p.city || p.town || p.county || p.state || p.name || '';
      const prov = p.state || p.county || '';
      return name ? { cityName: name, provinceName: prov } : null;
    } catch(e) { return null; }
  }

  /* ── Forward geocode (city name → coords) ── */
  async function forwardGeocode(city) {
    const d = await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`, 5000);
    if (!d?.results?.length) throw new Error('city_not_found');
    const r = d.results[0];
    return { lat: r.latitude, lon: r.longitude, cityName: r.name||city, provinceName: r.admin1||r.country||'' };
  }

  /* ── Weather ── */
  async function fetchWeather(lat, lon) {
    const p = new URLSearchParams({
      latitude: lat.toFixed(4), longitude: lon.toFixed(4),
      current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m',
      timezone: 'auto', forecast_days: '1',
    });
    try {
      const d = await fetchJSON(`https://api.open-meteo.com/v1/forecast?${p}`, 6000);
      const c = d.current;
      return { temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), code: c.weather_code, humidity: c.relative_humidity_2m, wind: c.wind_speed_10m, isDay: c.is_day===1 };
    } catch(e) {
      return { temp: 20, feels: 20, code: 0, humidity: 50, wind: 0, isDay: true };
    }
  }

  /* ── Cache ── */
  function saveCoords(c) { try { localStorage.setItem('rc', JSON.stringify({...c, t: Date.now()})); } catch(e) {} }
  function getCached() {
    try {
      const r = localStorage.getItem('rc'); if (!r) return null;
      const d = JSON.parse(r);
      return (Date.now()-d.t < 7*86400000) ? { lat: d.lat, lon: d.lon, city: d.city||'', prov: d.prov||'' } : null;
    } catch(e) { return null; }
  }

  /* ==========================================================
     Main: resolve location + weather. Hard 3s limit.
     ========================================================== */
  async function getWeatherContext(opts = {}) {
    let coord = { lat: 39.9042, lon: 116.4074, cityName: '北京', provinceName: '北京' }; // default

    if (opts.manualCity) {
      const g = await forwardGeocode(opts.manualCity);
      coord = { lat: g.lat, lon: g.lon, cityName: g.cityName, provinceName: g.provinceName };
      saveCoords(coord);
    } else {
      // 1. Use cached coords (instant, zero network)
      const cached = getCached();
      if (cached) {
        coord = { lat: cached.lat, lon: cached.lon, cityName: cached.city||'当前位置', provinceName: cached.prov||'' };
        // Try to refresh city name in background
        reverseCity(cached.lat, cached.lon).then(r => {
          if (r) saveCoords({ lat: cached.lat, lon: cached.lon, city: r.cityName, prov: r.provinceName });
        }).catch(()=>{});
      } else {
        // 2. Race GPS vs IP with a hard 3s overall timeout
        const gpsP = getGPS().then(p => ({ ...p, src: 'gps' })).catch(() => null);
        const ipP  = getIPLocation().then(r => r ? { lat: r.lat, lon: r.lon, city: r.city, prov: r.region, src: 'ip' } : null).catch(() => null);

        const winner = await Promise.race([
          gpsP, ipP,
          new Promise(r => setTimeout(() => r('timeout'), 3500))
        ]);

        if (winner && winner !== 'timeout' && winner.lat != null) {
          let cityName = winner.city || '当前位置';
          let provName = winner.prov || '';
          // Only try reverse geocode if we got GPS (no city info)
          if (winner.src === 'gps' && !cityName) {
            const rev = await reverseCity(winner.lat, winner.lon);
            if (rev) { cityName = rev.cityName; provName = rev.provinceName; }
          }
          coord = { lat: winner.lat, lon: winner.lon, cityName, provinceName: provName };
        }
        // else: use Beijing default
        saveCoords({ lat: coord.lat, lon: coord.lon, city: coord.cityName, prov: coord.provinceName });
      }
    }

    // Weather (always succeeds, falls back to 20°C default)
    const w = await fetchWeather(coord.lat, coord.lon);

    const now = new Date();
    return {
      temperature: w.temp, feelsLike: w.feels,
      tempCategory: RecipeModule.getTempCategory(w.temp),
      weatherCode: w.code,
      weatherTag: RecipeModule.mapWeatherCodeToTag(w.code),
      isRainy: RecipeModule.mapWeatherCodeToTag(w.code)==='rainy',
      isSnowy: RecipeModule.mapWeatherCodeToTag(w.code)==='snowy',
      isExtreme: RecipeModule.mapWeatherCodeToTag(w.code)==='extreme',
      isDay: w.isDay, humidity: w.humidity, windSpeed: w.wind,
      season: RecipeModule.getSeason(now.getMonth()+1, now.getDate()),
      mealTime: RecipeModule.getMealTime(now.getHours()),
      region: RecipeModule.getRegionFromProvince(coord.provinceName),
      cityName: coord.cityName||'未知城市',
      provinceName: coord.provinceName||'',
      dateStr: RecipeModule.formatDateStr(now),
      session: getRefreshCount(),
    };
  }

  function getRefreshCount() {
    try { return parseInt(localStorage.getItem('rf_'+RecipeModule.formatDateStr(new Date()))||'0',10); } catch(e) { return 0; }
  }
  function incrementRefreshCount() {
    try { const k='rf_'+RecipeModule.formatDateStr(new Date()); const n=getRefreshCount()+1; localStorage.setItem(k,String(n)); return n; } catch(e) { return 1; }
  }

  return { getWeatherContext, getCurrentPosition: getGPS, reverseGeocode: reverseCity, forwardGeocode, fetchWeather, getCachedCoords: getCached, saveCachedCoords: saveCoords, incrementRefreshCount };
})();
