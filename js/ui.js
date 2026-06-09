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
  var esc = escapeHtml;

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
    setHTML('city-name', '<svg width="14" height="14"><use href="#icon-pin"/></svg> ' + (context.cityName || '未知城市'));
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
     All-Day: Left Tabs + Right Recipes
     ========================================================== */
  var DAY_SLOTS = [
    { key: 'breakfast', time: '早餐', emoji: '🌅' },
    { key: 'lunch', time: '午餐', emoji: '🌤️' },
    { key: 'snack', time: '下午茶', emoji: '🍵' },
    { key: 'dinner', time: '晚餐', emoji: '🌙' },
    { key: 'late_night', time: '夜宵', emoji: '🌃' },
  ];

  function renderTodayMeals(dayData, currentMeal) {
    hide('loading-skeleton');
    var tabsEl = $('day-tabs');
    var contentEl = $('day-content');
    if (!tabsEl || !contentEl) return;

    var activeKey = currentMeal || 'lunch';

    // Left: tabs
    tabsEl.innerHTML = DAY_SLOTS.map(function(slot) {
      return '<div class="day-tab'+(slot.key===activeKey?' day-tab--active':'')+'" data-meal="'+slot.key+'">'+
        '<span class="day-tab-emoji">'+slot.emoji+'</span>'+
        '<span class="day-tab-label">'+slot.time+'</span>'+
      '</div>';
    }).join('');

    // Right: show active meal's recipes
    renderDayContent(dayData, activeKey);
    show('today-meals');
  }

  function renderDayContent(dayData, mealKey) {
    var contentEl = $('day-content');
    if (!contentEl) { console.log('[DayTab] day-content element not found'); return; }
    var top3 = (dayData && dayData[mealKey]) ? dayData[mealKey] : [];
    console.log('[DayTab] mealKey:', mealKey, 'top3 count:', top3.length, 'dayData keys:', dayData ? Object.keys(dayData) : 'null');
    contentEl.innerHTML = '<div class="day-recipes">'+top3.map(function(r) {
      return '<div class="day-recipe">'+
        '<span class="day-recipe-emoji">'+r.recipe.emoji+'</span>'+
        '<div class="day-recipe-info">'+
          '<div class="day-recipe-name">'+esc(r.recipe.name.replace(r.recipe.emoji+' ',''))+'</div>'+
          '<div class="day-recipe-desc">'+esc(r.recipe.description)+'</div>'+
          '<div class="day-recipe-meta">⏱ '+r.recipe.prepTimeMin+'分钟 · '+(r.recipe.difficulty==='easy'?'简单':r.recipe.difficulty==='medium'?'中等':'挑战')+'</div>'+
        '</div>'+
        '<span class="day-recipe-score">'+r.score+'%</span>'+
      '</div>';
    }).join('')+'</div>';
  }

  function switchDayTab(mealKey, dayData) {
    console.log('[DayTab] switchDayTab called, mealKey:', mealKey);
    var tabs = document.querySelectorAll('.day-tab');
    tabs.forEach(function(t) { t.classList.remove('day-tab--active'); });
    var active = document.querySelector('.day-tab[data-meal="'+mealKey+'"]');
    if (active) active.classList.add('day-tab--active');
    renderDayContent(dayData, mealKey);
  }

  /* ==========================================================
     Current Meal Time Section
     ========================================================== */
  function renderCurrentMeal(mealTime, recipes) {
    hide('loading-skeleton');
    show('current-meal');

    const headers = {breakfast:['🌅','现在是早餐时间'],lunch:['🌤️','现在是午餐时间'],snack:['🍵','下午茶时间'],dinner:['🌙','现在是晚餐时间'],late_night:['🌃','现在是夜宵时间']};
    const h = headers[mealTime] || headers.lunch;
    setText('meal-header-icon', h[0]);
    setText('meal-header-title', h[1]);

    // Tab bar (3 tabs)
    const tabBar = $('cm-tab-bar');
    if (tabBar) {
      tabBar.innerHTML = recipes.map((r, i) => {
        const active = i === 0 ? ' cm-tab--active' : '';
        return '<button class="cm-tab' + active + '" data-index="' + i + '">' +
          '<span class="cm-tab-emoji">' + r.recipe.emoji + '</span>' +
          '<span class="cm-tab-name">' + esc(r.recipe.name.replace(r.recipe.emoji + ' ', '')) + '</span>' +
          '<span class="cm-tab-score">' + r.score + '%</span>' +
        '</button>';
      }).join('');
    }

    // Detail panel for active tab (index 0)
    const detail = $('cm-detail');
    if (detail) {
      const r = recipes[0];
      const tags = getDisplayTags(r.recipe.tags).slice(0, 6);
      detail.innerHTML =
        '<div class="cm-detail-meta">' +
          '<span>⏱ ' + r.recipe.prepTimeMin + '分钟</span>' +
          '<span>· ' + (r.recipe.difficulty === 'easy' ? '简单' : r.recipe.difficulty === 'medium' ? '中等' : '挑战') + '</span>' +
          '<span class="cm-detail-score">' + r.score + '% 匹配</span>' +
        '</div>' +
        '<div class="cm-detail-section"><h4>食材</h4><ul>' + r.recipe.ingredients.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
        '<div class="cm-detail-section"><h4>做法</h4><ol>' + r.recipe.steps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></div>' +
        (tags.length ? '<div class="cm-detail-tags">' + tags.map(t => '<span class="cm-tag">' + esc(t) + '</span>').join('') + '</div>' : '');
    }
  }

  function switchCurrentMealTab(index, recipes) {
    // Update tab active state
    const tabs = document.querySelectorAll('.cm-tab');
    tabs.forEach(t => t.classList.remove('cm-tab--active'));
    if (tabs[index]) tabs[index].classList.add('cm-tab--active');

    // Update detail panel
    const detail = $('cm-detail');
    if (!detail || !recipes[index]) return;
    const r = recipes[index];
    const tags = getDisplayTags(r.recipe.tags).slice(0, 6);
    detail.innerHTML =
      '<div class="cm-detail-meta">' +
        '<span>⏱ ' + r.recipe.prepTimeMin + '分钟</span>' +
        '<span>· ' + (r.recipe.difficulty === 'easy' ? '简单' : r.recipe.difficulty === 'medium' ? '中等' : '挑战') + '</span>' +
        '<span class="cm-detail-score">' + r.score + '% 匹配</span>' +
      '</div>' +
      '<div class="cm-detail-section"><h4>食材</h4><ul>' + r.recipe.ingredients.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
      '<div class="cm-detail-section"><h4>做法</h4><ol>' + r.recipe.steps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></div>' +
      (tags.length ? '<div class="cm-detail-tags">' + tags.map(t => '<span class="cm-tag">' + esc(t) + '</span>').join('') + '</div>' : '');
  }

  /* ==========================================================
     Browse Overlay
     ========================================================== */
  function showBrowseOverlay() { show('browse-overlay'); document.body.style.overflow='hidden'; }
  function hideBrowseOverlay() { hide('browse-overlay'); document.body.style.overflow=''; }

  function renderBrowseList(recipes, query, activeTag) {
    const list = $('browse-list');
    const empty = $('browse-empty');
    const loadMore = $('browse-load-more');
    const count = $('browse-count');
    if (count) count.textContent = '· '+recipes.total+' 道';

    if (recipes.items.length === 0) {
      list.innerHTML = '';
      show('browse-empty');
      hide('browse-load-more');
      hide('browse-list');
      return;
    }
    hide('browse-empty');
    show('browse-list');

    list.innerHTML = recipes.items.map(r => {
      const displayTags = getDisplayTags(r.tags).slice(0,3);
      const isCustom = r.id && r.id.startsWith('u');
      return '<div class="browse-item" data-recipe-id="'+r.id+'">' +
        '<span class="browse-item-emoji">'+r.emoji+'</span>' +
        '<div class="browse-item-info">' +
          '<div class="browse-item-name">'+escapeHtml(r.name.replace(r.emoji+' ',''))+'</div>' +
          '<div class="browse-item-desc">'+escapeHtml(r.description)+'</div>' +
          '<div class="browse-item-meta">' +
            (isCustom ? '<span class="browse-item-tag custom-tag">我的</span>' : '') +
            '<span class="browse-item-tag">⏱ '+r.prepTimeMin+'min</span>' +
            displayTags.map(t => '<span class="browse-item-tag">'+escapeHtml(t)+'</span>').join('') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    if (recipes.hasMore) { show('browse-load-more'); } else { hide('browse-load-more'); }
  }

  function renderBrowseDetail(recipe) {
    return '<div class="browse-detail">' +
      '<h4>🥬 食材</h4><ul>'+recipe.ingredients.map(i=>'<li>'+escapeHtml(i)+'</li>').join('')+'</ul>' +
      '<h4 style="margin-top:12px">📝 做法</h4><ol>'+recipe.steps.map(s=>'<li>'+escapeHtml(s)+'</li>').join('')+'</ol>' +
      '</div>';
  }

  /* ==========================================================
     Add Recipe Modal
     ========================================================== */
  function showAddModal() { show('add-modal'); document.body.style.overflow='hidden'; }
  function hideAddModal() { hide('add-modal'); document.body.style.overflow=''; }

  function getAddFormData() {
    const name = ($('add-name').value||'').trim();
    const desc = ($('add-desc').value||'').trim();
    const ingRaw = ($('add-ingredients').value||'').trim();
    const stepsRaw = ($('add-steps').value||'').trim();
    const time = parseInt($('add-time').value)||20;
    const diff = $('add-difficulty').value;
    const takeoutRaw = ($('add-takeout').value||'').trim();

    if (!name || !ingRaw || !stepsRaw) return null;

    const ingredients = ingRaw.split('\n').map(s=>s.trim()).filter(Boolean);
    const steps = stepsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
    const takeoutKeywords = takeoutRaw ? takeoutRaw.split(/[,，]/).map(s=>s.trim()).filter(Boolean) : [name];

    return {
      id: 'u'+Date.now(),
      name: '🍽️ '+name, emoji: '🍽️',
      description: desc || '我的私房菜',
      ingredients, steps,
      prepTimeMin: Math.max(1,Math.min(300,time)),
      difficulty: diff,
      tags: ['home_style','universal','warm_weather','cool_weather','lunch','dinner'],
      takeoutKeywords: takeoutKeywords.length>0 ? takeoutKeywords : [name],
    };
  }

  function clearAddForm() {
    $('add-name').value = '';
    $('add-desc').value = '';
    $('add-ingredients').value = '';
    $('add-steps').value = '';
    $('add-time').value = '20';
    $('add-difficulty').value = 'medium';
    $('add-takeout').value = '';
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
    setText('location-error-msg', '');
    var inp = $('city-input');
    if (inp) inp.value = '';
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
    var btn = $('btn-refresh');
    if (btn) { btn.disabled = !enabled; }
    var btn2 = $('btn-refresh-meal');
    if (btn2) { btn2.disabled = !enabled; }
    if (btn && enabled) {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 18 18"><use href="#icon-refresh"/></svg> 换一个';
    } else if (btn) {
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
    renderTodayMeals, renderCurrentMeal, switchCurrentMealTab, switchDayTab, showBrowseOverlay, hideBrowseOverlay, renderBrowseList,
    renderBrowseDetail, showAddModal, hideAddModal, getAddFormData, clearAddForm,
  };
})();
