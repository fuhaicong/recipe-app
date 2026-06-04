/* ============================================================
   app.js — Main Application Orchestrator v2
   ============================================================ */

const App = (() => {
  const STORAGE_KEY = 'recipe_today';
  const HISTORY_KEY = 'recipe_history';
  const CUSTOM_KEY = 'recipe_custom';

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
    UIModule.renderWeatherBar(cached.context);
    if (cached.mealRecs) UIModule.renderTodayMeals(cached.mealRecs);
    if (cached.takeoutPrimary) UIModule.renderTakeoutSection(cached.takeoutPrimary);
  }

  /* ==========================================================
     Whole-Day Recommendations
     ========================================================== */
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
    if (!silent) UIModule.showLoading();
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
      UIModule.renderWeatherBar(context);
      UIModule.renderTodayMeals(mealRecs);

      // Pick current meal time's recipe as primary for takeout
      const currentSlot = context.mealTime;
      const primary = mealRecs[currentSlot] ? mealRecs[currentSlot].recipe : mealRecs['lunch']?.recipe || mealRecs['dinner']?.recipe;
      if (primary) {
        UIModule.renderTakeoutSection(primary);
        addToHistory(primary.id);
      }

      // Save cache
      saveTodayCache({ context, mealRecs, takeoutPrimary: primary });
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
  async function onRelocate() {
    const btn = document.getElementById('btn-relocate');
    const promptText = document.getElementById('location-prompt-text');
    if (btn) { btn.disabled = true; btn.textContent = '定位中...'; }

    // Check permission state first
    let permDenied = false;
    try {
      const perm = await navigator.permissions.query({ name: 'geolocation' });
      permDenied = (perm.state === 'denied');
    } catch(e) { /* permissions API not supported */ }

    // Clear old cache
    try { localStorage.removeItem('rc2'); } catch(e) {}

    try {
      const pos = await WeatherModule.getCurrentPosition();
      if (pos && pos.lat != null) {
        WeatherModule.saveCachedCoords(pos.lat, pos.lon, '当前位置', '');
        if (promptText) promptText.innerHTML = '📍 定位成功！当前：<strong>附近位置</strong>';
        await refreshRecommendations({ silent: false });
      }
    } catch(e) {
      if (permDenied || e.message === 'denied') {
        // Permission permanently denied — tell user how to fix
        if (promptText) {
          const isIOS = /iPhone|iPad|iOS/i.test(navigator.userAgent);
          const hint = isIOS
            ? '设置 → 隐私与安全性 → 定位服务 → Safari → 允许'
            : '浏览器地址栏左侧锁图标 → 权限 → 位置 → 允许';
          promptText.innerHTML = '⚠️ 定位权限未开启<br><small style="color:#888">' + hint + '<br>或直接下方输入城市名↓</small>';
        }
      } else {
        UIModule.showError('定位失败，请在下方输入城市名');
        setTimeout(() => UIModule.hideError(), 3000);
      }
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="14" height="14"><use href="#icon-pin"/></svg> 重新定位'; }
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

  function closeBrowse() { UIModule.hideBrowseOverlay(); }

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

    // Relocate button
    const btnRelocate = document.getElementById('btn-relocate');
    if (btnRelocate) btnRelocate.addEventListener('click', onRelocate);

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
  async function init() {
    UIModule.showLoading();
    window.addEventListener('online',()=>UIModule.setOfflineBanner(false));
    window.addEventListener('offline',()=>UIModule.setOfflineBanner(true));
    if(!navigator.onLine) UIModule.setOfflineBanner(true);

    // Check geolocation permission state
    let permDenied = false;
    try {
      const perm = await navigator.permissions.query({ name: 'geolocation' });
      permDenied = (perm.state === 'denied');
      // Listen for changes (user might enable it in settings and come back)
      perm.addEventListener('change', () => {
        if (perm.state === 'granted') {
          // User just enabled location — refresh!
          onRelocate();
        }
      });
    } catch(e) { /* permissions API not available */ }

    const promptText = document.getElementById('location-prompt-text');
    if (permDenied && promptText) {
      promptText.innerHTML = '⚠️ 定位权限已被拒绝<br><small style="color:#888">点击下方「重新定位」查看如何开启</small>';
    }

    try {
      const cached = getCachedToday();
      if (cached && isCacheFresh(cached)) {
        renderFromCache(cached);
        // Always try GPS refresh in background (will prompt if permission is "prompt")
        if (navigator.onLine) {
          setTimeout(() => refreshRecommendations({ silent: true }), 2000);
        }
      } else {
        await refreshRecommendations({ silent: false });
      }
    } catch(e) {
      console.error('Init error:', e);
      const cached = getCachedToday();
      if (cached) { renderFromCache(cached); UIModule.showError('刷新失败，显示上次推荐'); }
      else { UIModule.showError('加载失败，请检查网络连接', true); }
    }

    setupEventListeners();

    // Back-forward cache
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        const c = getCachedToday();
        if (c && isCacheFresh(c)) renderFromCache(c);
        else if (c) { renderFromCache(c); refreshRecommendations({ silent: true }); }
      }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();

  return { refreshRecommendations, getRecentRecommendations, getCachedToday, getCustomRecipes, saveCustomRecipe };
})();
