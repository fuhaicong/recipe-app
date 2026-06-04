/* ============================================================
   app.js — Main Application Orchestrator
   ============================================================ */

const App = (() => {
  const STORAGE_KEY = 'recipe_today';
  const HISTORY_KEY = 'recipe_history';

  /* ==========================================================
     LocalStorage Helpers
     ========================================================== */

  function getCachedToday() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveTodayCache(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        context: data.context,
        primary: data.primary,
        primaryScore: data.primaryScore,
        alternatives: data.alternatives,
        cachedAt: Date.now(),
      }));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  /** Cache is fresh if from the same "recipe day" (6am boundary) */
  function isCacheFresh(cached) {
    if (!cached || !cached.cachedAt) return false;
    const now = new Date();
    const cachedDate = new Date(cached.cachedAt);

    // Adjust both to recipe day (6am boundary)
    const cacheDay = new Date(cachedDate);
    if (cacheDay.getHours() < 6) cacheDay.setDate(cacheDay.getDate() - 1);

    const nowDay = new Date(now);
    if (now.getHours() < 6) nowDay.setDate(nowDay.getDate() - 1);

    return cacheDay.toDateString() === nowDay.toDateString();
  }

  function getRecentRecommendations() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function addToHistory(recipeId) {
    try {
      const history = getRecentRecommendations();
      history.unshift(recipeId);
      // Keep last 14 entries
      const trimmed = history.slice(0, 14);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (e) { /* ignore */ }
  }

  /* ==========================================================
     Render from Cache
     ========================================================== */

  function renderFromCache(cached) {
    if (!cached) return;
    UIModule.renderWeatherBar(cached.context);
    UIModule.renderPrimaryCard(cached.primary, cached.primaryScore);
    if (cached.alternatives && cached.alternatives.length > 0) {
      UIModule.renderAlternatives(cached.alternatives);
    }
    UIModule.renderTakeoutSection(cached.primary);
  }

  /* ==========================================================
     Refresh Logic
     ========================================================== */

  async function refreshRecommendations({ silent, manualCity } = {}) {
    if (!silent) UIModule.showLoading();
    UIModule.setRefreshEnabled(false);
    UIModule.hideError();

    try {
      // Get weather context (auto-detect or manual city)
      let context;
      try {
        context = await WeatherModule.getWeatherContext({ manualCity });
      } catch (geoErr) {
        const code = geoErr.message;
        if (code === 'GEOLOCATION_DENIED' ||
            code === 'GEOLOCATION_UNAVAILABLE' ||
            code === 'GEOLOCATION_TIMEOUT' ||
            code === 'GEOLOCATION_NOT_SUPPORTED') {
          UIModule.showLocationPrompt(code);
          UIModule.setRefreshEnabled(true);
          return; // Wait for manual city input
        }
        throw geoErr;
      }

      UIModule.hideLocationPrompt();

      // Get recent IDs for diversity
      const recentIds = getRecentRecommendations();

      // Get recommendations
      const { primary, primaryScore, alternatives } = RecipeModule.getRecommendations(context, recentIds);

      // Render UI
      UIModule.renderWeatherBar(context);
      UIModule.renderPrimaryCard(primary, primaryScore);
      UIModule.renderAlternatives(alternatives);
      UIModule.renderTakeoutSection(primary);

      // Save to cache
      saveTodayCache({ context, primary, primaryScore, alternatives });

      // Track history
      addToHistory(primary.id);

      // Hide offline banner if we succeeded
      UIModule.setOfflineBanner(false);

    } catch (e) {
      console.error('Refresh failed:', e);

      // Fallback to stale cache
      const stale = getCachedToday();
      if (stale) {
        renderFromCache(stale);
        UIModule.showError('刷新失败，显示上次缓存结果');
      } else {
        UIModule.showError('加载失败，请检查网络后重试', true);
      }
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
    if (!city || !city.trim()) return;
    UIModule.hideLocationPrompt();
    refreshRecommendations({ silent: false, manualCity: city.trim() });
  }

  function onRetryClick() {
    refreshRecommendations({ silent: false });
  }

  function onCopyKeywords() {
    const cached = getCachedToday();
    if (cached && cached.primary) {
      UIModule.copyTakeoutKeywords(cached.primary);
    }
  }

  function onKeywordTap(keyword) {
    UIModule.copySingleKeyword(keyword);
  }

  function onAlternativeCardClick(recipeId) {
    // Find the recipe and swap it to primary
    if (!recipeId) return;
    const recipe = RecipeModule.RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    const cached = getCachedToday();
    if (!cached || !cached.context) return;

    // Re-score for the current context
    const recentIds = getRecentRecommendations();
    const score = RecipeModule.scoreRecipe(recipe, cached.context, recentIds);

    // Update cache
    const newAlternatives = (cached.alternatives || [])
      .filter(a => a.recipe.id !== recipeId)
      .concat([{ recipe: cached.primary, score: cached.primaryScore }])
      .slice(0, 3);

    // Render as primary
    UIModule.renderPrimaryCard(recipe, score);

    // Save updated cache
    const updatedCache = {
      context: cached.context,
      primary: recipe,
      primaryScore: score,
      alternatives: newAlternatives,
      cachedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCache));

    // Update alternatives display
    UIModule.renderAlternatives(newAlternatives);
    UIModule.renderTakeoutSection(recipe);

    addToHistory(recipeId);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================
     Pull-to-Refresh
     ========================================================== */

  function setupPullToRefresh() {
    let startY = 0;
    let pulling = false;
    let pulled = 0;
    const threshold = 70;
    const indicator = document.getElementById('ptr-indicator');

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY <= 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        pulled = Math.min(dy * 0.4, 60);
        indicator.style.transform = 'translateX(-50%) translateY(' + pulled + 'px)';
        if (dy > threshold) {
          indicator.classList.add('ptr-ready');
        } else {
          indicator.classList.remove('ptr-ready');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!pulling) return;
      pulling = false;
      if (pulled > threshold * 0.5) {
        onRefreshClick();
      }
      indicator.style.transform = 'translateX(-50%) translateY(-60px)';
      indicator.classList.remove('ptr-ready');
    });
  }

  /* ==========================================================
     Setup Event Listeners
     ========================================================== */

  function setupEventListeners() {
    // Refresh button
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', onRefreshClick);
    }

    // City form
    const cityForm = document.getElementById('city-form');
    if (cityForm) {
      cityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('city-input');
        onCitySubmit(input ? input.value : '');
      });
    }

    // Copy keywords button
    const btnCopy = document.getElementById('btn-copy-keywords');
    if (btnCopy) {
      btnCopy.addEventListener('click', onCopyKeywords);
    }

    // Error banner retry (delegated)
    const errorBanner = document.getElementById('error-banner');
    if (errorBanner) {
      errorBanner.addEventListener('click', (e) => {
        if (e.target.id === 'btn-retry') {
          onRetryClick();
        }
      });
    }

    // Keyword chip taps (delegated)
    const takeoutKeywords = document.getElementById('takeout-keywords');
    if (takeoutKeywords) {
      takeoutKeywords.addEventListener('click', (e) => {
        if (e.target.classList.contains('keyword-chip')) {
          const keyword = e.target.dataset.keyword;
          onKeywordTap(keyword);
          // Visual feedback
          const original = e.target.textContent;
          e.target.textContent = '✅ ' + original;
          e.target.style.background = 'var(--color-primary-light)';
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.color = 'var(--color-primary)';
          setTimeout(() => {
            e.target.textContent = original;
            e.target.style.background = '';
            e.target.style.borderColor = '';
            e.target.style.color = '';
          }, 1500);
        }
      });
    }

    // Alternative card taps (delegated)
    const altCards = document.getElementById('alternative-cards');
    if (altCards) {
      altCards.addEventListener('click', (e) => {
        const card = e.target.closest('.recipe-card--mini');
        if (card && card.dataset.recipeId) {
          onAlternativeCardClick(card.dataset.recipeId);
        }
      });
    }

    // Pull-to-refresh
    setupPullToRefresh();
  }

  /* ==========================================================
     Init
     ========================================================== */

  async function init() {
    UIModule.showLoading();

    // Online/offline listeners
    window.addEventListener('online', () => UIModule.setOfflineBanner(false));
    window.addEventListener('offline', () => UIModule.setOfflineBanner(true));

    // Initial offline state
    if (!navigator.onLine) {
      UIModule.setOfflineBanner(true);
    }

    try {
      // Step 1: Try cache first for instant render
      const cached = getCachedToday();
      if (cached && isCacheFresh(cached)) {
        renderFromCache(cached);
        // Background refresh if online and cache is over 1 hour old
        if (navigator.onLine && Date.now() - cached.cachedAt > 3600000) {
          setTimeout(() => refreshRecommendations({ silent: true }), 5000);
        }
      } else {
        // No fresh cache — full refresh
        await refreshRecommendations({ silent: false });
      }
    } catch (e) {
      console.error('Init error:', e);
      const cached = getCachedToday();
      if (cached) {
        renderFromCache(cached);
        UIModule.showError('刷新失败，显示上次推荐');
      } else {
        UIModule.showError('加载失败，请检查网络连接后刷新', true);
      }
    }

    // Always set up event listeners
    setupEventListeners();

    // Handle back-forward cache restoration
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        const cached = getCachedToday();
        if (cached && isCacheFresh(cached)) {
          renderFromCache(cached);
        } else if (cached) {
          renderFromCache(cached);
          refreshRecommendations({ silent: true });
        }
      }
    });
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ==========================================================
     Public API
     ========================================================== */

  return {
    refreshRecommendations,
    getRecentRecommendations,
    getCachedToday,
  };
})();
