/* ============================================================
   ui.js — DOM Rendering Module (Culinary Atelier Edition)
   ============================================================ */

const UIModule = (() => {
  /* ==========================================================
     Helpers
     ========================================================== */

  function $(id) { return document.getElementById(id); }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function setHTML(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  function show(id) { const el = $(id); if (el) el.hidden = false; }
  function hide(id) { const el = $(id); if (el) el.hidden = true; }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ==========================================================
     Weather SVG Icon Mapping
     ========================================================== */

  /**
   * Return the SVG icon href for a WMO weather code + day/night.
   * Uses <use href="#icon-xxx"/> references from the inline SVG defs.
   */
  function getWeatherIconHTML(code, isDay) {
    // Nighttime: use moon for clear/partly-cloudy
    if (!isDay && code <= 1) {
      return '<svg width="40" height="40" viewBox="0 0 32 32"><use href="#icon-moon"/></svg>';
    }

    const map = {
      0: 'icon-sun',                    // Clear sky
      1: 'icon-cloud-sun',              // Mainly clear
      2: 'icon-cloud-sun',              // Partly cloudy
      3: 'icon-cloud',                  // Overcast
      45: 'icon-mist', 48: 'icon-mist', // Fog
      51: 'icon-rain', 53: 'icon-rain', 55: 'icon-rain', 57: 'icon-rain',  // Drizzle
      61: 'icon-rain', 63: 'icon-rain', 65: 'icon-rain', 67: 'icon-rain',  // Rain
      71: 'icon-snow', 73: 'icon-snow', 75: 'icon-snow', 77: 'icon-snow',  // Snow
      80: 'icon-rain', 81: 'icon-rain', 82: 'icon-storm',                   // Rain showers
      85: 'icon-snow', 86: 'icon-snow',                                     // Snow showers
      95: 'icon-storm', 96: 'icon-storm', 99: 'icon-storm',                 // Thunderstorm
    };

    const iconId = map[code] || 'icon-cloud';
    return '<svg width="40" height="40" viewBox="0 0 32 32"><use href="#' + iconId + '"/></svg>';
  }

  /** Human-readable weather description */
  function getWeatherDesc(tag) {
    const map = {
      clear: '晴', overcast: '阴', rainy: '雨', snowy: '雪',
      humid: '雾', extreme: '极端天气',
    };
    return map[tag] || '多云';
  }

  /** Temperature category label */
  function getTempLabel(category) {
    const map = { hot: '炎热', warm: '温暖', cool: '凉爽', cold: '寒冷' };
    return map[category] || '';
  }

  /** Season label */
  function getSeasonLabel(season) {
    const map = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
    return map[season] || '';
  }

  /** Meal time label */
  function getMealLabel(mealTime) {
    const map = {
      breakfast: '早餐时间', lunch: '午餐时间', snack: '下午茶',
      dinner: '晚餐时间', late_night: '夜宵时间',
    };
    return map[mealTime] || '';
  }

  /** Difficulty label */
  function getDifficultyLabel(d) {
    const map = { easy: '简单', medium: '中等', hard: '挑战' };
    return map[d] || d;
  }

  /** Filter tags for display */
  function getDisplayTags(tags) {
    const internalPrefixes = ['hot_weather', 'warm_weather', 'cool_weather', 'cold_weather'];
    const displayMap = {
      'cold_dish': '凉拌', 'stir_fry': '小炒', 'soup': '汤羹', 'noodle': '面食',
      'rice': '米饭', 'hotpot': '火锅', 'stew': '炖菜', 'salad': '沙拉',
      'dim_sum': '点心', 'street_food': '街头美食', 'home_style': '家常',
      'healthy': '健康', 'comfort_food': '暖心', 'quick_easy': '快手',
      'spring': '春', 'summer': '夏', 'autumn': '秋', 'winter': '冬',
      'spicy': '辣', 'mild': '清淡', 'sour': '酸', 'sweet': '甜', 'savory': '咸香',
      'light': '轻食', 'hearty': '硬菜', 'vegetarian': '素食', 'meat': '荤', 'seafood': '海鲜',
      'sichuan': '川', 'guangdong': '粤', 'hunan': '湘', 'shandong': '鲁',
      'northeast': '东北', 'northwest': '西北', 'southwest': '西南', 'central': '华中',
      'beijing': '京', 'shanghai': '沪',
    };
    return tags
      .filter(t => !internalPrefixes.includes(t))
      .map(t => displayMap[t] || t)
      .slice(0, 8);
  }

  /* ==========================================================
     Render Functions
     ========================================================== */

  /** Render the weather module */
  function renderWeatherBar(context) {
    setText('city-name', context.cityName || '未知城市');
    setText('temperature', context.temperature);
    setText('weather-desc', getWeatherDesc(context.weatherTag));
    setText('season-tag', getSeasonLabel(context.season));
    setText('meal-period', getMealLabel(context.mealTime));
    setText('temp-tag', '体感 ' + context.feelsLike + '°C · ' + getTempLabel(context.tempCategory));

    // Weather SVG icon
    setHTML('weather-icon-container', getWeatherIconHTML(context.weatherCode, context.isDay));

    // Temperature mood theme class
    document.documentElement.className = 'theme-' + context.tempCategory;
  }

  /** Render primary recipe card */
  function renderPrimaryCard(recipe, score) {
    hide('loading-skeleton');
    show('primary-card');

    // Name with emoji (food emoji is data, not icon library)
    setText('primary-name', recipe.emoji + ' ' + recipe.name);
    setText('primary-desc', recipe.description);
    setText('primary-match', '匹配 ' + score + '%');
    setText('primary-time', recipe.prepTimeMin + ' 分钟');
    setText('primary-difficulty', getDifficultyLabel(recipe.difficulty));

    // Ingredients
    setHTML('primary-ingredients',
      recipe.ingredients.map(i => '<li>' + escapeHtml(i) + '</li>').join(''));

    // Steps
    setHTML('primary-steps',
      recipe.steps.map((s, idx) =>
        '<li value="' + (idx + 1) + '">' + escapeHtml(s) + '</li>'
      ).join(''));

    // Collapse details when switching
    $('primary-details').open = false;

    // Tags
    const displayTags = getDisplayTags(recipe.tags);
    setHTML('primary-tags',
      displayTags.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join(''));

    // Card entrance animation
    const card = $('primary-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  /** Render alternative cards */
  function renderAlternatives(alternatives) {
    if (!alternatives || alternatives.length === 0) {
      hide('alternatives-section');
      return;
    }

    setHTML('alternative-cards', alternatives.map(({ recipe, score }) =>
      '<article class="recipe-card recipe-card--mini" role="article"' +
      ' data-recipe-id="' + escapeHtml(recipe.id) + '"' +
      ' aria-label="' + escapeHtml(recipe.name) + '">' +
      '<h4 class="mini-name">' + recipe.emoji + ' ' + escapeHtml(recipe.name) + '</h4>' +
      '<p class="mini-desc">' + escapeHtml(recipe.description) + '</p>' +
      '<span class="mini-score">' + score + '%</span>' +
      '</article>'
    ).join(''));
    show('alternatives-section');
  }

  /** Render takeout keyword chips */
  function renderTakeoutSection(primaryRecipe) {
    const keywords = primaryRecipe.takeoutKeywords;
    setHTML('takeout-keywords', keywords.map(k =>
      '<span class="keyword-chip" data-keyword="' + escapeHtml(k) + '">' + escapeHtml(k) + '</span>'
    ).join(''));
    show('takeout-section');
  }

  /* ==========================================================
     State Transitions
     ========================================================== */

  function showLoading() {
    show('loading-skeleton');
    hide('primary-card');
    hide('alternatives-section');
    hide('takeout-section');
  }

  function showLocationPrompt(errorType) {
    show('location-prompt');
    const msgMap = {
      'GEOLOCATION_DENIED': '位置权限被拒绝',
      'GEOLOCATION_UNAVAILABLE': '无法获取位置信息',
      'GEOLOCATION_TIMEOUT': '定位请求超时',
      'GEOLOCATION_NOT_SUPPORTED': '您的浏览器不支持定位',
    };
    setText('location-error-msg', msgMap[errorType] || '');
  }

  function hideLocationPrompt() {
    hide('location-prompt');
    setText('location-error-msg', '');
    $('city-input').value = '';
  }

  function showError(message, isRetryable) {
    const banner = $('error-banner');
    if (isRetryable) {
      banner.innerHTML = escapeHtml(message) +
        ' <button class="btn-retry" id="btn-retry">重试</button>';
    } else {
      banner.textContent = message;
    }
    show('error-banner');
  }

  function hideError() {
    hide('error-banner');
  }

  function setOfflineBanner(visible) {
    if (visible) show('offline-banner');
    else hide('offline-banner');
  }

  function setRefreshEnabled(enabled) {
    const btn = $('btn-refresh');
    btn.disabled = !enabled;
    if (enabled) {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 18 18"><use href="#icon-refresh"/></svg> 换一个';
    } else {
      btn.innerHTML = '<span class="ptr-spinner"></span> 加载中...';
    }
  }

  /* ==========================================================
     Copy Helpers
     ========================================================== */

  function copyTakeoutKeywords(primaryRecipe) {
    const text = primaryRecipe.takeoutKeywords.join(' ');
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('btn-copy-keywords');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" style="display:none"><use href="#icon-copy"/></svg> 已复制！去外卖APP搜索吧';
      btn.style.color = 'var(--sage-deep)';
      btn.style.borderColor = 'var(--sage)';
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><use href="#icon-copy"/></svg> 复制关键词';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2500);
    }).catch(() => {
      // Fallback: select text
      const container = $('takeout-keywords');
      const range = document.createRange();
      range.selectNodeContents(container);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      const btn = $('btn-copy-keywords');
      btn.textContent = '已选中，请手动复制';
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><use href="#icon-copy"/></svg> 复制关键词';
      }, 2000);
    });
  }

  function copySingleKeyword(keyword) {
    navigator.clipboard.writeText(keyword).then(() => {}).catch(() => {});
  }

  /* ==========================================================
     Public API
     ========================================================== */

  return {
    $, setText, setHTML, show, hide, escapeHtml,
    getWeatherIconHTML, getWeatherDesc, getSeasonLabel, getMealLabel,
    getDifficultyLabel, getTempLabel,
    renderWeatherBar, renderPrimaryCard, renderAlternatives, renderTakeoutSection,
    showLoading, showLocationPrompt, hideLocationPrompt,
    showError, hideError, setOfflineBanner, setRefreshEnabled,
    copyTakeoutKeywords, copySingleKeyword,
  };
})();
