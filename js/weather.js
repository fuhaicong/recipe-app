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
        (err) => reject(new Error(
          err.code === 1 ? 'denied' :
          err.code === 2 ? 'unavailable' :
          err.code === 3 ? 'timeout' : 'error'
        )),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
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

  /* ── City database (hierarchical + flat for coordinate lookup) ── */
  const PROVINCE_CITIES = [
    {n:'北京',c:['北京']},{n:'上海',c:['上海']},{n:'天津',c:['天津']},{n:'重庆',c:['重庆']},
    {n:'广东',c:['广州','深圳','东莞','佛山','珠海','惠州','中山','汕头','湛江','茂名','韶关','河源','清远','肇庆','江门','潮州','揭阳','梅州','汕尾','阳江','云浮']},
    {n:'浙江',c:['杭州','宁波','温州','绍兴','嘉兴','金华','台州','湖州','丽水','衢州','舟山']},
    {n:'江苏',c:['南京','苏州','无锡','常州','南通','徐州','扬州','镇江','连云港','淮安','盐城','泰州','宿迁']},
    {n:'山东',c:['济南','青岛','烟台','淄博','潍坊','威海','日照','临沂','济宁','泰安','聊城','德州','滨州','菏泽']},
    {n:'四川',c:['成都','绵阳','宜宾','德阳','南充','泸州','达州','乐山','广安','眉山','遂宁','内江','自贡','攀枝花','广元','资阳','雅安','巴中']},
    {n:'湖北',c:['武汉','襄阳','宜昌','荆州','黄冈','十堰','孝感','荆门','鄂州','黄石','咸宁','随州','恩施']},
    {n:'湖南',c:['长沙','株洲','湘潭','衡阳','岳阳','常德','郴州','怀化','邵阳','永州','益阳','娄底','张家界','湘西']},
    {n:'河南',c:['郑州','洛阳','开封','南阳','许昌','新乡','周口','商丘','平顶山','信阳','驻马店','安阳','焦作','濮阳','漯河','三门峡']},
    {n:'河北',c:['石家庄','唐山','保定','邯郸','秦皇岛','沧州','邢台','廊坊','承德','张家口','衡水']},
    {n:'辽宁',c:['沈阳','大连','鞍山','抚顺','锦州','营口','丹东','盘锦','本溪','朝阳','葫芦岛','辽阳','铁岭','阜新']},
    {n:'福建',c:['福州','厦门','泉州','漳州','莆田','龙岩','三明','南平','宁德']},
    {n:'陕西',c:['西安','咸阳','宝鸡','渭南','汉中','榆林','延安','安康','商洛','铜川']},
    {n:'安徽',c:['合肥','芜湖','蚌埠','马鞍山','安庆','滁州','阜阳','宿州','六安','亳州','淮南','宣城','铜陵','池州','黄山','淮北']},
    {n:'江西',c:['南昌','赣州','九江','上饶','吉安','宜春','抚州','景德镇','萍乡','新余','鹰潭']},
    {n:'山西',c:['太原','大同','运城','临汾','长治','晋中','吕梁','忻州','晋城','朔州','阳泉']},
    {n:'黑龙江',c:['哈尔滨','大庆','齐齐哈尔','牡丹江','佳木斯','鸡西','鹤岗','双鸭山','伊春','绥化','七台河','黑河']},
    {n:'吉林',c:['长春','吉林','四平','辽源','通化','白山','松原','白城','延边']},
    {n:'云南',c:['昆明','大理','曲靖','玉溪','保山','昭通','丽江','普洱','临沧','红河','西双版纳','楚雄','文山','德宏']},
    {n:'贵州',c:['贵阳','遵义','毕节','六盘水','铜仁','安顺','黔东南','黔南','黔西南']},
    {n:'广西',c:['南宁','桂林','柳州','北海','玉林','梧州','钦州','百色','河池','贵港','防城港','贺州','来宾','崇左']},
    {n:'海南',c:['海口','三亚','儋州','琼海','文昌','万宁','东方','五指山']},
    {n:'甘肃',c:['兰州','天水','嘉峪关','金昌','白银','武威','张掖','平凉','酒泉','庆阳','定西','陇南','临夏','甘南']},
    {n:'内蒙古',c:['呼和浩特','包头','鄂尔多斯','赤峰','通辽','呼伦贝尔','乌兰察布','巴彦淖尔','乌海']},
    {n:'新疆',c:['乌鲁木齐','克拉玛依','喀什','伊犁','昌吉','阿克苏','巴音郭楞','吐鲁番','哈密','博尔塔拉','和田']},
    {n:'青海',c:['西宁','海东']},{n:'宁夏',c:['银川','石嘴山','吴忠','固原','中卫']},
    {n:'西藏',c:['拉萨','日喀则','昌都','林芝','山南','那曲']},
    {n:'香港',c:['香港']},{n:'澳门',c:['澳门']},{n:'台湾',c:['台北','高雄','台中','台南','新竹']},
  ];

  // Flat list for coordinate→city lookup
  const CITY_COORDS = [
    ['北京',39.9,116.4,'北京'],['上海',31.2,121.5,'上海'],['广州',23.1,113.3,'广东'],['深圳',22.5,114.1,'广东'],
    ['成都',30.6,104.1,'四川'],['重庆',29.6,106.6,'重庆'],['杭州',30.3,120.2,'浙江'],['武汉',30.6,114.3,'湖北'],
    ['西安',34.3,108.9,'陕西'],['南京',32.1,118.8,'江苏'],['长沙',28.2,112.9,'湖南'],['天津',39.1,117.2,'天津'],
    ['苏州',31.3,120.6,'江苏'],['郑州',34.8,113.6,'河南'],['济南',36.7,117.0,'山东'],['青岛',36.1,120.4,'山东'],
    ['大连',38.9,121.6,'辽宁'],['沈阳',41.8,123.4,'辽宁'],['哈尔滨',45.8,126.5,'黑龙江'],['长春',43.9,125.3,'吉林'],
    ['福州',26.1,119.3,'福建'],['厦门',24.5,118.1,'福建'],['昆明',25.0,102.7,'云南'],['贵阳',26.6,106.6,'贵州'],
    ['南宁',22.8,108.4,'广西'],['海口',20.0,110.3,'海南'],['合肥',31.8,117.2,'安徽'],['南昌',28.7,115.9,'江西'],
    ['太原',37.9,112.6,'山西'],['石家庄',38.0,114.5,'河北'],['兰州',36.1,103.8,'甘肃'],['西宁',36.6,101.8,'青海'],
    ['银川',38.5,106.2,'宁夏'],['乌鲁木齐',43.8,87.6,'新疆'],['呼和浩特',40.8,111.8,'内蒙古'],
    ['东莞',23.0,113.7,'广东'],['佛山',23.0,113.1,'广东'],['珠海',22.3,113.6,'广东'],['惠州',23.1,114.4,'广东'],
    ['中山',22.5,113.4,'广东'],['汕头',23.4,116.7,'广东'],['温州',28.0,120.7,'浙江'],['宁波',29.9,121.5,'浙江'],
    ['无锡',31.6,120.3,'江苏'],['常州',31.8,120.0,'江苏'],['南通',32.0,120.9,'江苏'],['徐州',34.3,117.2,'江苏'],
    ['烟台',37.5,121.4,'山东'],['淄博',36.8,118.1,'山东'],['潍坊',36.7,119.2,'山东'],['洛阳',34.6,112.5,'河南'],
    ['唐山',39.6,118.2,'河北'],['保定',38.9,115.5,'河北'],['襄阳',32.1,112.1,'湖北'],['宜昌',30.7,111.3,'湖北'],
    ['株洲',27.8,113.1,'湖南'],['衡阳',26.9,112.6,'湖南'],['岳阳',29.4,113.1,'湖南'],['赣州',25.8,114.9,'江西'],
    ['桂林',25.3,110.3,'广西'],['三亚',18.3,109.5,'海南'],['绵阳',31.5,104.7,'四川'],['遵义',27.7,106.9,'贵州'],
    ['大理',25.6,100.3,'云南'],['包头',40.7,109.8,'内蒙古'],['大庆',46.6,125.0,'黑龙江'],
    ['扬州',32.4,119.4,'江苏'],['镇江',32.2,119.4,'江苏'],['绍兴',30.1,120.6,'浙江'],['嘉兴',30.8,120.8,'浙江'],
    ['金华',29.1,119.7,'浙江'],['泉州',24.9,118.6,'福建'],['芜湖',31.4,118.4,'安徽'],
    ['咸阳',34.3,108.7,'陕西'],['宝鸡',34.4,107.2,'陕西'],['北海',21.5,109.1,'广西'],
  ];

  function reverseCityName(lat, lon) {
    let best = null, bestDist = Infinity;
    for (const c of CITY_COORDS) {
      const dlat = c[1] - lat, dlon = c[2] - lon;
      const dist = dlat*dlat + dlon*dlon;
      if (dist < bestDist) { bestDist = dist; best = c; }
    }
    if (best && bestDist < 9) return { cityName: best[0], provinceName: best[3] };
    return { cityName: '当前位置', provinceName: best ? best[3] : '' };
  }

  /* ── City search ── */
  function searchCities(query) {
    if (!query||!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results = [];
    PROVINCE_CITIES.forEach(prov => {
      prov.c.forEach(city => {
        if (city.toLowerCase().includes(q) || prov.n.toLowerCase().includes(q)) {
          results.push({ city, province: prov.n });
        }
      });
    });
    return results.slice(0, 30);
  }

  function getProvinceCities() { return PROVINCE_CITIES; }

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

  /* ── IP Geolocation (JSONP via pconline — always calls 'myCallback') ── */
  function getIPLocation() {
    return new Promise((resolve, reject) => {
      console.log('[定位] 正在请求IP定位(JSONP)...');
      var cb = '_jpcb' + Date.now();
      var script = document.createElement('script');
      var tid = setTimeout(() => {
        console.log('[定位] 请求超时(4s), 清理');
        if(script.parentNode)script.parentNode.removeChild(script); delete window.myCallback; reject(new Error('timeout'));
      }, 4000);
      window.myCallback = function(data) {
        clearTimeout(tid); if(script.parentNode)script.parentNode.removeChild(script); delete window.myCallback;
        console.log('[定位] JSONP返回, 原始数据:', JSON.stringify(data));
        if (data && data.city) {
          var cityName = data.city, provName = data.pro || '';
          console.log('[定位] 城市:', cityName, '省份:', provName);
          var lat = 39.9, lon = 116.4;
          for (var i=0;i<CITY_COORDS.length;i++) {
            if (CITY_COORDS[i][0]===cityName) { lat=CITY_COORDS[i][1]; lon=CITY_COORDS[i][2]; break; }
          }
          console.log('[定位] 坐标匹配:', lat, lon);
          resolve({ lat: lat, lon: lon, city: cityName, region: provName });
        } else {
          console.log('[定位] 数据无city字段');
          reject(new Error('no_data'));
        }
      };
      script.src = 'https://whois.pconline.com.cn/ipJson.jsp?callback=myCallback';
      script.onerror = function() {
        console.log('[定位] script加载失败');
        clearTimeout(tid); if(script.parentNode)script.parentNode.removeChild(script); delete window.myCallback; reject(new Error('error'));
      };
      document.head.appendChild(script);
      console.log('[定位] script已插入DOM,等待响应...');
    });
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
      // Try IP first (fast, reliable), fallback to GPS
      const cached = loadCache();
      var located = false;

      // 1. Try IP geolocation (fast, works everywhere)
      console.log('[定位] 开始IP定位...');
      try {
        var ipLoc = await getIPLocation();
        if (ipLoc && ipLoc.city) {
          console.log('[定位] IP定位成功,城市:', ipLoc.city);
          var cityInfo = reverseCityName(ipLoc.lat, ipLoc.lon);
          var cnName = (cityInfo && cityInfo.cityName !== '当前位置') ? cityInfo.cityName : ipLoc.city;
          var cnProv = (cityInfo && cityInfo.provinceName) ? cityInfo.provinceName : ipLoc.region;
          coord = { lat: ipLoc.lat, lon: ipLoc.lon, cityName: cnName, provinceName: cnProv };
          saveCache(ipLoc.lat, ipLoc.lon, cnName, cnProv);
          located = true;
          console.log('[定位] 最终城市:', cnName, cnProv);
        } else {
          console.log('[定位] IP定位返回数据无效');
        }
      } catch(e) { console.log('[定位] IP定位失败:', e.message); }

      // 2. IP failed, try GPS
      if (!located) {
        console.log('[定位] IP失败,尝试GPS...');
        try {
          const pos = await Promise.race([
            getGPSPosition(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('gps_slow')), 5000))
          ]);
          var cityInfo2 = reverseCityName(pos.lat, pos.lon);
          coord = { lat: pos.lat, lon: pos.lon, cityName: cityInfo2.cityName, provinceName: cityInfo2.provinceName };
          saveCache(pos.lat, pos.lon, cityInfo2.cityName, cityInfo2.provinceName);
          located = true;
        } catch(e) {}
      }

      // 3. Both failed, use cache or default
      if (!located) {
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

  return { getWeatherContext, getCurrentPosition: getGPSPosition, cityToCoords, fetchWeather, incrementRefreshCount, saveCachedCoords: saveCache, searchCities, getProvinceCities };
})();
