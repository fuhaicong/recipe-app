/* ============================================================
   app.js — Main Orchestrator v15
   ============================================================ */
const App = (() => {
  const SK='rt',HK='rh',CK='rc3';

  /* ── Storage ── */
  function getCached(k,ttl){
    try{const r=localStorage.getItem(k);if(!r)return null;const d=JSON.parse(r);return(Date.now()-d.t<ttl)?d:null}catch(e){return null}
  }
  function setCached(k,v){try{localStorage.setItem(k,JSON.stringify({...v,t:Date.now()}))}catch(e){}}
  function getCachedToday(){return getCached(SK,86400000)}
  function saveCachedToday(d){setCached(SK,d)}
  function isCacheFresh(c){if(!c||!c.t)return false;const n=new Date(),cd=new Date(c.t);if(cd.getHours()<6)cd.setDate(cd.getDate()-1);const nd=new Date(n);if(nd.getHours()<6)nd.setDate(nd.getDate()-1);return cd.toDateString()===nd.toDateString()}
  function getHistory(){try{const r=localStorage.getItem(HK);return r?JSON.parse(r):[]}catch(e){return[]}}
  function addHistory(id){const h=getHistory();h.unshift(id);localStorage.setItem(HK,JSON.stringify(h.slice(0,14)))}
  function getCustom(){try{const r=localStorage.getItem(CK);return r?JSON.parse(r):[]}catch(e){return[]}}
  function saveCustom(r){const l=getCustom();l.unshift(r);localStorage.setItem(CK,JSON.stringify(l))}
  function getAllRecipes(){const c=getCustom();return c.length?[...RecipeModule.RECIPES,...c.filter(r=>!RecipeModule.RECIPES.some(b=>b.name===r.name))]:RecipeModule.RECIPES}

  /* ── Recommendations ── */
  function getMealRecs(context,recentIds,count){
    const all=getAllRecipes();
    const ctx={...context};
    const scored=all.map(r=>({recipe:r,score:RecipeModule.scoreRecipe(r,ctx,recentIds)})).sort((a,b)=>b.score-a.score);
    const seen=new Set();const results=[];
    for(const s of scored){if(seen.has(s.recipe.id))continue;results.push({recipe:s.recipe,score:s.score});seen.add(s.recipe.id);if(results.length>=count)break}
    return results;
  }
  function getDayRecs(context,recentIds){
    const all=getAllRecipes();const slots=['breakfast','lunch','dinner','late_night'];
    const results={};const used=new Set();
    slots.forEach(slot=>{
      const ctx={...context,mealTime:slot};
      const scored=all.map(r=>({recipe:r,score:RecipeModule.scoreRecipe(r,ctx,recentIds)})).filter(s=>!used.has(s.recipe.id)).sort((a,b)=>b.score-a.score);
      if(scored.length){results[slot]=scored[0];used.add(scored[0].recipe.id)}
    });
    return results;
  }

  /* ── Render ── */
  let currentMeals=[],dayRecs={},currentContext=null;

  function render(context,recentIds){
    currentContext=context;
    UIModule.renderTopBar(context);
    UIModule.renderMealHeader(context.mealTime);

    // 3 recipes for current meal time
    currentMeals=getMealRecs(context,recentIds,3);
    UIModule.renderCurrentMeals(currentMeals,0); // first one expanded by default

    // Day recommendations
    dayRecs=getDayRecs(context,recentIds);
    UIModule.renderDayRecipes(dayRecs);

    // Takeout from top recipe
    if(currentMeals.length)UIModule.renderTakeout(currentMeals[0].recipe);

    // Track
    addHistory(currentMeals[0]?.recipe?.id);
    saveCachedToday({context,currentMeals,dayRecs});
  }

  /* ── Refresh ── */
  async function refresh(opts={}){
    const btnR=$('btn-refresh'),btnR2=$('btn-refresh2');
    if(btnR)btnR.disabled=true;if(btnR2)btnR2.disabled=true;
    try{
      const ctx=await WeatherModule.getWeatherContext(opts);
      const recentIds=getHistory();
      render(ctx,recentIds);
    }catch(e){
      console.error(e);
      const fb={temperature:22,feelsLike:22,tempCategory:'warm',weatherCode:0,weatherTag:'clear',isDay:true,season:'summer',mealTime:'lunch',region:'universal',cityName:'北京',provinceName:'北京',dateStr:'2026-06-04',session:0};
      render(fb,[]);
    }
    if(btnR)btnR.disabled=false;if(btnR2)btnR2.disabled=false;
  }

  /* ── City Edit ── */
  function openCityEdit(){
    const bar=$('top-city'),edit=$('city-edit'),input=$('city-edit-input');
    bar.hidden=true;edit.hidden=false;input.value='';input.focus();
  }
  function closeCityEdit(){const bar=$('top-city'),edit=$('city-edit');bar.hidden=false;edit.hidden=true}
  async function submitCity(){
    const input=$('city-edit-input');const city=input.value.trim();
    if(!city)return;
    closeCityEdit();
    await refresh({manualCity:city});
  }

  /* ── Card Clicks ── */
  function onCurrentCardClick(index,recipeId){
    // Toggle active card
    currentMeals.forEach((m,i)=>{
      const card=document.querySelector('#current-recipes .recipe-card[data-index="'+i+'"]');
      if(!card)return;
      if(i===index)card.classList.toggle('recipe-card--active');
      else card.classList.remove('recipe-card--active');
    });
    // Update takeout
    const meal=currentMeals.find(m=>m.recipe.id===recipeId);
    if(meal)UIModule.renderTakeout(meal.recipe);
  }

  function onDayCardClick(mealSlot,recipeId){
    // Find the recipe
    const all=getAllRecipes();
    const recipe=all.find(r=>r.id===recipeId);
    if(!recipe)return;
    // Show as a 4th card in current meals section or just show takeout
    UIModule.renderTakeout(recipe);
    document.getElementById('takeout-section')?.scrollIntoView({behavior:'smooth'});
  }

  /* ── Browse ── */
  const PS=30;let bState={query:'',tag:'',page:0,all:[]};
  function openBrowse(){bState={query:'',tag:'',page:0,all:[]};UIModule.showBrowse();doBrowse();renderBrowseTags()}
  function closeBrowse(){UIModule.hideBrowse()}
  function doBrowse(){
    let all=getAllRecipes();
    const q=bState.query.toLowerCase();
    if(q)all=all.filter(r=>r.name.toLowerCase().includes(q)||r.description.toLowerCase().includes(q)||r.ingredients.some(i=>i.toLowerCase().includes(q)));
    if(bState.tag)all=all.filter(r=>r.tags.includes(bState.tag));
    bState.all=all;bState.page=0;renderBrowsePage();
  }
  function renderBrowsePage(){
    const items=bState.all.slice(0,(bState.page+1)*PS);
    UIModule.renderBrowseList({items,total:bState.all.length,hasMore:items.length<bState.all.length});
  }
  function loadMore(){bState.page++;renderBrowsePage()}
  function renderBrowseTags(){
    const c=$('browse-tags');if(!c)return;
    const tags=['stir_fry','soup','noodle','cold_dish','stew','rice','hotpot','quick_easy','spicy','vegetarian'];
    const tl={stir_fry:'小炒',soup:'汤羹',noodle:'面食',cold_dish:'凉拌',stew:'炖菜',rice:'米饭',hotpot:'火锅',quick_easy:'快手',spicy:'辣',vegetarian:'素食'};
    c.innerHTML=tags.map(t=>'<button class="browse-tag-chip'+(bState.tag===t?' active':'')+'" data-tag="'+t+'">'+(tl[t]||t)+'</button>').join('');
  }
  function onBrowseTag(t){bState.tag=bState.tag===t?'':t;doBrowse();renderBrowseTags()}
  function onBrowseItem(id){
    const all=getAllRecipes();const r=all.find(x=>x.id===id);if(!r)return;
    const item=document.querySelector('[data-recipe-id="'+id+'"].browse-item');if(!item)return;
    const ex=item.nextElementSibling;
    if(ex&&ex.classList.contains('browse-detail'))ex.remove();
    else{const d=document.createElement('div');d.className='browse-detail';d.innerHTML=UIModule.renderBrowseDetail(r);item.after(d);d.scrollIntoView({behavior:'smooth',block:'nearest'})}
  }

  /* ── Add ── */
  function openAdd(){UIModule.showAdd()}
  function closeAdd(){UIModule.hideAdd();UIModule.clearAdd()}
  function submitAdd(e){
    e.preventDefault();const r=UIModule.getAddData();
    if(!r){UIModule.showError('请填写菜名、食材和做法');setTimeout(()=>UIModule.hideError(),2000);return}
    saveCustom(r);UIModule.clearAdd();UIModule.hideAdd();
  }

  /* ── Events ── */
  function setupEvents(){
    // Refresh
    $('btn-refresh')?.addEventListener('click',()=>{WeatherModule.incrementRefreshCount();refresh()});
    $('btn-refresh2')?.addEventListener('click',()=>{WeatherModule.incrementRefreshCount();refresh()});

    // City
    $('top-city')?.addEventListener('click',openCityEdit);
    $('city-edit-close')?.addEventListener('click',closeCityEdit);
    $('city-edit-ok')?.addEventListener('click',submitCity);
    $('city-edit-input')?.addEventListener('keydown',(e)=>{if(e.key==='Enter')submitCity()});

    // Current recipe cards
    $('current-recipes')?.addEventListener('click',(e)=>{
      const card=e.target.closest('.recipe-card');if(!card)return;
      const idx=parseInt(card.dataset.index);const rid=card.dataset.recipeId;
      if(e.target.closest('.recipe-card-body')||e.target.closest('.recipe-card-tags'))return; // don't toggle when clicking body content
      onCurrentCardClick(idx,rid);
    });

    // Day recipe cards
    $('day-recipes')?.addEventListener('click',(e)=>{
      const card=e.target.closest('.day-card');if(!card)return;
      onDayCardClick(card.dataset.meal,card.dataset.recipeId);
    });

    // Browse
    $('btn-browse')?.addEventListener('click',openBrowse);
    $('btn-browse2')?.addEventListener('click',openBrowse);
    $('btn-close-browse')?.addEventListener('click',closeBrowse);
    $('browse-search')?.addEventListener('input',(e)=>{bState.query=e.target.value;doBrowse()});
    $('browse-tags')?.addEventListener('click',(e)=>{if(e.target.classList.contains('browse-tag-chip'))onBrowseTag(e.target.dataset.tag)});
    $('browse-list')?.addEventListener('click',(e)=>{const item=e.target.closest('.browse-item');if(item)onBrowseItem(item.dataset.recipeId)});
    $('btn-load-more')?.addEventListener('click',loadMore);

    // Add
    $('fab-add')?.addEventListener('click',openAdd);
    $('btn-close-add')?.addEventListener('click',closeAdd);
    $('add-form')?.addEventListener('submit',submitAdd);

    // Copy
    $('btn-copy-keywords')?.addEventListener('click',()=>{
      if(currentMeals.length)UIModule.copyKeywords(currentMeals[0].recipe);
    });

    // Keyword chips
    $('takeout-keywords')?.addEventListener('click',(e)=>{
      if(e.target.classList.contains('keyword-chip')){
        navigator.clipboard.writeText(e.target.dataset.keyword).catch(()=>{});
        const o=e.target.textContent;e.target.textContent='✓ '+o;
        e.target.style.background='var(--amber-light)';e.target.style.borderColor='var(--amber)';e.target.style.color='var(--amber-deep)';
        setTimeout(()=>{e.target.textContent=o;e.target.style.background='';e.target.style.borderColor='';e.target.style.color=''},1500);
      }
    });

    // Error retry
    $('error-banner')?.addEventListener('click',(e)=>{if(e.target.id==='btn-retry')refresh()});

    // Close overlays on backdrop
    $('browse-overlay')?.addEventListener('click',(e)=>{if(e.target===e.currentTarget)closeBrowse()});
    $('add-modal')?.addEventListener('click',(e)=>{if(e.target===e.currentTarget)closeAdd()});
  }

  /* ── Init ── */
  async function init(){
    const cached=getCachedToday();
    if(cached&&isCacheFresh(cached)){
      currentContext=cached.context;
      currentMeals=cached.currentMeals||[];
      dayRecs=cached.dayRecs||{};
      UIModule.renderTopBar(cached.context);
      UIModule.renderMealHeader(cached.context.mealTime);
      UIModule.renderCurrentMeals(currentMeals,0);
      UIModule.renderDayRecipes(dayRecs);
      if(currentMeals.length)UIModule.renderTakeout(currentMeals[0].recipe);
    }else{
      // Default render immediately, then refresh
      const fb={temperature:22,feelsLike:22,tempCategory:'warm',weatherCode:0,weatherTag:'clear',isDay:true,season:'summer',mealTime:'lunch',region:'universal',cityName:'北京',provinceName:'北京',dateStr:'2026-06-04',session:0};
      render(fb,[]);
    }
    setupEvents();
    // Background refresh with real location
    setTimeout(()=>refresh({}).catch(()=>{}),100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  return{refresh,getAllRecipes};
})();
