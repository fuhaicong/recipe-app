/* ============================================================
   recipes.js — 500+ Recipe Database & Scoring Engine v2
   ============================================================ */

const RecipeModule = (() => {

  const TAG = {
    temperature: ['hot_weather','warm_weather','cool_weather','cold_weather'],
    weather: ['rainy','snowy','clear','overcast','humid','extreme'],
    season: ['spring','summer','autumn','winter'],
    region: ['sichuan','guangdong','hunan','shandong','jiangsu','zhejiang','fujian','anhui','beijing','shanghai','northeast','northwest','southwest','central','universal'],
    mealTime: ['breakfast','lunch','dinner','snack','late_night'],
    category: ['cold_dish','stir_fry','soup','noodle','rice','hotpot','stew','salad','dim_sum','street_food','home_style','healthy','comfort_food','quick_easy'],
    dietary: ['spicy','mild','sour','sweet','savory','light','hearty','vegetarian','meat','seafood'],
  };

  /* ==========================================================
     Part 1 — Curated Classic Recipes (~90)
     ========================================================== */
  const CURATED = [
    // === Hot / Summer / Cold Dishes ===
    {id:'c001',n:'凉拌鸡丝荞麦面',e:'🍜',d:'清爽低卡，鸡丝嫩滑，夏日必备',ig:['荞麦面150g','鸡胸肉1块','黄瓜1根','胡萝卜半根','芝麻酱2勺','生抽1勺','香醋1勺','蒜末适量'],st:['鸡胸肉冷水下锅加姜片料酒煮熟，撕成细丝','荞麦面煮熟过凉水沥干','黄瓜胡萝卜切丝','芝麻酱加温水调匀，加生抽香醋蒜末','全部拌匀撒芝麻'],tm:15,df:'easy',tg:['hot_weather','summer','cold_dish','noodle','light','universal','lunch','dinner','quick_easy'],tk:['凉面','鸡丝拌面','荞麦面','轻食']},
    {id:'c002',n:'拍黄瓜',e:'🥒',d:'爽脆开胃，两分钟搞定',ig:['黄瓜2根','蒜末适量','生抽1勺','香醋2勺','芝麻油1勺','盐少许','辣椒油可选'],st:['黄瓜拍裂切段','盐腌5分钟倒掉水','加蒜末生抽香醋麻油拌匀'],tm:5,df:'easy',tg:['hot_weather','summer','cold_dish','vegetarian','light','universal','lunch','dinner','quick_easy'],tk:['拍黄瓜','凉拌黄瓜','凉菜']},
    {id:'c003',n:'口水鸡',e:'🐔',d:'麻辣鲜香，川味经典凉菜',ig:['鸡腿2只','姜片','花椒','辣椒油3勺','花椒粉1勺','生抽2勺','香醋1勺','糖1勺','蒜末','花生碎','葱花'],st:['鸡腿加姜花椒煮15分钟焖10分钟','过冰水切块','调酱汁:辣椒油+花椒粉+生抽+醋+糖+蒜末','淋酱汁撒花生碎葱花'],tm:25,df:'medium',tg:['hot_weather','summer','cold_dish','spicy','meat','sichuan','lunch','dinner','comfort_food'],tk:['口水鸡','红油鸡','川味凉菜','麻辣鸡']},
    {id:'c004',n:'冷面',e:'🍝',d:'冰凉酸甜，朝鲜族风味消暑面',ig:['冷面条200g','酱牛肉几片','水煮蛋半个','黄瓜丝','梨片','泡菜','冷面汤底(醋+糖+酱油+冰水)'],st:['调冰镇汤底','面煮熟过冷水','倒入冰汤放配料'],tm:20,df:'medium',tg:['hot_weather','summer','cold_dish','noodle','light','sour','northeast','lunch','dinner'],tk:['冷面','朝鲜冷面','冰面']},
    {id:'c005',n:'越南春卷',e:'🫔',d:'透明饼皮包裹鲜蔬虾仁，清爽健康',ig:['米纸8张','鲜虾200g','生菜','米粉','薄荷叶','蘸料:鱼露+柠檬汁+糖+蒜末'],st:['虾煮熟去壳','米纸温水浸软','依次放生菜米粉虾仁薄荷','卷紧蘸酱吃'],tm:20,df:'easy',tg:['hot_weather','summer','cold_dish','salad','seafood','light','healthy','southwest','lunch','dinner','quick_easy'],tk:['越南春卷','夏卷','米纸卷','轻食']},
    {id:'c006',n:'绿豆汤',e:'🫘',d:'清热解毒，老北京消暑名品',ig:['绿豆200g','冰糖适量','水2L','百合可选'],st:['绿豆泡2小时','大火煮开撇沫','小火煮至开花','加冰糖冰镇更好'],tm:50,df:'easy',tg:['hot_weather','summer','soup','sweet','vegetarian','healthy','beijing','snack'],tk:['绿豆汤','冰糖绿豆','消暑饮品']},
    {id:'c007',n:'酸梅汤',e:'🥤',d:'古法熬制，酸甜解腻消暑饮品',ig:['乌梅10颗','山楂干20g','甘草5g','洛神花5g','陈皮1片','冰糖80g','桂花少许'],st:['材料浸泡30分钟','大火煮开转小火熬40分钟','加冰糖过滤','撒桂花冷藏后饮'],tm:60,df:'easy',tg:['hot_weather','summer','healthy','sweet','vegetarian','beijing','snack'],tk:['酸梅汤','老北京酸梅汤','消暑饮料']},
    {id:'c008',n:'皮蛋豆腐',e:'🥚',d:'冰凉嫩滑，一分钟搞定的夏日凉菜',ig:['嫩豆腐1块','皮蛋2个','葱花','生抽2勺','香醋1勺','芝麻油1勺','辣椒油可选'],st:['豆腐倒扣盘中','皮蛋切瓣摆在周围','淋生抽香醋麻油','撒葱花辣椒油'],tm:3,df:'easy',tg:['hot_weather','summer','cold_dish','vegetarian','light','universal','dinner','quick_easy'],tk:['皮蛋豆腐','凉拌豆腐','凉菜']},

    // === Warm / Home Style ===
    {id:'c009',n:'番茄炒蛋',e:'🍅',d:'国民家常菜第一名，酸甜下饭',ig:['鸡蛋3个','番茄2个','葱花','盐','糖1小勺'],st:['鸡蛋打散加盐','热油炒蛋盛出','炒番茄出汁加糖','倒回蛋翻匀撒葱'],tm:8,df:'easy',tg:['warm_weather','summer','spring','stir_fry','home_style','vegetarian','mild','universal','lunch','dinner','quick_easy'],tk:['番茄炒蛋','西红柿炒蛋','家常菜']},
    {id:'c010',n:'鱼香肉丝',e:'🥩',d:'酸甜微辣，肉丝嫩滑，经典川菜',ig:['猪里脊200g','木耳50g','胡萝卜半根','青椒1个','豆瓣酱1勺','姜蒜末','料汁:生抽+醋+糖+淀粉+水'],st:['肉切丝腌10分钟','木耳胡萝卜青椒切丝','滑炒肉丝盛出','炒豆瓣酱姜蒜加蔬菜','倒肉丝淋料汁翻炒'],tm:20,df:'medium',tg:['warm_weather','spring','autumn','stir_fry','home_style','sour','spicy','meat','sichuan','lunch','dinner'],tk:['鱼香肉丝','川菜','下饭菜']},
    {id:'c011',n:'宫保鸡丁',e:'🥜',d:'荔枝味酱汁，花生酥脆，全球最受欢迎中餐',ig:['鸡胸肉250g','花生米50g','干辣椒5个','花椒','葱段','姜蒜片','料汁:生抽+醋+糖+老抽+淀粉+水'],st:['鸡肉切丁腌','花生小火炒金黄','鸡丁滑炒','煸干辣椒花椒','倒鸡丁淋料汁加花生'],tm:20,df:'medium',tg:['warm_weather','spring','autumn','stir_fry','home_style','spicy','sichuan','lunch','dinner'],tk:['宫保鸡丁','川菜','下饭菜']},
    {id:'c012',n:'麻婆豆腐',e:'🧈',d:'麻辣烫香，豆腐嫩滑，无敌下饭',ig:['嫩豆腐1块','猪肉末100g','豆瓣酱1勺','豆豉','辣椒粉','花椒粉','姜蒜末','葱花','水淀粉'],st:['豆腐焯水2分钟','炒肉末加豆瓣酱出红油','加姜蒜豆豉辣椒粉','加水煮开放豆腐炖5分钟','勾芡撒花椒粉葱'],tm:20,df:'medium',tg:['cool_weather','warm_weather','stir_fry','spicy','meat','sichuan','lunch','dinner','comfort_food'],tk:['麻婆豆腐','川菜','豆腐','下饭']},
    {id:'c013',n:'蛋炒饭',e:'🍚',d:'粒粒分明黄金炒饭，隔夜饭的归宿',ig:['隔夜米饭1碗','鸡蛋2个','葱花','盐','胡萝卜丁可选','豌豆可选','火腿丁可选'],st:['蛋黄拌入米饭','热油炒蛋白','大火炒米饭打散','加配料盐炒匀撒葱'],tm:10,df:'easy',tg:['warm_weather','rice','home_style','quick_easy','universal','breakfast','lunch','dinner','late_night'],tk:['蛋炒饭','扬州炒饭','炒饭']},
    {id:'c014',n:'蒜蓉西兰花',e:'🥦',d:'翠绿清脆，蒜香浓郁的健康蔬菜',ig:['西兰花1颗','蒜末5瓣','盐','蚝油1勺'],st:['西兰花掰小朵泡盐水','沸水加油盐焯1分钟','爆香蒜末翻炒','加盐蚝油出锅'],tm:10,df:'easy',tg:['warm_weather','spring','summer','stir_fry','healthy','vegetarian','light','universal','lunch','dinner','quick_easy'],tk:['蒜蓉西兰花','清炒西兰花','素菜']},

    // === Cool / Autumn-Winter ===
    {id:'c015',n:'红烧肉',e:'🍖',d:'红亮软糯，肥而不腻，米饭杀手',ig:['五花肉500g','冰糖30g','生抽2勺','老抽1勺','料酒2勺','八角2个','桂皮1块','香叶2片','姜葱'],st:['五花肉焯水','小火炒糖色','下肉上色加香料','加料酒酱油热水','小火炖40分钟收汁'],tm:60,df:'medium',tg:['cool_weather','cold_weather','autumn','winter','stew','meat','hearty','savory','universal','lunch','dinner'],tk:['红烧肉','红烧肉盖饭','硬菜']},
    {id:'c016',n:'番茄牛腩',e:'🍲',d:'酸甜浓郁，牛腩入口即化，暖心汤菜',ig:['牛腩500g','番茄3个','洋葱半个','胡萝卜1根','番茄酱2勺','姜八角香叶'],st:['牛腩焯水','番茄洋葱胡萝卜切块','炒洋葱加番茄出汁','加牛腩热水炖1h','加胡萝卜再炖20min'],tm:100,df:'medium',tg:['cool_weather','cold_weather','autumn','winter','stew','soup','meat','hearty','universal','lunch','dinner'],tk:['番茄牛腩','炖菜','暖汤']},
    {id:'c017',n:'酸辣汤',e:'🥣',d:'酸辣开胃，雨天最佳慰藉',ig:['嫩豆腐1块','木耳','香菇3朵','鸡蛋1个','白胡椒粉1勺','香醋2勺','生抽1勺','水淀粉','葱','香油'],st:['木耳香菇切丝','水开下木耳香菇','豆腐切条入锅','加生抽白胡椒粉','勾芡淋蛋花','关火加醋香油香葱'],tm:15,df:'easy',tg:['cool_weather','cold_weather','rainy','autumn','winter','soup','sour','spicy','comfort_food','universal','lunch','dinner','quick_easy'],tk:['酸辣汤','胡辣汤','热汤']},
    {id:'c018',n:'红烧排骨',e:'🦴',d:'酱香浓郁，排骨酥烂入味',ig:['排骨500g','生抽2勺','老抽1勺','料酒2勺','冰糖20g','八角2个','姜3片','葱段'],st:['排骨焯水','炒糖色下排骨','加姜葱八角料酒酱油','加热水炖40min','大火收汁'],tm:55,df:'medium',tg:['cool_weather','cold_weather','autumn','winter','stew','meat','hearty','savory','universal','lunch','dinner'],tk:['红烧排骨','糖醋排骨','硬菜']},
    {id:'c019',n:'土豆炖牛肉',e:'🥔',d:'牛肉酥烂土豆绵软，冬日一锅出',ig:['牛肉500g','土豆2个','胡萝卜1根','洋葱半个','生抽2勺','老抽1勺','八角桂皮香叶','姜片'],st:['牛肉焯水','炒洋葱加牛肉','加香料酱油热水炖1h','加土豆胡萝卜炖20min','收汁调味'],tm:90,df:'medium',tg:['cold_weather','winter','stew','meat','hearty','northeast','central','dinner'],tk:['土豆牛肉','炖牛肉','冬日暖锅']},
    {id:'c020',n:'牛肉面',e:'🍜',d:'汤浓肉香，手工拉面的灵魂',ig:['牛腱肉300g','面条200g','白萝卜半根','八角桂皮香叶花椒','姜葱','生抽老抽','香菜蒜苗','辣椒油'],st:['牛肉加香料炖1h切片','萝卜片入原汤煮熟','另煮面至熟','碗中盛面浇汤摆肉','撒香菜蒜苗淋辣椒油'],tm:90,df:'hard',tg:['cool_weather','cold_weather','noodle','soup','meat','hearty','northwest','lunch','dinner','comfort_food'],tk:['牛肉面','兰州拉面','汤面']},

    // === Cold / Winter ===
    {id:'c021',n:'清汤羊肉',e:'🐑',d:'汤清肉鲜，暖身驱寒首选',ig:['羊肉500g','白萝卜1根','姜片5片','枸杞','料酒2勺','盐','香菜','白胡椒粉'],st:['羊肉泡水1h去血','冷水焯水加料酒姜','洗净慢炖40min','加萝卜再炖15min','加盐枸杞胡椒粉撒香菜'],tm:80,df:'medium',tg:['cold_weather','winter','soup','stew','meat','hearty','northwest','dinner','comfort_food'],tk:['羊肉汤','清炖羊肉','暖汤']},
    {id:'c022',n:'萝卜炖牛腩',e:'🥩',d:'冬日炖菜之王，萝卜吸饱肉汁',ig:['牛腩500g','白萝卜1根','姜3片','八角桂皮','生抽2老抽1料酒2','盐'],st:['牛腩焯水','炒姜八角桂皮','加牛腩酱油料酒翻炒','加热水炖1h','加萝卜炖20min收汁加盐'],tm:90,df:'medium',tg:['cold_weather','winter','autumn','stew','meat','hearty','guangdong','central','lunch','dinner'],tk:['萝卜牛腩','广式煲仔','冬日暖菜']},
    {id:'c023',n:'火锅',e:'🫕',d:'冬日聚餐之魂，热腾腾暖身又暖心',ig:['火锅底料1包','肥牛300g','羊肉卷300g','豆腐','金针菇','白菜','藕','土豆','粉丝','蘸料:麻酱+蒜+香油+香菜'],st:['锅中加水加底料煮开','蔬菜切好肉装盘','调麻酱蘸料','涮肉涮菜','最后下粉丝面'],tm:30,df:'easy',tg:['cold_weather','winter','hotpot','meat','hearty','sichuan','southwest','dinner','comfort_food'],tk:['火锅','涮羊肉','麻辣火锅','锅底']},
    {id:'c024',n:'酸菜炖排骨',e:'🦴',d:'东北冬日硬菜，酸菜解腻排骨香嫩',ig:['排骨500g','酸菜300g','粉条','姜3片','八角1个','料酒2勺','盐'],st:['排骨焯水','酸菜切丝泡去咸味','炒姜八角加排骨','加酸菜翻炒加热水炖40min','加粉条炖10min加盐'],tm:60,df:'medium',tg:['cold_weather','winter','stew','meat','hearty','sour','northeast','dinner','comfort_food'],tk:['酸菜排骨','东北菜','炖菜']},

    // === Rainy / Comfort ===
    {id:'c025',n:'麻辣烫',e:'🌶️',d:'下雨天就想吃，在家做干净又过瘾',ig:['火锅底料50g','牛奶100ml','丸子鱼豆腐','午餐肉','豆腐泡','金针菇','蔬菜','粉丝','麻酱蘸料'],st:['汤底加水加底料煮开','加牛奶搅拌汤白','依次下食材耐煮先放','煮熟连汤盛出配麻酱蘸料'],tm:20,df:'easy',tg:['rainy','cool_weather','cold_weather','street_food','spicy','comfort_food','sichuan','lunch','dinner','late_night'],tk:['麻辣烫','冒菜','串串']},
    {id:'c026',n:'水煮鱼',e:'🐟',d:'红油翻滚鱼片嫩滑，吃完浑身舒畅',ig:['鱼片300g','豆芽200g','干辣椒10个','花椒','豆瓣酱2勺','姜蒜末','蛋清1个','淀粉'],st:['鱼片加盐料酒蛋清淀粉腌','豆芽焯水铺碗底','炒豆瓣酱出红油加水煮开','滑入鱼片煮至变白','撒干辣椒花椒浇热油'],tm:30,df:'hard',tg:['rainy','cool_weather','spicy','seafood','comfort_food','sichuan','lunch','dinner'],tk:['水煮鱼','水煮肉片','麻辣鱼']},
    {id:'c027',n:'姜丝可乐',e:'☕',d:'下雨天驱寒暖身，懒人最快热饮',ig:['可乐1罐','生姜几片','柠檬可选'],st:['姜切薄片','可乐倒锅加姜','小火煮5分钟','挤少许柠檬汁倒入杯中'],tm:8,df:'easy',tg:['rainy','cold_weather','snowy','healthy','sweet','universal','snack','late_night','quick_easy'],tk:['姜丝可乐','暖饮','驱寒饮品']},

    // === Spring ===
    {id:'c028',n:'春笋炒肉',e:'🎋',d:'春笋脆嫩，腊肉咸香完美搭配',ig:['春笋300g','腊肉150g','蒜苗2根','干辣椒2个','生抽1勺','盐','糖少许'],st:['春笋剥壳切片焯水2min','腊肉切薄片','炒腊肉出油微焦','加干辣椒春笋翻炒','加生抽盐糖蒜苗翻匀'],tm:15,df:'easy',tg:['spring','warm_weather','stir_fry','meat','home_style','zhejiang','anhui','lunch','dinner'],tk:['春笋炒肉','腊肉炒笋','春季时令']},
    {id:'c029',n:'荠菜饺子',e:'🥟',d:'荠菜清香，包一盘春天的味道',ig:['荠菜300g','猪肉馅250g','饺子皮','姜末','生抽2勺','香油1勺','蚝油1勺','盐','鸡蛋1个'],st:['荠菜焯水挤干切碎','肉馅加调料搅上劲','加荠菜碎香油拌匀','包饺子','水开下饺子浮起后再煮2min'],tm:40,df:'medium',tg:['spring','warm_weather','dim_sum','home_style','meat','shandong','central','lunch','dinner'],tk:['荠菜饺子','野菜饺子','春季']},

    // === Autumn ===
    {id:'c030',n:'银耳莲子羹',e:'🪷',d:'滋阴润燥，胶质满满养颜圣品',ig:['银耳1朵','莲子30g','红枣8颗','枸杞','冰糖','水1.5L'],st:['银耳泡2h撕小朵','莲子去芯泡发','加红枣水大火煮开','小火炖1h出胶','加冰糖枸杞煮5min'],tm:120,df:'easy',tg:['autumn','winter','soup','sweet','vegetarian','healthy','guangdong','snack','breakfast'],tk:['银耳羹','糖水','养生甜品']},
    {id:'c031',n:'莲藕排骨汤',e:'🪵',d:'藕香四溢，汤汁清甜秋日润燥',ig:['排骨400g','莲藕2节','姜3片','枸杞','盐','料酒1勺'],st:['排骨焯水','莲藕去皮切块','排骨姜料酒加水炖30min','加莲藕炖30min','加盐枸杞煮5min'],tm:80,df:'easy',tg:['autumn','cool_weather','soup','meat','healthy','central','lunch','dinner'],tk:['莲藕排骨','煲汤','秋季滋补']},

    // === Regional ===
    {id:'c032',n:'白切鸡',e:'🐔',d:'皮爽肉滑，简约中见真功夫',ig:['三黄鸡1只','姜1大块','葱3根','蘸料:姜蓉+葱+盐+热油'],st:['鸡处理干净水加姜葱烧开','鸡浸入沸水提起重复3次','关火浸泡25min','过冰水切块','姜蓉葱碎盐浇热油'],tm:45,df:'hard',tg:['warm_weather','spring','summer','meat','light','guangdong','lunch','dinner'],tk:['白切鸡','白斩鸡','广东菜','烧腊']},
    {id:'c033',n:'小炒肉',e:'🌶️',d:'湘菜之魂！五花肉煸至焦香吸饱辣椒味',ig:['五花肉250g','青线椒5个','小米辣2个','蒜片','豆豉','生抽1勺','老抽半勺','盐'],st:['五花肉切薄片青椒切圈','干锅煸青椒至虎皮','炒五花肉微卷焦黄','加豆豉蒜片酱油','倒回青椒翻匀加盐'],tm:15,df:'easy',tg:['warm_weather','cool_weather','stir_fry','spicy','meat','hunan','lunch','dinner','quick_easy'],tk:['小炒肉','辣椒炒肉','湘菜','下饭']},
    {id:'c034',n:'锅包肉',e:'🥩',d:'外酥里嫩酸甜可口，东北第一硬菜',ig:['猪里脊300g','土豆淀粉150g','胡萝卜丝','姜丝','葱丝','糖醋汁:白糖3+白醋3+生抽1'],st:['里脊切薄片刀背拍松','淀粉加水沉淀裹肉','炸至定型复炸金黄','糖醋汁加热','锅底油倒汁加配菜','倒肉快速翻匀'],tm:30,df:'hard',tg:['cool_weather','winter','sweet','sour','meat','northeast','lunch','dinner'],tk:['锅包肉','东北菜','酸甜肉']},
    {id:'c035',n:'葱油拌面',e:'🧅',d:'葱油焦香，5分钟就香死人',ig:['面条150g','小葱5根','生抽2勺','老抽1勺','糖1小勺','油3勺'],st:['葱切段分葱白葱绿','小火煸葱白至微黄加葱绿','煸至焦黄关火倒酱油糖液','面煮熟捞碗','浇葱油放焦葱拌匀'],tm:10,df:'easy',tg:['warm_weather','noodle','vegetarian','quick_easy','shanghai','breakfast','lunch','late_night'],tk:['葱油拌面','上海面','拌面']},
    {id:'c036',n:'地三鲜',e:'🍆',d:'土豆绵软茄子吸汁青椒增香，东北名素菜',ig:['土豆2个','茄子1根','青椒2个','蒜末','生抽2老抽半','糖1勺','淀粉','盐'],st:['三样切滚刀块','土豆茄子分别炸','调碗汁:酱油+糖+盐+水+淀粉','爆香蒜倒汁煮浓','倒入炸菜翻匀'],tm:25,df:'medium',tg:['cool_weather','warm_weather','stir_fry','vegetarian','hearty','northeast','lunch','dinner'],tk:['地三鲜','东北菜','素菜']},
    {id:'c037',n:'鱼香茄子',e:'🍆',d:'茄子吸满酸甜酱汁，比肉还好吃',ig:['茄子2根','猪肉末100g','姜蒜末','豆瓣酱1勺','料汁:生抽+醋+糖+淀粉+水','葱'],st:['茄子切条盐腌挤水','炒肉末加豆瓣酱','加姜蒜茄子翻炒','淋料汁炖2min收汁','撒葱花'],tm:20,df:'medium',tg:['warm_weather','stir_fry','spicy','sour','meat','sichuan','lunch','dinner'],tk:['鱼香茄子','川菜','下饭菜']},

    // === Breakfast ===
    {id:'c038',n:'鸡蛋灌饼',e:'🫓',d:'饼皮酥脆鸡蛋灌入，街头早餐之王',ig:['面粉200g','鸡蛋2个','生菜','甜面酱','火腿肠','葱'],st:['面粉加热水和面醒30min','擀薄抹油酥包起再擀','热油放饼','鼓起时倒蛋液','翻面煎金黄刷酱卷菜'],tm:25,df:'medium',tg:['breakfast','street_food','dim_sum','quick_easy','central','universal'],tk:['鸡蛋灌饼','煎饼','早餐']},
    {id:'c039',n:'皮蛋瘦肉粥',e:'🥣',d:'绵密顺滑，经典广式早餐暖胃',ig:['大米100g','皮蛋2个','猪瘦肉100g','姜丝','盐','白胡椒粉','葱'],st:['米泡30min','肉丝加盐料酒腌','皮蛋切丁','水开下米煮15min','加肉丝皮蛋姜丝熬15min','加盐胡椒粉撒葱'],tm:40,df:'easy',tg:['breakfast','cool_weather','rainy','soup','light','guangdong','universal','comfort_food'],tk:['皮蛋瘦肉粥','广式早餐','粥']},
    {id:'c040',n:'煎饼果子',e:'🥞',d:'天津经典早餐，薄脆夹心咸香可口',ig:['面粉100g','绿豆面30g','鸡蛋1个','薄脆','甜面酱','辣椒酱','葱花','香菜','芝麻'],st:['面糊调匀','鏊子上摊薄','打鸡蛋摊开','撒葱花香菜芝麻','翻面刷酱','放薄脆卷起'],tm:15,df:'medium',tg:['breakfast','street_food','quick_easy','beijing','north','universal'],tk:['煎饼果子','天津煎饼','早餐']},

    // === Late Night ===
    {id:'c041',n:'螺蛳粉',e:'🐌',d:'酸辣鲜爽，加班夜宵神器',ig:['袋装螺蛳粉1包','煎蛋1个','青菜','火腿可选'],st:['按说明煮粉过冷水','换水加汤料煮开','放粉和青菜','加酸笋木耳花生腐竹','加辣椒油醋包配煎蛋'],tm:15,df:'easy',tg:['late_night','rainy','noodle','spicy','sour','street_food','southwest','comfort_food'],tk:['螺蛳粉','柳州螺蛳粉','夜宵']},
    {id:'c042',n:'烤肉拌饭',e:'🍛',d:'烤肉焦香配拌饭酱，一人食的快乐',ig:['米饭1碗','五花肉200g','生菜','韩式辣酱2勺','蜂蜜少许','蒜末','生抽1勺','香油1勺','芝麻','煎蛋1个'],st:['辣酱加蜂蜜生抽蒜末香油调拌饭酱','五花肉切片煎至焦黄','碗中盛饭铺菜肉蛋','浇酱撒芝麻拌匀'],tm:15,df:'easy',tg:['late_night','warm_weather','rice','meat','spicy','northeast','lunch','dinner','quick_easy'],tk:['烤肉拌饭','韩式拌饭','一人食']},

    // === More varied home-style dishes ===
    {id:'c043',n:'可乐鸡翅',e:'🍗',d:'甜香软嫩零失败，厨房新手也能做',ig:['鸡翅中8个','可乐1罐','生抽2勺','老抽1勺','料酒1勺','姜3片','盐少许'],st:['鸡翅划两刀焯水','热油煎鸡翅两面金黄','加姜料酒生抽老抽','倒可乐没过鸡翅','中火炖15min大火收汁加盐'],tm:25,df:'easy',tg:['warm_weather','stew','meat','sweet','universal','lunch','dinner','quick_easy','popular'],tk:['可乐鸡翅','鸡翅','下饭菜']},
    {id:'c044',n:'糖醋里脊',e:'🍖',d:'外酥里嫩酸甜酱汁，大人小孩都爱',ig:['猪里脊300g','面粉淀粉各半','鸡蛋1个','糖醋汁：番茄酱2+白糖2+白醋1','盐料酒'],st:['里脊切条盐料酒腌','面粉淀粉鸡蛋调糊','每根裹糊炸金黄','复炸酥脆','糖醋汁加热浓稠倒肉条翻匀'],tm:30,df:'medium',tg:['warm_weather','stir_fry','meat','sweet','sour','shandong','lunch','dinner'],tk:['糖醋里脊','锅包肉','酸甜肉']},
    {id:'c045',n:'回锅肉',e:'🥩',d:'肥而不腻香气四溢，川菜之首',ig:['五花肉300g','蒜苗3根','青椒2个','豆瓣酱1勺','甜面酱半勺','姜片','料酒','生抽'],st:['五花肉冷水加姜料酒煮至筷子能插透','捞出切薄片','热锅少许油炒肉片微卷出油','加豆瓣酱炒出红油','加甜面酱生抽','加蒜苗青椒翻炒断生'],tm:30,df:'medium',tg:['warm_weather','cool_weather','stir_fry','spicy','meat','sichuan','lunch','dinner'],tk:['回锅肉','川菜','下饭菜']},
    {id:'c046',n:'羊肉泡馍',e:'🐑',d:'汤浓馍香，西安人的魂',ig:['羊肉500g','烙饼2个','粉丝','木耳','黄花菜','姜葱','八角桂皮花椒','盐','辣椒酱'],st:['羊肉加香料炖1.5h至酥烂','掰馍成黄豆大小','木耳黄花菜泡发','羊肉汤煮沸加配料','放入馍粒煮1min','盛出配辣椒酱'],tm:120,df:'hard',tg:['cold_weather','winter','soup','meat','hearty','northwest','lunch','dinner','comfort_food'],tk:['羊肉泡馍','西安美食','暖汤']},
    {id:'c047',n:'黄焖鸡',e:'🍗',d:'酱香浓郁鸡肉嫩滑，外卖人气王',ig:['鸡腿肉500g','土豆2个','香菇6朵','青椒1个','生抽2老抽1','蚝油1勺','冰糖10g','姜片','干辣椒'],st:['鸡肉切块焯水','炒糖色下鸡块','加姜干辣椒香菇','加生抽老抽蚝油热水炖20min','加土豆炖10min','加青椒收汁'],tm:40,df:'easy',tg:['cool_weather','warm_weather','stew','meat','hearty','shandong','lunch','dinner'],tk:['黄焖鸡','黄焖鸡米饭','外卖']},
    {id:'c048',n:'酸菜鱼',e:'🐟',d:'酸爽开胃鱼片嫩滑，一大盆都不够吃',ig:['草鱼片300g','酸菜200g','干辣椒','花椒','姜蒜','蛋清','淀粉','料酒','盐','白胡椒粉'],st:['鱼片加盐料酒蛋清淀粉腌','酸菜切丝炒干出香','炒姜蒜加酸菜加水煮开','小火滑入鱼片煮至变白','撒干辣椒花椒浇热油'],tm:25,df:'medium',tg:['cool_weather','warm_weather','rainy','sour','spicy','seafood','sichuan','lunch','dinner','comfort_food'],tk:['酸菜鱼','川菜','鱼火锅']},
    {id:'c049',n:'京酱肉丝',e:'🥩',d:'酱香浓郁配豆腐皮卷着吃，京味十足',ig:['猪里脊250g','大葱2根','豆腐皮几张','甜面酱2勺','生抽1勺','料酒1勺','淀粉','糖','黄瓜丝'],st:['肉切细丝加料酒淀粉腌','大葱切丝黄瓜切丝','热油滑肉丝至白','甜面酱+生抽+糖+水熬浓','倒肉丝翻匀','豆腐皮包肉丝葱丝黄瓜吃'],tm:20,df:'medium',tg:['warm_weather','stir_fry','meat','savory','beijing','lunch','dinner'],tk:['京酱肉丝','北京菜','卷饼']},
    {id:'c050',n:'蚝油生菜',e:'🥬',d:'脆嫩鲜甜，两分钟搞定，最简单的绿叶菜',ig:['生菜300g','蒜末','蚝油2勺','生抽1勺','糖少许','水淀粉'],st:['生菜焯水10秒捞出','爆香蒜末','加蚝油生抽糖水淀粉煮浓','浇在生菜上即刻'],tm:5,df:'easy',tg:['warm_weather','hot_weather','stir_fry','vegetarian','light','quick_easy','guangdong','lunch','dinner'],tk:['蚝油生菜','清炒生菜','素菜']},
    {id:'c051',n:'粉蒸肉',e:'🥩',d:'米粉包裹五花肉，蒸出来的软糯鲜香',ig:['五花肉400g','蒸肉粉1包','红薯1个','生抽2老抽1','料酒1勺','豆瓣酱1勺','姜片'],st:['五花肉切厚片加调料腌30min','红薯切块铺碗底','肉片裹蒸肉粉码在红薯上','上锅蒸1h蒸至软烂','出锅撒葱花'],tm:100,df:'medium',tg:['cool_weather','autumn','winter','steam','meat','hearty','central','hunan','lunch','dinner'],tk:['粉蒸肉','蒸菜','硬菜']},
    {id:'c052',n:'手撕包菜',e:'🥬',d:'大火快炒锅气十足，麻辣脆爽',ig:['包菜半个','干辣椒5个','花椒','蒜片','生抽1勺','醋1勺','盐','糖少许'],st:['包菜手撕成块','热油爆香干辣椒花椒蒜','大火翻炒包菜','沿锅边淋醋','加生抽盐糖快速翻匀出锅'],tm:8,df:'easy',tg:['warm_weather','stir_fry','vegetarian','spicy','quick_easy','hunan','lunch','dinner'],tk:['手撕包菜','湘菜','素菜']},
    {id:'c053',n:'可乐饼',e:'🥔',d:'外酥里绵，日式风味的土豆可乐饼',ig:['土豆3个','猪肉末150g','洋葱半个','鸡蛋2个','面包糠','面粉','盐','黑胡椒'],st:['土豆煮熟压泥','炒肉末洋葱加盐胡椒','土豆泥包肉末馅捏成饼','依次裹面粉蛋液面包糠','炸至金黄'],tm:40,df:'medium',tg:['warm_weather','cool_weather','stir_fry','meat','snack','universal','lunch','dinner'],tk:['可乐饼','日式炸物','小吃']},
    {id:'c054',n:'炸酱面',e:'🍝',d:'酱香浓郁菜码丰富，老北京的讲究',ig:['面条200g','五花肉丁200g','黄酱2勺','甜面酱1勺','黄瓜丝','豆芽','心里美萝卜丝','黄豆','葱姜末'],st:['黄酱甜面酱加水调稀','小火炸酱：多油煸肉丁加葱姜末加酱慢熬20min','面煮熟过水','码上各种菜码','浇炸酱拌匀'],tm:35,df:'medium',tg:['warm_weather','summer','noodle','meat','savory','beijing','lunch','dinner'],tk:['炸酱面','老北京炸酱面','拌面']},
    {id:'c055',n:'干锅花菜',e:'🥦',d:'焦香四溢麻辣入味，比肉还好吃的素菜',ig:['花菜半颗','五花肉薄片100g','干辣椒','花椒','豆瓣酱1勺','蒜片','生抽','蚝油'],st:['花菜掰小朵焯水沥干','炒五花肉出油','加豆瓣酱干辣椒花椒蒜','加花菜大火翻炒','加生抽蚝油炒至边缘微焦'],tm:15,df:'easy',tg:['warm_weather','cool_weather','stir_fry','spicy','meat','hunan','sichuan','lunch','dinner'],tk:['干锅花菜','湘菜','干锅']},
    {id:'c056',n:'蒜蓉粉丝蒸虾',e:'🦐',d:'鲜美快手，粉丝吸饱虾汁比虾还香',ig:['大虾12只','粉丝1把','蒜末大量','生抽2勺','蚝油1勺','糖','葱花','热油'],st:['粉丝泡软铺盘底','虾开背去虾线铺粉丝上','蒜末一半炸金一半生的混合','加生抽蚝油糖调蒜蓉酱','蒜蓉酱铺虾上蒸8min','出锅撒葱花浇热油'],tm:25,df:'medium',tg:['warm_weather','steam','seafood','light','guangdong','lunch','dinner'],tk:['蒜蓉粉丝蒸虾','广式蒸海鲜','海鲜']},
    {id:'c057',n:'冬瓜排骨汤',e:'🫕',d:'清甜解暑，夏天喝最舒服',ig:['排骨400g','冬瓜500g','姜3片','枸杞','盐','料酒'],st:['排骨焯水','冬瓜去皮切块','排骨姜料酒加水炖30min','加冬瓜再炖15min','加盐枸杞'],tm:50,df:'easy',tg:['hot_weather','summer','soup','light','healthy','guangdong','lunch','dinner'],tk:['冬瓜排骨汤','清汤','夏季汤品']},
    {id:'c058',n:'金汤肥牛',e:'🥩',d:'酸辣金黄汤底，肥牛嫩滑，下饭神器',ig:['肥牛卷300g','金针菇1把','黄灯笼辣椒酱2勺','泡椒3个','蒜末','白醋1勺','盐','青红椒圈'],st:['金针菇焯水铺碗底','肥牛焯水至变色捞出','炒蒜末黄灯笼酱泡椒','加水煮开加白醋盐','放肥牛煮1min连汤倒入碗中','撒青红椒圈'],tm:15,df:'easy',tg:['cool_weather','rainy','soup','sour','spicy','meat','sichuan','lunch','dinner','comfort_food','quick_easy'],tk:['金汤肥牛','酸汤肥牛','川菜']},
    {id:'c059',n:'毛血旺',e:'🌶️',d:'麻辣鲜香一锅烩，川渝江湖菜代表',ig:['鸭血1块','午餐肉','毛肚','豆芽','豆皮','木耳','火锅底料50g','干辣椒','花椒','蒜末'],st:['鸭血午餐肉切片毛肚洗净','豆芽焯水铺碗底','炒火锅底料干辣椒花椒加水煮开','依次下鸭血午餐肉豆皮木耳煮5min','下毛肚烫30秒','连汤倒入碗中撒蒜末浇热油'],tm:25,df:'medium',tg:['cool_weather','rainy','hotpot','spicy','meat','sichuan','southwest','lunch','dinner','comfort_food'],tk:['毛血旺','川菜','麻辣烫菜']},
    {id:'c060',n:'腊味煲仔饭',e:'🍚',d:'锅巴焦香，腊味油脂浸入米饭，广东人的魂',ig:['大米200g','腊肠2根','腊肉100g','油菜2棵','生抽2勺','蚝油1勺','糖','香油'],st:['米提前泡30min','砂锅抹油放米加水煮开','转小火铺上切片腊味','盖盖小火焖15min','放焯水的油菜','调酱汁:生抽+蚝油+糖+香油淋入'],tm:35,df:'medium',tg:['cool_weather','autumn','winter','rice','meat','hearty','guangdong','lunch','dinner','comfort_food'],tk:['煲仔饭','腊味煲仔饭','广东美食']},
  ];

  /* ==========================================================
     Part 2 — Recipe Template Engine (generates ~440 more)
     ========================================================== */

  // Ingredient pools
  const PRO = {
    // [name, weight, prep_note, is_meat, is_seafood]
    chicken_breast: ['鸡胸肉','250g','切片/切丁',true,false],
    chicken_leg:    ['鸡腿肉','300g','去骨切块',true,false],
    chicken_wing:   ['鸡翅中','8个','划两刀',true,false],
    pork_loin:      ['猪里脊','250g','切片/切丝',true,false],
    pork_belly:     ['五花肉','300g','切薄片',true,false],
    pork_rib:       ['排骨','400g','斩小段',true,false],
    pork_mince:     ['猪肉末','200g','',true,false],
    beef_slice:     ['牛肉片','250g','逆纹切薄片',true,false],
    beef_brisket:   ['牛腩','400g','切块',true,false],
    beef_chunk:     ['牛肉块','350g','切块',true,false],
    lamb_slice:     ['羊肉片','300g','',true,false],
    lamb_chunk:     ['羊肉块','400g','切块',true,false],
    fish_fillet:    ['鱼片','300g','斜刀片薄',false,true],
    fish_whole:     ['整鱼','1条(约500g)','去鳞去内脏划花刀',false,true],
    shrimp:         ['大虾','300g','去虾线',false,true],
    shrimp_peeled:  ['虾仁','200g','',false,true],
    squid:          ['鱿鱼','300g','切圈/花刀',false,true],
    tofu_firm:      ['老豆腐','1块','切厚片',false,false],
    tofu_soft:      ['嫩豆腐','1块','切块',false,false],
    tofu_skin:      ['豆皮','2张','切条',false,false],
    egg:            ['鸡蛋','3个','打散',false,false],
    duck_breast:    ['鸭胸肉','250g','切片',true,false],
  };

  const VEG = {
    bok_choy:    ['小白菜','200g','洗净'],
    spinach:     ['菠菜','200g','洗净焯水'],
    cabbage:     ['包菜','半个','手撕成块'],
    napa:        ['大白菜','300g','切块'],
    broccoli:    ['西兰花','1颗','掰小朵'],
    cauli:       ['花菜','半颗','掰小朵'],
    pepper_green:['青椒','2个','切丝/切块'],
    pepper_red:  ['红椒','1个','切丝'],
    chili:       ['线椒','4根','斜切圈'],
    eggplant:    ['茄子','2根','切条/滚刀块'],
    tomato:      ['番茄','2个','切块'],
    cucumber:    ['黄瓜','2根','切片/拍碎'],
    celery:      ['芹菜','3根','切段'],
    green_bean:  ['四季豆','250g','去筋掐段'],
    snow_pea:    ['荷兰豆','200g','去筋'],
    potato:      ['土豆','2个','切丝/切块'],
    radish:      ['白萝卜','1根','切块'],
    carrot:      ['胡萝卜','1根','切片'],
    lotus:       ['莲藕','1节','切片'],
    mushroom:    ['香菇','8朵','去蒂切片'],
    enoki:       ['金针菇','1把','去根'],
      fungus:      ['木耳','适量','泡发撕小朵'],
    onion:       ['洋葱','半个','切丝'],
    garlic_sprout:['蒜苗','3根','斜切段'],
    leek:        ['韭菜','200g','切段'],
    asparagus:   ['芦笋','200g','去老根切段'],
    zuke:        ['西葫芦','1根','切片'],
    bitter_melon:['苦瓜','1根','去瓤切片'],
      corn:        ['玉米','1根','切段'],
    pea:         ['豌豆','100g',''],
    edamame:     ['毛豆','200g',''],
  };

  const CARB = {
    rice_white:  ['白米饭','1碗',''],
    noodle_wheat:['面条','200g','煮熟'],
    noodle_rice: ['米粉','200g','泡软'],
    vermicelli:  ['粉丝','1把','泡软'],
    udon:        ['乌冬面','200g',''],
      bread:       ['馒头/饼','2个',''],
  };

  const SAUCE = {
    soy:       ['生抽','2勺'],
    dark_soy:  ['老抽','1勺'],
    oyster:    ['蚝油','1勺'],
    vinegar:   ['香醋','1勺'],
    cooking_wine:['料酒','1勺'],
    douban:    ['豆瓣酱','1勺'],
    hoisin:    ['甜面酱','1勺'],
    chili_oil: ['辣椒油','1勺'],
    sesame_oil:['芝麻油','1勺'],
    fermented: ['豆豉','少许'],
    yellow_chili:['黄灯笼辣椒酱','1勺'],
  };

  const ARO = {
    garlic:  ['蒜末','适量'],
    ginger:  ['姜片','3片'],
    scallion:['葱花','适量'],
    cilantro:['香菜','适量'],
    dry_chili:['干辣椒','5个'],
    sichuan_pep:['花椒','适量'],
    star_anise:['八角','2个'],
    cassia:  ['桂皮','1块'],
    bay:     ['香叶','2片'],
    cumin:   ['孜然粉','1勺'],
  };

  // Cooking method → default steps pattern and tags
  const METHODS = {
    stir_fry: {
      steps: (p,v) => [
        '{protein}用料酒+淀粉+少许盐腌制10分钟',
        '热锅凉油，滑炒{protein}至变色盛出',
        '锅底留油爆香{aromatics}',
        '加入{vegetable}大火翻炒至断生',
        '倒回{protein}，加{sauce}调味',
        '大火翻炒均匀出锅',
      ],
      tags: ['stir_fry','home_style','quick_easy'],
      time: [8,20], diff: 'easy',
      meal: ['lunch','dinner'],
    },
    braise: {
      steps: (p,v) => [
        '{protein}焯水捞出洗净',
        '热锅小火炒糖色（冰糖慢熬至焦黄起泡）',
        '下{protein}翻炒上色',
        '加{aromatics}、料酒、生抽、老抽',
        '加入没过食材的热水，大火烧开转小火慢炖40分钟',
        '中途加入{vegetable}继续炖至入味',
        '大火收汁至浓稠即可',
      ],
      tags: ['stew','hearty','savory'],
      time: [40,80], diff: 'medium',
      meal: ['lunch','dinner'],
      temp_bias: ['cool_weather','cold_weather'],
    },
    soup_stew: {
      steps: (p,v) => [
        '{protein}焯水洗净备用',
        '锅中加足量清水，放入{protein}和{aromatics}',
        '大火煮开后撇去浮沫，转小火炖30-50分钟',
        '加入{vegetable}继续炖15-20分钟',
        '加盐和少许白胡椒粉调味',
        '出锅前撒上{aromatics_finish}即可',
      ],
      tags: ['soup','healthy','light'],
      time: [50,100], diff: 'easy',
      meal: ['lunch','dinner'],
      season_bias: ['autumn','winter'],
      temp_bias: ['cool_weather','cold_weather'],
    },
    cold_mix: {
      steps: (p,v) => [
        '{protein}煮熟/焯水后捞出，过凉水沥干',
        '{vegetable}切丝/切片，焯水10秒捞出',
        '调酱汁：生抽+香醋+蒜末+芝麻油+少许糖拌匀',
        '将{protein}和{vegetable}放入大碗',
        '浇上酱汁拌匀',
        '可加辣椒油或花椒油调味',
      ],
      tags: ['cold_dish','light','quick_easy'],
      time: [8,20], diff: 'easy',
      meal: ['lunch','dinner'],
      temp_bias: ['hot_weather','warm_weather'],
      season_bias: ['summer','spring'],
    },
    dry_fry: {
      steps: (p,v) => [
        '{vegetable}焯水沥干备用',
        '热锅少许油，下{protein}（五花肉/腊肉）煸炒出油至微焦',
        '加入豆瓣酱、干辣椒、花椒、蒜片炒香',
        '倒入{vegetable}大火翻炒',
        '加生抽、蚝油调味',
        '炒至{vegetable}边缘微焦，出锅',
      ],
      tags: ['stir_fry','spicy','home_style'],
      time: [12,25], diff: 'medium',
      meal: ['lunch','dinner'],
      region_bias: ['hunan','sichuan'],
    },
    steam: {
      steps: (p,v) => [
        '{protein}加料酒、姜片、少许盐腌制15分钟',
        '盘中铺上{vegetable}',
        '码上{protein}',
        '铺上{aromatics}和调味料',
        '水开后上锅蒸10-15分钟',
        '出锅后淋少许生抽和热油',
      ],
      tags: ['healthy','light'],
      time: [20,35], diff: 'easy',
      meal: ['lunch','dinner'],
      region_bias: ['guangdong','jiangsu'],
    },
    quick_soup: {
      steps: (p,v) => [
        '锅中少许油爆香{aromatics}',
        '加入{vegetable}翻炒几下',
        '加适量水烧开',
        '放入{protein}煮至熟',
        '加盐、白胡椒粉调味',
        '出锅淋几滴香油',
      ],
      tags: ['soup','quick_easy','light'],
      time: [8,18], diff: 'easy',
      meal: ['lunch','dinner','breakfast'],
    },
    egg_dish: {
      steps: (p,v) => [
        '鸡蛋打散加少许盐',
        '热油炒鸡蛋至凝固盛出',
        '锅中炒{vegetable}至断生',
        '倒回鸡蛋，加盐调味',
        '翻炒均匀出锅',
      ],
      tags: ['stir_fry','home_style','quick_easy','vegetarian'],
      time: [5,10], diff: 'easy',
      meal: ['breakfast','lunch','dinner'],
    },
    tofu_dish: {
      steps: (p,v) => [
        '豆腐切块，淡盐水焯2分钟沥干',
        '热油炒{aromatics}出香',
        '轻轻放入豆腐',
        '加{vegetable}和水/高汤',
        '加生抽、蚝油，小火炖5分钟入味',
        '水淀粉勾薄芡出锅',
      ],
      tags: ['stew','home_style','healthy'],
      time: [12,22], diff: 'easy',
      meal: ['lunch','dinner'],
    },
    noodle_dish: {
      steps: (p,v) => [
        '面条/粉煮熟，过凉水沥干',
        '热油爆香{aromatics}',
        '加入{protein}和{vegetable}翻炒',
        '加入面条/粉，加生抽、老抽、蚝油',
        '大火翻炒均匀，调味出锅',
      ],
      tags: ['noodle','stir_fry','quick_easy','home_style'],
      time: [10,20], diff: 'easy',
      meal: ['lunch','dinner','late_night'],
    },
  };

  // Name patterns for each cooking method
  const NAME_PATTERNS = {
    stir_fry: [
      '{p}炒{v}', '{v}炒{p}', '{p}{v}丁', '{p}丝炒{v}', '{v}炒{p}片',
      '蚝油{p}{v}', '{p}滑{v}', '滑炒{p}{v}', '爆炒{p}{v}',
      '蒜蓉{p}{v}', '清炒{p}{v}', '香炒{p}{v}',
    ],
    braise: [
      '红烧{p}{v}', '{p}烧{v}', '{v}烧{p}', '{p}焖{v}', '酱烧{p}{v}',
      '{p}炖{v}', '焖烧{p}{v}', '{v}煨{p}',
    ],
    soup_stew: [
      '{p}{v}汤', '{p}炖{v}汤', '{v}{p}煲', '{v}煲{p}',
      '{p}{v}煲', '清炖{p}{v}',
    ],
    cold_mix: [
      '凉拌{p}{v}', '{v}拌{p}', '蒜泥{p}{v}', '红油{p}{v}',
      '麻辣{p}{v}', '酸辣{p}{v}',
    ],
    dry_fry: [
      '干锅{p}{v}', '香辣{p}{v}', '麻辣{p}{v}', '干煸{p}{v}',
      '香锅{p}{v}',
    ],
    steam: [
      '清蒸{p}{v}', '蒜蓉蒸{p}{v}', '{v}蒸{p}', '剁椒蒸{p}{v}',
      '豉汁蒸{p}',
    ],
    quick_soup: [
      '{p}{v}汤', '{v}{p}汤', '上汤{p}{v}', '{p}{v}粉丝汤',
      '{p}汆{v}', '番茄{p}{v}汤',
    ],
    egg_dish: [
      '{v}炒蛋', '{p}炒蛋', '滑蛋{p}', '蛋包{p}{v}',
      '韭香{蛋}{v}',
    ],
    tofu_dish: [
      '{v}烧豆腐', '{p}豆腐煲', '家常豆腐{v}', '{p}烧豆腐',
      '砂锅豆腐{p}',
    ],
    noodle_dish: [
      '{p}{v}炒面', '{p}{v}炒粉', '{p}{v}拌面', '{p}{v}盖饭',
      '{p}{v}捞面',
    ],
  };

  // Compatible protein-veg pairs per method (generates bulk recipes)
  // [protein_key, veg_key, region_tilt]
  const MEAT_PROTEINS = ['pork_loin','pork_belly','pork_rib','chicken_breast','chicken_leg','beef_slice','beef_brisket','beef_chunk','lamb_slice','lamb_chunk'];
  const ALL_PROTEINS = [...MEAT_PROTEINS,'fish_fillet','shrimp','shrimp_peeled','squid','tofu_firm','tofu_soft','egg'];
  const STIRFRY_VEGS = ['pepper_green','broccoli','cauli','celery','asparagus','onion','carrot','cabbage','green_bean','snow_pea','zuke','leek','garlic_sprout','mushroom','fungus'];
  const BRAISE_VEGS = ['potato','radish','lotus','eggplant','napa','corn','edamame','mushroom'];
  const SOUP_VEGS = ['radish','napa','spinach','bok_choy','mushroom','corn','lotus','potato','tomato'];
  const COLD_VEGS = ['cucumber','spinach','fungus','napa','broccoli','celery','zuke'];
  const ALL_VEGS = [...new Set([...STIRFRY_VEGS,...BRAISE_VEGS,...SOUP_VEGS,...COLD_VEGS])];

  // Build generation triplets: [pKey, vKey, method, region]
  function buildTriplets() {
    const T = [];
    // Stir-fry: meat × all stirfry vegs
    for (const p of MEAT_PROTEINS) { for (const v of STIRFRY_VEGS) { T.push([p,v,'stir_fry','universal']); } }
    // Stir-fry with specific regions
    for (let i=0;i<MEAT_PROTEINS.length;i+=2) { for (const v of STIRFRY_VEGS.slice(0,8)) {
      T.push([MEAT_PROTEINS[i],v,'stir_fry','sichuan']);
      T.push([MEAT_PROTEINS[i+1]||MEAT_PROTEINS[0],v,'stir_fry','hunan']);
    }}
    // Braise: meat × braise vegs
    for (const p of ['pork_rib','pork_belly','chicken_leg','beef_brisket','beef_chunk','lamb_chunk']) { for (const v of BRAISE_VEGS) { T.push([p,v,'braise','universal']); } }
    // Braise regional
    for (const p of ['pork_rib','pork_belly','chicken_leg']) { for (const v of BRAISE_VEGS.slice(0,5)) {
      T.push([p,v,'braise','northeast']); T.push([p,v,'braise','shandong']);
    }}
    // Soup: meat × soup vegs
    for (const p of ['pork_rib','chicken_leg','beef_brisket','lamb_chunk','fish_fillet']) { for (const v of SOUP_VEGS) { T.push([p,v,'soup_stew','universal']); } }
    for (const p of ['pork_rib','chicken_leg']) { for (const v of SOUP_VEGS.slice(0,5)) { T.push([p,v,'soup_stew','guangdong']); } }
    // Quick soup
    for (const p of ['pork_loin','beef_slice','lamb_slice','fish_fillet','egg']) { for (const v of ['tomato','spinach','napa','bok_choy','mushroom']) { T.push([p,v,'quick_soup','universal']); } }
    for (const p of ['lamb_slice']) { for (const v of ['napa','radish']) { T.push([p,v,'quick_soup','northwest']); } }
    // Cold mix: various proteins × cold vegs
    for (const p of ['chicken_breast','pork_belly','beef_slice','shrimp','tofu_firm','tofu_skin']) { for (const v of COLD_VEGS) { T.push([p,v,'cold_mix','universal']); } }
    for (const p of ['chicken_breast','beef_slice','pork_belly']) { for (const v of COLD_VEGS.slice(0,4)) { T.push([p,v,'cold_mix','sichuan']); } }
    // Dry fry: select pairs
    for (const p of ['pork_belly','chicken_leg','shrimp','beef_slice']) { for (const v of ['cauli','potato','green_bean','cabbage','onion']) { T.push([p,v,'dry_fry','hunan']); } }
    for (const p of ['pork_belly','squid','shrimp']) { for (const v of ['cauli','potato','onion','celery']) { T.push([p,v,'dry_fry','sichuan']); } }
    // Steam
    for (const p of ['fish_fillet','pork_rib','chicken_leg','pork_mince','shrimp']) { for (const v of ['mushroom','lotus','eggplant','tofu_skin']) { T.push([p,v,'steam','guangdong']); } }
    for (const p of ['fish_fillet','chicken_leg']) { for (const v of ['mushroom','tofu_skin']) { T.push([p,v,'steam','hunan']); } }
    // Egg dishes
    for (const v of ['tomato','leek','onion','pepper_green','zuke','spinach','mushroom']) { T.push(['egg',v,'egg_dish','universal']); }
    for (const p of ['shrimp_peeled']) { for (const v of ['leek','asparagus']) { T.push([p,v,'egg_dish','guangdong']); } }
    // Tofu dishes
    for (const v of ['napa','pepper_green','mushroom','eggplant','tomato']) { T.push(['tofu_firm',v,'tofu_dish','universal']); }
    for (const v of ['napa','pepper_green']) { T.push(['tofu_firm',v,'tofu_dish','sichuan']); }
    for (const p of ['pork_mince','beef_slice']) { for (const v of ['tofu_firm','napa']) { T.push([p,v,'tofu_dish','universal']); } }
    for (const p of ['shrimp']) { for (const v of ['tofu_soft']) { T.push([p,v,'tofu_dish','guangdong']); } }
    // Noodle/rice
    for (const p of ['pork_loin','chicken_breast','beef_slice','shrimp']) { for (const v of ['cabbage','pepper_green','onion']) { T.push([p,v,'noodle_dish','universal']); } }
    for (const p of ['beef_slice']) { for (const v of ['onion','pepper_green']) { T.push([p,v,'noodle_dish','guangdong']); } }

    return T;
  }

  const TRIPLETS = buildTriplets();

  // Region display names
  const REGION_NAME = {
    sichuan:'川味',guangdong:'粤味',hunan:'湘味',shandong:'鲁味',
    jiangsu:'苏味',zhejiang:'浙味',fujian:'闽味',anhui:'徽味',
    beijing:'京味',shanghai:'本帮',northeast:'东北',northwest:'西北',
    southwest:'西南',central:'华中',universal:'家常',
  };

  // Emoji pool for generated recipes
  const EMOJI_POOL = {
    stir_fry: ['🥘','🍳','🫕'],
    braise: ['🍖','🥩','🍗'],
    soup_stew: ['🍲','🥣','🫕'],
    cold_mix: ['🥗','🥒','🥬'],
    dry_fry: ['🌶️','🥘','🔥'],
    steam: ['🧆','🐟','🦐'],
    quick_soup: ['🍵','🥣'],
    egg_dish: ['🍳','🥚'],
    tofu_dish: ['🧈','🥘'],
    noodle_dish: ['🍝','🍜','🫕'],
  };

  /** Generate one recipe from a protein+veg+method triplet */
  function genRecipe(pKey, vKey, methodKey, regionTilt, idx) {
    const prot = PRO[pKey];
    const veg = VEG[vKey];
    const meth = METHODS[methodKey];
    if (!prot || !veg || !meth) return null;

    // Pick a name pattern
    const patterns = NAME_PATTERNS[methodKey] || ['{p}{v}'];
    const namePat = patterns[idx % patterns.length];

    let name = namePat
      .replace('{p}', prot[0])
      .replace('{v}', veg[0])
      .replace('{v2}', '菠菜')
      .replace('{蛋}', '鸡蛋');
    if (name.length < 4) return null;

    // Aromatics
    const aromaticsPick = [ARO.garlic, ARO.ginger].map(a => a[0]+a[1]).join('、');
    const aromaticsFinishPick = [ARO.scallion, ARO.cilantro].map(a => a[0]+a[1]).join('、');

    // Steps
    let steps = meth.steps({name:prot[0]},{name:veg[0]}).map(s =>
      s.replace('{protein}',prot[0]).replace('{vegetable}',veg[0])
        .replace('{aromatics}',aromaticsPick).replace('{aromatics_finish}',aromaticsFinishPick)
        .replace('{sauce}','生抽+蚝油')
    );

    // Tags
    let tags = [...(meth.tags||[])];
    if (prot[3]) tags.push('meat');
    if (prot[4]) tags.push('seafood');
    if (!prot[3] && !prot[4]) tags.push('vegetarian');
    if (regionTilt && regionTilt !== 'universal') tags.push(regionTilt);
    tags.push('universal');
    if (meth.temp_bias) meth.temp_bias.forEach(t => tags.push(t));
    if (meth.season_bias) meth.season_bias.forEach(s => tags.push(s));
    meth.meal.forEach(m => tags.push(m));
    if (meth.time[0] <= 15) tags.push('quick_easy');
    tags = [...new Set(tags)];

    // Emoji
    const elist = EMOJI_POOL[methodKey] || ['🍽️'];
    const emoji = elist[idx % elist.length];

    // Time
    const prepTime = meth.time[0] + (idx % (meth.time[1]-meth.time[0]+1));

    // Ingredients
    const ig = [
      prot[0]+' '+prot[1], veg[0]+' '+veg[1],
      ARO.garlic[0]+' '+ARO.garlic[1], ARO.ginger[0]+' '+ARO.ginger[1],
      SAUCE.soy[0]+' '+SAUCE.soy[1], SAUCE.oyster[0]+' '+SAUCE.oyster[1],
      ARO.scallion[0]+' '+ARO.scallion[1],
    ];

    // Takeout keywords
    const tk = [name, prot[0], veg[0], '家常菜'];
    if (regionTilt !== 'universal') tk.push(REGION_NAME[regionTilt]||'');

    return {
      id: 'g'+String(idx).padStart(4,'0'), n: name, e: emoji,
      d: prot[0]+'搭配'+veg[0]+'，'+(REGION_NAME[regionTilt]||'家常')+'风味',
      ig, st: steps, tm: prepTime, df: meth.diff,
      tg: tags.filter(Boolean), tk: tk.filter(Boolean).slice(0,5),
    };
  }

  /** Generate all triplet-based recipes */
  function generateAll() {
    const results = [];
    const seen = new Set();
    const curatedNames = new Set(CURATED.map(r => r.n));
    for (let i = 0; i < TRIPLETS.length; i++) {
      const [p,v,m,r] = TRIPLETS[i];
      const recipe = genRecipe(p, v, m, r, i);
      if (recipe && !curatedNames.has(recipe.n) && !seen.has(recipe.n)) {
        seen.add(recipe.n);
        results.push(recipe);
      }
    }
    return results;
  }

  // Convert curated to runtime format
  function normalizeCurated() {
    return CURATED.map(r => ({
      id: r.id,
      name: (r.e || '') + ' ' + r.n,
      emoji: r.e || '🍽️',
      description: r.d,
      ingredients: r.ig,
      steps: r.st,
      prepTimeMin: r.tm,
      difficulty: r.df,
      tags: r.tg,
      takeoutKeywords: r.tk,
    }));
  }

  function normalizeGenerated(gen) {
    return gen.map(r => ({
      id: r.id,
      name: r.e + ' ' + r.n,
      emoji: r.e,
      description: r.d,
      ingredients: r.ig,
      steps: r.st,
      prepTimeMin: r.tm,
      difficulty: r.df,
      tags: r.tg,
      takeoutKeywords: r.tk,
    }));
  }

  const GENERATED = generateAll();
  const RECIPES = [...normalizeCurated(), ...normalizeGenerated(GENERATED)];

  // ============ Scoring Engine (unchanged logic) ============

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getTempCategory(temp) {
    if (temp > 30) return 'hot';
    if (temp >= 20) return 'warm';
    if (temp >= 10) return 'cool';
    return 'cold';
  }

  function getAdjacentTempCategory(cat) {
    const map = { hot: ['warm'], warm: ['hot','cool'], cool: ['warm','cold'], cold: ['cool'] };
    return map[cat] || [];
  }

  function mapWeatherCodeToTag(code) {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'overcast';
    if (code >= 45 && code <= 48) return 'overcast';
    if (code >= 51 && code <= 57) return 'humid';
    if (code >= 61 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snowy';
    if (code >= 80 && code <= 82) return 'rainy';
    if (code >= 85 && code <= 86) return 'snowy';
    if (code >= 95 && code <= 99) return 'extreme';
    return 'clear';
  }

  function getSeason(month, day) {
    if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) return 'spring';
    if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) return 'summer';
    if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) return 'autumn';
    return 'winter';
  }

  function getAdjacentSeason(season) {
    return {spring:['winter','summer'],summer:['spring','autumn'],autumn:['summer','winter'],winter:['autumn','spring']}[season]||[];
  }

  function getMealTime(hour) {
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 17) return 'snack';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'late_night';
  }

  function getRegionFromProvince(provinceName) {
    const m = {'四川':'sichuan','成都':'sichuan','重庆':'southwest','广东':'guangdong','广州':'guangdong','深圳':'guangdong','湖南':'hunan','长沙':'hunan','山东':'shandong','济南':'shandong','青岛':'shandong','江苏':'jiangsu','南京':'jiangsu','苏州':'jiangsu','浙江':'zhejiang','杭州':'zhejiang','福建':'fujian','福州':'fujian','厦门':'fujian','安徽':'anhui','合肥':'anhui','北京':'beijing','上海':'shanghai','辽宁':'northeast','吉林':'northeast','黑龙江':'northeast','沈阳':'northeast','哈尔滨':'northeast','长春':'northeast','陕西':'northwest','西安':'northwest','甘肃':'northwest','青海':'northwest','宁夏':'northwest','新疆':'northwest','云南':'southwest','贵州':'southwest','广西':'southwest','湖北':'central','武汉':'central','河南':'central','江西':'central','山西':'northwest','内蒙古':'northwest','西藏':'southwest','海南':'southwest','天津':'beijing','河北':'beijing'};
    if (!provinceName) return 'universal';
    for (const [k,v] of Object.entries(m)) { if (provinceName.includes(k)) return v; }
    return 'universal';
  }

  function formatDateStr(date) {
    const d = new Date(date);
    if (d.getHours() < 6) d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  function scoreRecipe(recipe, context, recentIds) {
    let score = 0;
    const tempMap = {hot:'hot_weather',warm:'warm_weather',cool:'cool_weather',cold:'cold_weather'};
    const target = tempMap[context.tempCategory];
    if (recipe.tags.includes(target)) score += 30;
    else { for (const adj of getAdjacentTempCategory(context.tempCategory)) { if (recipe.tags.includes(tempMap[adj])) { score += 10; break; } } }

    if (recipe.tags.includes(context.weatherTag)) score += 15;
    else if (context.weatherTag === 'rainy' && recipe.tags.includes('comfort_food')) score += 8;
    else if (context.weatherTag === 'extreme' && recipe.tags.includes('comfort_food')) score += 12;
    else if (context.weatherTag === 'snowy' && recipe.tags.includes('hearty')) score += 8;

    if (recipe.tags.includes(context.season)) score += 20;
    else { for (const s of getAdjacentSeason(context.season)) { if (recipe.tags.includes(s)) { score += 8; break; } } }

    if (context.region && recipe.tags.includes(context.region)) score += 10;
    else if (recipe.tags.includes('universal')) score += 5;

    if (recipe.tags.includes(context.mealTime)) score += 15;
    else {
      if (context.mealTime==='lunch' && recipe.tags.includes('quick_easy')) score += 8;
      if (context.mealTime==='dinner' && recipe.tags.includes('hearty')) score += 8;
      if (context.mealTime==='late_night' && recipe.tags.includes('comfort_food')) score += 8;
      if (context.mealTime==='breakfast' && recipe.tags.includes('quick_easy')) score += 8;
    }

    score += hashString(recipe.id + context.dateStr + context.session) % 11;
    if (recentIds && recentIds.includes(recipe.id)) score -= 15;
    return Math.max(0, Math.min(100, score));
  }

  function getRecommendations(context, recentIds) {
    const scored = RECIPES.map(r => ({ recipe: r, score: scoreRecipe(r, context, recentIds) })).sort((a, b) => b.score - a.score);
    const primary = scored[0].recipe;
    const primaryScore = scored[0].score;
    const primaryCats = primary.tags.filter(t => TAG.category.includes(t));
    const alternatives = [];
    for (let i = 1; i < scored.length && alternatives.length < 3; i++) {
      const c = scored[i];
      const cCats = c.recipe.tags.filter(t => TAG.category.includes(t));
      const overlap = cCats.filter(x => primaryCats.includes(x));
      if (alternatives.length === 0 && overlap.length >= 2 && i <= 5) continue;
      if (alternatives.some(a => { const aC = a.recipe.tags.filter(t => TAG.category.includes(t)); return cCats.filter(x => aC.includes(x)).length >= 3; })) continue;
      alternatives.push({ recipe: c.recipe, score: c.score });
    }
    return { primary, primaryScore, alternatives };
  }

  return { RECIPES, TAG, getTempCategory, getAdjacentTempCategory, mapWeatherCodeToTag, getSeason, getAdjacentSeason, getMealTime, getRegionFromProvince, formatDateStr, hashString, scoreRecipe, getRecommendations };
})();
