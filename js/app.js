/* ============================================================
   app.js — Main Application Orchestrator v2
   ============================================================ */

window.App = (() => {
  const STORAGE_KEY = 'recipe_today';
  const HISTORY_KEY = 'recipe_history';
  const CUSTOM_KEY = 'recipe_custom';
  let currentContext = null;
  let currentMealShown = new Set();

  /* ==========================================================
     LocalStorage Helpers
     ========================================================== */
  function getCachedToday() {
    try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null; } catch(e) { return null; }
  }
  function saveTodayCache(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({...data, cachedAt: Date.now()})); } catch(e) {}
  }
  function isCacheFresh(cached) {
    if (!cached||!cached.cachedAt) return false;
    const now=new Date(), cd=new Date(cached.cachedAt);
    const cacheDay=new Date(cd); if(cacheDay.getHours()<6) cacheDay.setDate(cacheDay.getDate()-1);
    const nowDay=new Date(now); if(now.getHours()<6) nowDay.setDate(nowDay.getDate()-1);
    return cacheDay.toDateString()===nowDay.toDateString();
  }
  function getRecentRecommendations() {
    try { const r=localStorage.getItem(HISTORY_KEY); return r?JSON.parse(r):[]; } catch(e) { return []; }
  }
  function addToHistory(recipeId) {
    try { const h=getRecentRecommendations(); h.unshift(recipeId); localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0,14))); } catch(e) {}
  }

  /* ==========================================================
     Custom Recipes (LocalStorage)
     ========================================================== */
  function getCustomRecipes() {
    try { const r=localStorage.getItem(CUSTOM_KEY); return r?JSON.parse(r):[]; } catch(e) { return []; }
  }
  function saveCustomRecipe(recipe) {
    const list=getCustomRecipes(); list.unshift(recipe); localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  }
  function deleteCustomRecipe(id) {
    const list=getCustomRecipes().filter(r=>r.id!==id); localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  }

  /** Merge custom recipes into the main pool */
  function getAllRecipes() {
    const custom = getCustomRecipes();
    if (custom.length===0) return RecipeModule.RECIPES;
    // Deduplicate with built-in recipes (by name similarity)
    const builtInNames = new Set(RecipeModule.RECIPES.map(r=>r.name));
    const uniqueCustom = custom.filter(r=>!builtInNames.has(r.name));
    return [...RecipeModule.RECIPES, ...uniqueCustom];
  }

  /* ==========================================================
     Render from Cache
     ========================================================== */
  function renderFromCache(cached) {
    if (!cached) return;
    // Always use current meal time, not cached
    var ctx = {...cached.context, mealTime: RecipeModule.getMealTime(new Date().getHours())};
    currentContext = ctx;
    UIModule.hide('loading-skeleton');
    UIModule.renderWeatherBar(ctx);
    if (cached.currentRecs) UIModule.renderCurrentMeal(ctx.mealTime, cached.currentRecs);
    if (cached.currentRecs) { currentMealShown.clear(); cached.currentRecs.forEach(function(r){currentMealShown.add(r.recipe.id);}); }
    if (cached.mealRecs) UIModule.renderTodayMeals(cached.mealRecs);
    if (cached.takeoutPrimary) UIModule.renderTakeoutSection(cached.takeoutPrimary);
  }

  function renderFallback() {
    var now = new Date();
    var fb = {temperature:22,feelsLike:22,tempCategory:'warm',weatherCode:0,weatherTag:'clear',isRainy:false,isSnowy:false,isExtreme:false,isDay:true,humidity:50,season:'summer',mealTime:RecipeModule.getMealTime(now.getHours()),region:'universal',cityName:'北京',provinceName:'北京',dateStr:RecipeModule.formatDateStr(now),session:0};
    currentContext = fb;
    try {
      UIModule.hide('loading-skeleton');
      var cityBtn = document.getElementById('city-name');
      if (cityBtn) cityBtn.innerHTML = '<svg width="14" height="14"><use href=\"#icon-pin\"/></svg> 北京';
      const cRecs = getCurrentMealTop3(fb, []);
      const mealRecs = getMealRecommendations(fb, []);
      const p = cRecs[0]?.recipe || mealRecs['lunch']?.recipe;
      UIModule.renderWeatherBar(fb);
      UIModule.renderCurrentMeal(fb.mealTime, cRecs);
      UIModule.renderTodayMeals(mealRecs);
      if (p) UIModule.renderTakeoutSection(p);
    } catch(e) { UIModule.showError('加载失败，请刷新重试', true); }
  }

  /* ==========================================================
     Whole-Day Recommendations
     ========================================================== */
  function getCurrentMealTop3(context, recentIds) {
    const all = getAllRecipes();
    const ctx = { ...context };
    const scored = all.map(r => ({ recipe: r, score: RecipeModule.scoreRecipe(r, ctx, recentIds) })).sort((a, b) => b.score - a.score);
    const seen = new Set(), results = [];
    for (const s of scored) { if (seen.has(s.recipe.id)) continue; results.push(s); seen.add(s.recipe.id); if (results.length >= 3) break; }
    return results;
  }
  function getCurrentMealTop3All(context, recentIds) {
    const all = getAllRecipes();
    const ctx = { ...context };
    const scored = all.map(r => ({ recipe: r, score: RecipeModule.scoreRecipe(r, ctx, recentIds) })).sort((a, b) => b.score - a.score);
    const seen = new Set(), results = [];
    for (const s of scored) { if (seen.has(s.recipe.id)) continue; results.push(s); seen.add(s.recipe.id); }
    return results;
  }

  function getMealRecommendations(context, recentIds) {
    const allRecipes = getAllRecipes();
    const slots = ['breakfast','lunch','dinner','late_night'];
    const results = {};
    const used = new Set();

    slots.forEach(slot => {
      const ctx = {...context, mealTime: slot};
      // Score all recipes for this meal slot
      const scored = allRecipes
        .map(r => ({ recipe: r, score: RecipeModule.scoreRecipe(r, ctx, recentIds) }))
        .filter(s => !used.has(s.recipe.id))
        .sort((a,b) => b.score - a.score);

      if (scored.length > 0) {
        results[slot] = scored[0];
        used.add(scored[0].recipe.id);
      }
    });
    return results;
  }

  /* ==========================================================
     Refresh Logic
     ========================================================== */
  async function refreshRecommendations({ silent, manualCity } = {}) {
    if (silent) {
      // Don't hide existing content, but still disable refresh during background update
    } else {
      UIModule.showLoading();
    }
    UIModule.setRefreshEnabled(false);
    UIModule.hideError();

    try {
      let context;
      try {
        context = await WeatherModule.getWeatherContext({ manualCity });
      } catch (geoErr) {
        const code = geoErr.message;
        if (['GEOLOCATION_DENIED','GEOLOCATION_UNAVAILABLE','GEOLOCATION_TIMEOUT','GEOLOCATION_NOT_SUPPORTED'].includes(code)) {
          UIModule.showLocationPrompt(code); UIModule.setRefreshEnabled(true); return;
        }
        throw geoErr;
      }
      UIModule.hideLocationPrompt();
      // Update prompt text to show we got location
      const promptText = document.getElementById('location-prompt-text');
      if (promptText) promptText.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" style="vertical-align:-1px;margin-right:4px"><use href="#icon-pin"/></svg> 当前城市：<strong>'+context.cityName+'</strong>';

      const recentIds = getRecentRecommendations();
      const mealRecs = getMealRecommendations(context, recentIds);

      // Render
      currentContext = context;
      UIModule.hide('loading-skeleton');
      UIModule.renderWeatherBar(context);

      // Current meal: top 3 recipes
      const currentSlot = context.mealTime;
      const cRecs = getCurrentMealTop3(context, recentIds);
      UIModule.renderCurrentMeal(currentSlot, cRecs);
      // Track shown recipes to avoid repeats on refresh-click
      currentMealShown.clear();
      cRecs.forEach(function(r){currentMealShown.add(r.recipe.id);});

      UIModule.renderTodayMeals(mealRecs);

      // Pick current meal time's recipe as primary for takeout
      const primary = mealRecs[currentSlot] ? mealRecs[currentSlot].recipe : mealRecs['lunch']?.recipe || mealRecs['dinner']?.recipe;
      if (primary) {
        UIModule.renderTakeoutSection(primary);
        addToHistory(primary.id);
      }

      // Save cache
      saveTodayCache({ context, currentRecs: cRecs, mealRecs, takeoutPrimary: primary });
      UIModule.setOfflineBanner(false);

    } catch (e) {
      console.error('Refresh failed:', e);
      const stale = getCachedToday();
      if (stale) { renderFromCache(stale); UIModule.showError('刷新失败，显示上次结果'); }
      else { UIModule.showError('加载失败，请检查网络后重试', true); }
    } finally {
      UIModule.setRefreshEnabled(true);
    }
  }

  /* ==========================================================
     Event Handlers
     ========================================================== */
  function onRefreshClick() {
    WeatherModule.incrementRefreshCount();
    refreshRecommendations({ silent: false });
  }

  function onRefreshMealClick() {
    if (!currentContext) {
      currentContext = {temperature:22,feelsLike:22,tempCategory:'warm',weatherCode:0,weatherTag:'clear',isDay:true,season:'summer',mealTime:'lunch',region:'universal',cityName:'北京',provinceName:'北京',dateStr:'2026-06-04',session:0};
    }
    var count = WeatherModule.incrementRefreshCount();
    var ctx = Object.assign({}, currentContext, {session: count});
    var recentIds = getRecentRecommendations().concat(Array.from(currentMealShown));
    var allRecs = getCurrentMealTop3All(ctx, recentIds);
    // Filter out already shown, pick 3 new ones
    var fresh = allRecs.filter(function(r){return !currentMealShown.has(r.recipe.id);});
    // If not enough fresh ones, reset and use all
    if (fresh.length < 3) { currentMealShown.clear(); fresh = allRecs; }
    var cRecs = fresh.slice(0, 3);
    cRecs.forEach(function(r){currentMealShown.add(r.recipe.id);});
    UIModule.renderCurrentMeal(ctx.mealTime, cRecs);
    var cached = getCachedToday();
    if (cached) { cached.currentRecs = cRecs; saveTodayCache(cached); }
  }
  function onCitySubmit(city) {
    if (!city||!city.trim()) return;
    UIModule.hideLocationPrompt();
    refreshRecommendations({ silent: false, manualCity: city.trim() });
  }
  function onRetryClick() { refreshRecommendations({ silent: false }); }
  function onCopyKeywords() {
    const cached = getCachedToday();
    if (cached&&cached.takeoutPrimary) UIModule.copyTakeoutKeywords(cached.takeoutPrimary);
  }
  /* ==========================================================
     City Picker
     ========================================================== */
  function openCityPicker() {
    document.getElementById('city-picker-overlay').hidden = false;
    document.body.style.overflow = 'hidden';
    const searchInput = document.getElementById('city-picker-search');
    searchInput.value = '';
    searchInput.focus();
    renderCityPickerProvinces();
  }
  function closeCityPicker() {
    document.getElementById('city-picker-overlay').hidden = true;
    document.body.style.overflow = '';
  }

  function renderCityPickerProvinces() {
    const list = document.getElementById('city-picker-list');
    const provs = WeatherModule.getProvinceCities();
    list.innerHTML = provs.map(p => {
      const citiesHtml = p.c.map(c => '<button class="city-chip" data-city="'+c+'" data-prov="'+p.n+'">'+c+'</button>').join('');
      return '<div class="city-province">' +
        '<div class="city-province-header">'+p.n+'</div>' +
        '<div class="city-province-body">'+citiesHtml+'</div>' +
      '</div>';
    }).join('');

    // Toggle province open/close
    list.querySelectorAll('.city-province-header').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
    });

    // Select city
    list.querySelectorAll('.city-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const city = chip.dataset.city;
        selectCity(city);
      });
    });
  }

  function renderCitySearchResults(query) {
    const list = document.getElementById('city-picker-list');
    const results = WeatherModule.searchCities(query);
    if (results.length === 0) {
      list.innerHTML = '<div class="city-picker-empty">未找到匹配城市</div>';
      return;
    }
    list.innerHTML = results.map(r =>
      '<div class="city-search-result" data-city="'+r.city+'">' +
        '<span>'+r.city+'</span>' +
        '<span class="province-hint">'+r.province+'</span>' +
      '</div>'
    ).join('');
    list.querySelectorAll('.city-search-result').forEach(el => {
      el.addEventListener('click', () => selectCity(el.dataset.city));
    });
  }

  function selectCity(city) {
    closeCityPicker();
    document.getElementById('city-name').innerHTML = '<svg width="14" height="14"><use href="#icon-pin"/></svg> ' + city;
    // Trigger refresh with selected city
    refreshRecommendations({ silent: false, manualCity: city });
  }

  function onCityPickerSearch(e) {
    const q = e.target.value.trim();
    if (q) renderCitySearchResults(q);
    else renderCityPickerProvinces();
  }

  async function onRelocate() {
    const btn = document.getElementById('btn-relocate');
    const promptText = document.getElementById('location-prompt-text');
    if (btn) { btn.disabled = true; }

    let permDenied = false;
    try {
      const perm = await navigator.permissions.query({ name: 'geolocation' });
      permDenied = (perm.state === 'denied');
    } catch(e) {}

    try { localStorage.removeItem('rc2'); } catch(e) {}

    try {
      const pos = await WeatherModule.getCurrentPosition();
      if (pos && pos.lat != null) {
        WeatherModule.saveCachedCoords(pos.lat, pos.lon, '当前位置', '');
        if (promptText) promptText.innerHTML = '📍 定位成功！当前：<strong>附近位置</strong>';
        await refreshRecommendations({ silent: false });
      }
    } catch(e) {
      if (e.message === 'denied') {
        if (promptText) {
          const isIOS = /iPhone|iPad|iOS/i.test(navigator.userAgent);
          const hint = isIOS
            ? '设置 → 隐私与安全性 → 定位服务 → Safari → 允许'
            : '浏览器地址栏左侧锁图标 → 权限 → 位置 → 允许';
          promptText.innerHTML = '⚠️ 定位权限未开启<br><small style="color:#888">' + hint + '</small>';
        }
      } else if (e.message === 'timeout') {
        if (promptText) promptText.innerHTML = '⚠️ 定位超时，请确保GPS已开启<br><small style="color:#888">或直接下方输入城市名</small>';
      } else {
        if (promptText) promptText.innerHTML = '⚠️ 定位失败，请直接下方输入城市名';
      }
    }

    if (btn) { btn.disabled = false; }
  }

  function onMealSlotClick(recipeId) {
    if (!recipeId) return;
    const allRecipes = getAllRecipes();
    const recipe = allRecipes.find(r=>r.id===recipeId);
    if (!recipe) return;
    // Show detail in a simple alert style or swap takeout section
    UIModule.renderTakeoutSection(recipe);
    window.scrollTo({ top: document.getElementById('takeout-section').offsetTop - 20, behavior: 'smooth' });
  }

  /* ==========================================================
     Browse Recipes
     ========================================================== */
  const BROWSE_PAGE_SIZE = 30;
  let browseState = { query:'', activeTag:'', page:0, allFiltered:[] };

  function openBrowse() {
    browseState = { query:'', activeTag:'', page:0, allFiltered:[] };
    UIModule.showBrowseOverlay();
    filterAndRenderBrowse();
    renderBrowseTags();
  }

  function closeBrowse() {
    UIModule.hideBrowseOverlay();
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('nav-item--active'));
    var recTab = document.querySelector('.nav-item[data-tab=\"recommend\"]');
    if (recTab) recTab.classList.add('nav-item--active');
  }

  function filterAndRenderBrowse() {
    const allRecipes = getAllRecipes();
    const q = browseState.query.toLowerCase();
    const tag = browseState.activeTag;

    let filtered = allRecipes;
    if (q) filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.ingredients.some(i=>i.toLowerCase().includes(q))
    );
    if (tag) filtered = filtered.filter(r => r.tags.includes(tag));

    browseState.allFiltered = filtered;
    browseState.page = 0;
    renderBrowsePage();
  }

  function renderBrowsePage() {
    const filtered = browseState.allFiltered;
    const start = 0;
    const end = (browseState.page + 1) * BROWSE_PAGE_SIZE;
    const items = filtered.slice(start, end);
    const hasMore = end < filtered.length;

    UIModule.renderBrowseList(
      { items, total: filtered.length, hasMore },
      browseState.query,
      browseState.activeTag
    );
  }

  function loadMoreBrowse() {
    browseState.page++;
    renderBrowsePage();
  }

  function renderBrowseTags() {
    const container = document.getElementById('browse-tags');
    if (!container) return;
    const tags = ['stir_fry','soup','noodle','cold_dish','stew','rice','hotpot','steam','quick_easy','spicy','vegetarian'];
    const tagLabels = { stir_fry:'小炒',soup:'汤羹',noodle:'面食',cold_dish:'凉拌',stew:'炖菜',rice:'米饭',hotpot:'火锅',steam:'清蒸',quick_easy:'快手',spicy:'辣',vegetarian:'素食' };
    container.innerHTML = tags.map(t => {
      const active = browseState.activeTag===t ? ' active' : '';
      return '<button class="browse-tag-chip'+active+'" data-tag="'+t+'">'+ (tagLabels[t]||t) +'</button>';
    }).join('');
  }

  function onBrowseTagClick(tag) {
    if (browseState.activeTag===tag) { browseState.activeTag=''; }
    else { browseState.activeTag=tag; }
    filterAndRenderBrowse();
    renderBrowseTags();
  }

  function onBrowseSearch(e) {
    browseState.query = e.target.value;
    filterAndRenderBrowse();
  }

  function onBrowseItemClick(recipeId) {
    const allRecipes = getAllRecipes();
    const recipe = allRecipes.find(r=>r.id===recipeId);
    if (!recipe) return;

    // Toggle detail inline
    const item = document.querySelector('[data-recipe-id="'+recipeId+'"].browse-item');
    if (!item) return;
    const existing = item.nextElementSibling;
    if (existing && existing.classList.contains('browse-detail')) {
      existing.remove();
    } else {
      const detail = document.createElement('div');
      detail.className = 'browse-detail';
      detail.innerHTML = UIModule.renderBrowseDetail(recipe);
      item.after(detail);
      detail.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
  }

  /* ==========================================================
     Add Custom Recipe
     ========================================================== */
  function openAddModal() { UIModule.showAddModal(); }
  function closeAddModal() { UIModule.hideAddModal(); UIModule.clearAddForm(); }

  function onSubmitRecipe(e) {
    e.preventDefault();
    const recipe = UIModule.getAddFormData();
    if (!recipe) { UIModule.showError('请填写菜名、食材和做法'); setTimeout(()=>UIModule.hideError(),2000); return; }
    saveCustomRecipe(recipe);
    UIModule.clearAddForm();
    UIModule.hideAddModal();
    // Brief success feedback
    const fab = document.getElementById('fab-add');
    if (fab) { fab.style.background='var(--sage)'; setTimeout(()=>{fab.style.background=''},800); }
  }

  /* ==========================================================
     Pull-to-Refresh
     ========================================================== */
  function setupPullToRefresh() {
    let startY=0, pulling=false, pulled=0;
    const threshold=70, indicator=document.getElementById('ptr-indicator');
    document.addEventListener('touchstart',(e)=>{ if(window.scrollY<=0){ startY=e.touches[0].clientY; pulling=true; } },{passive:true});
    document.addEventListener('touchmove',(e)=>{
      if(!pulling)return; const dy=e.touches[0].clientY-startY;
      if(dy>0){ pulled=Math.min(dy*0.4,60); indicator.style.transform='translateX(-50%) translateY('+pulled+'px)';
        if(dy>threshold) indicator.classList.add('ptr-ready'); else indicator.classList.remove('ptr-ready'); }
    },{passive:true});
    document.addEventListener('touchend',()=>{
      if(!pulling)return; pulling=false;
      if(pulled>threshold*0.5) onRefreshClick();
      indicator.style.transform='translateX(-50%) translateY(-64px)'; indicator.classList.remove('ptr-ready');
    });
  }

  /* ==========================================================
     Setup Event Listeners
     ========================================================== */
  function setupEventListeners() {
    // Refresh
    const btnRefresh=document.getElementById('btn-refresh');
    if(btnRefresh) btnRefresh.addEventListener('click',onRefreshClick);

    // Browse
    const btnBrowse=document.getElementById('btn-browse');
    if(btnBrowse) btnBrowse.addEventListener('click',openBrowse);
    const btnCloseBrowse=document.getElementById('btn-close-browse');
    if(btnCloseBrowse) btnCloseBrowse.addEventListener('click',closeBrowse);

    // Browse search
    const browseSearch=document.getElementById('browse-search');
    if(browseSearch) browseSearch.addEventListener('input',onBrowseSearch);

    // Browse tags (delegated)
    const browseTags=document.getElementById('browse-tags');
    if(browseTags) browseTags.addEventListener('click',(e)=>{ if(e.target.classList.contains('browse-tag-chip')) onBrowseTagClick(e.target.dataset.tag); });

    // Browse list items (delegated)
    const browseList=document.getElementById('browse-list');
    if(browseList) browseList.addEventListener('click',(e)=>{ const item=e.target.closest('.browse-item'); if(item) onBrowseItemClick(item.dataset.recipeId); });

    // Load more
    const btnLoadMore=document.getElementById('btn-load-more');
    if(btnLoadMore) btnLoadMore.addEventListener('click',loadMoreBrowse);

    // City picker
    const cityName = document.getElementById('city-name');
    if (cityName) cityName.addEventListener('click', openCityPicker);
    const btnCloseCity = document.getElementById('btn-close-city-picker');
    if (btnCloseCity) btnCloseCity.addEventListener('click', closeCityPicker);
    const citySearch = document.getElementById('city-picker-search');
    if (citySearch) citySearch.addEventListener('input', onCityPickerSearch);
    const cityOverlay = document.getElementById('city-picker-overlay');
    if (cityOverlay) cityOverlay.addEventListener('click',(e)=>{if(e.target===e.currentTarget)closeCityPicker()});

    // Relocate button
    const btnRelocate = document.getElementById('btn-relocate');
    if (btnRelocate) btnRelocate.addEventListener('click', onRelocate);

    // Bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function(){
        var tab = this.dataset.tab;
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('nav-item--active'));
        this.classList.add('nav-item--active');
        if (tab === 'recommend') {
          UIModule.hideBrowseOverlay();
        } else if (tab === 'recipes') {
          openBrowse();
        }
      });
    });

    // Tab bar: switch active recipe
    const tabBar = document.getElementById('cm-tab-bar');
    if (tabBar) tabBar.addEventListener('click', (e) => {
      const tab = e.target.closest('.cm-tab');
      if (!tab) return;
      const idx = parseInt(tab.dataset.index);
      // Get current recipes from cache
      const cached = getCachedToday();
      const recs = cached?.currentRecs || [];
      if (recs[idx]) UIModule.switchCurrentMealTab(idx, recs);
    });

    // Today's meal slots (delegated)
    const mealsGrid=document.getElementById('today-meals-grid');
    if(mealsGrid) mealsGrid.addEventListener('click',(e)=>{ const card=e.target.closest('.meal-slot-card'); if(card) onMealSlotClick(card.dataset.recipeId); });

    // Add recipe
    const fabAdd=document.getElementById('fab-add');
    if(fabAdd) fabAdd.addEventListener('click',openAddModal);
    const btnCloseAdd=document.getElementById('btn-close-add');
    if(btnCloseAdd) btnCloseAdd.addEventListener('click',closeAddModal);
    const addForm=document.getElementById('add-form');
    if(addForm) addForm.addEventListener('submit',onSubmitRecipe);

    // City form
    const cityForm=document.getElementById('city-form');
    if(cityForm) cityForm.addEventListener('submit',(e)=>{ e.preventDefault(); onCitySubmit(document.getElementById('city-input')?.value||''); });

    // Copy keywords
    const btnCopy=document.getElementById('btn-copy-keywords');
    if(btnCopy) btnCopy.addEventListener('click',onCopyKeywords);

    // Error banner retry
    const errorBanner=document.getElementById('error-banner');
    if(errorBanner) errorBanner.addEventListener('click',(e)=>{ if(e.target.id==='btn-retry') onRetryClick(); });

    // Keyword chip taps
    const takeoutKeywords=document.getElementById('takeout-keywords');
    if(takeoutKeywords) takeoutKeywords.addEventListener('click',(e)=>{
      if(e.target.classList.contains('keyword-chip')) {
        const kw=e.target.dataset.keyword; UIModule.copySingleKeyword(kw);
        const orig=e.target.textContent; e.target.textContent='✓ '+orig;
        e.target.style.background='var(--amber-light)'; e.target.style.borderColor='var(--amber)'; e.target.style.color='var(--amber-deep)';
        setTimeout(()=>{ e.target.textContent=orig; e.target.style.background=''; e.target.style.borderColor=''; e.target.style.color=''; },1500);
      }
    });

    // Close overlays on backdrop tap
    document.getElementById('browse-overlay')?.addEventListener('click',(e)=>{ if(e.target===e.currentTarget) closeBrowse(); });
    document.getElementById('add-modal')?.addEventListener('click',(e)=>{ if(e.target===e.currentTarget) closeAddModal(); });

    setupPullToRefresh();
  }

  /* ==========================================================
     Init
     ========================================================== */
  function init() {
    window.addEventListener('online',()=>UIModule.setOfflineBanner(false));
    window.addEventListener('offline',()=>UIModule.setOfflineBanner(true));
    if(!navigator.onLine) UIModule.setOfflineBanner(true);

    // Render IMMEDIATELY — zero async, zero API
    var cached = getCachedToday();
    var hasCache = cached && isCacheFresh(cached);
    if (hasCache) {
      renderFromCache(cached);
    } else {
      renderFallback();
    }

    setupEventListeners();

    // Background: try GPS + weather to update location & recipes
    if (!hasCache) {
      setTimeout(() => { refreshRecommendations({silent:true}).catch(()=>{}); }, 500);
    }
    setTimeout(() => { checkPermissionInBackground(); }, 2000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();

  return { refreshRecommendations, getRecentRecommendations, getCachedToday, getCustomRecipes, saveCustomRecipe, refreshCurrentMeal: onRefreshMealClick };
})();
