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

  /* ── Local city lookup: coordinates → nearest Chinese city (zero network) ── */
  // ~200 major Chinese cities with lat/lon
  const CITY_DB = [
    ['北京',39.90,116.40,'北京'],['上海',31.23,121.47,'上海'],['广州',23.13,113.26,'广东'],['深圳',22.54,114.06,'广东'],
    ['成都',30.57,104.07,'四川'],['重庆',29.56,106.55,'重庆'],['杭州',30.25,120.17,'浙江'],['武汉',30.58,114.30,'湖北'],
    ['西安',34.26,108.94,'陕西'],['南京',32.06,118.80,'江苏'],['长沙',28.23,112.94,'湖南'],['天津',39.14,117.18,'天津'],
    ['苏州',31.30,120.62,'江苏'],['郑州',34.75,113.62,'河南'],['济南',36.67,116.98,'山东'],['青岛',36.09,120.38,'山东'],
    ['大连',38.91,121.61,'辽宁'],['沈阳',41.80,123.43,'辽宁'],['哈尔滨',45.80,126.53,'黑龙江'],['长春',43.88,125.32,'吉林'],
    ['福州',26.07,119.30,'福建'],['厦门',24.48,118.09,'福建'],['昆明',25.04,102.71,'云南'],['贵阳',26.65,106.63,'贵州'],
    ['南宁',22.82,108.37,'广西'],['海口',20.04,110.34,'海南'],['合肥',31.82,117.23,'安徽'],['南昌',28.68,115.86,'江西'],
    ['太原',37.87,112.55,'山西'],['石家庄',38.04,114.51,'河北'],['兰州',36.06,103.83,'甘肃'],['西宁',36.62,101.78,'青海'],
    ['银川',38.49,106.23,'宁夏'],['乌鲁木齐',43.79,87.62,'新疆'],['拉萨',29.65,91.14,'西藏'],['呼和浩特',40.84,111.75,'内蒙古'],
    ['东莞',23.05,113.75,'广东'],['佛山',23.03,113.12,'广东'],['珠海',22.27,113.58,'广东'],['惠州',23.11,114.41,'广东'],
    ['中山',22.52,113.38,'广东'],['汕头',23.37,116.69,'广东'],['温州',28.00,120.70,'浙江'],['宁波',29.87,121.55,'浙江'],
    ['无锡',31.57,120.31,'江苏'],['常州',31.77,119.97,'江苏'],['南通',32.00,120.86,'江苏'],['徐州',34.26,117.19,'江苏'],
    ['烟台',37.46,121.44,'山东'],['淄博',36.81,118.06,'山东'],['潍坊',36.71,119.16,'山东'],['洛阳',34.62,112.45,'河南'],
    ['开封',34.80,114.31,'河南'],['唐山',39.63,118.18,'河北'],['保定',38.87,115.47,'河北'],['邯郸',36.61,114.49,'河北'],
    ['襄阳',32.06,112.15,'湖北'],['宜昌',30.69,111.29,'湖北'],['荆州',30.33,112.24,'湖北'],['株洲',27.83,113.13,'湖南'],
    ['湘潭',27.83,112.94,'湖南'],['衡阳',26.89,112.57,'湖南'],['岳阳',29.37,113.09,'湖南'],['赣州',25.83,114.93,'江西'],
    ['九江',29.71,116.00,'江西'],['桂林',25.27,110.29,'广西'],['柳州',24.31,109.41,'广西'],['三亚',18.25,109.51,'海南'],
    ['绵阳',31.47,104.73,'四川'],['宜宾',28.77,104.62,'四川'],['遵义',27.72,106.93,'贵州'],['大理',25.61,100.27,'云南'],
    ['包头',40.66,109.84,'内蒙古'],['大庆',46.59,125.03,'黑龙江'],['齐齐哈尔',47.35,123.92,'黑龙江'],['吉林',43.84,126.55,'吉林'],
    ['鞍山',41.11,122.99,'辽宁'],['抚顺',41.88,123.96,'辽宁'],['秦皇岛',39.94,119.60,'河北'],['威海',37.51,122.12,'山东'],
    ['日照',35.42,119.53,'山东'],['连云港',34.60,119.22,'江苏'],['扬州',32.39,119.41,'江苏'],['镇江',32.19,119.43,'江苏'],
    ['绍兴',30.05,120.58,'浙江'],['嘉兴',30.77,120.76,'浙江'],['金华',29.08,119.65,'浙江'],['台州',28.66,121.42,'浙江'],
    ['泉州',24.91,118.59,'福建'],['漳州',24.52,117.65,'福建'],['芜湖',31.35,118.43,'安徽'],['蚌埠',32.94,117.36,'安徽'],
    ['咸阳',34.33,108.71,'陕西'],['宝鸡',34.36,107.24,'陕西'],['天水',34.58,105.72,'甘肃'],['嘉峪关',39.77,98.29,'甘肃'],
    ['克拉玛依',45.58,84.89,'新疆'],['柳州',24.31,109.41,'广西'],['北海',21.48,109.12,'广西'],['湛江',21.27,110.36,'广东'],
    ['茂名',21.66,110.92,'广东'],['韶关',24.80,113.60,'广东'],['河源',23.74,114.70,'广东'],['清远',23.70,113.03,'广东'],
    ['肇庆',23.05,112.46,'广东'],['江门',22.58,113.08,'广东'],['潮州',23.66,116.63,'广东'],['揭阳',23.55,116.37,'广东'],
    ['梅州',24.30,116.12,'广东'],['汕尾',22.78,115.37,'广东'],['阳江',21.86,111.98,'广东'],['云浮',22.92,112.04,'广东'],
  ];

  function reverseCityName(lat, lon) {
    let best = null, bestDist = Infinity;
    for (const c of CITY_DB) {
      const dlat = c[1] - lat, dlon = c[2] - lon;
      const dist = dlat*dlat + dlon*dlon; // squared distance (fast, no sqrt needed for comparison)
      if (dist < bestDist) { bestDist = dist; best = c; }
    }
    // If distance is reasonable (< ~3 degrees ≈ 300km), use the city
    if (best && bestDist < 9) {
      return { cityName: best[0], provinceName: best[3] };
    }
    return { cityName: '当前位置', provinceName: best ? best[3] : '' };
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
      // Race GPS against 2s timeout. Never block page load on slow GPS.
      const cached = loadCache();
      try {
        const pos = await Promise.race([
          getGPSPosition(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('gps_slow')), 2000))
        ]);
        const cityInfo = reverseCityName(pos.lat, pos.lon);
        coord = { lat: pos.lat, lon: pos.lon, cityName: cityInfo.cityName, provinceName: cityInfo.provinceName };
        saveCache(pos.lat, pos.lon, cityInfo.cityName, cityInfo.provinceName);
      } catch(e) {
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
