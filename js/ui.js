/* ============================================================
   ui.js — DOM Rendering v15
   ============================================================ */
const UIModule = (() => {
  function $(id){return document.getElementById(id)}
  function setText(id,t){const e=$(id);if(e)e.textContent=t}
  function setHTML(id,h){const e=$(id);if(e)e.innerHTML=h}
  function show(id){const e=$(id);if(e)e.hidden=false}
  function hide(id){const e=$(id);if(e)e.hidden=true}
  function esc(s){if(!s)return'';const d=document.createElement('div');d.textContent=s;return d.innerHTML}

  /* ── Weather Icons ── */
  function weatherIcon(code,isDay){
    const m={0:isDay?'icon-sun':'icon-sun',1:'icon-sun',2:'icon-sun',3:'icon-cloud',45:'icon-mist',48:'icon-mist',51:'icon-rain',53:'icon-rain',55:'icon-rain',61:'icon-rain',63:'icon-rain',65:'icon-rain',71:'icon-snow',73:'icon-snow',75:'icon-snow',80:'icon-rain',81:'icon-rain',82:'icon-storm',85:'icon-snow',86:'icon-snow',95:'icon-storm',99:'icon-storm'};
    return m[code]||'icon-sun';
  }

  /* ── Render Top Bar ── */
  function renderTopBar(ctx){
    setHTML('top-weather-icon','<svg width="28" height="28"><use href="#'+weatherIcon(ctx.weatherCode,ctx.isDay)+'"/></svg>');
    setText('top-temp',ctx.temperature+'°');
    setText('top-weather-desc',{clear:'晴',overcast:'阴',rainy:'雨',snowy:'雪',humid:'雾',extreme:'恶劣'}[ctx.weatherTag]||'多云');
    setText('top-city-name',ctx.cityName||'北京');
  }

  /* ── Render Meal Header ── */
  function renderMealHeader(mealTime){
    const map={breakfast:['🌅','现在是早餐时间','为你推荐以下三道菜'],lunch:['🌤️','现在是午餐时间','为你推荐以下三道菜'],snack:['🍵','现在是下午茶时间','来点小食吧'],dinner:['🌙','现在是晚餐时间','为你推荐以下三道菜'],late_night:['🌃','现在是夜宵时间','深夜暖胃推荐']};
    const[emoji,title,sub]=map[mealTime]||map.lunch;
    setText('meal-header-icon',emoji);
    setText('meal-header-title',title);
    setText('meal-header-sub',sub);
  }

  /* ── Render 3 Current Meal Recipe Cards ── */
  function renderCurrentMeals(recipes, activeIndex){
    const container=$('current-recipes');
    if(!container)return;
    container.innerHTML=recipes.map((r,i)=>{
      const active=i===activeIndex?' recipe-card--active':'';
      const tags=(r.tags||[]).filter(t=>!t.includes('_weather')).slice(0,6).map(t=>'<span class="tag">'+esc(t)+'</span>').join('');
      return '<div class="recipe-card'+active+'" data-index="'+i+'" data-recipe-id="'+r.id+'">'+
        '<div class="recipe-card-header">'+
          '<span class="recipe-card-emoji">'+r.emoji+'</span>'+
          '<div class="recipe-card-info">'+
            '<div class="recipe-card-name">'+esc(r.name.replace(r.emoji+' ',''))+'</div>'+
            '<div class="recipe-card-desc">'+esc(r.description)+'</div>'+
            '<div class="recipe-card-meta">⏱ '+r.prepTimeMin+'分钟 · '+(r.difficulty==='easy'?'简单':r.difficulty==='medium'?'中等':'挑战')+'</div>'+
          '</div>'+
          '<span class="recipe-card-score">'+r.score+'%</span>'+
        '</div>'+
        '<div class="recipe-card-body">'+
          '<h4>🥬 食材</h4><ul>'+r.ingredients.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>'+
          '<h4>📝 做法</h4><ol>'+r.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>'+
        '</div>'+
        (tags?'<div class="recipe-card-tags">'+tags+'</div>':'')+
      '</div>';
    }).join('');
  }

  /* ── Render Day Recipes (3 cards) ── */
  function renderDayRecipes(dayRecs){
    const container=$('day-recipes');
    if(!container)return;
    const slots=[
      {key:'breakfast',time:'早餐',emoji:'🌅'},
      {key:'lunch',time:'午餐',emoji:'🌤️'},
      {key:'dinner',time:'晚餐',emoji:'🌙'},
      {key:'late_night',time:'夜宵',emoji:'🌃'},
    ];
    container.innerHTML=slots.map(s=>{
      const m=dayRecs[s.key];
      if(!m)return'';
      return '<div class="day-card" data-meal="'+s.key+'" data-recipe-id="'+m.recipe.id+'">'+
        '<div class="day-card-time">'+s.time+'</div>'+
        '<span class="day-card-emoji">'+m.recipe.emoji+'</span>'+
        '<div class="day-card-name">'+esc(m.recipe.name.replace(m.recipe.emoji+' ',''))+'</div>'+
      '</div>';
    }).join('');
  }

  /* ── Display Tags ── */
  function getDisplayTags(tags){
    const m={'cold_dish':'凉拌','stir_fry':'小炒','soup':'汤羹','noodle':'面食','rice':'米饭','hotpot':'火锅','stew':'炖菜','salad':'沙拉','dim_sum':'点心','street_food':'街头美食','home_style':'家常','healthy':'健康','comfort_food':'暖心','quick_easy':'快手','spring':'春','summer':'夏','autumn':'秋','winter':'冬','spicy':'辣','mild':'清淡','sour':'酸','sweet':'甜','savory':'咸香','light':'轻食','hearty':'硬菜','vegetarian':'素食','meat':'荤','seafood':'海鲜','sichuan':'川','guangdong':'粤','hunan':'湘','shandong':'鲁','northeast':'东北','northwest':'西北','southwest':'西南','central':'华中','beijing':'京','shanghai':'沪'};
    return tags.filter(t=>!['hot_weather','warm_weather','cool_weather','cold_weather'].includes(t)).map(t=>m[t]||t).slice(0,8);
  }

  /* ── Takeout ── */
  function renderTakeout(recipe){
    const c=$('takeout-keywords');if(!c)return;
    c.innerHTML=recipe.takeoutKeywords.map(k=>'<span class="keyword-chip" data-keyword="'+esc(k)+'">'+esc(k)+'</span>').join('');
    show('takeout-section');
  }

  /* ── Browse ── */
  function showBrowse(){show('browse-overlay');document.body.style.overflow='hidden'}
  function hideBrowse(){hide('browse-overlay');document.body.style.overflow=''}
  function renderBrowseList(recipes){
    const list=$('browse-list'),empty=$('browse-empty'),loadMore=$('browse-load-more'),count=$('browse-count');
    if(count)count.textContent='· '+recipes.total+' 道';
    if(!recipes.items.length){list.innerHTML='';show('browse-empty');hide('browse-load-more');return}
    hide('browse-empty');
    list.innerHTML=recipes.items.map(r=>{
      const dt=getDisplayTags(r.tags).slice(0,3);
      const isCustom=r.id&&r.id.startsWith('u');
      return '<div class="browse-item" data-recipe-id="'+r.id+'">'+
        '<span class="browse-item-emoji">'+r.emoji+'</span>'+
        '<div class="browse-item-info">'+
          '<div class="browse-item-name">'+esc(r.name.replace(r.emoji+' ',''))+'</div>'+
          '<div class="browse-item-desc">'+esc(r.description)+'</div>'+
          '<div class="browse-item-meta">'+
            (isCustom?'<span class="browse-item-tag custom-tag">我的</span>':'')+
            '<span class="browse-item-tag">⏱ '+r.prepTimeMin+'min</span>'+
            dt.map(t=>'<span class="browse-item-tag">'+esc(t)+'</span>').join('')+
          '</div>'+
        '</div></div>';
    }).join('');
    if(recipes.hasMore)show('browse-load-more');else hide('browse-load-more');
  }
  function renderBrowseDetail(recipe){
    return '<div class="browse-detail"><h4>🥬 食材</h4><ul>'+recipe.ingredients.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul><h4 style="margin-top:10px">📝 做法</h4><ol>'+recipe.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol></div>';
  }

  /* ── Add Modal ── */
  function showAdd(){show('add-modal');document.body.style.overflow='hidden'}
  function hideAdd(){hide('add-modal');document.body.style.overflow=''}
  function getAddData(){
    const n=($('add-name').value||'').trim(),d=($('add-desc').value||'').trim();
    const ir=($('add-ingredients').value||'').trim(),sr=($('add-steps').value||'').trim();
    const t=parseInt($('add-time').value)||20,df=$('add-difficulty').value;
    const tr=($('add-takeout').value||'').trim();
    if(!n||!ir||!sr)return null;
    return{id:'u'+Date.now(),name:'🍽️ '+n,emoji:'🍽️',description:d||'我的私房菜',
      ingredients:ir.split('\n').map(s=>s.trim()).filter(Boolean),
      steps:sr.split('\n').map(s=>s.trim()).filter(Boolean),
      prepTimeMin:Math.max(1,Math.min(300,t)),difficulty:df,
      tags:['home_style','universal','lunch','dinner'],
      takeoutKeywords:tr?tr.split(/[,，]/).map(s=>s.trim()).filter(Boolean):[n]};
  }
  function clearAdd(){$('add-name').value='';$('add-desc').value='';$('add-ingredients').value='';$('add-steps').value='';$('add-time').value='20';$('add-difficulty').value='medium';$('add-takeout').value=''}
  function showError(msg,retry){const b=$('error-banner');b.innerHTML=retry?esc(msg)+' <button class="btn-retry" id="btn-retry">重试</button>':esc(msg);show('error-banner')}
  function hideError(){hide('error-banner')}

  function copyKeywords(recipe){
    const t=recipe.takeoutKeywords.join(' ');
    navigator.clipboard.writeText(t).then(()=>{
      const b=$('btn-copy-keywords');b.textContent='✅ 已复制';setTimeout(()=>{b.innerHTML='<svg width="14" height="14"><use href="#icon-copy"/></svg> 复制关键词'},2000);
    }).catch(()=>{
      const c=$('takeout-keywords'),r=document.createRange();r.selectNodeContents(c);
      const s=window.getSelection();s.removeAllRanges();s.addRange(r);
    });
  }

  return{$,setText,setHTML,show,hide,esc,
    renderTopBar,renderMealHeader,renderCurrentMeals,renderDayRecipes,renderTakeout,
    showBrowse,hideBrowse,renderBrowseList,renderBrowseDetail,
    showAdd,hideAdd,getAddData,clearAdd,showError,hideError,copyKeywords,getDisplayTags
  };
})();
