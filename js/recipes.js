/* ============================================================
   recipes.js — Recipe Database & Scoring Engine
   ============================================================ */

const RecipeModule = (() => {
  /* ==========================================================
     Tag Catalog
     ========================================================== */
  const TAG = {
    temperature: ['hot_weather', 'warm_weather', 'cool_weather', 'cold_weather'],
    weather: ['rainy', 'snowy', 'clear', 'overcast', 'humid', 'extreme'],
    season: ['spring', 'summer', 'autumn', 'winter'],
    region: ['sichuan', 'guangdong', 'hunan', 'shandong', 'jiangsu',
             'zhejiang', 'fujian', 'anhui', 'beijing', 'shanghai',
             'northeast', 'northwest', 'southwest', 'central', 'universal'],
    mealTime: ['breakfast', 'lunch', 'dinner', 'snack', 'late_night'],
    category: ['cold_dish', 'stir_fry', 'soup', 'noodle', 'rice', 'hotpot',
               'stew', 'salad', 'dim_sum', 'street_food', 'home_style',
               'healthy', 'comfort_food', 'quick_easy'],
    dietary: ['spicy', 'mild', 'sour', 'sweet', 'savory', 'light', 'hearty',
              'vegetarian', 'meat', 'seafood'],
  };

  /* ==========================================================
     Recipe Database — 38 curated Chinese recipes
     ========================================================== */
  const RECIPES = [
    // ── Hot Weather / Summer ──
    {
      id: 'r001',
      name: '凉拌鸡丝荞麦面',
      emoji: '🍜',
      description: '清爽低卡，鸡丝嫩滑，荞麦面筋道，夏日必备凉面',
      ingredients: ['荞麦面 150g', '鸡胸肉 1块', '黄瓜 1根', '胡萝卜 半根',
                    '芝麻酱 2勺', '生抽 1勺', '香醋 1勺', '蒜末 适量', '辣椒油 可选', '熟芝麻 适量'],
      steps: ['鸡胸肉冷水下锅，加姜片料酒，煮熟后撕成细丝',
              '荞麦面按包装说明煮熟，过凉水沥干',
              '黄瓜、胡萝卜切细丝',
              '芝麻酱加少量温水调匀，加入生抽、香醋、蒜末拌匀',
              '将面条、鸡丝、蔬菜放入碗中，浇上酱汁，撒上芝麻'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['hot_weather', 'summer', 'cold_dish', 'noodle', 'light', 'universal', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['凉面', '鸡丝拌面', '荞麦面', '轻食', '凉拌菜'],
    },
    {
      id: 'r002',
      name: '拍黄瓜',
      emoji: '🥒',
      description: '爽脆开胃，两分钟搞定，夏日的国民凉菜',
      ingredients: ['黄瓜 2根', '蒜末 适量', '生抽 1勺', '香醋 2勺',
                    '芝麻油 1勺', '盐 少许', '辣椒油 可选', '香菜 可选'],
      steps: ['黄瓜洗净用刀面拍裂，切成段',
              '加入盐腌制5分钟，倒掉渗出的水',
              '加入蒜末、生抽、香醋、芝麻油拌匀',
              '根据口味加辣椒油和香菜即可'],
      prepTimeMin: 5, difficulty: 'easy',
      tags: ['hot_weather', 'summer', 'cold_dish', 'vegetarian', 'light', 'universal', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['拍黄瓜', '凉拌黄瓜', '凉菜', '清爽小菜'],
    },
    {
      id: 'r003',
      name: '冷面（朝鲜风味）',
      emoji: '🍝',
      description: '冰凉酸甜的荞麦冷面，配以泡菜和鸡蛋，消暑利器',
      ingredients: ['冷面面条 200g', '酱牛肉 几片', '水煮蛋 半个', '黄瓜丝 适量',
                    '梨片 几片', '泡菜 适量', '冷面汤底（醋+糖+酱油+冰水）', '芝麻 少许'],
      steps: ['调制冷面汤底：冰水加白醋、白糖、生抽、盐调匀',
              '冷面煮好后过冷水，沥干放入碗中',
              '倒入冰镇汤底，摆上酱牛肉、水煮蛋、黄瓜丝、梨片和泡菜',
              '撒上芝麻即可'],
      prepTimeMin: 20, difficulty: 'medium',
      tags: ['hot_weather', 'summer', 'cold_dish', 'noodle', 'light', 'sour', 'northeast', 'lunch', 'dinner'],
      takeoutKeywords: ['冷面', '朝鲜冷面', '韩国冷面', '冰凉面'],
    },
    {
      id: 'r004',
      name: '绿豆汤',
      emoji: '🫘',
      description: '清热解毒，老北京消暑名品，冰镇后更佳',
      ingredients: ['绿豆 200g', '冰糖 适量', '水 2L', '百合/莲子 可选'],
      steps: ['绿豆提前浸泡2小时',
              '绿豆加水大火煮开，撇去浮沫',
              '转小火煮30-40分钟至绿豆开花',
              '加入冰糖调味，可加百合或莲子增加风味',
              '冷却后冰镇饮用更佳'],
      prepTimeMin: 50, difficulty: 'easy',
      tags: ['hot_weather', 'summer', 'soup', 'sweet', 'vegetarian', 'healthy', 'beijing', 'snack', 'universal'],
      takeoutKeywords: ['绿豆汤', '冰糖绿豆', '消暑饮品', '甜品糖水'],
    },
    {
      id: 'r005',
      name: '口水鸡',
      emoji: '🐔',
      description: '麻辣鲜香，红油诱人，川味经典冷菜',
      ingredients: ['鸡腿 2只', '姜片 3片', '葱段 适量', '花椒 适量',
                    '辣椒油 3勺', '花椒粉 1勺', '生抽 2勺', '香醋 1勺', '糖 1勺',
                    '蒜末 适量', '熟花生碎 适量', '葱花 适量'],
      steps: ['鸡腿冷水下锅加姜葱花椒煮15分钟，关火焖10分钟',
              '捞出过冰水，切块装盘',
              '混合辣椒油、花椒粉、生抽、香醋、糖、蒜末调成酱汁',
              '将酱汁淋在鸡块上，撒花生碎和葱花'],
      prepTimeMin: 25, difficulty: 'medium',
      tags: ['hot_weather', 'summer', 'cold_dish', 'spicy', 'meat', 'sichuan', 'lunch', 'dinner', 'comfort_food'],
      takeoutKeywords: ['口水鸡', '红油鸡块', '川味凉菜', '麻辣鸡'],
    },
    {
      id: 'r006',
      name: '越南春卷',
      emoji: '🫔',
      description: '透明饼皮包裹鲜蔬虾仁，清爽健康，无需开火',
      ingredients: ['越南春卷皮（米纸）8张', '鲜虾 200g', '生菜 适量',
                    '米粉 适量', '薄荷叶 适量', '韭菜 适量',
                    '蘸料：鱼露2勺+柠檬汁1勺+糖1勺+蒜末+辣椒'],
      steps: ['鲜虾煮熟去壳，米粉煮熟过冷水',
              '米纸在温水中快速浸软，铺在湿布上',
              '依次放上生菜、米粉、虾仁、薄荷叶',
              '卷紧包好即可，搭配蘸料食用'],
      prepTimeMin: 20, difficulty: 'easy',
      tags: ['hot_weather', 'summer', 'cold_dish', 'salad', 'seafood', 'light', 'healthy', 'southwest', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['越南春卷', '夏卷', '米纸卷', '健康轻食', '东南亚菜'],
    },
    {
      id: 'r007',
      name: '酸梅汤',
      emoji: '🥤',
      description: '古法熬制，酸甜解腻，夏日续命饮品',
      ingredients: ['乌梅 10颗', '山楂干 20g', '甘草 5g', '洛神花 5g',
                    '陈皮 1片', '冰糖 80g', '桂花 少许', '水 2L'],
      steps: ['除冰糖和桂花外所有材料洗净浸泡30分钟',
              '加2L水大火煮开，转小火熬40分钟',
              '加入冰糖搅拌至融化',
              '过滤后撒入桂花，冷藏后饮用'],
      prepTimeMin: 60, difficulty: 'easy',
      tags: ['hot_weather', 'summer', 'healthy', 'sweet', 'vegetarian', 'beijing', 'snack', 'universal'],
      takeoutKeywords: ['酸梅汤', '老北京酸梅汤', '消暑饮料', '酸甜饮品'],
    },

    // ── Warm Weather / Home Style ──
    {
      id: 'r008',
      name: '番茄炒蛋',
      emoji: '🍅',
      description: '国民家常菜第一名，酸甜下饭，五分钟搞定',
      ingredients: ['鸡蛋 3个', '番茄 2个', '葱花 适量', '盐 适量', '糖 1小勺',
                    '番茄酱 可选', '水淀粉 少许'],
      steps: ['鸡蛋打散加少许盐，番茄切块',
              '热油炒鸡蛋至凝固盛出',
              '锅留底油炒番茄至出汁，加糖和番茄酱增味',
              '倒回鸡蛋翻炒均匀，加盐调味',
              '撒葱花出锅'],
      prepTimeMin: 8, difficulty: 'easy',
      tags: ['warm_weather', 'summer', 'spring', 'stir_fry', 'home_style', 'vegetarian', 'mild', 'universal', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['番茄炒蛋', '西红柿炒鸡蛋', '家常菜', '下饭菜'],
    },
    {
      id: 'r009',
      name: '鱼香肉丝',
      emoji: '🥩',
      description: '酸甜微辣，肉丝嫩滑，配菜丰富的川系名菜',
      ingredients: ['猪里脊 200g', '木耳 50g', '胡萝卜 半根', '青椒 1个',
                    '泡椒/豆瓣酱 1勺', '姜蒜末 适量',
                    '料汁：生抽2+醋1+糖1+淀粉1+水3勺'],
      steps: ['猪肉切丝加料酒、淀粉、少许盐腌制10分钟',
              '木耳泡发切丝，胡萝卜、青椒切丝',
              '热油滑炒肉丝至变色盛出',
              '炒香豆瓣酱和姜蒜，加蔬菜丝炒至断生',
              '倒回肉丝，倒入料汁翻炒均匀收汁即可'],
      prepTimeMin: 20, difficulty: 'medium',
      tags: ['warm_weather', 'spring', 'autumn', 'stir_fry', 'home_style', 'sour', 'spicy', 'meat', 'sichuan', 'lunch', 'dinner'],
      takeoutKeywords: ['鱼香肉丝', '川菜', '下饭菜', '家常小炒'],
    },
    {
      id: 'r010',
      name: '宫保鸡丁',
      emoji: '🥜',
      description: '荔枝味酱汁包裹鸡丁，花生酥脆，全球最受欢迎的中餐之一',
      ingredients: ['鸡胸肉 250g', '花生米 50g', '干辣椒 5-6个', '花椒 少许',
                    '葱段 适量', '姜蒜片 适量',
                    '料汁：生抽2+香醋1+糖1+老抽1+淀粉1+水3勺'],
      steps: ['鸡肉切丁加料酒、淀粉、盐腌制',
              '花生米小火炒至金黄备用',
              '热油炒鸡丁至变白盛出',
              '小火煸香干辣椒花椒，加姜蒜葱爆香',
              '倒回鸡丁，淋入料汁大火翻炒，加花生米翻匀出锅'],
      prepTimeMin: 20, difficulty: 'medium',
      tags: ['warm_weather', 'spring', 'autumn', 'stir_fry', 'home_style', 'spicy', 'sichuan', 'lunch', 'dinner'],
      takeoutKeywords: ['宫保鸡丁', '宫爆鸡丁', '川菜', '下饭菜'],
    },
    {
      id: 'r011',
      name: '蒜蓉西兰花',
      emoji: '🥦',
      description: '翠绿清脆，蒜香浓郁，简单健康的蔬菜料理',
      ingredients: ['西兰花 1颗', '蒜末 5瓣', '盐 适量', '蚝油 1勺', '食用油 适量'],
      steps: ['西兰花掰成小朵，淡盐水浸泡10分钟',
              '沸水加盐和几滴油，西兰花焯水1分钟捞出',
              '热油爆香蒜末，加入西兰花翻炒',
              '加盐、蚝油调味，快速翻炒均匀出锅'],
      prepTimeMin: 10, difficulty: 'easy',
      tags: ['warm_weather', 'spring', 'summer', 'stir_fry', 'healthy', 'vegetarian', 'light', 'universal', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['蒜蓉西兰花', '清炒西兰花', '健康小炒', '素菜'],
    },
    {
      id: 'r012',
      name: '蛋炒饭',
      emoji: '🍚',
      description: '粒粒分明的黄金炒饭，隔夜饭的终极归宿',
      ingredients: ['隔夜米饭 1碗', '鸡蛋 2个', '葱花 适量', '盐 适量',
                    '胡萝卜丁 可选', '豌豆 可选', '火腿丁 可选'],
      steps: ['鸡蛋打散，可以先把蛋黄拌入米饭中',
              '热油炒鸡蛋碎盛出',
              '大火热油下米饭快速翻炒打散',
              '加入鸡蛋碎和配菜，加盐调味',
              '炒至米饭粒粒分明，撒葱花出锅'],
      prepTimeMin: 10, difficulty: 'easy',
      tags: ['warm_weather', 'rice', 'home_style', 'quick_easy', 'universal', 'breakfast', 'lunch', 'dinner', 'late_night'],
      takeoutKeywords: ['蛋炒饭', '扬州炒饭', '炒饭', '快餐'],
    },

    // ── Cool Weather ──
    {
      id: 'r013',
      name: '红烧肉',
      emoji: '🍖',
      description: '红亮软糯，肥而不腻，米饭杀手',
      ingredients: ['五花肉 500g', '冰糖 30g', '生抽 2勺', '老抽 1勺',
                    '料酒 2勺', '八角 2个', '桂皮 1块', '香叶 2片',
                    '姜片 3片', '葱段 适量', '水 适量'],
      steps: ['五花肉切块冷水下锅焯水，捞出洗净',
              '小火炒冰糖至焦糖色起泡',
              '下五花肉翻炒上色，加姜葱八角桂皮香叶',
              '加料酒、生抽、老抽，倒入没过肉的开水',
              '大火煮开后转小火慢炖40-50分钟',
              '大火收汁至浓稠即可'],
      prepTimeMin: 60, difficulty: 'medium',
      tags: ['cool_weather', 'cold_weather', 'autumn', 'winter', 'stew', 'meat', 'hearty', 'savory', 'universal', 'lunch', 'dinner'],
      takeoutKeywords: ['红烧肉', '红烧肉盖饭', '家常硬菜', '下饭菜'],
    },
    {
      id: 'r014',
      name: '番茄牛腩',
      emoji: '🍲',
      description: '酸甜浓郁，牛腩入口即化，暖心汤菜',
      ingredients: ['牛腩 500g', '番茄 3个', '洋葱 半个', '胡萝卜 1根',
                    '番茄酱 2勺', '姜片 3片', '八角 1个', '香叶 1片',
                    '盐 适量', '糖 1勺'],
      steps: ['牛腩切块焯水洗净',
              '番茄切块，洋葱、胡萝卜切块',
              '热油炒洋葱出香，加番茄炒出汁，加番茄酱',
              '加入牛腩、姜片、八角、香叶，倒足量热水',
              '大火煮开转小火炖1-1.5小时',
              '加入胡萝卜再炖20分钟，加盐糖调味'],
      prepTimeMin: 100, difficulty: 'medium',
      tags: ['cool_weather', 'cold_weather', 'autumn', 'winter', 'stew', 'soup', 'meat', 'hearty', 'universal', 'lunch', 'dinner'],
      takeoutKeywords: ['番茄牛腩', '番茄牛腩盖饭', '炖菜', '暖身汤'],
    },
    {
      id: 'r015',
      name: '牛肉面',
      emoji: '🍜',
      description: '汤浓肉香，手工拉面筋道，兰州的灵魂',
      ingredients: ['牛腱肉 300g', '面条 200g', '白萝卜 半根',
                    '八角、桂皮、香叶、花椒', '姜片、葱段',
                    '生抽、老抽、盐', '香菜、蒜苗 适量', '辣椒油'],
      steps: ['牛肉焯水后加香料和足量水炖1小时至软烂，捞出切片',
              '白萝卜切片放入原汤中煮熟',
              '另起锅煮面至熟',
              '碗中盛面，浇牛肉汤，摆上牛肉片和萝卜',
              '撒香菜蒜苗，淋辣椒油'],
      prepTimeMin: 90, difficulty: 'hard',
      tags: ['cool_weather', 'cold_weather', 'noodle', 'soup', 'meat', 'hearty', 'northwest', 'lunch', 'dinner', 'comfort_food'],
      takeoutKeywords: ['牛肉面', '兰州拉面', '牛肉拉面', '汤面'],
    },
    {
      id: 'r016',
      name: '麻婆豆腐',
      emoji: '🧈',
      description: '麻辣烫香，豆腐嫩滑，配饭绝佳',
      ingredients: ['嫩豆腐 1块', '猪肉末 100g', '豆瓣酱 1勺', '豆豉 少许',
                    '辣椒粉 1勺', '花椒粉 1勺', '姜蒜末 适量', '葱花 适量',
                    '水淀粉 适量'],
      steps: ['豆腐切小块，入淡盐水中焯2分钟捞出',
              '热油炒肉末至酥香，加豆瓣酱炒出红油',
              '加姜蒜末、豆豉、辣椒粉炒香',
              '加适量水煮开，轻轻放入豆腐',
              '小火煮5分钟入味，水淀粉勾芡',
              '出锅撒花椒粉和葱花'],
      prepTimeMin: 20, difficulty: 'medium',
      tags: ['cool_weather', 'warm_weather', 'stir_fry', 'spicy', 'meat', 'sichuan', 'lunch', 'dinner', 'comfort_food'],
      takeoutKeywords: ['麻婆豆腐', '川菜', '豆腐', '下饭菜', '麻辣'],
    },

    // ── Cold Weather / Winter ──
    {
      id: 'r017',
      name: '清汤羊肉',
      emoji: '🐑',
      description: '汤清肉鲜，暖身驱寒，冬日进补首选',
      ingredients: ['羊肉 500g', '白萝卜 1根', '姜片 5片',
                    '枸杞 适量', '料酒 2勺', '盐 适量', '香菜 适量', '白胡椒粉 适量'],
      steps: ['羊肉切块冷水浸泡1小时去血水',
              '冷水下锅焯水，加料酒姜片去膻',
              '洗净后加足量水、姜片大火煮开，撇沫',
              '转小火炖40分钟至羊肉软烂',
              '加入白萝卜块炖15分钟',
              '加盐、枸杞、白胡椒粉调味，撒香菜'],
      prepTimeMin: 80, difficulty: 'medium',
      tags: ['cold_weather', 'winter', 'soup', 'stew', 'meat', 'hearty', 'northwest', 'dinner', 'comfort_food'],
      takeoutKeywords: ['羊肉汤', '清炖羊肉', '暖身汤', '冬季进补'],
    },
    {
      id: 'r018',
      name: '萝卜炖牛腩',
      emoji: '🥩',
      description: '冬日炖菜之王，牛腩软烂，萝卜吸饱了肉汁',
      ingredients: ['牛腩 500g', '白萝卜 1根', '姜片 3片', '八角 2个',
                    '桂皮 1块', '生抽 2勺', '老抽 1勺', '料酒 2勺', '盐 适量'],
      steps: ['牛腩切块焯水洗净',
              '热油炒香姜片、八角、桂皮',
              '加牛腩翻炒，加料酒、生抽、老抽炒上色',
              '加入没过牛腩的热水，大火煮开转小火炖1小时',
              '加入萝卜块再炖20分钟至软烂，大火收汁加盐调味'],
      prepTimeMin: 90, difficulty: 'medium',
      tags: ['cold_weather', 'winter', 'autumn', 'stew', 'meat', 'hearty', 'guangdong', 'central', 'lunch', 'dinner'],
      takeoutKeywords: ['萝卜牛腩', '炖牛腩', '广式煲仔', '冬日暖菜'],
    },
    {
      id: 'r019',
      name: '火锅（家庭版）',
      emoji: '🫕',
      description: '冬日聚餐之魂，热腾腾的一锅暖身又暖心',
      ingredients: ['火锅底料 1包', '肥牛卷 300g', '羊肉卷 300g',
                    '豆腐 1块', '金针菇 1把', '白菜 适量', '藕片 适量',
                    '土豆 1个', '粉丝 1把', '蘸料：麻酱+蒜末+香油+香菜'],
      steps: ['锅中加水和火锅底料煮开',
              '蔬菜洗净切好，肉卷装盘',
              '调制蘸料：麻酱加水调稀，加蒜末、香油、香菜',
              '汤底煮开后，先涮肉再涮菜',
              '最后可以下粉丝或者煮面'],
      prepTimeMin: 30, difficulty: 'easy',
      tags: ['cold_weather', 'winter', 'hotpot', 'meat', 'hearty', 'sichuan', 'southwest', 'dinner', 'comfort_food'],
      takeoutKeywords: ['火锅', '涮羊肉', '麻辣火锅', '火锅食材', '锅底'],
    },
    {
      id: 'r020',
      name: '酸菜炖排骨',
      emoji: '🦴',
      description: '东北冬日硬菜，酸菜解腻，排骨香嫩',
      ingredients: ['排骨 500g', '酸菜 300g', '粉条 适量', '姜片 3片',
                    '八角 1个', '料酒 2勺', '盐 适量'],
      steps: ['排骨焯水洗净',
              '酸菜切丝，清水浸泡去咸味',
              '热油炒香姜片八角，加排骨翻炒',
              '加酸菜翻炒出香，倒足量开水',
              '大火煮开转小火炖40分钟',
              '加入泡软的粉条炖10分钟，加盐调味'],
      prepTimeMin: 60, difficulty: 'medium',
      tags: ['cold_weather', 'winter', 'stew', 'meat', 'hearty', 'sour', 'northeast', 'dinner', 'comfort_food'],
      takeoutKeywords: ['酸菜排骨', '东北菜', '炖菜', '家常硬菜'],
    },

    // ── Rainy / Comfort Food ──
    {
      id: 'r021',
      name: '酸辣汤',
      emoji: '🥣',
      description: '酸辣开胃，热汤暖身，雨天最佳慰藉',
      ingredients: ['嫩豆腐 1块', '木耳 适量', '香菇 3朵', '鸡蛋 1个',
                    '白胡椒粉 1勺', '香醋 2勺', '生抽 1勺',
                    '水淀粉 适量', '葱花 适量', '香油 几滴'],
      steps: ['木耳、香菇泡发切丝',
              '锅中加水烧开，放入木耳丝、香菇丝',
              '豆腐切细条放入锅中，加生抽和白胡椒粉',
              '水淀粉勾薄芡',
              '鸡蛋打散淋入锅中成蛋花',
              '关火后淋入香醋和香油，撒葱花'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['cool_weather', 'cold_weather', 'rainy', 'autumn', 'winter', 'soup', 'sour', 'spicy', 'comfort_food', 'universal', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['酸辣汤', '胡辣汤', '酸辣粉', '热汤', '暖胃'],
    },
    {
      id: 'r022',
      name: '麻辣烫（家庭版）',
      emoji: '🌶️',
      description: '下雨天就想吃的麻辣烫，在家做干净又过瘾',
      ingredients: ['火锅底料/麻辣烫料 50g', '牛奶 100ml（增浓汤底）',
                    '各种丸子、鱼豆腐', '午餐肉', '豆腐泡', '金针菇',
                    '蔬菜（娃娃菜、菠菜等）', '粉丝', '芝麻酱蘸料'],
      steps: ['锅中加水加底料煮开',
              '加牛奶搅拌，汤底变得浓郁奶白',
              '按照耐煮程度依次下入食材',
              '先下丸子和耐煮的菜，最后放青菜粉丝',
              '煮好后连汤盛出，配芝麻酱蘸料食用'],
      prepTimeMin: 20, difficulty: 'easy',
      tags: ['rainy', 'cool_weather', 'cold_weather', 'street_food', 'spicy', 'comfort_food', 'sichuan', 'lunch', 'dinner', 'late_night'],
      takeoutKeywords: ['麻辣烫', '冒菜', '串串', '麻辣拌', '暖身'],
    },
    {
      id: 'r023',
      name: '水煮鱼',
      emoji: '🐟',
      description: '红油翻滚，鱼片嫩滑，雨天吃完浑身舒畅',
      ingredients: ['草鱼/黑鱼片 300g', '豆芽 200g', '干辣椒 10个',
                    '花椒 适量', '郫县豆瓣酱 2勺', '姜蒜末 适量',
                    '蛋清 1个', '淀粉 适量', '盐、料酒'],
      steps: ['鱼片加盐、料酒、蛋清、淀粉腌15分钟',
              '豆芽焯水铺入碗底',
              '热油炒豆瓣酱出红油，加姜蒜、水煮开',
              '小火滑入鱼片，煮至变白立即捞出放在豆芽上',
              '撒上干辣椒段和花椒',
              '烧热油浇在辣椒花椒上激发香味'],
      prepTimeMin: 30, difficulty: 'hard',
      tags: ['rainy', 'cool_weather', 'spicy', 'seafood', 'comfort_food', 'sichuan', 'lunch', 'dinner'],
      takeoutKeywords: ['水煮鱼', '水煮肉片', '川菜', '麻辣鱼', '下饭菜'],
    },
    {
      id: 'r024',
      name: '姜丝可乐',
      emoji: '☕',
      description: '下雨天驱寒暖身的懒人热饮，简单有效',
      ingredients: ['可乐 1罐', '生姜 几片', '柠檬 可选'],
      steps: ['生姜切薄片或细丝',
              '可乐倒入锅中，加入姜片',
              '小火煮5-8分钟，不要煮沸太久',
              '倒入杯中，可挤少许柠檬汁'],
      prepTimeMin: 8, difficulty: 'easy',
      tags: ['rainy', 'cold_weather', 'snowy', 'healthy', 'sweet', 'universal', 'snack', 'late_night', 'quick_easy'],
      takeoutKeywords: ['姜汁可乐', '热姜茶', '暖饮', '驱寒饮品'],
    },

    // ── Spring ──
    {
      id: 'r025',
      name: '春笋炒肉',
      emoji: '🎋',
      description: '春天的味道，春笋脆嫩，腊肉的咸香完美搭配',
      ingredients: ['春笋 300g', '腊肉/五花肉 150g', '蒜苗 2根',
                    '干辣椒 2个', '生抽 1勺', '盐 适量', '糖 少许'],
      steps: ['春笋剥壳切片，焯水2分钟去除涩味',
              '腊肉切薄片',
              '热油炒腊肉出油至微焦',
              '加干辣椒和春笋片翻炒',
              '加生抽、盐、少许糖调味',
              '加入蒜苗段翻炒均匀出锅'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['spring', 'warm_weather', 'stir_fry', 'meat', 'home_style', 'zhejiang', 'anhui', 'lunch', 'dinner'],
      takeoutKeywords: ['春笋炒肉', '腊肉炒笋', '时令菜', '春季限定'],
    },
    {
      id: 'r026',
      name: '荠菜饺子',
      emoji: '🥟',
      description: '春日野蔌，荠菜清香，包一盘春天的味道',
      ingredients: ['荠菜 300g', '猪肉馅 250g', '饺子皮 适量',
                    '姜末 1勺', '生抽 2勺', '香油 1勺',
                    '蚝油 1勺', '盐 适量', '鸡蛋 1个'],
      steps: ['荠菜洗净焯水10秒，挤干水分切碎',
              '肉馅加姜末、生抽、蚝油、盐、鸡蛋搅拌上劲',
              '加入荠菜碎和香油拌匀',
              '包成饺子',
              '水开下饺子，煮至浮起再煮2分钟即可'],
      prepTimeMin: 40, difficulty: 'medium',
      tags: ['spring', 'warm_weather', 'dim_sum', 'home_style', 'meat', 'shandong', 'central', 'lunch', 'dinner'],
      takeoutKeywords: ['荠菜饺子', '野菜饺子', '手工水饺', '春季美食'],
    },

    // ── Autumn ──
    {
      id: 'r027',
      name: '银耳莲子羹',
      emoji: '🪷',
      description: '滋阴润燥，胶质满满，秋冬养颜圣品',
      ingredients: ['银耳 1朵', '莲子 30g', '红枣 8颗', '枸杞 适量',
                    '冰糖 适量', '水 1.5L'],
      steps: ['银耳提前泡发2小时，撕成小朵',
              '莲子去芯提前泡发',
              '银耳、莲子、红枣加水大火煮开',
              '转小火慢炖1-1.5小时',
              '炖至银耳出胶软糯',
              '加入冰糖和枸杞再煮5分钟即可'],
      prepTimeMin: 120, difficulty: 'easy',
      tags: ['autumn', 'winter', 'soup', 'sweet', 'vegetarian', 'healthy', 'guangdong', 'snack', 'breakfast'],
      takeoutKeywords: ['银耳羹', '银耳莲子', '糖水', '养生甜品', '广式甜品'],
    },
    {
      id: 'r028',
      name: '莲藕排骨汤',
      emoji: '🪵',
      description: '藕香四溢，汤汁清甜，秋日润燥汤品',
      ingredients: ['排骨 400g', '莲藕 2节', '姜片 3片',
                    '枸杞 适量', '盐 适量', '料酒 1勺'],
      steps: ['排骨焯水洗净',
              '莲藕去皮切块，泡水防氧化',
              '锅中加足量水，放入排骨、姜片、料酒',
              '大火煮开转小火炖30分钟',
              '加入莲藕块再炖30-40分钟',
              '加盐和枸杞，再煮5分钟即可'],
      prepTimeMin: 80, difficulty: 'easy',
      tags: ['autumn', 'cool_weather', 'soup', 'meat', 'healthy', 'hubei', 'central', 'lunch', 'dinner'],
      takeoutKeywords: ['莲藕排骨汤', '煲汤', '广式老火汤', '秋季滋补'],
    },

    // ── Regional Specialties ──
    {
      id: 'r029',
      name: '白切鸡',
      emoji: '🐔',
      description: '皮爽肉滑，骨中带血，极简之中见真功夫',
      ingredients: ['三黄鸡 1只（约1.2kg）', '姜 1大块', '葱 3根',
                    '蘸料：姜蓉+葱花+盐+热油', '沙姜/蒜蓉 可选'],
      steps: ['鸡处理干净，水中加入姜片葱结烧开',
              '抓住鸡脖子将鸡浸入沸水，提起倒出腹中冷水，重复3次',
              '整鸡浸入，水再次开后关火，盖盖浸泡25分钟',
              '取出过冰水，皮收紧后切块',
              '蘸料：姜蓉+葱碎+盐，浇热油激香'],
      prepTimeMin: 45, difficulty: 'hard',
      tags: ['warm_weather', 'spring', 'summer', 'meat', 'light', 'guangdong', 'lunch', 'dinner'],
      takeoutKeywords: ['白切鸡', '白斩鸡', '广东菜', '豉油鸡', '烧腊'],
    },
    {
      id: 'r030',
      name: '小炒肉',
      emoji: '🌶️',
      description: '湘菜之魂！五花肉煸至焦香，辣椒吸收了肉香',
      ingredients: ['五花肉 250g', '青线椒 5个', '小米辣 2个',
                    '蒜片 适量', '豆豉 少许', '生抽 1勺', '老抽 半勺', '盐 适量'],
      steps: ['五花肉切薄片，青椒斜切圈',
              '干锅（不放油）煸炒青椒至虎皮纹盛出',
              '热锅少许油，下五花肉煸至微卷焦黄',
              '下豆豉、蒜片炒香',
              '加生抽、老抽翻炒',
              '倒回青椒快速翻炒，加盐调味出锅'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['warm_weather', 'cool_weather', 'stir_fry', 'spicy', 'meat', 'hunan', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['小炒肉', '辣椒炒肉', '湘菜', '下饭菜', '农家小炒肉'],
    },
    {
      id: 'r031',
      name: '锅包肉',
      emoji: '🥩',
      description: '外酥里嫩，酸甜可口，东北最受欢迎的硬菜',
      ingredients: ['猪里脊 300g', '土豆淀粉 150g', '胡萝卜丝 适量',
                    '姜丝 适量', '葱丝 适量',
                    '糖醋汁：白糖3+白醋3+生抽1+水3勺'],
      steps: ['里脊切薄片，刀背拍松',
              '土豆淀粉加水沉淀，倒掉上层清水，取湿淀粉裹肉片',
              '170°C油温炸至定型，190°C复炸至金黄酥脆',
              '糖醋汁加热至糖融化',
              '锅中少许底油，倒入糖醋汁和配菜',
              '快速倒入炸好的肉片翻匀立即出锅'],
      prepTimeMin: 30, difficulty: 'hard',
      tags: ['cool_weather', 'winter', 'sweet', 'sour', 'meat', 'northeast', 'lunch', 'dinner'],
      takeoutKeywords: ['锅包肉', '东北菜', '酸甜肉', '特色菜'],
    },
    {
      id: 'r032',
      name: '葱油拌面',
      emoji: '🧅',
      description: '葱油焦香，拌一拌就香死人，5分钟就够了',
      ingredients: ['鲜切面/挂面 150g', '小葱 5根', '生抽 2勺',
                    '老抽 1勺', '糖 1小勺', '食用油 3勺'],
      steps: ['小葱切段，葱白葱绿分开',
              '热油小火煸葱白至微黄，加入葱绿',
              '继续小火煸至葱段焦黄，捞出一半葱段',
              '关火，倒入生抽+老抽+糖的混合液',
              '面条煮熟捞入碗中',
              '浇上葱油拌匀，放上焦葱段'],
      prepTimeMin: 10, difficulty: 'easy',
      tags: ['warm_weather', 'noodle', 'vegetarian', 'quick_easy', 'shanghai', 'breakfast', 'lunch', 'late_night'],
      takeoutKeywords: ['葱油拌面', '上海面', '拌面', '本帮面'],
    },
    {
      id: 'r033',
      name: '地三鲜',
      emoji: '🍆',
      description: '土豆绵软、茄子吸汁、青椒增香，东北名素菜',
      ingredients: ['土豆 2个', '茄子 1根', '青椒 2个',
                    '蒜末 适量', '生抽 2勺', '老抽 半勺',
                    '糖 1勺', '淀粉 适量', '盐 适量'],
      steps: ['土豆、茄子、青椒切滚刀块',
              '土豆块炸至金黄，茄子裹薄淀粉炸软',
              '调碗汁：生抽+老抽+糖+盐+水+淀粉',
              '少许底油爆香蒜末，倒入碗汁煮至浓稠',
              '倒入所有炸好的蔬菜快速翻匀即可'],
      prepTimeMin: 25, difficulty: 'medium',
      tags: ['cool_weather', 'warm_weather', 'stir_fry', 'vegetarian', 'hearty', 'northeast', 'lunch', 'dinner'],
      takeoutKeywords: ['地三鲜', '东北菜', '素菜', '下饭菜'],
    },

    // ── Breakfast ──
    {
      id: 'r034',
      name: '鸡蛋灌饼',
      emoji: '🫓',
      description: '饼皮酥脆，鸡蛋灌入其中，街头早餐之王',
      ingredients: ['面粉 200g', '鸡蛋 2个', '生菜 适量',
                    '甜面酱/辣椒酱 适量', '火腿肠/里脊肉 可选', '葱花 适量'],
      steps: ['面粉加热水和面，醒30分钟',
              '面团擀薄，中间抹油酥，包起再擀成饼',
              '平底锅热油，放入饼坯',
              '待饼鼓起大泡，挑破后倒入蛋液（鸡蛋+葱花+盐）',
              '翻面煎至两面金黄',
              '刷酱，放生菜和火腿肠，卷起即可'],
      prepTimeMin: 25, difficulty: 'medium',
      tags: ['breakfast', 'street_food', 'dim_sum', 'quick_easy', 'central', 'henan', 'universal'],
      takeoutKeywords: ['鸡蛋灌饼', '煎饼', '早餐', '卷饼'],
    },
    {
      id: 'r035',
      name: '皮蛋瘦肉粥',
      emoji: '🥣',
      description: '绵密顺滑，经典广式早餐，暖胃舒服',
      ingredients: ['大米 100g', '皮蛋 2个', '猪瘦肉 100g',
                    '姜丝 适量', '盐 适量', '白胡椒粉 适量', '葱花 适量'],
      steps: ['大米提前浸泡30分钟',
              '瘦肉切丝加盐、料酒腌制',
              '皮蛋切小丁',
              '水开后下米，大火煮15分钟至米开花',
              '加入肉丝、皮蛋、姜丝',
              '小火再熬15分钟，加盐和白胡椒粉调味，撒葱花'],
      prepTimeMin: 40, difficulty: 'easy',
      tags: ['breakfast', 'cool_weather', 'rainy', 'soup', 'light', 'guangdong', 'universal', 'comfort_food'],
      takeoutKeywords: ['皮蛋瘦肉粥', '广式早餐', '粥', '暖胃早餐'],
    },
    {
      id: 'r036',
      name: '煎饼果子',
      emoji: '🥞',
      description: '天津经典早餐，薄脆夹心，咸香可口',
      ingredients: ['面粉 100g', '绿豆面 30g', '鸡蛋 1个', '薄脆/油条 适量',
                    '甜面酱 适量', '辣椒酱 适量', '葱花 适量', '香菜 适量', '黑芝麻 少许'],
      steps: ['面粉和绿豆面加水调成面糊',
              '平底锅/鏊子加热，舀一勺面糊摊薄',
              '打一个鸡蛋摊在面上',
              '撒葱花、香菜、黑芝麻',
              '翻面，刷甜面酱和辣椒酱',
              '放薄脆或油条，卷起即可'],
      prepTimeMin: 15, difficulty: 'medium',
      tags: ['breakfast', 'street_food', 'quick_easy', 'tianjin', 'north', 'universal'],
      takeoutKeywords: ['煎饼果子', '天津煎饼', '早餐', '卷饼'],
    },

    // ── Late Night / Snack ──
    {
      id: 'r037',
      name: '螺蛳粉',
      emoji: '🐌',
      description: '酸辣鲜爽，闻到就饿了，加班夜宵神器',
      ingredients: ['袋装螺蛳粉 1包', '煎蛋 1个', '青菜 适量', '火腿/午餐肉 可选'],
      steps: ['按照包装说明煮粉，捞出过冷水',
              '换水加入汤料包煮开',
              '放入煮好的粉和青菜',
              '加入酸笋、木耳、花生、腐竹等配料',
              '盛出后加辣椒油和醋包',
              '配一个煎蛋，完美'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['late_night', 'rainy', 'noodle', 'spicy', 'sour', 'street_food', 'southwest', 'guangxi', 'comfort_food'],
      takeoutKeywords: ['螺蛳粉', '柳州螺蛳粉', '夜宵', '速食粉面'],
    },
    {
      id: 'r038',
      name: '烤肉拌饭',
      emoji: '🍛',
      description: '韩式风味，烤肉焦香配拌饭酱，一人食的快乐',
      ingredients: ['米饭 1碗', '五花肉/牛肉 200g', '生菜 几片',
                    '韩式辣酱 2勺', '雪碧/蜂蜜 少许', '蒜末 适量',
                    '生抽 1勺', '香油 1勺', '熟芝麻 适量', '煎蛋 1个'],
      steps: ['辣酱加雪碧（或蜂蜜）、生抽、蒜末、香油调成拌饭酱',
              '五花肉切薄片煎至两面焦黄',
              '碗中盛饭，铺上生菜和烤肉',
              '放一个煎蛋，浇拌饭酱，撒芝麻',
              '拌匀即可食用'],
      prepTimeMin: 15, difficulty: 'easy',
      tags: ['late_night', 'warm_weather', 'rice', 'meat', 'spicy', 'northeast', 'lunch', 'dinner', 'quick_easy'],
      takeoutKeywords: ['烤肉拌饭', '韩式拌饭', '一人食', '盖饭', '石锅拌饭'],
    },
  ];

  /* ==========================================================
     Utility Functions
     ========================================================== */

  /** Hash a string to a stable integer (for seeded random) */
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /** Map temperature to category */
  function getTempCategory(temp) {
    if (temp > 30) return 'hot';
    if (temp >= 20) return 'warm';
    if (temp >= 10) return 'cool';
    return 'cold';
  }

  /** Get adjacent temperature categories */
  function getAdjacentTempCategory(cat) {
    const map = { hot: ['warm'], warm: ['hot', 'cool'], cool: ['warm', 'cold'], cold: ['cool'] };
    return map[cat] || [];
  }

  /** Map WMO weather code to tag */
  function mapWeatherCodeToTag(code) {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'overcast';
    if (code >= 45 && code <= 48) return 'overcast'; // Fog
    if (code >= 51 && code <= 57) return 'humid';    // Drizzle
    if (code >= 61 && code <= 67) return 'rainy';    // Rain
    if (code >= 71 && code <= 77) return 'snowy';    // Snow
    if (code >= 80 && code <= 82) return 'rainy';    // Rain showers
    if (code >= 85 && code <= 86) return 'snowy';    // Snow showers
    if (code >= 95 && code <= 99) return 'extreme';  // Thunderstorm
    return 'clear';
  }

  /** Determine season by month + day (Northern Hemisphere, China) */
  function getSeason(month, day) {
    if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) return 'spring';
    if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) return 'summer';
    if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) return 'autumn';
    return 'winter';
  }

  /** Get adjacent seasons */
  function getAdjacentSeason(season) {
    const map = {
      spring: ['winter', 'summer'],
      summer: ['spring', 'autumn'],
      autumn: ['summer', 'winter'],
      winter: ['autumn', 'spring'],
    };
    return map[season] || [];
  }

  /** Determine meal time by hour */
  function getMealTime(hour) {
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 17) return 'snack';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'late_night';
  }

  /** Map province name to cuisine region */
  function getRegionFromProvince(provinceName) {
    const PROVINCE_MAP = {
      '四川': 'sichuan', '成都': 'sichuan', '重庆': 'southwest',
      '广东': 'guangdong', '广州': 'guangdong', '深圳': 'guangdong',
      '湖南': 'hunan', '长沙': 'hunan',
      '山东': 'shandong', '济南': 'shandong', '青岛': 'shandong',
      '江苏': 'jiangsu', '南京': 'jiangsu', '苏州': 'jiangsu',
      '浙江': 'zhejiang', '杭州': 'zhejiang',
      '福建': 'fujian', '福州': 'fujian', '厦门': 'fujian',
      '安徽': 'anhui', '合肥': 'anhui',
      '北京': 'beijing', '上海': 'shanghai',
      '辽宁': 'northeast', '吉林': 'northeast', '黑龙江': 'northeast',
      '沈阳': 'northeast', '哈尔滨': 'northeast', '长春': 'northeast',
      '陕西': 'northwest', '西安': 'northwest',
      '甘肃': 'northwest', '青海': 'northwest', '宁夏': 'northwest', '新疆': 'northwest',
      '云南': 'southwest', '贵州': 'southwest', '广西': 'southwest',
      '湖北': 'central', '武汉': 'central', '河南': 'central', '江西': 'central',
      '山西': 'northwest', '内蒙古': 'northwest',
      '西藏': 'southwest', '海南': 'southwest', '天津': 'beijing', '河北': 'beijing',
    };

    if (!provinceName) return 'universal';
    for (const [key, region] of Object.entries(PROVINCE_MAP)) {
      if (provinceName.includes(key)) return region;
    }
    return 'universal';
  }

  /** Format date string with 6am boundary */
  function formatDateStr(date) {
    const d = new Date(date);
    if (d.getHours() < 6) d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  /* ==========================================================
     Scoring Algorithm
     ========================================================== */

  /**
   * Score a recipe against the weather context.
   * Weights: Temperature 30 + Weather 15 + Season 20 + Region 10 + MealTime 15 + Random 10 = 100
   */
  function scoreRecipe(recipe, context, recentIds) {
    let score = 0;

    // --- Temperature Match (30 pts) ---
    const tempTagMap = { hot: 'hot_weather', warm: 'warm_weather', cool: 'cool_weather', cold: 'cold_weather' };
    const targetTempTag = tempTagMap[context.tempCategory];
    if (recipe.tags.includes(targetTempTag)) {
      score += 30;
    } else {
      const adjacent = getAdjacentTempCategory(context.tempCategory);
      for (const adj of adjacent) {
        if (recipe.tags.includes(tempTagMap[adj])) { score += 10; break; }
      }
    }

    // --- Weather Match (15 pts) ---
    const weatherTag = context.weatherTag;
    if (recipe.tags.includes(weatherTag)) {
      score += 15;
    } else if (weatherTag === 'rainy' && recipe.tags.includes('comfort_food')) {
      score += 8;
    } else if (weatherTag === 'extreme' && recipe.tags.includes('comfort_food')) {
      score += 12;
    } else if (weatherTag === 'snowy' && recipe.tags.includes('hearty')) {
      score += 8;
    }

    // --- Season Match (20 pts) ---
    if (recipe.tags.includes(context.season)) {
      score += 20;
    } else {
      const adjSeasons = getAdjacentSeason(context.season);
      for (const s of adjSeasons) {
        if (recipe.tags.includes(s)) { score += 8; break; }
      }
    }

    // --- Region Match (10 pts) ---
    if (context.region && recipe.tags.includes(context.region)) {
      score += 10;
    } else if (recipe.tags.includes('universal')) {
      score += 5;
    }

    // --- Meal Time Match (15 pts) ---
    if (recipe.tags.includes(context.mealTime)) {
      score += 15;
    } else {
      // Cross-meal bonus
      if (context.mealTime === 'lunch' && recipe.tags.includes('quick_easy')) score += 8;
      if (context.mealTime === 'dinner' && recipe.tags.includes('hearty')) score += 8;
      if (context.mealTime === 'late_night' && recipe.tags.includes('comfort_food')) score += 8;
      if (context.mealTime === 'breakfast' && recipe.tags.includes('quick_easy')) score += 8;
    }

    // --- Random Jitter (10 pts, seeded by date + recipe id) ---
    const seed = hashString(recipe.id + context.dateStr + context.session);
    score += (seed % 11); // 0–10

    // --- Diversity Penalty (recently recommended) ---
    if (recentIds && recentIds.includes(recipe.id)) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Main recommendation function.
   * @param {Object} context - WeatherContext
   * @param {string[]} recentIds - Recently recommended recipe IDs
   * @returns {{ primary: Object, primaryScore: number, alternatives: Array<{recipe: Object, score: number}> }}
   */
  function getRecommendations(context, recentIds) {
    const scored = RECIPES
      .map(recipe => ({ recipe, score: scoreRecipe(recipe, context, recentIds) }))
      .sort((a, b) => b.score - a.score);

    const primary = scored[0].recipe;
    const primaryScore = scored[0].score;

    // Alternatives with diversity filter
    const primaryCats = primary.tags.filter(t => TAG.category.includes(t));
    const alternatives = [];

    for (let i = 1; i < scored.length && alternatives.length < 3; i++) {
      const candidate = scored[i];
      const candidateCats = candidate.recipe.tags.filter(t => TAG.category.includes(t));
      const overlap = candidateCats.filter(c => primaryCats.includes(c));

      // Skip if too similar to primary (only skip first 5 candidates)
      if (alternatives.length === 0 && overlap.length >= 2 && i <= 5) continue;
      // Skip if too similar to existing alternatives
      const isDiverse = alternatives.every(a => {
        const aCats = a.recipe.tags.filter(t => TAG.category.includes(t));
        const aOverlap = candidateCats.filter(c => aCats.includes(c));
        return aOverlap.length < 3;
      });
      if (!isDiverse) continue;

      alternatives.push({ recipe: candidate.recipe, score: candidate.score });
    }

    return { primary, primaryScore, alternatives };
  }

  /* ==========================================================
     Public API
     ========================================================== */

  return {
    RECIPES,
    TAG,
    getTempCategory,
    getAdjacentTempCategory,
    mapWeatherCodeToTag,
    getSeason,
    getAdjacentSeason,
    getMealTime,
    getRegionFromProvince,
    formatDateStr,
    hashString,
    scoreRecipe,
    getRecommendations,
  };
})();
