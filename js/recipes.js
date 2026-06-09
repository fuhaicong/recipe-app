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
     Part 2 — Real Recipes from HowToCook (github.com/Anduin2017/HowToCook)
     ========================================================== */

  const REAL_RECIPES = [
  {
    "id": "r冬瓜酿肉",
    "name": "🥩 冬瓜酿肉",
    "emoji": "🥩",
    "description": "冬瓜酿肉，家常美味",
    "ingredients": [
      "冬瓜",
      "猪肉末",
      "鸡蛋",
      "葱",
      "葱姜末",
      "胡椒粉",
      "生抽",
      "淀粉"
    ],
    "steps": [
      "冬瓜去皮，切成 25cm 长 3cm 厚的片",
      "将切好的冬瓜放入碗中，放入 15g 盐，将冬瓜抹匀，放置 10 分钟",
      "放置冬瓜的同时，换个碗放入肉末，葱姜末， 5g 盐，淀粉 5g，胡椒粉，生抽，胡椒粉",
      "使用筷子在肉末中进行顺时针搅拌，搅拌到食材颜色没有明显对比（约 2 分钟）",
      "将腌制好的冬瓜（会变软）使用清水洗三遍",
      "拿出 1 片冬瓜片卷起来，并把肉塞进去",
      "放入碟子中摆到碟子的边缘",
      "打入 1 个鸡蛋到中间圆圈处",
      "放入普通铁锅中水烧开后，蒸 15 分钟，盖上锅盖",
      "开盖，取出蒸好的冬瓜酿肉",
      "将冬瓜酿肉碟子的水倒入锅中，放入水淀粉，加入 50ml 清水倒入锅中烧开",
      "淋到冬瓜酿肉上"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "冬瓜酿肉的做法",
      "猪肉",
      "肉",
      "家常菜"
    ]
  },
  {
    "id": "r冷吃兔",
    "name": "🥩 冷吃兔",
    "emoji": "🥩",
    "description": "冷吃兔，家常美味",
    "ingredients": [
      "兔肉",
      "盐",
      "味精",
      "蚝油",
      "料酒",
      "蒜",
      "姜",
      "小葱/大葱/洋葱",
      "干辣椒",
      "青花椒",
      "八角",
      "桂皮",
      "香叶",
      "山奈",
      "白蔻",
      "小茴香",
      "白芝麻"
    ],
    "steps": [
      "蒜、姜扒皮并剁碎备用，八角、桂皮、香叶、山奈、白蔻、小茴香洗净备用。",
      "干辣椒剪成 2 厘米的小段，洗净备用。",
      "小葱/大葱/洋葱洗净，洋葱切成小块。",
      "兔肉剁成 2 厘米的小块，加入盐、料酒、味精调味，腌制 15 分钟。",
      "锅中倒油，油温 4 成热下小葱/大葱/洋葱，中小火煸炒出香味，待到小葱/大葱/洋葱微焦，将其捞出。",
      "开大火升高油温，油温 8 成热时下入兔肉，炸制过程转中小火，炸至兔肉微微焦黄时捞出兔肉。",
      "升高油温，倒入干辣椒、青花椒、八角、桂皮、香叶、山奈、白蔻、小茴香；转小火将辣椒段炸脆。",
      "重新倒入兔肉，加入蚝油、翻炒几分钟。",
      "关火，加入蒜、姜、白芝麻，翻炒均匀。",
      "放置一夜更加入味。"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "冷吃兔的做法",
      "家常菜"
    ]
  },
  {
    "id": "r凉拌鸡丝",
    "name": "🐔 凉拌鸡丝",
    "emoji": "🐔",
    "description": "凉拌鸡丝，家常美味",
    "ingredients": [
      "鸡胸肉（常温冷冻均可）",
      "麻油（花椒油）",
      "生抽",
      "香醋",
      "白糖",
      "盐",
      "料酒",
      "姜",
      "凉白开水"
    ],
    "steps": [
      "姜切片，备用",
      "锅中倒入 4 升水",
      "加入鸡胸肉、姜片",
      "倒入 20 毫升料酒",
      "开大火不盖盖将水烧开",
      "水开后转中火，用勺子将浮沫捞出",
      "继续煮 **5-7** 分钟，如果是非冷冻肉煮 5 分钟，冷冻肉煮 7 分钟",
      "鸡胸肉大小会影响成熟时间，用筷子插入鸡胸肉，如果能轻松插入，代表鸡肉熟了。如果不熟需延长煮制时间",
      "用凉白开水冲泡鸡胸肉，使鸡胸肉降至室温",
      "顺着鸡胸肉纹理将鸡胸肉撕成细丝",
      "准备一个碗",
      "碗中加入准备好的麻油、生抽、香醋、白糖、盐",
      "搅拌料汁，使糖和盐尽量溶化",
      "将料汁倒入鸡丝中，搅拌均匀"
    ],
    "prepTimeMin": 80,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "凉拌鸡丝的做法",
      "鸡肉",
      "鸡",
      "家常菜"
    ]
  },
  {
    "id": "r口水鸡",
    "name": "🐔 口水鸡",
    "emoji": "🐔",
    "description": "口水鸡，家常美味",
    "ingredients": [
      "半只鸡",
      "辣椒粉",
      "花椒",
      "花生",
      "葱姜蒜",
      "花椒",
      "白糖",
      "生抽",
      "醋",
      "味精"
    ],
    "steps": [
      "姜切片，1 颗小葱，15 颗花椒备用",
      "鸡肉洗干净，放入锅中，清水没过鸡肉，放入姜片、小葱和花椒，开大火烧开。",
      "大火烧开后，转中小火 20 分钟关火",
      "取出鸡肉，放入冰水中，直至冰凉",
      "取出鸡肉，切块摆盘子中，备用",
      "小火把锅烧热，导入花生，烘烤至表皮爆裂。（注意随时翻动，不要糊了）",
      "一颗葱切成段，蒜拍成末，花椒 15 颗，花生去皮切碎。",
      "锅内导入油烧热后，放入葱段，花椒和一半蒜末，炒香",
      "炒至油温 8 成热，关火，滤出热油",
      "将热油倒入放辣椒粉的碗中，搅拌，并滤出红油",
      "红油中放入剩余蒜末、生抽、醋、盐、味精、糖、香油、花椒粉。拌匀放凉",
      "在鸡肉上撒上花生碎，把红油淋到切好的鸡肉上，撒上香菜。成盘"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "口水鸡的做法",
      "鸡肉",
      "鸡",
      "家常菜"
    ]
  },
  {
    "id": "r台式卤肉饭",
    "name": "🍚 台式卤肉饭",
    "emoji": "🍚",
    "description": "台式卤肉饭，家常美味",
    "ingredients": [
      "红葱头（火葱）",
      "带皮五花肉 （可用猪绞肉代替）",
      "鸡蛋（可选）",
      "食用油",
      "生抽酱油",
      "米酒（可用料酒代替）",
      "大蒜",
      "香叶",
      "八角",
      "冰糖",
      "白胡椒粉",
      "五香粉（可选）",
      "米饭"
    ],
    "steps": [
      "带皮五花肉切成 $0.7cm（长）\\times 0.7cm（宽） \\times 2.5cm（高）$ 的细长条",
      "红葱头、大蒜切末备用",
      "鸡蛋煮熟剥壳，并用刀划破蛋白（便于入味），备用。",
      "**大火**热锅，锅内放入 15 ml 食用油，让油滑满锅底即可。",
      "放入五花肉条，翻炒至肉色稍微变白，沿锅边淋入米酒 10ml 。继续翻炒至五花肉不再出油。",
      "将切好的红葱头加入锅中，翻炒 1 分钟爆出油葱香味。",
      "将切好的红葱头加入锅中，翻炒 30 秒。",
      "把猪肉推到旁边，放入冰糖加热到融化冒泡变成焦糖，再把猪肉一起翻拌，让焦糖均匀附着。",
      "加入生抽炒出香气。",
      "呛入米酒 25 ml ，水加到淹过猪肉，加入白胡椒粉、五香粉、八角、香叶、水煮蛋，沸腾后转小火卤 1 小时。",
      "1 小时后，开大火收汁直到酱汁浓稠，呈现有光泽的琥珀色，即完成。",
      "炖煮结束后，乘一碗米饭，将软烂的卤肉浇在米饭上，并加上卤蛋，开始享用。"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "台式卤肉饭的做法",
      "猪肉",
      "肉",
      "盖饭",
      "米饭"
    ]
  },
  {
    "id": "r咖喱肥牛",
    "name": "🐮 咖喱肥牛",
    "emoji": "🐮",
    "description": "咖喱肥牛，家常美味",
    "ingredients": [
      "香叶",
      "纯牛奶（推荐卫岗鲜奶）",
      "洋葱",
      "胡萝卜",
      "土豆",
      "肥牛卷",
      "咖喱块"
    ],
    "steps": [
      "洋葱切成条状、胡萝卜以及土豆切成块状，备用",
      "烧一锅开水，水沸时将肥牛卷下锅，捞出血沫后放在一边沥水，备用",
      "热锅，锅内放入 10ml - 15ml 食用油，**等待 10 秒让油温升高**",
      "放入洋葱，翻炒至洋葱变软变透明",
      "放入土豆以及胡萝卜**翻炒 2 分钟**",
      "加入冷水至淹没所有食材即可",
      "将香叶、咖喱块投入锅中，盖上锅盖，**待水沸腾后将火调小然后等待直至土豆块以及胡萝卜块炖至软烂（可用筷子确认）**",
      "加入肥牛卷以及牛奶，盖上锅盖再小火煮 2-3 分钟即可出锅（用勺子搅拌食材，注意力度，避免肥牛卷破碎）"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "咖喱肥牛的做法",
      "牛肉",
      "牛",
      "家常菜"
    ]
  },
  {
    "id": "r商芝肉",
    "name": "🥩 商芝肉",
    "emoji": "🥩",
    "description": "商芝肉，家常美味",
    "ingredients": [
      "带皮猪五花肉（去骨）",
      "商芝（又名紫萁，属蕨类，嫩叶可食）",
      "葱",
      "姜",
      "八角",
      "蜂蜜",
      "醋",
      "料酒",
      "味精",
      "酱油",
      "摊鸡蛋皮",
      "精盐",
      "鸡汤",
      "芝麻油",
      "熟猪油"
    ],
    "steps": [
      "将肉刮洗干净，入煮锅煮至六成熟（变色为白），捞出趁热用蜂蜜、醋涂抹肉皮。",
      "炒锅内放入熟猪油，用旺火烧至八成熟（约 200 度，油表有大量青烟，油状平静），将肉块皮朝下投入，炸至呈金红色时，捞入凉肉煮锅（之前煮完的煮锅）中泡软，放在案板上，切成三寸(10 cm)长、两分(0.6 cm)厚的片，仍然皮朝下，整齐装入蒸碗内。",
      "将 5 克大葱切成 2.4 cm 长的段，5 克切成 2.4 cm 长的斜形片。姜去皮洗净，1.5 克切成片，5 克切成末，摊的鸡蛋皮切成 2.4 cm 长的等腰三角形片。",
      "商芝入沸水锅中煮软捞出，去除老茎、杂质，淘洗干净，切成 3 cm 长的段，放入碗中,加酱油（5 克）、精盐（1 克）、熟猪油（10 克）拌匀，盖在肉片上，另将鸡汤（100 克）放入一小碗中，加酱油（5 克）、精盐（0.5 克）、料酒（15 克）搅匀，浇入蒸碗，再放入姜片、葱段、八角上笼用旺火蒸约半小时后，转用小火继续蒸约一小时三十分钟，熟烂后取出，拣去姜、葱、八角，倒、过滤原汁，将肉扣入汤盘。",
      "炒锅内，放入鸡汤（100 克），加入原汁，用旺火烧沸，下入姜末、葱片、味精后搅匀，投入摊鸡蛋皮，淋芝麻油，浇入汤盘即成。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "商芝肉的做法",
      "猪肉",
      "肉",
      "家常菜"
    ]
  },
  {
    "id": "r啤酒鸭",
    "name": "🦆 啤酒鸭",
    "emoji": "🦆",
    "description": "啤酒鸭，家常美味",
    "ingredients": [
      "鸭肉",
      "啤酒",
      "生抽酱油",
      "老抽酱油",
      "姜",
      "蒜",
      "冰糖",
      "干辣椒",
      "料酒",
      "盐",
      "鸡精",
      "丁香",
      "八角",
      "香叶",
      "豆瓣酱"
    ],
    "steps": [
      "把鸭子切成 3 cm 小块，鸭肉冷水下锅，加姜片、料酒，焯一遍水，盛出沥干水分，备用。",
      "炒锅烧热，放入约 100ml 食用油，大火待油烧开，鸭肉入锅翻炒至上色。",
      "待鸭肉完全变色（肉眼可见泛白），将鸭肉拨到锅的一边，倒入豆瓣酱和糖，小火翻炒出香味和糖色。",
      "加入丁香、八角、香叶、干辣椒、生抽、老抽、蒜，翻炒出香味。",
      "倒入啤酒，没过鸭肉，加入盐、鸡精，然后中火将鸭子烧 30 分钟（牙口不好的话可以再多烧 5 分钟）。",
      "出锅盛盘，上桌食用。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "啤酒鸭的做法",
      "家常菜"
    ]
  },
  {
    "id": "r奶酪培根通心粉",
    "name": "🥛 奶酪培根通心粉",
    "emoji": "🥛",
    "description": "奶酪培根通心粉，家常美味",
    "ingredients": [
      "通心粉",
      "奶酪",
      "肉类",
      "洋葱",
      "黄油",
      "面粉",
      "牛奶",
      "大蒜"
    ],
    "steps": [
      "奶酪要磨成碎末",
      "洋葱切成条状",
      "通心粉用微咸的水煮 6 分钟",
      "**中火**",
      "锅中放入黄油，等待融化",
      "加入洋葱",
      "洋葱软化后加入大蒜",
      "大蒜香味出来后，加入肉类，等待 5 秒",
      "**小火**",
      "分四次加入牛奶，每次搅拌 5 秒后再加下一次",
      "加入面粉并充分搅拌",
      "加入奶酪并搅拌均匀",
      "将通心粉和奶酪搅拌",
      "如果不打算烘烤，可以直接吃了",
      "**烘烤：**",
      "预热烤箱至 180°C",
      "将额外的 50g 芝士铺在通心粉之上",
      "等待烤箱预热至 180°C 后，将通心粉放入",
      "烤至表面金黄,约 24 分钟"
    ],
    "prepTimeMin": 105,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "奶酪培根通心粉的做法",
      "家常菜"
    ]
  },
  {
    "id": "r姜炒鸡",
    "name": "🐔 姜炒鸡",
    "emoji": "🐔",
    "description": "姜炒鸡，家常美味",
    "ingredients": [
      "鸡",
      "生姜",
      "啤酒",
      "生抽",
      "老抽",
      "盐",
      "小米椒",
      "美人辣",
      "泡椒",
      "大蒜"
    ],
    "steps": [
      "鸡尽量剁成 1cm 的小块，洗净后滤干，再放生抽腌和料酒腌制 30 分钟",
      "大先热锅到微微冒烟，放入食用油，等 5 秒",
      "下入姜片后转中火炒 30 秒，",
      "下入鸡块翻炒 3 分钟，炒干水分，炒出鸡油",
      "放入各种剁碎的辣椒和大蒜子，加盐和老抽继续翻炒 30 秒",
      "倒入啤酒，中小火焖 2 分钟",
      "大火收汁盛盘"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "姜炒鸡的做法",
      "鸡肉",
      "鸡",
      "家常菜"
    ]
  },
  {
    "id": "r姜葱捞鸡",
    "name": "🐔 姜葱捞鸡",
    "emoji": "🐔",
    "description": "姜葱捞鸡，家常美味",
    "ingredients": [
      "鸡腿肉",
      "盐焗鸡粉",
      "葱，姜"
    ],
    "steps": [
      "四个鸡腿清洗干净，放入碗中",
      "碗中加入盐焗鸡粉和 5ml 油，搅拌均匀",
      "让鸡腿静置腌制 15 分钟， 同时准备蒸锅并把水煮开",
      "鸡腿腌制完成后， 放入水开后的蒸锅中，蒸制 20 分钟",
      "将姜根据个人口味切成 1）姜蓉或 2）姜丝或 3）姜粒",
      "将葱切成 0.5cm 小段",
      "将葱姜放入蘸料碗，并加入盐和糖",
      "将剩余的油倒入另一个锅中加热至六至七层热",
      "将热油淋入葱姜碗中",
      "鸡腿蒸好后将其撕碎成鸡丝，不需要特别细，大概 1cm 粗就可以",
      "姜葱姜油淋在鸡丝上，搅拌均匀即可"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "姜葱捞鸡的做法",
      "鸡肉",
      "鸡",
      "家常菜"
    ]
  },
  {
    "id": "r小炒肉",
    "name": "🥩 小炒肉",
    "emoji": "🥩",
    "description": "小炒肉，家常美味",
    "ingredients": [
      "五花肉",
      "朝天椒",
      "小米椒",
      "豆豉",
      "豆瓣酱",
      "老抽",
      "淀粉",
      "盐",
      "葱",
      "蒜"
    ],
    "steps": [
      "五花肉切片",
      "把肉放入器皿内，加入淀粉、老抽、盐搅拌腌制半小时",
      "葱切段",
      "小米椒、朝天椒斜刀切好",
      "热锅、倒油",
      "油热后加入五花肉煸炒。炒至变色后盛出来",
      "向锅中加蒜，煸出香味，加入豆豉，翻炒均匀",
      "加入豆瓣酱翻炒均匀",
      "加入炒好的五花肉继续的翻炒均匀",
      "加入小米椒、朝天椒、葱段翻炒 40 秒",
      "出锅。"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小炒肉的做法",
      "猪肉",
      "肉",
      "家常菜"
    ]
  },
  {
    "id": "r小炒鸡肝",
    "name": "🐔 小炒鸡肝",
    "emoji": "🐔",
    "description": "小炒鸡肝，家常美味",
    "ingredients": [
      "生鸡肝",
      "蒜苗（蒜苗指的是：大蒜幼苗发育到一定时期的青苗。有些地方叫做青蒜，特别说明一下。）",
      "大葱、姜、料酒",
      "食用盐、鸡精（味精）、五香粉（十三香）、胡椒粉",
      "烧烤料或孜然粉（可选）",
      "芝麻（可选）",
      "食用油"
    ],
    "steps": [
      "鸡肝清洗，备用",
      "蒜苗清洗，切段，备用",
      "大葱清洗，取 100g 切段，取 50g 切片，备用",
      "姜清晰，取 70g 切片， 取 50g 切丁，备用",
      "第一步：焯水",
      "第二步：炒制"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小炒鸡肝的做法",
      "鸡肉",
      "鸡",
      "家常菜"
    ]
  },
  {
    "id": "r小炒黄牛肉",
    "name": "🐮 小炒黄牛肉",
    "emoji": "🐮",
    "description": "小炒黄牛肉，家常美味",
    "ingredients": [
      "牛里脊",
      "芹菜",
      "小米椒",
      "野山椒",
      "香菜"
    ],
    "steps": [
      "牛里脊切成不超过 3cm 宽，3mm 厚的薄片，倒入 6ml 酱油，用手抓匀备用",
      "芹菜切成不超过 5cm 的小段，备用",
      "小米椒切成丝状，备用",
      "野山椒切成颗粒，备用",
      "香菜切成成不超过 3cm 的小段，备用",
      "热锅，锅内放入 15ml 食用油，大火等待 30 秒让油温升高",
      "放入小米椒和野山椒爆香",
      "放入牛里脊和芹菜，然后**大火翻炒 1 分钟**",
      "关火，撒上香菜，盛盘"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小炒黄牛肉的做法",
      "猪肉",
      "肉",
      "牛肉",
      "牛"
    ]
  },
  {
    "id": "r小酥肉",
    "name": "🥩 小酥肉",
    "emoji": "🥩",
    "description": "小酥肉，家常美味",
    "ingredients": [
      "去皮猪肉（根据喜好选择肥瘦）",
      "植物油",
      "老姜",
      "小葱",
      "料酒",
      "盐",
      "十三香",
      "胡椒粉",
      "味精",
      "鸡精",
      "花椒碎",
      "花椒粒",
      "生抽",
      "鸡蛋",
      "面粉",
      "红薯淀粉"
    ],
    "steps": [
      "老姜切丝,小葱不用切。",
      "根据计算公式倒入料酒、清水。",
      "用手捏揉 5 分钟，使姜葱的味道充分溶解在水中。"
    ],
    "prepTimeMin": 25,
    "difficulty": "easy",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小酥肉的做法",
      "猪肉",
      "肉",
      "家常菜"
    ]
  },
  {
    "id": "r上汤娃娃菜",
    "name": "🍲 上汤娃娃菜",
    "emoji": "🍲",
    "description": "上汤娃娃菜，家常美味",
    "ingredients": [
      "娃娃菜",
      "皮蛋",
      "午餐肉（火腿肠）",
      "葱",
      "姜",
      "蒜",
      "盐",
      "糖",
      "淀粉"
    ],
    "steps": [
      "娃娃菜洗净, 竖着切开切成段。",
      "葱 3g 切 小段。蒜 10g 切片。姜 10g 切小片。",
      "皮蛋切成丁, 火腿肠或者午餐肉切成丁（1cm 大小的丁）",
      "金针菇洗净撕开",
      "烧热水娃娃菜放进去十秒钟出一下水捞出。",
      "热锅凉油, 加热锅倒入油过一遍就倒出来, 重新倒入一点油。",
      "调至小火加入葱姜蒜，煎炒出香味即可。",
      "加入适 300g 清水（水量没过娃娃菜即可）, 放入娃娃菜, 金针菇, 午餐肉",
      "加入调味料蚝油、糖、盐、味精烧开。",
      "煮 3 分钟, 煮开后开始装盘, 盛出娃娃菜后皮蛋放在上面把汤汁浇上去就可以了",
      "![上汤娃娃菜](./上汤娃娃菜.png)"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "上汤娃娃菜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r乾隆白菜",
    "name": "🥬 乾隆白菜",
    "emoji": "🥬",
    "description": "乾隆白菜，家常美味",
    "ingredients": [
      "大白菜（取黄心嫩叶，冬季黄心白菜最佳）",
      "芝麻酱",
      "陈醋（推荐镇江香醋或山西老陈醋）",
      "白糖",
      "香油",
      "熟白芝麻（可选，用于点缀）"
    ],
    "steps": [
      "大白菜只取内部嫩叶（黄色部分），去除菜帮，用手撕成半个巴掌大的块，**不要用刀切**（手撕截面粗糙更易挂酱）",
      "将撕好的白菜叶冲洗干净，充分控干水分，水分残留会导致酱汁无法挂附",
      "碗中加入 30g 芝麻酱，**先加入 45ml 陈醋**，沿同一方向搅拌，将麻酱慢慢稀释开，直至*成细线状滴落*为止（切勿来回搅拌，会导致芝麻酱\"走油\"）",
      "向麻酱汁中加入 5g 白糖，搅拌均匀；再加入 1g 食盐，搅拌均匀；最后加入 5ml 香油，搅拌均匀（各调料需分次加入并分别搅拌，边加边感受稀稠度）",
      "将调好的麻酱汁均匀淋在白菜叶上，用手轻轻抓拌，使每片菜叶都裹上酱汁",
      "撒上熟白芝麻，装盘即可食用；若时间充裕，可**静置 5 分钟**待其入味后再食用"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "乾隆白菜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r凉拌豆腐",
    "name": "🧈 凉拌豆腐",
    "emoji": "🧈",
    "description": "凉拌豆腐，家常美味",
    "ingredients": [
      "豆腐 （推荐选用北豆腐或老豆腐）",
      "小葱",
      "大蒜",
      "生抽",
      "香油",
      "醋（可选）",
      "白糖（可选）",
      "辣椒油（可选）"
    ],
    "steps": [
      "将 豆腐 切成 2 cm 见方的小块，备用。",
      "锅中加入 500 ml 饮用水，大火烧开。",
      "放入 豆腐 块，煮 **1-2 分钟**，以去除豆腥味并使豆腐口感更紧实。",
      "将 煮好的 豆腐 块捞出，沥干水分，放入碗中，备用。",
      "将 小葱 洗净，切成葱花，备用。",
      "将 大蒜 去皮，切成蒜末，备用。",
      "在一个干净的小碗中，加入 15 ml 生抽，5 ml 香油，5 ml 醋（可选），2 g 白糖（可选）。",
      "加入切好的 大蒜末。",
      "搅拌均匀，使 白糖 充分溶解，酱汁混合均匀。",
      "将制作好的酱汁均匀淋在 豆腐 块上。",
      "撒上切好的 小葱花。",
      "根据个人喜好，淋上 5 ml 辣椒油（可选）。",
      "用 筷子 或勺子轻轻拌匀，即可食用。"
    ],
    "prepTimeMin": 75,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "凉拌豆腐的做法",
      "家常菜"
    ]
  },
  {
    "id": "r凉拌金针菇",
    "name": "🥬 凉拌金针菇",
    "emoji": "🥬",
    "description": "凉拌金针菇，家常美味",
    "ingredients": [
      "金针菇",
      "小葱",
      "大蒜",
      "生抽",
      "醋",
      "白糖（可选）",
      "香油（可选）",
      "辣椒油（可选）"
    ],
    "steps": [
      "将 金针菇 根部切除，用清水冲洗干净，备用。",
      "将 小葱 洗净，切成葱花，备用。",
      "将 大蒜 去皮，切成蒜末，备用。",
      "锅中加入 1000 ml 饮用水，大火烧开。",
      "放入 金针菇，煮 **1-2 分钟**，至金针菇变软。",
      "将 煮好的 金针菇 捞出，沥干水分，放入一个较大的碗中，备用。",
      "在另一个干净的小碗中，加入 15 ml 生抽，10 ml 醋，3 g 白糖（可选），5 ml 香油（可选）。",
      "加入切好的 大蒜末。",
      "搅拌均匀，使 白糖 充分溶解，酱汁混合均匀。",
      "将制作好的酱汁均匀淋在 金针菇 上。",
      "撒上切好的 小葱花。",
      "根据个人喜好，淋上 5 ml 辣椒油（可选）。",
      "用 筷子 轻轻拌匀，即可食用。"
    ],
    "prepTimeMin": 75,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "凉拌金针菇的做法",
      "家常菜"
    ]
  },
  {
    "id": "r印度土豆花菜",
    "name": "🥬 印度土豆花菜",
    "emoji": "🥬",
    "description": "印度土豆花菜，家常美味",
    "ingredients": [
      "土豆",
      "花菜（菜花）",
      "洋葱",
      "番茄",
      "生姜",
      "大蒜",
      "青辣椒",
      "香菜",
      "食用油",
      "孜然籽",
      "姜黄粉",
      "红辣椒粉",
      "香菜粉",
      "印度综合香料粉(Garam Masala)",
      "盐",
      "炒锅（带盖）"
    ],
    "steps": [
      "将土豆去皮切成约 2cm 的块状",
      "将花菜掰成均匀的小朵，大朵可用刀切小",
      "在炒锅中倒入 30ml 食用油，中火加热",
      "油热后放入孜然籽 3g，炸至*孜然籽变深色且散发香味*（约 10 秒，注意不要炸糊）",
      "放入切碎的洋葱，翻炒至*洋葱变透明微黄*（约 3-4 分钟）",
      "加入生姜、大蒜和青辣椒，翻炒 1 分钟",
      "加入切碎的番茄，翻炒至*番茄软烂*（约 2-3 分钟）",
      "加入姜黄粉 3g、红辣椒粉 3g、香菜粉 5g、盐 5g",
      "翻炒 1 分钟，使香料与蔬菜融合",
      "放入土豆块，翻炒 2 分钟使土豆表面裹上香料",
      "放入花菜朵，轻轻翻拌均匀",
      "盖上锅盖，转中小火，**焖 12-15 分钟**，期间每 3-4 分钟打开翻炒一次防止粘锅",
      "当*土豆用筷子可轻松戳透、花菜略有焦边*时，撒入印度综合香料粉 3g",
      "翻炒 1 分钟",
      "关火，撒上香菜叶，盛盘"
    ],
    "prepTimeMin": 85,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "印度土豆花菜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r印度葫芦丸子",
    "name": "🥬 印度葫芦丸子",
    "emoji": "🥬",
    "description": "印度葫芦丸子，家常美味",
    "ingredients": [
      "瓠瓜（葫芦）",
      "鹰嘴豆粉(Besan)",
      "洋葱",
      "番茄",
      "生姜",
      "大蒜",
      "青辣椒",
      "香菜",
      "姜黄粉(Turmeric)",
      "红辣椒粉",
      "香菜粉(Coriander Powder)",
      "孜然粉",
      "印度综合香料粉(Garam Masala)",
      "盐",
      "食用油",
      "深锅或炒锅"
    ],
    "steps": [
      "将瓠瓜去皮，用刨丝器刨成细丝",
      "用手将瓠瓜丝中的水分挤干，*尽量挤干*，否则丸子炸不成型",
      "在挤干水分的瓠瓜丝中加入鹰嘴豆粉 80g、盐 3g、红辣椒粉 3g、香菜粉 3g",
      "用手充分混合均匀，揉成不粘手的面团状",
      "将混合物搓成直径约 3cm 的小丸子，备用",
      "在深锅中倒入 500ml 食用油，中火加热至油温约 170°C（放入一小块面团，能快速浮起且冒泡即可）",
      "将丸子分批放入油中，**炸 4-5 分钟**，直至*表面金黄酥脆*",
      "炸好的丸子用厨房纸吸去多余油分，备用",
      "在炒锅中倒入 30ml 食用油，中火加热 10 秒",
      "放入切碎的洋葱，翻炒至*洋葱变成金棕色*（约 5-7 分钟）",
      "加入磨碎的生姜和大蒜，翻炒 1 分钟至*香味散出*",
      "加入切碎的番茄，翻炒至*番茄完全软烂出油*（约 5 分钟）",
      "加入姜黄粉 3g、红辣椒粉 5g、香菜粉 5g、孜然粉 3g、盐 5g",
      "翻炒 2 分钟，使香料与番茄充分融合",
      "加入 200ml 水，搅拌均匀，煮沸后转小火**炖 5 分钟**",
      "将炸好的丸子轻轻放入酱汁中，小火**炖 3-5 分钟**，使丸子吸收酱汁",
      "撒上印度综合香料粉 3g 和切碎的青辣椒",
      "关火，撒上香菜叶装饰，盛盘"
    ],
    "prepTimeMin": 100,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "印度葫芦丸子的做法",
      "家常菜"
    ]
  },
  {
    "id": "r家常日本豆腐",
    "name": "🧈 家常日本豆腐",
    "emoji": "🧈",
    "description": "家常日本豆腐，家常美味",
    "ingredients": [
      "日本豆腐（玉子豆腐）",
      "青椒",
      "胡萝卜",
      "火腿肠（可选）",
      "黑木耳（可选）",
      "洋葱（可选）",
      "生粉",
      "蒜",
      "油（煎豆腐用，能没过一大半就行）",
      "生抽 8 ml",
      "蚝油 15 ml",
      "盐（咸鲜口）",
      "鸡精（咸鲜口，可选）",
      "番茄酱（酸甜口）",
      "白砂糖（酸甜口）"
    ],
    "steps": [
      "胡萝卜切片，尖椒切薄块，葱蒜碎切好",
      "把买好的日本豆腐打开袋子切好，切成大概 1 cm 厚的圆柱体",
      "生粉放到平盘中，准备给豆腐裹面",
      "轻轻把豆腐放到面粉上，上下两面和周边都裹上面粉，注意不要包裹的太厚",
      "在平底锅里放 150 ml 油，油能没过豆腐一大半即可，看边缘颜色变成金黄，翻面煎就可以了",
      "两边都煎好的时候捞出来放在干净的盘里备用",
      "在炒锅中倒入 10-15 ml 油，放入葱蒜，爆香后放入青椒、胡萝卜、火腿肠、黑木耳",
      "加入蚝油、生抽、盐、鸡精、白砂糖、番茄酱",
      "轻轻翻炒至颜色均匀"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "家常日本豆腐的做法",
      "家常菜"
    ]
  },
  {
    "id": "r干锅花菜",
    "name": "🥬 干锅花菜",
    "emoji": "🥬",
    "description": "干锅花菜，家常美味",
    "ingredients": [
      "花菜",
      "五花肉",
      "辣椒",
      "生抽",
      "白糖",
      "蒜",
      "盐",
      "油"
    ],
    "steps": [
      "花菜朵朝下，没入淡盐水中浸泡 20 分钟。然后洗净用小刀拆成小朵",
      "入开水锅中焯水 1 分钟，捞出立即用冷水冲淋至完全凉透，沥水备用",
      "五花肉切成薄片，大蒜白色切下用刀背拍扁，小红辣椒切成段",
      "锅烧热放油，油热下大葱白爆香",
      "下五花肉片入锅，用中火煸炒至表面全部变色，继续煸炒一会儿，把肥肉部分的油份逼出一部分",
      "倒入红辣椒段和花菜，翻炒几下",
      "加入 10 ml 生抽",
      "再加入 5 g 白糖，转大火不断翻炒 1 分钟",
      "把大蒜叶部分切成段，放入锅中，翻炒几下后，关火盖上盖子焖 1 分钟即可"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "干锅花菜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r椒盐玉米",
    "name": "🥬 椒盐玉米",
    "emoji": "🥬",
    "description": "椒盐玉米，家常美味",
    "ingredients": [
      "玉米粒",
      "椒盐",
      "芝麻粒",
      "油",
      "淀粉",
      "两个塑料簸箕",
      "若干吸油纸"
    ],
    "steps": [
      "玉米粒都是剥好的，直接解冻即可，温水泡 15 分钟或者灶上开水煮 5 分钟。",
      "拿出一个簸箕，将其假设为 BoxA，垫上吸油纸，倒进解冻好的玉米粒。",
      "shaking shaking shaking! - 直到吸油纸全部变湿为止。",
      "拿出第二个簸箕 BoxB，垫上吸油纸，将 BoxA 的玉米粒全部倒入 BoxB 中。",
      "shaking shaking shaking! - 直到吸油纸全部变湿为止。",
      "重复上述操作多次，直到玉米表面没有明显可见的水滴但保持湿润的状态。",
      "倒入大量淀粉，能够完全盖住玉米粒。",
      "shaking shaking shaking! - 直到淀粉裹住了玉米粒",
      "开灶 - 放锅 - 倒入油 尽量铺满锅底 但不要太多。",
      "油热 8 成，倒入裹上了淀粉的玉米粒。",
      "中火先煎 30s，不要翻炒，不然淀粉会掉。",
      "轻微翻炒 3 分钟即可出锅。",
      "最重要的一步：撒上 3g 椒盐，撒上芝麻粒！",
      "香喷喷的”椒盐玉米“就做好了"
    ],
    "prepTimeMin": 80,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "椒盐玉米的做法",
      "家常菜"
    ]
  },
  {
    "id": "r油醋爆蛋",
    "name": "🥚 油醋爆蛋",
    "emoji": "🥚",
    "description": "油醋爆蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "小米辣",
      "小葱",
      "蒜",
      "油",
      "香醋",
      "生抽",
      "蚝油（可选但推荐）",
      "白糖（可选）"
    ],
    "steps": [
      "鸡蛋不需打散，直接打入碗中备用",
      "香葱切 3cm 长小段即可",
      "蒜瓣和小米辣放入打蒜器，打成沫",
      "将香醋、生抽、蚝油、白糖、水加入小碗，搅拌均匀作为糖醋料汁",
      "油热倒入鸡蛋，等鸡蛋凝固之后铲成大块，倒入蒜沫、小米辣沫、倒入糖醋料汁",
      "大火收汁、快出锅时加入葱段即可"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "油醋爆蛋的做法",
      "家常菜"
    ]
  },
  {
    "id": "r清炒花菜",
    "name": "🥬 清炒花菜",
    "emoji": "🥬",
    "description": "清炒花菜，家常美味",
    "ingredients": [
      "花菜",
      "大蒜",
      "盐"
    ],
    "steps": [
      "将 花菜 洗净，用刀或手掰成小朵，粗茎部分可以切片，备用。",
      "将 大蒜 去皮，切成蒜片，备用。",
      "锅中加入 1000 ml 饮用水，大火烧开。",
      "放入 花菜 朵，煮 **2-3 分钟**，至花菜颜色变浅，口感稍微软化。",
      "将 煮好的 花菜 捞出，沥干水分，备用。",
      "热锅，加入 15 ml 食用油，大火烧热。",
      "放入 蒜片，快速煸炒出香味。",
      "放入 焯好水的 花菜 朵，转中大火，快速翻炒约 **2 分钟**，使花菜均匀受热。",
      "加入 3 g 盐，继续翻炒均匀。",
      "沿锅边淋入 50 ml 饮用水，盖上锅盖，焖 **1 分钟**，帮助花菜完全熟透入味。",
      "开盖，快速翻炒均匀，即可出锅。"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "清炒花菜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r清蒸南瓜",
    "name": "🥬 清蒸南瓜",
    "emoji": "🥬",
    "description": "清蒸南瓜，家常美味",
    "ingredients": [
      "南瓜",
      "蒸锅"
    ],
    "steps": [
      "将 南瓜 外皮洗净，去除瓜瓤和籽。",
      "将 南瓜 切成厚度大约 2 cm 的片，备用。",
      "在 蒸锅 的锅中加入 1000 ml 饮用水。",
      "将切好的 南瓜 片均匀摆放在盘中。",
      "待蒸锅中的水烧开后，将装有 南瓜 的盘子放入蒸锅中。",
      "盖上锅盖，保持大火蒸 **15-20 分钟**，直至南瓜变软，可以用筷子轻松穿透。",
      "关火，小心取出盘子。"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "清蒸南瓜的做法",
      "家常菜"
    ]
  },
  {
    "id": "r凉粉",
    "name": "🍚 凉粉",
    "emoji": "🍚",
    "description": "凉粉，家常美味",
    "ingredients": [
      "豌豆淀粉",
      "大蒜",
      "小米辣",
      "辣椒粉",
      "酱油",
      "醋",
      "白糖",
      "鸡精",
      "盐",
      "花生碎",
      "香菜"
    ],
    "steps": [
      "准备食材。",
      "把豌豆淀粉和水各 100 克混合搅拌。",
      "往锅中倒入 600g 水，大火煮开后转为小火。",
      "倒入淀粉水，边倒边不断的搅拌，搅拌到浓稠且色泽均匀。",
      "找一个容器，在容器中刷一层薄薄的食用油。",
      "将煮好的淀粉倒入容器中冷藏 2-4 小时。",
      "冷藏后取出，脱模，切条。",
      "大蒜和小米辣剁成沫，放上 10g 辣椒粉，5g 花生碎，热油搅拌均匀。",
      "再加入 10ml 酱油，10ml 醋，5g 白糖，3g 鸡精，3g 盐搅拌均匀。",
      "将调味料倒在凉粉上，然后撒上香菜即可。"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "凉粉的做法",
      "家常菜"
    ]
  },
  {
    "id": "r利提巧卡",
    "name": "🍚 利提巧卡",
    "emoji": "🍚",
    "description": "利提巧卡，家常美味",
    "ingredients": [
      "全麦面粉(Atta)",
      "烤鹰嘴豆粉(Sattu)— 可用炒熟的鹰嘴豆磨粉替代",
      "茄子",
      "番茄",
      "土豆",
      "洋葱",
      "大蒜",
      "生姜",
      "青辣椒",
      "柠檬",
      "香菜",
      "芥末油(Mustard Oil)— 可用其他食用油替代",
      "孜然籽",
      "印度黑盐(Kala Namak)— 可用普通盐替代",
      "红辣椒粉",
      "芝麻",
      "酥油(Ghee)",
      "盐",
      "烤箱或明火"
    ],
    "steps": [
      "在碗中混合烤鹰嘴豆粉 120g、切碎的洋葱、青辣椒、生姜",
      "加入孜然籽 3g、芝麻 5g、红辣椒粉 3g、印度黑盐 3g、盐 3g",
      "加入芥末油 15ml、柠檬汁 10ml、切碎的香菜叶",
      "充分混合均匀，馅料应呈松散但可捏合的状态，备用",
      "将全麦面粉 200g 放入大碗中",
      "逐渐加入温水，边加边揉，揉成*光滑柔软*的面团",
      "面团静置 **15 分钟**",
      "将面团分成 8 个等大的小剂子",
      "每个剂子用手压成一个直径约 8cm 的圆形面片（中间稍厚）",
      "在面片中央放入约 15g 馅料",
      "将面片四周收拢包住馅料，封口处捏紧，搓成圆球",
      "将茄子、番茄、土豆放在明火上直接烤，或放入 200°C 烤箱烤 **20-25 分钟**，直至*外皮焦黑、内部完全软烂*",
      "烤好后去皮，将茄子、番茄、土豆分别用叉子或手捣碎",
      "将捣碎的蔬菜混合在一起",
      "加入切碎的大蒜、青辣椒、盐 4g、芥末油 15ml",
      "充分搅拌混合均匀",
      "撒上香菜叶装饰"
    ],
    "prepTimeMin": 95,
    "difficulty": "hard",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "利提巧卡的做法",
      "家常菜"
    ]
  },
  {
    "id": "r可乐炒饭",
    "name": "🍚 可乐炒饭",
    "emoji": "🍚",
    "description": "可乐炒饭，家常美味",
    "ingredients": [
      "米饭",
      "可乐（含糖或无糖均可）",
      "鸡蛋",
      "火腿肠（或午餐肉，可选）",
      "油",
      "生抽",
      "老抽",
      "蚝油",
      "豆瓣酱（可选）",
      "葱花",
      "胡椒粉（白胡椒、黑胡椒均可）"
    ],
    "steps": [
      "将锅烧热后，加入 25 ml 油，放两个鸡蛋，煎至底部完全凝固",
      "翻面，煎至两面完全凝固",
      "关火，将鸡蛋取出，剪成 2-5 cm² 的小块后放回锅中（也可以直接用锅铲铲碎）",
      "重新开火，倒入可乐、生抽、老抽、豆瓣酱、蚝油，搅拌均匀",
      "加热到锅内液体剩 1/3，倒入米饭和火腿肠翻炒",
      "翻炒均匀后，改小火，锅内食物中心挖一个洞，打入 1 个鸡蛋，盖上锅盖，焖 2 分钟",
      "开盖翻炒至第三颗鸡蛋熟透，撒上葱花和胡椒粉，出锅"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "可乐炒饭的做法",
      "盖饭",
      "米饭",
      "家常菜"
    ]
  },
  {
    "id": "r咸肉菜饭",
    "name": "🍚 咸肉菜饭",
    "emoji": "🍚",
    "description": "咸肉菜饭，家常美味",
    "ingredients": [
      "大米",
      "青菜（推荐矮脚青菜，又称上海青）",
      "咸肉（淡咸肉）",
      "冬笋（可选）",
      "猪油",
      "料酒（可选）",
      "白糖（可选）",
      "白胡椒粉（可选）"
    ],
    "steps": [
      "如果加入冬笋，切薄片后冷水下锅煮 10 分钟去涩味",
      "咸肉切 1 cm 小丁",
      "咸肉和冬笋冷锅下 10 g 猪油、料酒、白糖，中小火煸炒到透明冒泡",
      "青菜切碎，菜梗和菜叶分开放，菜梗切成 0.5 cm 边长的正方形小块，菜叶切成长 2-3 cm，宽 1-1.5 cm 的长方形小块",
      "菜梗下锅炒到翡翠色",
      "米淘净后倒进电饭煲，加水",
      "把炒好的咸肉和菜梗铺在米上",
      "正常煮饭模式启动，最后 10 分钟开盖快速铺入菜叶",
      "煮好后焖 5 分钟，再淋 5 g 猪油、白胡椒粉疯狂翻拌均匀"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "咸肉菜饭的做法",
      "猪肉",
      "肉",
      "盖饭",
      "米饭"
    ]
  },
  {
    "id": "r基础牛奶面包",
    "name": "🐮 基础牛奶面包",
    "emoji": "🐮",
    "description": "基础牛奶面包，家常美味",
    "ingredients": [
      "鸡蛋 *（不过分要求大小及重量）*",
      "糖 *（如有糖浆是最好的。）*",
      "干酵母",
      "盐",
      "谷朊粉（可选）",
      "香草精（可选）"
    ],
    "steps": [
      "首先，将酵母和 ***30℃ 的温水*** 用刮刀或厨具混合均匀，静置 5 分钟。之后与面粉混合，搅拌均匀。此时的酵头应该是**特别粘稠**的面糊。",
      "用布盖上面糊，将面糊放置到**温暖的地方**进行发酵，时长为 45 ~ 60 分钟。",
      "最终的面糊应该是表面有很多气泡的且体积明显增大。",
      "将剩下的原料全部与酵头用刮刀混合、搅拌。在搅拌时一定要刮壁，使其充分混合。在形成面团且没有干粉时，用干净的干燥的一只手按压面团，另一只手扶住容器，使其形成一个大的面团，然后倒在面板或硅胶垫上操作",
      "用手掌下部推开面团，然后对折再次推开，直至表面没有干粉结块。这时的面团还不是很光滑。",
      "使用喷壶将至少是当前面团三倍大的容器内喷上一层植物油（也可用手涂抹均匀），将面团放入并盖上布，发酵 1 小时。",
      "此时面团应该有原来的两倍大。在面板或硅胶垫上撒上薄薄的一层面粉（可以看见面板或硅胶垫的厚度即可），然后将面团拿出，用手压瘪面团排气。",
      "之后使用擀面杖，擀成 1 cm 的厚片。并紧实、不留空隙地从一边卷起来。",
      "然后旋转 90° ，重复步骤 4、步骤 5 。",
      "将面包整形，放到垫了硅油纸的烤盘或者涂抹油脂的模具内。注意接缝处朝下。",
      "在托盘或模具内，发酵 30 ~ 45 分钟 。",
      "于此同时，预热烤箱。",
      "在面包上用剪子或者刀划开几条缝作为面包的花纹。",
      "用刷子刷上蛋液。（可选）",
      "放入烤箱，上下火 180℃ 烤制 30 分钟，然后调 165 ℃ 再烤 10 分钟。",
      "放凉后装入食品袋内，可保存一个星期。冷冻可保存一个月。"
    ],
    "prepTimeMin": 90,
    "difficulty": "hard",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "基础牛奶面包的做法",
      "牛肉",
      "牛",
      "面条",
      "面食"
    ]
  },
  {
    "id": "r微波炉腊肠煲仔饭",
    "name": "🍚 微波炉腊肠煲仔饭",
    "emoji": "🍚",
    "description": "微波炉腊肠煲仔饭，家常美味",
    "ingredients": [
      "工具",
      "原料"
    ],
    "steps": [
      "将米淘洗干净后倒入 `饭碗` 内，加入 400ml 的水，**盖上盖**",
      "放入微波炉，高火，`6` 分钟，煮饭途中准备原料",
      "6 分钟后，用毛巾或隔热手套取出碗，可以看见米饭已经八分熟",
      "在米饭上摆入切片的腊肠，继续高火 `2` 分钟",
      "取出腊肠饭，放入 `青菜碗`，高火 `4-5` 分钟",
      "在腊肠饭上摆好青菜，磕入鸡蛋，看个人喜好继续高火 `40-60` 秒",
      "取出腊肠饭，此时已经基本完成。",
      "将 `小碗` 放入，继续高火 `30` 秒",
      "在腊肠饭上淋上叮热的生抽，撒上葱花即可",
      "多余的青菜可以沾着酱油吃"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "微波炉腊肠煲仔饭的做法",
      "盖饭",
      "米饭",
      "家常菜"
    ]
  },
  {
    "id": "r意式肉酱面",
    "name": "🍜 意式肉酱面",
    "emoji": "🍜",
    "description": "意式肉酱面，家常美味",
    "ingredients": [
      "意大利面",
      "意大利面酱",
      "肉沫",
      "白洋葱（紫洋葱也可以）"
    ],
    "steps": [
      "锅中加水，烧开后放入意面（等待 6 - 12 分钟）",
      "在烧水的时候可以进行下面这些步骤，但请注意煮面的时间",
      "洋葱切成小丁",
      "空锅中倒油，中火下入洋葱碎",
      "时刻搅拌，注意不要让洋葱烧糊，直到洋葱变成半透明状",
      "下入肉沫，继续搅拌（搅散），直到肉末变成棕色",
      "加入意大利面酱，稍微搅拌一下即可",
      "把煮好的意大利面沥干水分并倒入肉酱中搅拌均匀即可（或者直接把做好的肉酱倒在意面上也行）"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "意式肉酱面的做法",
      "猪肉",
      "肉",
      "面条",
      "面食"
    ]
  },
  {
    "id": "r手工水饺",
    "name": "🍚 手工水饺",
    "emoji": "🍚",
    "description": "手工水饺，家常美味",
    "ingredients": [
      "擀面杖",
      "面粉",
      "冷水",
      "直径 30cm 以上的盆",
      "芝麻香油"
    ],
    "steps": [
      "盆中加入所有面粉",
      "加入芝麻香油",
      "面粉中央挖小洞",
      "分 4-5 次加入水，并搅和，当出现碎末状的稍微干燥面团时",
      "取消加水，用手将面团压实",
      "面团压实至可把盆周围的面粉纳入即可，此步骤为面光盆光",
      "将面团置于桌上，盆倒扣于桌上，环境温度为 25 度，使面团醒发约 45 分钟",
      "醒发完成后，将面团搓成条状，合成一团，再次搓成条，重复 3 次",
      "擀成条状，切成 20 份均匀大小面团，并搓成直径约 3-3.5cm 的球状",
      "压扁面团，在手上，桌上，擀面杖上，及面团上撒上面粉，此步骤防止面团发粘",
      "用擀面杖将面团擀平，约 8cm 直径，厚约 2mm，中间略微比四周厚 1mm"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "手工水饺的做法",
      "家常菜"
    ]
  },
  {
    "id": "r扬州炒饭",
    "name": "🍚 扬州炒饭",
    "emoji": "🍚",
    "description": "扬州炒饭，家常美味",
    "ingredients": [
      "冷饭（干一点的为佳）",
      "鸡蛋",
      "冷冻去皮基围虾",
      "午餐肉罐头",
      "青豆",
      "胡萝卜",
      "玉米粒（可选）",
      "葱",
      "油",
      "盐"
    ],
    "steps": [
      "胡萝卜切丁 0.2cm*0.2cm*0.2cm，备用",
      "午餐肉切丁 0.2cm*0.2cm*0.2cm，备用",
      "葱分别取葱白和葱绿，各切成 0.25-0.5cm 的小段，分开备用",
      "在碗中打入鸡蛋液，均匀搅拌，备用",
      "将胡萝卜，青豆，玉米粒煮熟捞出，备用（水别倒）",
      "将虾煮熟，捞出备用（水可以倒了）",
      "热锅热油，可以参考[学习炒与煎](../../../tips/learn/学习炒与煎.md)中的热锅双油",
      "鸡蛋凝固后立刻捞出，备用",
      "将午餐肉，青豆，胡萝卜，玉米粒，虾倒入锅中翻炒 1-2 分钟，装盘备用",
      "水冲一下锅，将杂物冲干净，保证锅内干净（可以有油但是不能有杂质）",
      "热锅热油(10ml)，将葱白放入爆香",
      "调至小火（如果油温过高可以关火 1-2 分钟），放入米饭，用铲子快速砸击米饭并翻炒，保证米饭均匀沾到油且粒粒分明",
      "倒入鸡蛋，继续砸击，使鸡蛋碎开并与米饭充分混合",
      "转大火，倒入其他所有备用配料，快速翻炒 1-2 分钟",
      "撒入盐，并翻炒至充分混合",
      "撒入葱绿，翻炒 1 分钟",
      "关火，装盘"
    ],
    "prepTimeMin": 95,
    "difficulty": "hard",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "扬州炒饭的做法",
      "盖饭",
      "米饭",
      "家常菜"
    ]
  },
  {
    "id": "r披萨饼皮",
    "name": "🫓 披萨饼皮",
    "emoji": "🫓",
    "description": "披萨饼皮，家常美味",
    "ingredients": [
      "中筋面粉",
      "水（温水）",
      "安琪干酵母粉",
      "食用盐",
      "橄榄油",
      "白砂糖",
      "烤箱",
      "烘焙油纸",
      "披萨石（有更好，没有普通烤盘也可以）",
      "擀面杖（非必需）"
    ],
    "steps": [
      "用准备好的温水把酵母粉化开，稍微搅拌小就好，备用",
      "取准备好的面粉，依次添加盐、橄榄油、白砂糖",
      "准备混合水和面粉，边加水边搅拌直至水全部加完",
      "搅拌至看不到干米粉为止",
      "用差不多三倍大面团的容器装好，密封，冰箱冷藏（4 度） **等待 8~12 小时，一般晚上做第二天就可以用**",
      "观察面团醒发完毕 **差不多是原始大小大约两倍算醒发完毕**",
      "取醒发好的面团，均匀分成四份，分别用保鲜膜盖好，备用",
      "案板撒稍微多一点的干面粉，准备开始揉面",
      "因为是比较湿的面团，所以粘上干面粉后才没那么粘手，不用揉太多次，面团表面稍微光滑一点就可以了",
      "用手拉扯，或者擀面杖擀平，也不一定非得擀圆，只要厚度均匀，烤箱放得进去就好",
      "铺好油纸，放上饼皮，依照个人口味，把准备好的食材放上去，撒上芝士碎",
      "水果烤箱上 180 度，下 220 度，16 分钟即可",
      "肉蔬菜烤箱上 200 度，下 230 度，18 分钟即可",
      "挤上沙拉酱或者其他自己喜欢的酱即可享用~"
    ],
    "prepTimeMin": 80,
    "difficulty": "hard",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "披萨饼皮的做法",
      "家常菜"
    ]
  },
  {
    "id": "r火腿饭团",
    "name": "🍚 火腿饭团",
    "emoji": "🍚",
    "description": "火腿饭团，家常美味",
    "ingredients": [
      "火腿",
      "米饭",
      "水",
      "冷冻青豆（可选）",
      "冷冻玉米粒（可选）",
      "海苔碎（可选）",
      "喜欢的沙拉酱（推荐日式 mayo！）"
    ],
    "steps": [
      "将米饭和水放到电饭锅里，点击米饭模式，等待完成",
      "冷冻玉米粒和青豆放到锅里，加水没过所有食材，沸腾后静待 2 分钟后，捞出。",
      "火腿切成 1cm 的方块",
      "与此同时，加入 10ml 食用油，加入火腿翻炒至火腿上色",
      "将米饭，火腿，海苔碎，青豆，玉米粒，沙拉酱放入碗中，混合均匀即可",
      "装盘（如果有的话）"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "火腿饭团的做法",
      "盖饭",
      "米饭",
      "家常菜"
    ]
  },
  {
    "id": "r炒凉粉",
    "name": "🍚 炒凉粉",
    "emoji": "🍚",
    "description": "炒凉粉，家常美味",
    "ingredients": [
      "凉粉",
      "玉米油",
      "大蒜",
      "香葱",
      "豆瓣酱",
      "生抽",
      "老抽",
      "食盐",
      "十三香",
      "中粗辣椒面",
      "矿泉水"
    ],
    "steps": [
      "凉粉改刀切麻将块大小",
      "开小火，起锅烧油，锅烧微热后，下入蒜末爆香后加入豆瓣酱炒出红油",
      "将凉粉块下入锅中，翻炒 10 秒",
      "加入生抽提味，老抽上色，翻炒均匀后加入辣椒面继续翻炒均匀",
      "加入食盐、十三香继续翻炒 10 秒",
      "加入准备好的矿泉水，再次翻炒 10 秒，待汤汁浓稠后，关火出锅装盘",
      "撒上葱花即可完成"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "炒凉粉的做法",
      "家常菜"
    ]
  },
  {
    "id": "r咖喱炒蟹",
    "name": "🦀 咖喱炒蟹",
    "emoji": "🦀",
    "description": "咖喱炒蟹，家常美味",
    "ingredients": [
      "青蟹（别称：肉蟹）",
      "咖喱块（推介乐惠蟹黄咖喱）",
      "洋葱",
      "椰浆",
      "鸡蛋",
      "生粉（别称：淀粉）",
      "大蒜"
    ],
    "steps": [
      "肉蟹掀盖后对半砍开，蟹钳用刀背轻轻拍裂，切口和蟹钳蘸一下生粉，不要太多。撒 5g 生粉到蟹盖中，盖住蟹黄，备用",
      "洋葱切成洋葱碎，备用",
      "大蒜切碎，备用",
      "烧一壶开水，备用",
      "起锅烧油，倒入约 20ml 食用油，等待 10 秒让油温升高",
      "将螃蟹切口朝下，轻轻放入锅中，煎 20 秒，这一步主要是封住蟹黄，蟹肉。然后翻面，每面煎 10 秒。煎完将螃蟹取出备用",
      "将螃蟹盖放入锅中，使用勺子舀起锅中热油泼到蟹盖中，煎封住蟹盖中的蟹黄，煎 20 秒后取出备用",
      "不用刷锅，再倒入 10ml 食用油，大火让油温升高至轻微冒烟，将大蒜末，洋葱碎倒入，炒 10 秒钟",
      "将咖喱块放入锅中炒化（10 秒），放入煎好的螃蟹，翻炒均匀",
      "倒入开水 300ml，焖煮 3 分钟。",
      "焖煮完后，倒入椰浆和蛋清，关火，关火后不断翻炒，一直到酱汁变浓稠。"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "咖喱炒蟹的做法",
      "家常菜"
    ]
  },
  {
    "id": "r响油鳝丝",
    "name": "🐟 响油鳝丝",
    "emoji": "🐟",
    "description": "响油鳝丝，家常美味",
    "ingredients": [
      "鳝丝",
      "大蒜",
      "姜末",
      "料酒",
      "生抽",
      "蚝油",
      "老抽",
      "食用盐",
      "白糖",
      "胡椒粉",
      "淀粉",
      "蒜末",
      "葱花",
      "猪油"
    ],
    "steps": [
      "将鳝鱼切成三段后切成细丝",
      "加入 0.5 g 胡椒粉、3 g 料酒搅拌均匀，再加入 5 g 香油腌制",
      "热油滑锅",
      "加入植物油，烧到 6 成热",
      "加入一半蒜末和全部姜末，翻炒几下",
      "加入鳝丝，中火爆炒 30 秒",
      "边缘淋入 10 g 料酒，翻炒几下",
      "加入生抽，炒匀",
      "加入蚝油、老抽，翻炒几下",
      "加入食用盐、白糖、3 g 胡椒粉，炒匀",
      "淀粉和水混合为水淀粉，倒入锅中，收汁至浓稠",
      "装盘，撒上蒜蓉、葱花",
      "另起锅烧热，加入猪油，烧至七成热，浇在鳝丝上"
    ],
    "prepTimeMin": 75,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "响油鳝丝的做法",
      "家常菜"
    ]
  },
  {
    "id": "r小龙虾",
    "name": "🦐 小龙虾",
    "emoji": "🦐",
    "description": "小龙虾，家常美味",
    "ingredients": [
      "小龙虾",
      "油",
      "香叶",
      "八角",
      "桂皮",
      "青花椒",
      "花椒",
      "子弹头辣椒",
      "葱姜蒜",
      "郫县豆瓣",
      "黄豆酱",
      "啤酒",
      "生抽",
      "盐"
    ],
    "steps": [
      "小龙虾刷干净去虾线，葱切 2cm 葱段，姜蒜切末。",
      "烧油，油微热, 下香叶、八角、桂皮、青花椒、花椒、子弹头辣椒。",
      "香料出香气之后下锅葱姜蒜",
      "葱姜蒜爆香后，加入郫县豆瓣、黄豆酱，炒出红油。",
      "下小龙虾，翻炒至变色。",
      "加入啤酒，等啤酒烧开后加入生抽，盐。",
      "将小龙虾完全煮熟后出锅。"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小龙虾的做法",
      "虾",
      "海鲜",
      "家常菜"
    ]
  },
  {
    "id": "r干煎阿根廷红虾",
    "name": "🦐 干煎阿根廷红虾",
    "emoji": "🦐",
    "description": "干煎阿根廷红虾，家常美味",
    "ingredients": [
      "阿根廷红虾（选用了速冻虾）",
      "海盐（研磨装）",
      "黑胡椒（研磨装）",
      "白葡萄酒",
      "生抽",
      "香菜",
      "柠檬",
      "洋葱",
      "生姜",
      "大蒜"
    ],
    "steps": [
      "阿根廷红虾解冻，最好是提前 1 天从速冻取出放到冷藏里自然解冻，能更好保持风味和口感。可买已经开背去虾线的，节省了不少时间",
      "解冻好的红虾洗净擦干备用，注意这里一定要沥干水分，赶时间可以用厨房用纸吸干水分",
      "生姜切片，洋葱切小方块，香菜洗干净后，叶茎分离，把香菜叶切碎，大蒜压碎切成小块碎末",
      "大火热锅，热锅后倒入两调羹橄榄油，等油温升高后，放入生姜片，洋葱块和香菜茎煸炒",
      "约 1 分钟后取出生姜，洋葱和香菜茎，弃用",
      "调中大火，放入红虾开始煎，注意所有虾需要单面都完整接触平底锅，煎约 2 分钟，同时给每只虾刷上一层油",
      "待底面虾壳有微微焦黄时翻面，并撒入大蒜碎末，轻微晃动平底锅使得受热均匀",
      "约 1 分钟后添加 20ml 白葡萄酒",
      "再煎 1 分钟后调中小火，均匀撒上一层盐和黑胡椒",
      "给每只虾滴上一滴生抽",
      "撒上香菜叶，装盘",
      "切好柠檬片，摆放到盘边即可"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "干煎阿根廷红虾的做法",
      "虾",
      "海鲜",
      "家常菜"
    ]
  },
  {
    "id": "r微波葱姜黑鳕鱼",
    "name": "🐟 微波葱姜黑鳕鱼",
    "emoji": "🐟",
    "description": "微波葱姜黑鳕鱼，家常美味",
    "ingredients": [
      "黑鳕鱼，带皮",
      "青葱",
      "姜",
      "料酒",
      "酱油",
      "芝麻油",
      "花生油",
      "密封袋"
    ],
    "steps": [
      "鱼片分别放入密封袋，鱼皮向下放在盘子中。",
      "取葱白切丝 25g，姜去皮后切丝，10g，混合在一起后分成两半，分别放在袋内鱼片上。",
      "每个袋子倒入 2.5mL 料酒。",
      "封好密封袋，放入微波炉中，中火（800 瓦）微波至*不透明且容易散开*时（约 3.5-5 分钟），从袋中取出鱼片。",
      "去除青葱和姜。",
      "取酱油 25mL，芝麻油 2mL，混合均匀后平均淋在两片鱼片上。",
      "取葱绿切细丝 10g，姜去皮后切丝 3g，混合后分成两份撒在鱼片上。",
      "取花生油 50mL，在小锅中加热至 190℃。",
      "将热油淋到放油葱绿的鱼片上，立刻上桌。"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "微波葱姜黑鳕鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r水煮鱼",
    "name": "🐟 水煮鱼",
    "emoji": "🐟",
    "description": "水煮鱼，家常美味",
    "ingredients": [
      "巴沙鱼",
      "蔬菜（比如土豆片/豆芽/花菜/生菜/……）",
      "红油豆瓣酱",
      "藤椒油",
      "菜籽油",
      "白胡椒粉",
      "蒜瓣",
      "盐",
      "糖",
      "量杯",
      "厨房秤（可选）",
      "大不锈钢碗"
    ],
    "steps": [
      "准备：巴沙鱼若是从冷冻柜里取出，需要放室温自然解冻 5 小时再做切片处理。",
      "切片：巴沙鱼撇成薄片，约 5cm 长，3cm 宽。",
      "[腌制](../../tips/learn/学习腌.md)：将切好片的巴沙鱼放入大不锈钢碗中",
      "加入 30g 豆瓣酱，3g 盐，10ml 藤椒油，3g 白胡椒粉",
      "用手抓匀后加入 5ml 菜籽油收尾封住口味",
      "常温静置至少 30 分钟入味。",
      "备菜：大蒜切成蒜末。以 300g 花菜，200g 生菜为例，将花菜与生菜洗净。",
      "焯水与炒菜：花菜[开水锅焯水](../../tips/learn/学习焯水.md)备用；将生菜洗净晾干，炒熟备用（不用放油）。",
      "炒豆瓣酱：热锅冷油（菜籽油 20ml），加入 10g 豆瓣酱，10g 豆豉（可选），加入蒜末，**中火**慢炒。",
      "汆鱼片：加入 150ml 热水，水很快开后加入腌制好的鱼片，轻轻翻动让鱼片在水中散开，加入 2g 盐和 2g 糖调味（此时可根据个人口味调整盐的用量）。水再次沸腾后即可盛盘。",
      "盛盘：先将熟的蔬菜盛至大碗中，然后将热的鱼片盛在蔬菜上面，浇上锅中剩余热汤即可！"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "水煮鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r油焖大虾",
    "name": "🦐 油焖大虾",
    "emoji": "🦐",
    "description": "油焖大虾，家常美味",
    "ingredients": [
      "黑虎虾 or 明虾、",
      "葱、姜",
      "料酒、盐、冰糖、植物油"
    ],
    "steps": [
      "剪虾枪到根上，虾须虾爪都剪掉，沙包挑掉，开背虾线挑出来，洗净备用",
      "炸料油",
      "下油，虾摆放整齐，两面变色后轻轻摁虾头",
      "大火烧开转小火盖盖子闷（中途不能再加汤水，不要开盖）",
      "皮亮虾弯就可以起锅，虾摆盘",
      "收汁（过滤后倒回锅里收浓，放葱油 ） 汤汁剩余 1/4 时。",
      "![油焖大虾-预览图-1](./油焖大虾.jpg)",
      "开吃✅"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "油焖大虾的做法",
      "虾",
      "海鲜",
      "家常菜"
    ]
  },
  {
    "id": "r烤鱼",
    "name": "🐟 烤鱼",
    "emoji": "🐟",
    "description": "烤鱼，家常美味",
    "ingredients": [
      "草鱼（农贸市场或者超市让店家杀掉，去除不要的器官）",
      "大葱",
      "料酒",
      "白胡椒粉",
      "食用盐",
      "大蒜",
      "桂皮",
      "八角",
      "香叶",
      "青花椒",
      "干辣椒段",
      "灯笼椒",
      "火锅底料（随意）",
      "千张",
      "绿豆芽",
      "洋葱",
      "豆瓣酱",
      "芹菜段",
      "熟花生米",
      "白芝麻",
      "香菜（放更好吃，根据个人口味可放可不放）"
    ],
    "steps": [
      "草鱼（一般 3 斤 ）从背部切开，两面沿着鱼的背部往下划几刀，不要划到鱼肚皮，不然不易定型",
      "把鱼放到容器中，加入料酒，10g 白胡椒粉，5g 食盐抹匀腌制二十分钟入味。",
      "把半根大葱切成一块一块，大蒜粒中间切开，和八角香叶桂皮放在一个容器中",
      "干辣椒段中间一分为二切开并和灯笼椒装在一个容器中",
      "芹菜切小段",
      "豆芽焯水",
      "千张焯水切成丝",
      "洋葱切成丝。",
      "烤制鱼",
      "锅中撒上 20ml 食用油，等到油热后，把大葱大蒜八角香叶倒入炒香",
      "加上一包火锅底料的一半和 15-20g 豆瓣酱，炒出红油",
      "加入 5g 白糖，10g 食盐，5ml 生抽调味，倒入和食材齐平的清水煮开",
      "依次下入芹菜段，豆芽，千张丝，不用煮熟，稍微烫一下后铺上洋葱丝，放上烤鱼",
      "加入干辣椒，灯笼椒，青花椒",
      "另一个锅烧油，油热后浇在刚加入的辣椒上面激发出香味",
      "最后撒上熟花生米，葱花，白芝麻，香菜",
      "煮 5-6 分钟，美味即成。"
    ],
    "prepTimeMin": 95,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "烤鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r清蒸鲈鱼",
    "name": "🐟 清蒸鲈鱼",
    "emoji": "🐟",
    "description": "清蒸鲈鱼，家常美味",
    "ingredients": [
      "鲈鱼（害怕杀鱼的同学可以让店家帮忙杀）",
      "香葱",
      "姜",
      "食用油",
      "蒸鱼豉油",
      "料酒",
      "食用盐"
    ],
    "steps": [
      "姜切片切丝、香葱的葱白切段，葱绿切丝，切丝后放入冷水浸泡备用。",
      "鲈鱼处理好后洗净，用厨房纸擦干，两面分别划几刀，用盐洗掉鱼身的粘液，并用 10g 盐抹遍鱼身的内外，腌制 10 分钟以上。",
      "补充一个鲈鱼改刀和摆盘的方法，改刀后可以让鲈鱼立起来蒸，均匀受热，同时吃起来更加方便，无需翻面。",
      "![改刀](./改刀.jpg)",
      "![清蒸鲈鱼-预览图-2](./摆盘.jpg)",
      "鱼肚内塞上姜和葱白，鱼身也撒上姜和葱白，量为备用的一半。蒸鱼的碟子用筷子将鱼跟碟子隔开蒸",
      "水烧热感觉到水温后放进入鱼",
      "大火清蒸 10 分钟。",
      "蒸好的鱼，用干净的盘子装起来并去除身上姜蒜",
      "鱼身浇上 15ml 蒸鱼豉油",
      "鱼身重新撒上姜和葱丝，锅内加上 10ml 食用油并烧热，将食用油淋至鱼身即可出菜"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "清蒸鲈鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r白灼虾",
    "name": "🦐 白灼虾",
    "emoji": "🦐",
    "description": "白灼虾，家常美味",
    "ingredients": [
      "活虾",
      "洋葱",
      "姜",
      "蒜",
      "葱",
      "食用油",
      "酱油",
      "料酒",
      "芝麻",
      "蚝油",
      "香醋"
    ],
    "steps": [
      "洋葱切小块，姜切片，平铺平底锅。",
      "活虾冲洗一下（去除虾线、剪刀减掉虾腿虾须子都是可选操作），控水，铺在平底锅的洋葱、姜片之上。",
      "锅内倒入料酒，盖上锅盖，中火 1 分钟，小火 5 分钟，关火 5 分钟。",
      "和上一步并行操作，制作蘸料：",
      "虾出锅，用干净的盘子装好。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "白灼虾的做法",
      "虾",
      "海鲜",
      "家常菜"
    ]
  },
  {
    "id": "r糖醋鲤鱼",
    "name": "🐟 糖醋鲤鱼",
    "emoji": "🐟",
    "description": "糖醋鲤鱼，家常美味",
    "ingredients": [
      "鲤鱼",
      "番茄酱",
      "白糖",
      "白醋",
      "淀粉",
      "盐",
      "葱",
      "姜",
      "料酒",
      "香菜一颗",
      "盆（两个）",
      "菜刀一个",
      "笊篱一个、锅铲一个"
    ],
    "steps": [
      "将鱼清洗干净，确保无鱼鳞等异物",
      "将鱼头朝左，鱼肚朝下，右手持刀。刀竖直切下 1cm，按紧鱼身往左片 3-4cm，再将鱼片中间轻轻划一刀",
      "将鱼放进盆里，然后将大姜切片，大葱切段（随便切切就行了，主要是需要去腥味）",
      "用吃奶的力气将大葱大姜里的汁水挤到盆中",
      "加入 20g 盐，25g 料酒，然后给鲤鱼搓个澡，涂抹均匀",
      "![腌制](./腌制.jpg)",
      "找个干净的盆，加入 100g 面粉、200g 淀粉、180g 水、5g 盐，用手将其搅拌均匀，面糊此时粘稠呈可拉丝状态，然后打入一个鸡蛋，再次搅匀",
      "等待 30 分钟",
      "将鱼放在案板上，用干毛巾将鱼身上的水擦干（这样可以更好的挂糊）",
      "将盆冲洗干净，用干毛巾擦干",
      "起锅烧油，加入约 1L 的油，将油温烧至 7 成热，约 200-240 度",
      "捏起鱼的尾巴，将鱼头沉入锅底，用勺子往鱼的身上淋热油，待面糊成型后，将鱼慢慢放入锅中，拿锅铲轻轻铲起鱼的头部，然后垫上笊篱。防止底部炸糊。",
      "准备一个盛鱼的盘子，放在锅的旁边。",
      "用锅铲从鱼身处轻轻铲入，两个工具配合鱼翻个身。再炸两分钟，还是同样的方式（笊篱托着鱼头，锅铲托着鱼身，将鱼盛入盘中）",
      "将锅中的油倒入擦干的盆中，放置一边，然后将锅刷干净",
      "将 50g 清水、40g 番茄酱、20g 白糖、10g 白醋放入小碗中，搅拌均匀",
      "再准备一个小碗加入 10g 淀粉、10g 水，搅拌成水淀粉",
      "开大火将锅烧热，然后倒入之前准备的料汁，大火烧开，转小火",
      "加入调好的水淀粉，边倒边搅拌，然后 20 秒后关火",
      "将熬好的糖醋汁用勺子均匀地浇在鱼身上，可以加点香菜或葱花点缀，糖醋鲤鱼就做好了",
      "![糖醋鲤鱼-预览图-2](./成品.jpg)"
    ],
    "prepTimeMin": 115,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "糖醋鲤鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r红烧鱼",
    "name": "🐟 红烧鱼",
    "emoji": "🐟",
    "description": "红烧鱼，家常美味",
    "ingredients": [
      "姜、蒜瓣、干辣椒",
      "油、盐、料酒、醋、酱油、白砂糖",
      "鱼",
      "蚝油",
      "葱",
      "香菜",
      "小米椒",
      "味精（鸡精）"
    ],
    "steps": [
      "加入 30-50ml 油，等待锅热...",
      "放入**擦干水分的鱼**（不想被热油溅一身的话），然后晃动锅，用热油煎鱼，注意这过程一定要小火",
      "将鱼翻面，重复上面油煎过程",
      "放入姜蒜辣椒，翻炒出香味",
      "倒入料酒，稍微多一点，此过程注意安全，会起大量油烟",
      "倒入醋（喜欢醋可以多放一点）",
      "然后放入白砂糖，酱油（老抽)",
      "加入冷水，以刚好淹没鱼身为宜，然后调成中火，盖上锅盖，大概 1 分钟后将鱼翻身，继续盖上锅盖",
      "3-4 分钟后，加入盐、小米椒、蚝油（味精、鸡精等），然后继续盖上锅盖，后续继续要翻身",
      "当锅内汤汁收汁到鱼的脊背线上的鱼鳍下面一点点的时候（或者汤汁不多的时候），转小火，加入香菜，葱花，然后盖上锅盖 20 秒，关火"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "红烧鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r红烧鱼头",
    "name": "🐟 红烧鱼头",
    "emoji": "🐟",
    "description": "红烧鱼头，家常美味",
    "ingredients": [
      "大葱、姜、大蒜、香菜、美人椒",
      "油、盐、鸡精、生抽、老抽、陈醋、黑胡椒粉、料酒",
      "八角、干辣椒",
      "鱼头一个",
      "注：市场直接贩卖的鱼头一般分为两种：白鲢、花鲢。前者价格便宜，后者价格略贵，但口感也更佳！"
    ],
    "steps": [
      "加入 30ml 油，等待锅热...",
      "油热，将锅关至小火",
      "放入姜片，慢慢翻炒，以姜片中的大部分汁水被炒出，以金黄色为准。",
      "放入葱段，翻炒至葱段略显发白。",
      "放入蒜碎、八角、干辣椒，翻炒 5 秒。",
      "将腌制好的鱼头倒入锅中，翻炒 2-3 分钟。",
      "倒入 500ml 清水，加入 2g 盐、3g 鸡精、5g 生抽、3g 老抽、5g 料酒、2g 黑胡椒粉、3g 陈醋。",
      "将两棵香菜放入锅中，盖上锅盖。",
      "调至大火，将水烧开。",
      "调至中火，慢焖入味。",
      "当汤汁减少一半时，打开锅盖。",
      "调至大火收汁，汤汁剩余 1/3 时，关火盛至小盆中。",
      "注：将锅中的汤汁均匀淋到鱼头上，盛盘时可以将锅中煮的香菜放入小盆底部，这样能让成品菜好看又好吃。",
      "将香菜放至已经盛出的鱼头上，把切好的美人椒圈放在香菜之上。",
      "色香味俱全的红烧鱼头出炉！"
    ],
    "prepTimeMin": 85,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "红烧鱼头的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r红烧鲤鱼",
    "name": "🐟 红烧鲤鱼",
    "emoji": "🐟",
    "description": "红烧鲤鱼，家常美味",
    "ingredients": [
      "大葱、姜、大蒜、干辣椒",
      "油、盐、生抽、老抽、陈醋、蚝油、料酒、白糖",
      "鲤鱼、五花肉"
    ],
    "steps": [
      "葱、姜、蒜、干辣椒分别清洗干净。",
      "葱白处切段，每段长度约 4cm，再将每段劈为四瓣。",
      "姜切片，每片厚度约 3mm。",
      "一个大蒜拍碎切末，其余蒜切为二瓣。",
      "干辣椒切四段。",
      "五花肉切片，约 4cm*4cm。",
      "清洗鱼。",
      "鱼背肉厚处拉几道斜口，方便入味",
      "锅里多倒点油，烧至 7 成热（刚刚开始冒烟），下入鱼炸 1 分钟至鱼皮稍稍变硬捞出备用（注意不要一下锅就拨弄鱼，等炸一会再拨弄、翻面），炸鱼的油倒出，锅里留一点底油",
      "将锅里底油烧热，下入五花肉，煸出香味。",
      "放入干辣椒、葱、姜、蒜瓣，翻炒 1 分钟。",
      "将炸好的鱼倒入锅中。",
      "沿锅边倒入",
      "调至中火，将水烧开。",
      "调至小火，慢焖入味。",
      "15 分钟 后，打开锅盖，挑出锅里的葱、姜、蒜、干辣椒。",
      "调至大火收汁，汤汁剩余 1/4 时，撒点蒜末，关火盛出。",
      "红烧鲤鱼出锅！"
    ],
    "prepTimeMin": 100,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "红烧鲤鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r肉蟹煲",
    "name": "🦀 肉蟹煲",
    "emoji": "🦀",
    "description": "肉蟹煲，家常美味",
    "ingredients": [
      "肉蟹（推荐优先级从高到低：缅甸黑蟹、青蟹、梭子蟹、大闸蟹）",
      "虾（可选）",
      "土豆",
      "年糕（推荐硬年糕，新鲜年糕亦可）",
      "洋葱",
      "大蒜",
      "生姜",
      "干辣椒",
      "青椒",
      "红椒",
      "蚝油",
      "海鲜酱（可选）",
      "黄豆酱（可选）",
      "甜面酱（或烧烤酱，可选）",
      "番茄酱（没有就挤半颗番茄碾碎）",
      "淀粉（玉米淀粉或土豆淀粉）",
      "冰糖",
      "鸡精",
      "白胡椒粉",
      "料酒（可使用黄酒替代）",
      "生抽",
      "老抽",
      "啤酒",
      "清水"
    ],
    "steps": [
      "土豆切块为各边均为 3 cm 的立方体，青/红椒切成边长 4 cm 的菱形片，洋葱切成 3 cm 宽的月牙瓣，年糕切成 1 cm 厚片",
      "螃蟹切成 50-80 g 的块，裹薄淀粉，180 °C 油温炸 1 分钟捞出",
      "锅中放油，蒜姜干辣椒爆香，放所有酱料 + 冰糖小火炒出红油，注意别糊底",
      "加螃蟹、土豆、啤酒和清水，烧开转小火炖 12 分钟",
      "放年糕和青红椒，开大火收汁到汤汁可以附着在物品表面，最后撒白胡椒粉"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "肉蟹煲的做法",
      "猪肉",
      "肉",
      "家常菜"
    ]
  },
  {
    "id": "r葱油桂鱼",
    "name": "🐟 葱油桂鱼",
    "emoji": "🐟",
    "description": "葱油桂鱼，家常美味",
    "ingredients": [
      "桂鱼",
      "小葱",
      "小米辣",
      "姜",
      "料酒",
      "植物油",
      "盐",
      "蒸鱼豉油",
      "蒸笼（含蒸锅）",
      "清水",
      "砧板",
      "铁锅",
      "塑料盘或塑料盆（腌鱼用）",
      "一次性手套",
      "厨房纸",
      "蒸鱼盘子（能平放下一条鱼即可）",
      "菜刀",
      "削皮刀",
      "防烫盘夹（或者防烫手套）"
    ],
    "steps": [
      "去菜市场买已经处理好的鱼（自己处理的话最好不要内脏），将鱼身表面的所有鳞片刮干净",
      "用厨房用纸将鱼肚子里的贴骨血和黑膜擦干净（帖骨血会影响口感，黑膜是鱼腥味的来源）",
      "用菜刀在鱼身表面来回刮几次，将鱼身的黏液刮掉，进一步去除腥味，然后用清水将鱼内外冲洗干净",
      "将鱼平放在砧板，使用厨房纸将鱼内外的水分擦干，然后鱼头朝左，尾朝右，从鱼鳃边开始，每隔 3cm 纵向划一刀，深度达到鱼的脊椎骨即可，另一面使用同样的处理方式",
      "将鱼平放在盆中，确保盘中没有多余水分",
      "取一块 50g 姜（鸡蛋大小），用削皮刀把表面的皮去除并洗干净，然后切成厚度为 3mm 的姜片",
      "将小米辣洗干净、去蒂，切成厚度为 2mm 的小圆片（或切成 1mm 宽度的丝状）",
      "将小葱洗干净，去除根须，切成 3cm 的小段，稍微粗一点的小葱，可以沿着小葱生长的方向沿中间劈开",
      "加入 8g 盐，25g 料酒到盆中，带上一次性手套，然后对鱼进行全身按摩 1 分钟，确保鱼身每个部位都均匀涂抹了盐和料酒",
      "按摩好鱼后，在鱼身的每一个刀口中塞入一片姜片，鱼肚子中放入 3 片姜片，腌制 10 分钟（建议不要腌制太久，否则鱼的鲜度降低）",
      "在鱼腌制期间，在蒸锅中加入 5L 清水，烧开后，在蒸锅上放上蒸笼",
      "鱼腌制好后，会析出水分，将多余水分和腌制用料酒、姜片倒掉，用清水冲洗干净鱼身和鱼肚，用厨房纸擦干鱼身和鱼肚",
      "将鱼平放在蒸鱼盘中，重新在鱼身、鱼肚刀口处塞入姜片",
      "然后将蒸鱼盘放入蒸笼中，盖上盖子，中火蒸 20 分钟",
      "期间水蒸气会附着整个鱼和盘子上，凝结后形成鱼汤，出锅后千万不要倒掉这个汤，这个汤汁是鲜味精华",
      "用防烫夹将蒸鱼盘夹出，在鱼身和鱼周围淋上 10g 蒸鱼豉油",
      "然后在鱼身和周围均匀撒上小葱段和小米辣",
      "在铁锅中倒入 15g 植物油，用中小火慢熬 5 分钟，不要用大火，否则油会挥发很快",
      "将出锅后的热油均匀地慢慢地淋在鱼身上，鲜掉眉毛的葱油桂鱼就出炉啦！"
    ],
    "prepTimeMin": 105,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "葱油桂鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r葱烧海参",
    "name": "🐟 葱烧海参",
    "emoji": "🐟",
    "description": "葱烧海参，家常美味",
    "ingredients": [
      "泡发好的海参![海参](./海参.jpeg)",
      "大葱葱白"
    ],
    "steps": [
      "葱白切成 1cm 的段，备用。",
      "海参切成 1cm 的段，备用。",
      "准备一个空碗，倒入 20g 蚝油， 10g 生抽， 2g 白糖，搅拌均匀。![料汁](./酱汁.jpeg)",
      "另一个空碗倒入淀粉，水，制备水淀粉，勾芡用。",
      "热锅，锅内放入 20ml - 25ml 食用油。等待 10 秒让油温升高。",
      "放入葱白，调*小火*，注意不要让葱白变焦。大概煎 3-5 分钟即可。![葱白](./葱白.jpeg)",
      "用筷子夹出葱白，放入盘中备用。",
      "倒入调好的料汁，炒香，**等待 1 - 2 分钟** 。",
      "放入切好的海参，翻炒 1 分钟",
      "加入 100 ml 的水， 中小火， **等待 5 分钟**",
      "等待锅中汤汁快干的时候，加入水淀粉，加入前面取出的葱白",
      "在外观*呈粘稠状态*后关火，盛盘 ![葱烧海参-预览图-5](./葱烧海参.jpeg)"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "葱烧海参的做法",
      "家常菜"
    ]
  },
  {
    "id": "r蒜香黄油虾",
    "name": "🦐 蒜香黄油虾",
    "emoji": "🦐",
    "description": "蒜香黄油虾，家常美味",
    "ingredients": [
      "大虾（推荐黑虎虾或基围虾）",
      "无盐黄油（推荐安佳）",
      "大蒜",
      "白葡萄酒（可选）",
      "柠檬",
      "平底煎锅",
      "厨房用夹"
    ],
    "steps": [
      "大虾去头去壳留尾，用牙签挑去虾线，洗净后用厨房纸吸干水分",
      "大蒜切成蒜末，备用",
      "中火加热平底锅，放入 10ml 橄榄油",
      "油热后放入大虾，每面煎 1-1.5 分钟至变色，取出备用",
      "同一锅中加入黄油，融化后放入蒜末，小火炒香（约 30 秒）",
      "如使用白葡萄酒，此时加入并煮至酒精挥发（约 1 分钟）",
      "将虾放回锅中，与蒜香黄油酱汁翻炒均匀（约 1 分钟）",
      "挤入柠檬汁，翻炒均匀后立即关火",
      "装盘，淋上锅中剩余酱汁"
    ],
    "prepTimeMin": 55,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "蒜香黄油虾的做法",
      "虾",
      "海鲜",
      "家常菜"
    ]
  },
  {
    "id": "r酱炖蟹",
    "name": "🦀 酱炖蟹",
    "emoji": "🦀",
    "description": "酱炖蟹，家常美味",
    "ingredients": [
      "螃蟹（首选河蟹，次选梭子蟹）",
      "豆瓣酱",
      "冰糖（可选）",
      "老抽",
      "菜油（未脱色的菜籽油，俗称“毛菜油”或“土菜油”，备选花生油）",
      "番茄酱",
      "料酒",
      "老姜",
      "小葱",
      "鸡蛋（可选）",
      "猪肉末（可选）"
    ],
    "steps": [
      "把螃蟹刷洗干净，然后在砧板上对半劈开",
      "锅里下菜油，放入姜末和豆瓣酱爆香，加入冰糖炒化，直到冒小气泡就盛出",
      "在盘子里铺上一层酱，然后把切好的螃蟹切开面朝下，整齐排放在酱上",
      "放点葱段和姜片，建议敲个鸡蛋或在盘底铺肉末",
      "上锅蒸 10-12 分钟"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "酱炖蟹的做法",
      "家常菜"
    ]
  },
  {
    "id": "r阳朔啤酒鱼",
    "name": "🐟 阳朔啤酒鱼",
    "emoji": "🐟",
    "description": "阳朔啤酒鱼，家常美味",
    "ingredients": [
      "剑骨鱼或鲤鱼（约 1.5 斤，让店家处理内脏，但**不要刮鱼鳞**）",
      "漓泉啤酒（一瓶，约 330ml，桂林本地啤酒，最正宗）",
      "番茄（2 个）",
      "青椒（2 个）",
      "红椒（1 个）",
      "大蒜（5-6 瓣）",
      "生姜（1 块）",
      "葱（2 根）",
      "桂林辣椒酱",
      "料酒",
      "生抽",
      "老抽",
      "白糖",
      "食盐",
      "食用油"
    ],
    "steps": [
      "鱼处理好内脏，保留鱼鳞，清洗干净，从腹部剖开成两半（背部相连），用 15ml 料酒、姜片、食盐 3g 腌制 15 分钟",
      "番茄切块，青椒红椒切块，大蒜拍碎，生姜切片，葱切段（葱白葱叶分开）",
      "用姜片擦拭锅底，热锅后倒入 30ml 食用油，油热后放入鱼（鱼皮朝下），煎至两面金黄、鱼鳞酥脆，盛出备用",
      "锅中留底油，放入葱白、姜片、蒜瓣爆香",
      "加入 15g 桂林辣椒酱，炒出红油",
      "放入番茄块，翻炒至番茄出汁变软",
      "倒入整瓶啤酒，加入 15ml 生抽、5ml 老抽、5g 白糖、5g 食盐，搅拌均匀",
      "放入煎好的鱼，大火烧开后转中小火，盖上锅盖焖煮 15-20 分钟",
      "开盖，放入青椒红椒块，继续煮 3-5 分钟",
      "大火收汁至汤汁浓稠，撒上葱叶段，出锅装盘"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "阳朔啤酒鱼的做法",
      "鱼肉",
      "鱼",
      "家常菜"
    ]
  },
  {
    "id": "r吐司果酱",
    "name": "🥣 吐司果酱",
    "emoji": "🥣",
    "description": "吐司果酱，家常美味",
    "ingredients": [
      "新鲜吐司",
      "果酱",
      "面包机"
    ],
    "steps": [
      "将吐司放入面包机",
      "设置好档位,时间到了会自动弹出",
      "两分钟后吐司加热完成弹出",
      "先取出一片吐司,涂满果酱再盖上另一片吐司即可",
      "用餐巾纸包一下可以边走边吃也可以吃完再出门"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "吐司果酱的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r完美水煮蛋",
    "name": "🥚 完美水煮蛋",
    "emoji": "🥚",
    "description": "完美水煮蛋，家常美味",
    "ingredients": [
      "新鲜鸡蛋（推荐 AA 级）",
      "100°C 沸水锅（直径≥ 15cm）",
      "30°C 温水锅（直径≥ 15cm）",
      "定时器",
      "漏勺"
    ],
    "steps": [
      "准备两锅水： A 锅维持 100°C 沸水， B 锅维持 30°C 温水",
      "用漏勺将鸡蛋放入 A 锅，启动定时器",
      "精准**每 2 分钟**将鸡蛋转移至另一锅水",
      "重复转移操作共 16 次（总时长 32 分钟）",
      "最后一次转移后，在 B 锅静置 30 秒",
      "立即放入冰水（ 0 摄氏度）终止加热（维持 30 秒）",
      "剥壳时从钝端气室处开始，沿纵轴剥离蛋膜"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "完美水煮蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r微波炉荷包蛋",
    "name": "🥚 微波炉荷包蛋",
    "emoji": "🥚",
    "description": "微波炉荷包蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "芝麻油",
      "盐"
    ],
    "steps": [
      "将鸡蛋打入小碗中，用筷子在所有鸡蛋黄上扎 2 个洞，避免加热弄脏微波炉",
      "然后向碗内倒入常温饮用水",
      "再向碗内倒入食用盐",
      "最后加入芝麻油",
      "将放好材料的碗放入微波炉中，高火加热 80 秒",
      "到达设定时间后，使用抹布垫着手取出成品"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "微波炉荷包蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r微波炉蒸蛋",
    "name": "🥚 微波炉蒸蛋",
    "emoji": "🥚",
    "description": "微波炉蒸蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "温水或高汤",
      "食盐",
      "生抽（可选）",
      "香油",
      "耐热碗",
      "保鲜膜或微波炉专用盖"
    ],
    "steps": [
      "将鸡蛋打散，加入温水/高汤、盐、生抽，轻轻搅匀，尽量不要起泡。",
      "将蛋液过筛倒入耐热碗中，表面若有气泡可用牙签轻戳。",
      "覆盖保鲜膜并扎 8-10 个小孔，或使用微波炉专用盖（留缝隙）。",
      "放入微波炉中加热：",
      "加热完成后取出静置 1 分钟，让余温使中心完全熟化。",
      "淋上香油，撒葱花即可食用。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "微波炉蒸蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r微波炉蛋糕",
    "name": "🥚 微波炉蛋糕",
    "emoji": "🥚",
    "description": "微波炉蛋糕，家常美味",
    "ingredients": [
      "微波炉",
      "能放进微波炉的容器",
      "黄油",
      "面粉",
      "泡打粉（不加吃着像饼）",
      "鸡蛋"
    ],
    "steps": [
      "加入以下食材，注意不要超过容器的 3/4",
      "夸赞一下自己🥰",
      "微波炉（高火）加热 **1分钟** （至蓬松蛋糕形态）",
      "取出杯子（烫手啊啊啊啊↑）并拍朋友圈就可以吃了"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "微波炉蛋糕的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r意式香肠北非蛋",
    "name": "🥚 意式香肠北非蛋",
    "emoji": "🥚",
    "description": "意式香肠北非蛋，家常美味",
    "ingredients": [
      "意式猪肉香肠（去肠衣）、辣香肠 (Chorizo) 或切块的午餐肉",
      "百味来 (Barilla) 拿坡里意面酱 (Napoletana Sauce)",
      "鸡蛋",
      "甜椒（青椒或红椒皆可）",
      "洋葱",
      "橄榄油",
      "帕马森干酪（可选）",
      "新鲜欧芹（可选）",
      "干辣椒碎（可选）",
      "面包（推荐酸面团面包 Sourdough、恰巴塔 Ciabatta 或厚切吐司）",
      "宽口平底锅（带锅盖）"
    ],
    "steps": [
      "将意式猪肉香肠去肠衣备用；洋葱切小丁；甜椒切细丝。",
      "在宽口平底锅中倒入 10ml - 15ml 橄榄油，中火加热。",
      "放入处理好的香肠或午餐肉，翻炒至边缘金黄酥脆（如果使用生香肠，翻炒时用勺子将其捣碎变色）。",
      "将洋葱丁和甜椒丝加入锅中与肉一起翻炒，持续翻炒 4 - 5 分钟，直到蔬菜变软，洋葱呈半透明状。",
      "倒入百味来拿坡里意面酱，搅拌均匀。将火调至中低火，保持微沸炖煮 2 - 3 分钟。（如果酱汁看起来太稠，可以加入 15ml 水）。",
      "用勺子的背面在锅内的酱汁中挖出 3 - 4 个小“坑”。",
      "依次小心地将鸡蛋打入每个坑中。",
      "盖上平底锅的盖子，利用蒸汽焖熟蛋白。等待 3 - 5 分钟。**注意：请频繁检查状态**。当蛋白变得不透明且凝固，但轻轻摇晃平底锅时蛋黄仍能晃动（溏心状态）时即可结束这一步。",
      "关火。根据个人喜好撒上磨碎的帕马森干酪、新鲜欧芹或干辣椒碎。",
      "将平底锅直接端上桌，配以硬壳面包蘸取蛋黄与酱汁食用。"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "意式香肠北非蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r手抓饼",
    "name": "🫓 手抓饼",
    "emoji": "🫓",
    "description": "手抓饼，家常美味",
    "ingredients": [
      "普通面粉",
      "开水",
      "冷水",
      "食用油",
      "盐",
      "鸡蛋",
      "生菜",
      "火腿",
      "芝士片",
      "--"
    ],
    "steps": [
      "面粉放入碗中，加入开水搅拌成絮状，再加入冷水揉成光滑面团，覆盖湿布静置 20 分钟。",
      "面团分成每份约 100 克，搓圆，擀成薄片。",
      "表面均匀涂抹食用油，撒上盐，卷成蜗牛状，松弛 10 分钟。",
      "面团再次擀成薄饼，厚度均匀。",
      "热锅中倒入油，小火煎至两面金黄起泡。",
      "煎好的饼依次铺入煎蛋、生菜、火腿、芝士片等配料，卷起即可。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "手抓饼的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r桂圆红枣粥",
    "name": "🥣 桂圆红枣粥",
    "emoji": "🥣",
    "description": "桂圆红枣粥，家常美味",
    "ingredients": [
      "糯米（或大米）",
      "红枣",
      "桂圆"
    ],
    "steps": [
      "将桂圆肉扒出，用清水洗两次，放入碗中浸泡 10 分钟",
      "红枣用清水洗两次，放入碗中浸泡 10 分钟",
      "糯米放入电饭锅中，清水淘米两次后，加入 2000ml 水",
      "将桂圆和红枣加入电饭锅",
      "打开电饭锅煮饭模式，1 小时后粥成"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "桂圆红枣粥的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r水煮玉米",
    "name": "🥣 水煮玉米",
    "emoji": "🥣",
    "description": "水煮玉米，家常美味",
    "ingredients": [
      "新鲜玉米",
      "放得下玉米的锅",
      "水",
      "盐",
      "糖（可选）"
    ],
    "steps": [
      "将新鲜玉米剥去外皮，剩部分玉米皮入锅",
      "加入淹过玉米约半节指头的水，加盐和糖",
      "水煮开之后转至小火，加盖继续煮 15-20 分钟，玉米煮久点没事。",
      "煮熟后沥干水分，冷却后食用。"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "水煮玉米的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r溏心蛋",
    "name": "🥚 溏心蛋",
    "emoji": "🥚",
    "description": "溏心蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "电锅",
      "水",
      "秒表（可选）"
    ],
    "steps": [
      "将鸡蛋放入电锅中。鸡蛋不可互相堆叠，应皆在底部，并留有空间可以晃动",
      "倒入淹过鸡蛋约 2 公分的冷水",
      "开盖，使用最大功率加热至水滚起（大约 85 - 95 度，稍微滚动，不需完全沸腾）",
      "关火，盖上盖子，让鸡蛋静置。",
      "沥干水分，用冷水冲洗鸡蛋约 1 分钟，即可去壳食用。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "溏心蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r燕麦鸡蛋饼",
    "name": "🐔 燕麦鸡蛋饼",
    "emoji": "🐔",
    "description": "燕麦鸡蛋饼，家常美味",
    "ingredients": [
      "鸡蛋",
      "燕麦",
      "牛奶 50-100g，能够将燕麦搅拌粘稠即可",
      "可根据口味选择增加 50g 蔬菜，如菠菜。"
    ],
    "steps": [
      "将牛奶与干燕麦混合搅拌均匀至黏稠状。",
      "将鸡蛋搅拌均匀至颜色单一程度。",
      "将鸡蛋液倒入燕麦牛奶中继续搅拌至黏稠、均匀。",
      "平底锅中加入一层黄油并覆盖均匀。",
      "下入搅拌好的食材，并摊开至饼状。",
      "小火加热两到三分钟。如想要加入蔬菜，可以在加热过程中加入碎菜叶。",
      "翻面继续加热两分钟。",
      "出锅，搭配剩下的牛奶作为早餐。"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "燕麦鸡蛋饼的做法",
      "鸡肉",
      "鸡",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r空气炸锅面包片",
    "name": "🍜 空气炸锅面包片",
    "emoji": "🍜",
    "description": "空气炸锅面包片，家常美味",
    "ingredients": [
      "面包片",
      "空气炸锅"
    ],
    "steps": [
      "取出两片面包片（建议使用粗粮面包片）",
      "将面包片**垂直**放入空气炸锅",
      "200°C 烘烤 5 分钟",
      "取出即可使用"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "空气炸锅面包片的做法",
      "面条",
      "面食",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r茶叶蛋",
    "name": "🥚 茶叶蛋",
    "emoji": "🥚",
    "description": "茶叶蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "八角",
      "香叶",
      "桂皮",
      "茴香",
      "冰糖",
      "红茶",
      "生抽",
      "老抽",
      "食盐"
    ],
    "steps": [
      "用冷水将鸡蛋煮熟，大火大约 8 分钟（根据自家厨具决定）",
      "鸡蛋捞出，过冷水",
      "将鸡蛋互相碰撞，使每个鸡蛋产生裂缝",
      "将鸡蛋下锅，放入八角，香叶，桂皮，茴香，冰糖，红茶，生抽，老抽，食盐",
      "加水直至没过鸡蛋",
      "大火煮开之后，转中小火煮 15 分钟"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "茶叶蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r蒸水蛋",
    "name": "🥚 蒸水蛋",
    "emoji": "🥚",
    "description": "蒸水蛋，家常美味",
    "ingredients": [
      "新鲜鸡蛋",
      "热水",
      "锡纸或保鲜膜"
    ],
    "steps": [
      "鸡蛋打入碗中，打散",
      "取其他容器，倒入 1.5 倍（半个蛋壳为 0.5 倍水）于蛋液的温水（温度 20~30），将盐倒入水中化开",
      "将盐水倒入鸡蛋液中，顺时针或逆时针单方向搅拌均匀，气泡之类的可以用舀出丢弃，过筛则口感更加。",
      "使用锡纸包裹盛蛋液的碗（或用盘子盖住），置入提前带盖并加入大约 3cm 深度水的锅中",
      "中火烧至水开，转最小的火继续蒸 4 分钟"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "蒸水蛋的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r蒸花卷",
    "name": "🥣 蒸花卷",
    "emoji": "🥣",
    "description": "蒸花卷，家常美味",
    "ingredients": [
      "冷冻花卷",
      "圆碟子",
      "蒸架",
      "水 400ml"
    ],
    "steps": [
      "从花卷的包装袋中取出 5 个花卷",
      "把花卷平铺在碟子上，尽量不用重叠",
      "往锅里倒入 400ml 水，把蒸架放里面，把装花卷的碟子放在蒸架上，盖上锅盖。",
      "开大火加热，直至水沸腾。",
      "转中火加热 15 分钟",
      "开盖用手感受花卷的表面温度，如果不够热，就继续盖上盖子加热，否则就可以关火出锅。",
      "碟子取出放凉至 50 度即可食用"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "蒸花卷的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r蛋煎糍粑",
    "name": "🥚 蛋煎糍粑",
    "emoji": "🥚",
    "description": "蛋煎糍粑，家常美味",
    "ingredients": [
      "鸡蛋",
      "糍粑",
      "白糖或红糖"
    ],
    "steps": [
      "把糍粑切成长方形小块，便于后面煎",
      "碗里打入一个鸡蛋并把鸡蛋搅碎，加入 2g 食用盐",
      "将切好的小糍粑依此放入搅碎的鸡蛋里面，涂抹完糍粑双面为止",
      "锅里倒入植物油 10ml ，把涂抹好的糍粑小块放进去小火慢慢煎软。",
      "将剩下的鸡蛋液慢慢倒在糍粑表面",
      "用筷子或者勺子为糍粑翻面，来回煎至金黄色后开吃"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "蛋煎糍粑的做法",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r金枪鱼酱三明治",
    "name": "🐟 金枪鱼酱三明治",
    "emoji": "🐟",
    "description": "金枪鱼酱三明治，家常美味",
    "ingredients": [
      "水浸金枪鱼罐头（不建议用油浸，会很腻）",
      "方形吐司片",
      "蛋黄酱",
      "俄式酸黄瓜汁",
      "芝士片（可选）",
      "火腿片（可选）",
      "轻食机"
    ],
    "steps": [
      "将金枪鱼、蛋黄酱、俄式酸黄瓜汁倒入碗中，用勺子搅拌，保证将金枪鱼块搅碎，酱整体呈糊状，并备用",
      "将 1 片吐司放在轻食机上",
      "将做好的金枪鱼酱涂抹到吐司上，建议 10-15ml",
      "将另一片方形吐司片覆盖在上面，并按压轻食机，开机",
      "待轻食机自动停止加热，即可装盘使用"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "金枪鱼酱三明治的做法",
      "鱼肉",
      "鱼",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r韩国麻药鸡蛋",
    "name": "🐔 韩国麻药鸡蛋",
    "emoji": "🐔",
    "description": "韩国麻药鸡蛋，家常美味",
    "ingredients": [
      "鸡蛋",
      "韩式酱油（或生抽）",
      "日式味淋",
      "白糖",
      "芝麻油",
      "青葱",
      "辣椒（小米辣或青红椒）"
    ],
    "steps": [
      "烧一锅开水，水沸腾后放入鸡蛋，**煮 7 分钟**（得到完美的溏心蛋状态）。",
      "煮鸡蛋的期间调制酱汁：将 4 汤匙酱油、4 汤匙清水、2 汤匙味淋、2 汤匙白糖倒入小锅中。",
      "加热酱汁至沸腾，煮开以挥发掉味淋中的酒精味，随后关火放凉备用。",
      "将切好的辣椒圈加入放凉的酱汁中。",
      "将煮好的鸡蛋捞出，放入冰水中冷却后剥去蛋壳。",
      "将剥好的鸡蛋放入调好的酱汁中，表面淋上 5ml 芝麻油并撒上葱花。",
      "放入冰箱**冷藏等待 1 - 2 小时**，让鸡蛋充分入味。"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "韩国麻药鸡蛋的做法",
      "鸡肉",
      "鸡",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r鸡蛋三明治",
    "name": "🐔 鸡蛋三明治",
    "emoji": "🐔",
    "description": "鸡蛋三明治，家常美味",
    "ingredients": [
      "鸡蛋",
      "吐司",
      "培根",
      "黄油",
      "蛋黄酱",
      "盐",
      "黑胡椒"
    ],
    "steps": [
      "吐司切去四边，备用",
      "鸡蛋煮熟，捣碎",
      "混合鸡蛋、蛋黄酱、盐、黑胡椒",
      "锅中加入黄油，煎熟培根",
      "组装吐司，在两片吐司间加入制作好的鸡蛋酱及培根",
      "四边形吐司切成三角形装盘"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "breakfast",
      "quick_easy",
      "home_style",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "鸡蛋三明治的做法",
      "鸡肉",
      "鸡",
      "早餐",
      "家常菜"
    ]
  },
  {
    "id": "r奶油蘑菇汤",
    "name": "🍲 奶油蘑菇汤",
    "emoji": "🍲",
    "description": "奶油蘑菇汤，家常美味",
    "ingredients": [
      "白蘑菇",
      "洋葱",
      "黄油",
      "面粉",
      "牛奶",
      "淡奶油",
      "黑胡椒碎",
      "盐",
      "清水",
      "--"
    ],
    "steps": [
      "白蘑菇切片备用，洋葱切末备用。",
      "平底锅中放入黄油，小火融化后加入洋葱炒至透明。",
      "加入白蘑菇翻炒至出水变软，撒入面粉搅拌均匀。",
      "加入牛奶和清水，搅拌均匀后小火煮沸，保持搅拌防止糊底。",
      "转小火煮约 10 分钟，汤汁浓稠。",
      "倒入淡奶油继续加热 1 分钟，加入盐和黑胡椒调味。",
      "熄火后可用料理机打成细腻浓汤（可选）。"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "奶油蘑菇汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r小米粥",
    "name": "🥣 小米粥",
    "emoji": "🥣",
    "description": "小米粥，家常美味",
    "ingredients": [
      "小米",
      "水（山泉水最佳）"
    ],
    "steps": [
      "小米 100 克，放入碗中，用水轻淘一遍（用手搅拌一下，将水倒掉，只是去掉外面的浮灰，不可搓洗！！！）",
      "水烧开，务必烧开！！！",
      "水烧开沸腾时，将小米倒入锅内。（很容易被忽视的一个很重要的环节）",
      "搅拌使得小米不会粘连锅底，继续用大火熬 6-10 分钟，注意用中间穿插搅拌几次。",
      "改中火、文火熬 15-20 分钟，锅盖要错开一条缝，千万不能让小米油溜掉哟，中间继续搅拌几次，不要糊锅底"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "小米粥的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r排骨山药玉米汤",
    "name": "🍲 排骨山药玉米汤",
    "emoji": "🍲",
    "description": "排骨山药玉米汤，家常美味",
    "ingredients": [
      "排骨（推荐精排）",
      "山药（推荐铁棍山药）",
      "胡萝卜",
      "玉米（推荐甜玉米或糯玉米）",
      "生姜",
      "小葱",
      "料酒",
      "食盐",
      "砂锅或深汤锅"
    ],
    "steps": [
      "**食材预处理**：",
      "**排骨焯水**：",
      "**翻炒排骨**：",
      "**炖煮过程**：",
      "**调味与出锅**："
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "排骨山药玉米汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r排骨苦瓜汤",
    "name": "🍲 排骨苦瓜汤",
    "emoji": "🍲",
    "description": "排骨苦瓜汤，家常美味",
    "ingredients": [
      "电压力锅（可以极大简化烹饪过程和时间）",
      "砂锅（相比于炒锅更适合炖汤）",
      "排骨",
      "苦瓜",
      "虾皮"
    ],
    "steps": [
      "排骨洗净，切到约 4cm ±2cm * 3 ± 2cm 的小块（如没有剁排骨的工具，可以求助摊主）",
      "炒锅倒入冷水 700ml 和排骨一起加热至煮沸，关火捞出排骨",
      "苦瓜中间切为两半，清除干净内部的种子和苦瓜瓤，切为 0.5 ± 0.3 cm 的苦瓜条，洗净"
    ],
    "prepTimeMin": 25,
    "difficulty": "easy",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "排骨苦瓜汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r朱雀汤",
    "name": "🍲 朱雀汤",
    "emoji": "🍲",
    "description": "朱雀汤，家常美味",
    "ingredients": [
      "鸡蛋",
      "香油（芝麻油）",
      "白糖",
      "水"
    ],
    "steps": [
      "鸡蛋在碗中打散，再倒入香油。",
      "水烧开后，在沸腾状态下快速倒入盛有鸡蛋的碗中。",
      "放入白糖。"
    ],
    "prepTimeMin": 25,
    "difficulty": "easy",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "朱雀汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r羊肉汤",
    "name": "🐑 羊肉汤",
    "emoji": "🐑",
    "description": "羊肉汤，家常美味",
    "ingredients": [
      "羊肉或羊杂",
      "食用油",
      "料酒",
      "大葱",
      "白胡椒粉",
      "食用盐",
      "孜然粉（可选）",
      "香菜（可选）"
    ],
    "steps": [
      "羊肉切成长 5cm 宽 0.5cm 的块",
      "大葱切成小段",
      "羊肉放入锅中，加入 1000ml 常温水，加入料酒、大葱",
      "煮沸 2 分钟后，捞出羊肉，使用常温水洗净，沥干水分",
      "热锅加入食用油，加入羊肉，翻炒 2 分钟至羊肉表面微黄",
      "加入开水，开到大火档位",
      "5 分钟后，加入白胡椒粉、盐，继续煮沸 5 分钟",
      "出锅之后，加入香菜、孜然粉，搅拌均匀"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "羊肉汤的做法",
      "猪肉",
      "肉",
      "汤",
      "煲汤"
    ]
  },
  {
    "id": "r腊八粥",
    "name": "🥣 腊八粥",
    "emoji": "🥣",
    "description": "腊八粥，家常美味",
    "ingredients": [
      "饮用水",
      "大米",
      "糯米",
      "花生",
      "红豆",
      "红枣",
      "粥锅（普通锅容易糊底，有条件可选择高压锅）",
      "中号玻璃碗（或其他中号不锈钢容器）",
      "小碗若干",
      "薏米",
      "黑米",
      "小米",
      "莲子",
      "绿豆",
      "黄豆",
      "豌豆",
      "红腰豆",
      "桂圆（去种龙眼干）",
      "栗子",
      "去壳核桃",
      "葡萄干",
      "冰糖（或白糖，调味用）"
    ],
    "steps": [
      "提前洗净好绿豆、红豆、花生、黄豆、豌豆、红腰豆，并用干净的玻璃碗盛放好，注入 3/4 玻璃碗大小的饮用水，浸泡一夜（或最少 8 小时）。",
      "提前洗净好大米、糯米、薏米、黑米、小米、莲子，并用干净的玻璃碗盛放好，注入 3/4 玻璃碗大小的饮用水，浸泡 3 小时。",
      "将步骤 1 中准备好的盛有绿豆、红豆、花生、黄豆、豌豆、红腰豆的玻璃碗中的水分分离倒出，其余原料倒入粥锅中，加入 1 升饮用水（或漫过食材 1 拇指块），大火煮沸，煮沸后合上锅盖，小火煮 30 分钟。",
      "将步骤 2 中准备好的盛有大米、糯米、薏米、黑米、小米、莲子的玻璃碗中的水分分离倒出，其余原料继续倒入粥锅中，合上锅盖，小火煮 60 分钟。",
      "洗净好红枣、桂圆、栗子、核桃、葡萄干（其中红枣切成小片）、冰糖，倒入锅中，合上锅盖，小火煮 60 分钟。",
      "确认煮出的粥粘稠后即可关火、盛盘、食用。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "腊八粥的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r西红柿鸡蛋汤",
    "name": "🐔 西红柿鸡蛋汤",
    "emoji": "🐔",
    "description": "西红柿鸡蛋汤，家常美味",
    "ingredients": [
      "西红柿",
      "鸡蛋",
      "香油",
      "味素",
      "盐",
      "葱、姜、蒜"
    ],
    "steps": [
      "将西红柿洗净，切块。",
      "葱姜蒜切碎。",
      "鸡蛋打到碗中，用筷子（或打蛋器）搅拌均匀。",
      "热锅，并放入 15 毫升的油，待能从油中看到冒出一丝烟时，放入葱姜蒜翻炒 30 秒。",
      "放入西红柿翻炒 1 分钟。",
      "倒入水，水的高度大约为锅内菜品高度的 1.2 倍，并放入盐。",
      "待开锅后，将鸡蛋液放入，并用筷子将鸡蛋打散，放入味素和香油。",
      "等待 30 秒，关火出锅。"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "西红柿鸡蛋汤的做法",
      "鸡肉",
      "鸡",
      "汤",
      "煲汤"
    ]
  },
  {
    "id": "r金针菇汤",
    "name": "🍲 金针菇汤",
    "emoji": "🍲",
    "description": "金针菇汤，家常美味",
    "ingredients": [
      "金针菇",
      "鸡蛋（如需要）"
    ],
    "steps": [
      "金针菇徒手掰散，越散越好**不然容易藏牙**，洗净备用。",
      "用菜刀或者水果刀将上述金针菇段段切，可依据个人喜好，但长度不宜超过 5 cm。",
      "将金针菇放入锅中，加水没过约食材总高度 1.1 倍，沸腾后**等待 3 分钟**。",
      "加入味精和食盐并搅拌。",
      "继续加热约 30 秒，关火装盘。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "金针菇汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r银耳莲子粥",
    "name": "🥣 银耳莲子粥",
    "emoji": "🥣",
    "description": "银耳莲子粥，家常美味",
    "ingredients": [
      "银耳",
      "去心莲子",
      "红枣",
      "枸杞（可选）",
      "冰糖"
    ],
    "steps": [
      "把银耳、莲子用清水浸泡 2 个小时，红枣浸泡 10 - 20 分钟，枸杞洗净，备用",
      "在锅中倒入 600ml 水，烧开后依次放入银耳、莲子、红枣",
      "等待水再次烧开后，盖上锅盖，转至中火继续熬",
      "熬到大约 1 小时后，放入 5g - 10g 冰糖和 5g - 6g 枸杞，转至小火熬",
      "小火继续熬 30 分钟，此时银耳开始呈现粘稠状态",
      "再次放入 5g - 10g 冰糖，用勺子搅拌 5 - 10 分钟",
      "关火，用勺子盛出"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "银耳莲子粥的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r黄瓜皮蛋汤",
    "name": "🥚 黄瓜皮蛋汤",
    "emoji": "🥚",
    "description": "黄瓜皮蛋汤，家常美味",
    "ingredients": [
      "黄瓜",
      "皮蛋",
      "大蒜",
      "小葱",
      "食用油（推荐猪油）",
      "盐",
      "鸡精（可选）"
    ],
    "steps": [
      "黄瓜洗净，切成 0.5-1.2 mm 厚的薄片",
      "葱洗净切成末，蒜用刀拍几下去皮，对半切一下",
      "皮蛋剥去壳，然后每个切成 6-8 份。锅里倒入油，放入切好的皮蛋和大蒜",
      "小火炒至皮蛋和大蒜表面有些焦黄，加入水，转大火烧开",
      "放入黄瓜片。水再次沸腾以后立马关火，放入盐、鸡精调味即可出锅",
      "装入碗中，再撒上葱花即可"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "soup",
      "healthy",
      "light",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "黄瓜皮蛋汤的做法",
      "汤",
      "煲汤",
      "家常菜"
    ]
  },
  {
    "id": "r反沙芋头",
    "name": "🍰 反沙芋头",
    "emoji": "🍰",
    "description": "反沙芋头，家常美味",
    "ingredients": [
      "荔浦芋头（电商平台购买即可，实惠新鲜）",
      "白砂糖或冰糖",
      "水",
      "葱"
    ],
    "steps": [
      "芋头切长条（稍微大条一点，翻炒过程不容易烂）",
      "加入可以没过芋头的油，等油温起来（插入筷子冒小泡即可）",
      "放进芋头到油里，去炸到芋头浮起来，一般是微微泛黄并且可以用筷子很轻松戳洞",
      "炸芋头的油放起来别浪费，后面炒菜啥的都能用",
      "接下来关键的一步，把糖(30g)和水(15g)按照 2：1 比例，加热至不变色且冒小泡",
      "倒入葱花和芋头，关火翻炒，此时等温度下来，糖就会有反沙的效果",
      "装盘上桌！"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "反沙芋头的做法",
      "家常菜"
    ]
  },
  {
    "id": "r咖啡椰奶冻",
    "name": "🥛 咖啡椰奶冻",
    "emoji": "🥛",
    "description": "咖啡椰奶冻，家常美味",
    "ingredients": [
      "125ml 淡奶油",
      "250ml 椰树牌椰汁",
      "35ml espresso 意式浓缩",
      "50ml 椰子水",
      "10g 吉利丁(gelatin)",
      "过滤网（可选）",
      "（那个...有摆盘需求的话，可以来点蓝莓 and/or 咖啡粉）"
    ],
    "steps": [
      "将定量淡奶油，椰树牌椰汁，espresso，椰子水混合备用。",
      "将以上液体加热 1 分钟，温度达到 50-60 度即可。",
      "（可选）如果格外嗜甜可以加额外的糖。",
      "倒入吉利丁，搅拌至融化，煮 1 分钟。",
      "（可选）过筛 （这一步可以让椰奶冻口感更佳顺畅）。",
      "放入模具。",
      "（可选）过滤掉表层的泡泡。这一步可以让椰奶冻口感更好，并且看着也会更棒。",
      "放入冰箱冷藏区，等待 3 小时。"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "咖啡椰奶冻的做法",
      "家常菜"
    ]
  },
  {
    "id": "r奥利奥冰淇淋",
    "name": "🍰 奥利奥冰淇淋",
    "emoji": "🍰",
    "description": "奥利奥冰淇淋，家常美味",
    "ingredients": [
      "淡奶油（推荐品牌 安佳动物淡奶油）",
      "原味奥利奥",
      "电动打蛋器",
      "小刀（或者可以去除夹心的工具）",
      "冰淇淋模具（可选）"
    ],
    "steps": [
      "将奥利奥拧开后去除利利（夹心），备用",
      "用筷子将奥奥剁碎，需要有一半奥奥变成粉状，另一半的奥奥最大长度小于 0.5 厘米，备用（某宝可搜“奥利奥饼干碎”，节省时间精力^-^）",
      "将奶油全部倒置于深容器中，并加入准备好的糖",
      "开始用电动打蛋器高速挡 搅打至 电动打蛋器提起后下方会出现**悬挂住**的奶油（ 0.5 厘米 - 1 厘米），而不是**全部**像液体一样滴下（部分滴下是正常现象）。",
      "搅打完成后将奥奥放入奶油中，搅拌均匀直至底部有奥奥。",
      "可选：将混合物倒入冰淇淋模具中",
      "放置冰箱冷冻室（ -18 度） 4 小时以上可取出"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "奥利奥冰淇淋的做法",
      "家常菜"
    ]
  },
  {
    "id": "r戚风蛋糕",
    "name": "🥚 戚风蛋糕",
    "emoji": "🥚",
    "description": "戚风蛋糕，家常美味",
    "ingredients": [
      "鸡蛋",
      "白糖",
      "牛奶（或水）",
      "食用油（或黄油，但需加热软化）",
      "低筋面粉（推荐惠宜）"
    ],
    "steps": [
      "从冰箱中取出新鲜的鸡蛋",
      "准备两个容器并擦干，分别盛放蛋清与蛋黄",
      "对盛放蛋清的容器，可稍有水珠，但**不能有任何油**；盛放蛋黄的容器不能有水珠",
      "打蛋，手工或利用分蛋器，将蛋清与蛋黄分离到两个容器中。",
      "分离过程中蛋黄不能破碎，**蛋清中不能混有任何蛋黄**，否则会严重影响打发。（白色系带可进入蛋清，不影响）",
      "（注意，不使用厨房机的情况下，盛放蛋清的容器也是打蛋的容器，为避免溢出，加入全部蛋清后不要超过容器的 **1/8**）",
      "预热：空气炸锅设置 **130°C** 预热 **5 分钟**",
      "入锅与遮盖：将装有蛋糕糊的模具放入炸锅。**立刻在模具上方盖上一层锡纸**（亮面朝上，哑光面接触食物），锡纸边缘捏紧，防止被热风吹开",
      "第一阶段烘烤：设置 **130°C**，烘烤 **35 分钟**",
      "第二阶段上色：打开炸锅，**撤掉锡纸**。将温度调高至 **150°C**，继续烘烤 **10–15 分钟**",
      "判断熟透：蛋糕顶部膨胀且上色呈金黄色即可出锅。用牙签扎入中心，拔出后没有湿润面糊带出即代表已烤熟",
      "出锅后的震热气与倒扣脱模操作，与烤箱版完全一致"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "戚风蛋糕的做法",
      "家常菜"
    ]
  },
  {
    "id": "r提拉米苏",
    "name": "🍰 提拉米苏",
    "emoji": "🍰",
    "description": "提拉米苏，家常美味",
    "ingredients": [
      "马斯卡彭芝士",
      "手指饼干",
      "放凉浓缩咖啡",
      "无菌鸡蛋",
      "白砂糖",
      "可可粉",
      "朗姆酒（不喜欢酒的朋友可省略，可按照自己口味调节）",
      "一个装成品的容器（这里用的是玻璃乐扣）",
      "打蛋器（手劲儿大的朋友也可以锻炼臂力）"
    ],
    "steps": [
      "分离蛋黄蛋清",
      "盛有蛋白的碗中加 10g 白砂糖湿性打发",
      "盛有蛋黄的碗中将 40g 白砂糖分三次加入，搅拌至均匀",
      "蛋黄中分三次加入马斯卡彭芝士，搅拌至均匀",
      "蛋黄中最后加入朗姆酒，搅拌均匀",
      "将打发好的蛋白分三次加入蛋黄芝士液中",
      "手指饼干两面浸湿咖啡液，平铺入容器",
      "两层芝士液两层饼干交替放入容器（这一步按照大家意愿及容器高度酌情处理）",
      "放入冰箱冷藏四个小时（心急的小伙伴可以提早拿出来）",
      "取出后在表面筛上可可粉，即可享用啦"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "提拉米苏的做法",
      "家常菜"
    ]
  },
  {
    "id": "r无厨师机蜂蜜面包",
    "name": "🍜 无厨师机蜂蜜面包",
    "emoji": "🍜",
    "description": "无厨师机蜂蜜面包，家常美味",
    "ingredients": [
      "高筋面粉：400g",
      "牛奶: 200g",
      "酵母：4g",
      "鸡蛋：1 个",
      "白砂糖：70g",
      "盐: 2g",
      "黄油: 30g",
      "蜂蜜：20g",
      "水: 20g",
      "芝麻"
    ],
    "steps": [
      "制作面团：将面粉，牛奶（建议加热到 40°，本人使用微波炉 15 - 20s），酵母，鸡蛋，面粉，糖和盐混合起来。",
      "搅拌面团，将原料混合均匀成团。",
      "加入黄油混合。",
      "继续搅拌 + 手揉，均匀混合。",
      "开始发面，使用保鲜膜覆盖容器，普通气温(10 - 20°)放置 1 - 2 小时，稍长时间对效果影响不大。",
      "明显看到面团发酵变大（2 倍）即可开始切分面团, 此时面团应该不再十分黏手。",
      "切分面团：理想状态每一份 60g（美观），可根据喜好适当调整大小。",
      "将每一份小面团使用擀面杖擀成舌状后卷起, 再次醒面 10。",
      "再次使用擀面杖擀成舌状后卷起, 从中间切开（一个变成两个）。",
      "再次使用擀面杖擀成舌状后卷起, 从中间切开（两个变成四个）。（此步骤可以按照自己的时间多擀/卷几次, 把握一份的大小就行）",
      "烤盘放入油纸并倒入花生油, （每份卷好的）底部蘸水 + 面粉后放入烤盘。",
      "再次醒发（盖上保鲜膜）, 这一步可以放入冰箱, 第二天再烤。",
      "刷上蛋液。",
      "烤箱 180°(355°F), 18 - 20 分钟。",
      "出炉后, 刷上蜂蜜水, 撒上芝麻。"
    ],
    "prepTimeMin": 85,
    "difficulty": "hard",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "无厨师机蜂蜜面包的做法",
      "面条",
      "面食",
      "家常菜"
    ]
  },
  {
    "id": "r炸鲜奶",
    "name": "🥛 炸鲜奶",
    "emoji": "🥛",
    "description": "炸鲜奶，家常美味",
    "ingredients": [
      "牛奶",
      "玉米淀粉",
      "面包糠",
      "鸡蛋",
      "白糖",
      "面包模具（或浅盘子）"
    ],
    "steps": [
      "将牛奶倒入碗中",
      "加入玉米淀粉和白糖，搅拌均匀",
      "将模具刷上食用油",
      "牛奶下锅，中火烧开",
      "烧开后转小火，边煮边搅拌",
      "牛奶*变粘稠*后出锅，倒入模具",
      "将模具放冰箱**冷却 1 小时**",
      "拿出，切成大小均匀的条，随后放入碗中",
      "向碗中倒入一半的面包糠，奶糊裹上后取出，备用",
      "在一个新碗中打入鸡蛋，搅匀，备用",
      "将奶糊裹上蛋液和剩余的面包糠",
      "锅中倒入足以覆盖奶糊的油，下锅",
      "奶糊外观*呈金黄状态*后停火，摆盘"
    ],
    "prepTimeMin": 75,
    "difficulty": "hard",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "炸鲜奶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r烤箱版巴斯克芝士",
    "name": "🥚 烤箱版巴斯克芝士蛋糕",
    "emoji": "🥚",
    "description": "烤箱版巴斯克芝士蛋糕，家常美味",
    "ingredients": [
      "奶油奶酪：212g （这是一块的质量，比较方便，原教程是 250g）",
      "白砂糖：60g",
      "鸡蛋：2 个",
      "鸡蛋黄：1 个",
      "淡奶油：120g",
      "低筋面粉：10g",
      "巧克力：38g（只尝试过将普通巧克力融化，在淡奶油那一步加入搅拌均匀即可）"
    ],
    "steps": [
      "奶油奶酪软化，微波炉 10s + 10s。",
      "奶油奶酪加入白砂糖，打蛋器打至顺滑。",
      "加入 2 个全蛋 + 1 个蛋黄，搅拌均匀。",
      "加入淡奶油，搅拌均匀。",
      "加入低筋面粉，搅拌均匀。",
      "烤箱 220°(425°F)，20 - 25 分钟（本人一般 20 或者 22 分钟）。",
      "放凉之后放入冰箱，最好过夜。"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "烤箱版巴斯克芝士蛋糕的做法",
      "家常菜"
    ]
  },
  {
    "id": "r烤蛋挞",
    "name": "🥚 烤蛋挞",
    "emoji": "🥚",
    "description": "烤蛋挞，家常美味",
    "ingredients": [
      "蛋挞皮 品牌不限",
      "鸡蛋",
      "牛奶",
      "淡奶油",
      "白砂糖",
      "烤箱 大小不限",
      "克数称",
      "搅拌器 包含且不限于筷子 打蛋器等工具",
      "筛网 网孔约为 1 毫米"
    ],
    "steps": [
      "将碗置于克数称上 称量 450 克 淡奶油（淡奶油密度在此处记为 1 ）",
      "加入 80 克白砂糖 （甜度中等 可按个人口味增减 建议范围 60-100 克）",
      "加入 200 克牛奶 （牛奶密度在此处记为 1 ）",
      "取 8 个蛋黄加入 蛋清可留作他用",
      "均匀搅拌所有材料直至白砂糖全部融化",
      "使用网筛对搅拌完成的食材进行过滤 滤除鸡蛋黏膜 鸡蛋壳 未融化的白砂糖 结块的淡奶油",
      "此时请将烤箱设置 220 摄氏度开始预热（约 10 分钟） 记得拿出烤盘",
      "将蛋挞皮以 0.5 厘米的间隔均匀放置于烤盘中",
      "将过滤完成的食材倒入蛋挞皮中 液面距离蛋挞皮上沿 0.5 厘米即可不宜过多",
      "截止此步骤 半成品蛋挞的制作已经完成 可直接放入冰箱速冻 12 小时以上保存",
      "将半成品蛋挞放入烤箱中进行烤制 温度为 200 摄氏度 时间为 25 分钟",
      "烤制结束后即可食用"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "烤蛋挞的做法",
      "家常菜"
    ]
  },
  {
    "id": "r玛格丽特饼干",
    "name": "🫓 玛格丽特饼干",
    "emoji": "🫓",
    "description": "玛格丽特饼干，家常美味",
    "ingredients": [
      "熟蛋黄",
      "黄油",
      "白砂糖",
      "盐",
      "低筋面粉",
      "玉米淀粉",
      "烤箱"
    ],
    "steps": [
      "黄油隔热水融化、将蛋黄磨碎备用。",
      "在融化的黄油中添加糖、盐、以及碾碎的鸡蛋黄，搅拌均匀",
      "加入低筋面粉与玉米淀粉，揉成面团",
      "将面团均匀分割成大约 8 克重的小面团，然后将它们搓成球状。",
      "使用大拇指轻压在每个小面团上，以形成裂纹。",
      "预热烤箱至 150℃，将小面团放入烤箱中，烘烤 20 分钟。",
      "微微放凉即可食用"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "玛格丽特饼干的做法",
      "家常菜"
    ]
  },
  {
    "id": "r红柚蛋糕",
    "name": "🥚 红柚蛋糕",
    "emoji": "🥚",
    "description": "红柚蛋糕，家常美味",
    "ingredients": [
      "空气炸锅",
      "鸡蛋",
      "红柚果肉",
      "面粉",
      "锡纸盘",
      "油",
      "糖",
      "水"
    ],
    "steps": [
      "锡纸盘里打入鸡蛋 2 个， 加入红柚果肉 20g",
      "锡纸盘中倒入 15ml 油并摇晃锡纸盘时期均匀覆盖盘底",
      "锡纸盘中放入 10g 糖， 以及 40g 面粉和 40ml 水",
      "用筷子顺时针方向搅拌至淡黄色糊状",
      "锡纸盘中放入 5g 糖， 以及 40g 面粉和 40ml 水",
      "继续用筷子搅拌至淡黄色糊状",
      "锡纸盘放入空气炸锅的烤篮上，用 180 摄氏度烤 15 分钟",
      "打开空气炸锅，小心取出锡纸盘，用筷子或勺子将蛋糕翻面",
      "继续 180 摄氏度烤 8 分钟",
      "取出即可食用"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "红柚蛋糕的做法",
      "家常菜"
    ]
  },
  {
    "id": "r胡萝卜甜糕",
    "name": "🍰 胡萝卜甜糕",
    "emoji": "🍰",
    "description": "胡萝卜甜糕，家常美味",
    "ingredients": [
      "胡萝卜（建议选用红色胡萝卜）",
      "全脂牛奶",
      "糖",
      "酥油(Ghee)— 可用黄油替代",
      "小豆蔻粉(Cardamom Powder)",
      "腰果",
      "杏仁",
      "葡萄干",
      "刨丝器",
      "厚底锅"
    ],
    "steps": [
      "将胡萝卜去皮，用刨丝器刨成细丝",
      "在厚底锅中倒入酥油 20g（一半量），中火加热融化",
      "放入胡萝卜丝，翻炒 **3-5 分钟**，直至*胡萝卜丝变软且散发香味*",
      "倒入全脂牛奶 500ml，搅拌均匀",
      "大火煮沸后转中小火，保持*缓慢沸腾*状态",
      "**持续翻搅 25-30 分钟**，直至*牛奶几乎完全被胡萝卜吸收蒸发*（这是最关键的步骤，需要耐心且不断搅拌防止糊底）",
      "当锅中几乎没有液体时，加入糖 80g，搅拌均匀",
      "加糖后会重新出水，继续中小火翻炒 **5-8 分钟**，直至*水分再次蒸发*",
      "加入剩余的酥油 20g 和小豆蔻粉 3g，翻炒 2 分钟",
      "在另一个小锅中，用少量酥油将腰果、杏仁片和葡萄干分别炸至*金黄*（约 1 分钟），注意葡萄干会膨胀",
      "将炸好的坚果和葡萄干的一半拌入胡萝卜甜糕中",
      "盛盘，将剩余坚果和葡萄干撒在表面作为装饰"
    ],
    "prepTimeMin": 70,
    "difficulty": "hard",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "胡萝卜甜糕的做法",
      "家常菜"
    ]
  },
  {
    "id": "r芋泥雪媚娘",
    "name": "🍰 芋泥雪媚娘",
    "emoji": "🍰",
    "description": "芋泥雪媚娘，家常美味",
    "ingredients": [
      "荔浦芋头（电商平台购买即可，实惠新鲜）",
      "紫薯粉",
      "牛奶",
      "糯米粉",
      "玉米淀粉",
      "黄油",
      "淡奶油",
      "白砂糖",
      "料理搅拌机（电动打蛋器也可以）",
      "筛网",
      "保鲜膜",
      "白砂糖"
    ],
    "steps": [
      "芋头切块，大火煮熟至软（40 分钟即可），全部放入料理机",
      "向内加入 30g 牛奶，25g 淡奶油，将其打成泥状",
      "再向内加入 3g 紫薯粉，18g 白砂糖，继续搅拌打成细腻芋泥",
      "取出另一个碗，加入全部糯米粉 b，22g 玉米淀粉，135g 牛奶，50g 白砂糖，混匀并过筛一遍，保鲜膜盖上并扎小洞，中火蒸半个小时",
      "在蒸的过程中，将糯米粉 a 放入平底锅小火翻炒至微微发黄（即炒熟），作为手粉备用",
      "将中火蒸完半小时的糯米牛奶混合物（果冻状）趁热加入黄油 30g，将黄油揉至面团完全吸收，然后放冰箱冷藏一小时",
      "取出另一只碗，加入 120g 淡奶油，8g 白砂糖，打发至有纹路，装进裱花袋备用",
      "取出冷藏后的面团，搓揉 5 分钟，分成 30g 一个，均匀撒上 2g 手粉防粘，擀成圆形，先挤上 5g 裱花奶油，然后放上 30g 芋泥，最后将面饼像包包子一样包起来（可以减去多余的皮）",
      "包好后再均匀撒 2g 手粉防粘",
      "重复以上两步直至原材料用光"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "芋泥雪媚娘的做法",
      "家常菜"
    ]
  },
  {
    "id": "r英式司康",
    "name": "🍰 英式司康",
    "emoji": "🍰",
    "description": "英式司康，家常美味",
    "ingredients": [
      "无盐黄油（推荐品牌总统）",
      "低筋面粉",
      "糖",
      "盐",
      "泡打粉",
      "鸡蛋",
      "淡奶油",
      "奶油奶酪（可选）"
    ],
    "steps": [
      "鸡蛋打散，称量出 30g 蛋液放入干净容器中，放入全量淡奶油和奶油奶酪混合均匀。如果奶酪太硬可以水浴加热至大约 40 度再混合。",
      "将低筋面粉，盐，糖，泡打粉放入干净容器中混合均匀",
      "黄油切成小块，放入上一步的混合物中，用手将黄油捏入混合物中，呈粗玉米粉质地",
      "将第一步的蛋奶混合液倒入上一步得到的粉油混合物种，搅拌均接近。叠压成均匀面团",
      "面团放到案板上，擀成 1.5cm 厚的面片，用刀或者模具分切成合适的形状",
      "用刷子蘸取剩余的 20g 鸡蛋液，刷在司康表面",
      "烤箱预热 180 度，烤制 27 分钟"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "英式司康的做法",
      "家常菜"
    ]
  },
  {
    "id": "r酸奶意式奶冻",
    "name": "🥛 酸奶意式奶冻",
    "emoji": "🥛",
    "description": "酸奶意式奶冻，家常美味",
    "ingredients": [
      "淡奶油",
      "糖",
      "原味酸奶",
      "吉利丁片",
      "筛网"
    ],
    "steps": [
      "吉利丁片剪成小片，泡入冷水中",
      "淡奶油和糖放入锅中，加热至 60 度",
      "关火，吉利丁从水中取出，控干水份，加入热淡奶油中，搅拌均匀",
      "淡奶油降温至 40 度，加入原味酸奶，搅拌均匀",
      "将上述步骤得到的混合物过两遍筛网",
      "分装入合适的容器，放入冰箱冷藏 4 小时以上"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "酸奶意式奶冻的做法",
      "家常菜"
    ]
  },
  {
    "id": "r雪花酥",
    "name": "🍰 雪花酥",
    "emoji": "🍰",
    "description": "雪花酥，家常美味",
    "ingredients": [
      "无盐黄油",
      "棉花糖",
      "全脂奶粉",
      "混合坚果（三只松鼠每日坚果）",
      "饼干（非夹心型饼干，推荐小奇福或购买使用雪花酥烘焙专用小饼干）"
    ],
    "steps": [
      "饼干超过一元硬币大小先切成小块",
      "无盐黄油加入锅中，小火加热至无盐黄油完全融化",
      "棉花糖加入锅中，使用刮刀搅拌，直至棉花糖融化并与无盐黄油均匀融合",
      "20g 奶粉加入锅中，使用刮刀搅拌，奶粉与黄油棉花糖混合物搅拌均匀后立即关火",
      "准备好的所有混合坚果与饼干趁热加入锅中，使用刮刀搅拌",
      "搅拌到温度下降到手可以接触的温度后，戴上一次塑料手套，在锅中搓揉或者双手拿起拉扯，让饼干混合坚果与棉花糖黄油奶粉混合物分散均匀。",
      "将上述步骤混合物压入模具中，边角压实，擀面杖擀平，未满的一边用手尽量压成直边",
      "室温放凉，完全冷却后脱模，按照模具纹路切块，或切成自己喜欢的大小，撒上剩余奶粉，尽量使雪花酥每面都沾上奶粉"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "雪花酥的做法",
      "家常菜"
    ]
  },
  {
    "id": "r龟苓膏",
    "name": "🍰 龟苓膏",
    "emoji": "🍰",
    "description": "龟苓膏，家常美味",
    "ingredients": [
      "龟苓膏粉 25 克",
      "冷水 120 毫升",
      "开水 500 毫升",
      "白砂糖 100 克",
      "小锅",
      "搅拌工具",
      "模具或碗",
      "--"
    ],
    "steps": [
      "在锅中倒入龟苓膏粉 25 克与冷水 120 毫升，充分搅拌至无颗粒感。",
      "在另一个容器中加入白砂糖 100 克，倒入沸水 500 毫升，搅拌至糖完全溶解。",
      "将糖水缓慢倒入龟苓膏粉液中，立即搅拌均匀，避免结块。",
      "将混合液体放入锅中，加热时保持中小火，并持续搅拌以防粘锅。",
      "加热至液体变粘稠并开始冒小泡，即可关火。",
      "快速将液体倒入模具中，自然冷却凝固。建议冷藏 1~2 小时后食用，口感更佳。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "snack",
      "sweet",
      "dessert",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "龟苓膏的做法",
      "家常菜"
    ]
  },
  {
    "id": "r冬瓜茶",
    "name": "🍵 冬瓜茶",
    "emoji": "🍵",
    "description": "冬瓜茶，家常美味",
    "ingredients": [
      "冬瓜",
      "冰糖",
      "保鲜膜",
      "过滤网",
      "大锅"
    ],
    "steps": [
      "**准备冬瓜**：将冬瓜去皮，去籽，切成小块（每块不超过 4cm）。",
      "**加入冰糖**：冬瓜加入冰糖，搅拌均匀，盖上保鲜膜放冰箱冷藏 2 小时以上。",
      "**煮冬瓜**： 此时冬瓜出了很多水, 倒入锅中 大火煮开，然后转中小火慢慢熬制 1~2 个小时，中途多搅拌防止糊锅。",
      "**过滤冬瓜茶**：使用过滤网将煮好的冬瓜茶液过滤，取出冬瓜块，只保留茶液。",
      "**冷却**：将冬瓜茶液放凉后，倒入干净的容器中，放入冰箱冷藏即可。",
      "**享用**: 熬好的冬瓜茶液是浓缩汁，根据个人喜好添加水或其他饮品，冷热皆宜。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "冬瓜茶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r冰粉",
    "name": "🥤 冰粉",
    "emoji": "🥤",
    "description": "冰粉，家常美味",
    "ingredients": [
      "冰粉籽 200g",
      "过滤豆浆渣的纱布一块",
      "凉白开 2000g",
      "薄荷汁 10ml / 薄荷粉 10g",
      "一次性透明塑料杯（可选）",
      "遇水发光冰块（可选）"
    ],
    "steps": [
      "将凉白开倒入盆中；",
      "将冰粉籽全部用纱布包起来，开口处打结",
      "将包好的冰粉籽放入凉白开中，在凉白开中用力揉搓 6 分钟",
      "然后将凉白开放置 2.5 小时，即可成型",
      "随后将石凉粉用勺子装进准备好的一次性透明塑料杯中，加入 10ml 薄荷汁或者 10g 薄荷粉（柠檬汁、山楂汁、桑椹汁也可），再放入遇水发光冰块，用勺子慢慢搅拌均匀"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "冰粉的做法",
      "家常菜"
    ]
  },
  {
    "id": "r印度奶茶",
    "name": "🥛 印度奶茶",
    "emoji": "🥛",
    "description": "印度奶茶，家常美味",
    "ingredients": [
      "红茶（CTC 红茶最佳，或阿萨姆红茶）",
      "全脂牛奶",
      "生姜",
      "小豆蔻（绿色）",
      "肉桂棒",
      "丁香",
      "黑胡椒粒",
      "糖",
      "小奶锅"
    ],
    "steps": [
      "将生姜拍碎（不用切太碎，拍开即可释放姜汁）",
      "将小豆蔻用刀背拍开，露出里面的籽",
      "将黑胡椒粒拍碎",
      "在小奶锅中倒入 120ml 水",
      "放入拍碎的生姜、小豆蔻、肉桂棒、丁香、黑胡椒粒",
      "大火煮沸后转小火，**煮 2 分钟**，让香料的味道充分释出",
      "加入红茶 8g，继续小火**煮 2 分钟**，直至*茶汤颜色变深*",
      "倒入全脂牛奶 120ml",
      "中火加热，**注意观察**，当奶茶开始*冒泡上升*时立即转小火（牛奶极易溢出）",
      "小火**煮 2-3 分钟**，期间可以将锅提起倒回（反复提拉 3-4 次），使茶汤与牛奶充分融合",
      "加入糖，搅拌溶解",
      "用滤网过滤到茶盏中，去除茶叶和香料残渣",
      "趁热饮用"
    ],
    "prepTimeMin": 75,
    "difficulty": "hard",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "印度奶茶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r可乐桶",
    "name": "🥤 可乐桶",
    "emoji": "🥤",
    "description": "可乐桶，家常美味",
    "ingredients": [
      "波旁威士忌",
      "可口可乐",
      "冰块",
      "柠檬（可选，提升口感用）",
      "手动压汁器"
    ],
    "steps": [
      "将柠檬对半切（**刀方向垂直于柠檬的头尾连线**），并从其中的一半中切取一片柠檬备用",
      "再次将柠檬对半切，将得到的 4 角柠檬用压汁器压出柠檬汁置于容器中备用",
      "将挤压过的柠檬置于容器中备用",
      "选择一个杯子，建议使用容量在大约 1 升的大型玻璃杯或铁皮酒桶",
      "将冰块和挤压过的柠檬入杯中（可根据个人喜好设计柠檬与冰块的摆放）",
      "倒入 15 毫升柠檬汁（如果喜酸可以加多点或全加）",
      "沿杯壁缓慢倒入可口可乐至距离杯口 3/4 处（控制可乐和威士忌的比例约在 5:1 ）",
      "倒入威士忌直至满杯"
    ],
    "prepTimeMin": 50,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "可乐桶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r奇异果菠菜特调",
    "name": "🥤 奇异果菠菜特调",
    "emoji": "🥤",
    "description": "奇异果菠菜特调，家常美味",
    "ingredients": [
      "原料:",
      "工具"
    ],
    "steps": [
      "将猕猴桃切成两半，每半再分四份小块",
      "将苹果切丁",
      "将菠菜叶去梗，只留叶子部分",
      "将菠菜切碎",
      "一起倒入榨汁机搅拌杯",
      "加入白砂糖",
      "启动搅拌机，搅拌约 4 个 15 秒（每 15 秒停下看状态）"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "奇异果菠菜特调的做法",
      "家常菜"
    ]
  },
  {
    "id": "r奶茶",
    "name": "🥛 奶茶",
    "emoji": "🥛",
    "description": "奶茶，家常美味",
    "ingredients": [
      "袋泡红茶（推荐立顿黄牌精选红茶）",
      "全脂奶粉或淡奶",
      "杯子，例如带刻度的杯子，陶瓷杯或保温杯"
    ],
    "steps": [
      "取袋泡红茶 2 包放入杯中，加入 180-200mL **沸水**。",
      "**等待 20 - 30 分钟**。",
      "称取 11-12g 奶粉和 5-7g 砂糖，分别加入前一步骤得到的液体中。",
      "搅拌均匀即可饮用。"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "奶茶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r杨枝甘露",
    "name": "🥤 杨枝甘露",
    "emoji": "🥤",
    "description": "杨枝甘露，家常美味",
    "ingredients": [
      "杯子",
      "水果刀",
      "牛奶",
      "冰块",
      "调理机/果汁机"
    ],
    "steps": [
      "奇亚籽泡牛奶 10 分钟。",
      "泡籽之时，把半粒芒果、葡萄柚去皮切丁，放入杯中。",
      "半粒芒果切小块放入调理机加冰块、椰奶打成泥。",
      "倒入杯中，放上点缀材料（如有）。",
      "一边享用一边写代码！！"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "杨枝甘露的做法",
      "家常菜"
    ]
  },
  {
    "id": "r柠檬水",
    "name": "🥤 柠檬水",
    "emoji": "🥤",
    "description": "柠檬水，家常美味",
    "ingredients": [
      "原料",
      "工具"
    ],
    "steps": [
      "称 40~45 克柠檬，放入雪克杯中",
      "雪克杯盖盖子锤大约 10 次",
      "加入果蜜 40~45 克",
      "摇晃均匀",
      "最后根据喜好加冰"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "柠檬水的做法",
      "家常菜"
    ]
  },
  {
    "id": "r海边落日",
    "name": "🥤 海边落日",
    "emoji": "🥤",
    "description": "海边落日，家常美味",
    "ingredients": [
      "红石榴糖浆",
      "NFC 橙汁",
      "苏打水",
      "白朗姆",
      "蓝橙力娇酒",
      "柠檬汁",
      "冰块",
      "柠檬",
      "大号的玻璃杯",
      "搅拌棒",
      "量酒器",
      "调酒杯",
      "吸管",
      "水果刀"
    ],
    "steps": [
      "柠檬洗净切出一片",
      "选择一个杯子，建议使用容量在 350~400 毫升的透明玻璃杯",
      "放入大冰块，用搅拌棒搅拌冰杯",
      "加入红石榴糖浆",
      "让橙汁沿搅拌棒导入酒杯，到就被一半就行",
      "轻轻搅拌半圈",
      "倒入苏打水",
      "拿出调酒杯，加入白朗姆 + 蓝橙力娇酒 + 柠檬汁 + 冰块。然后 shake，shake",
      "轻轻倒入酒杯中",
      "插上柠檬和吸管"
    ],
    "prepTimeMin": 60,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "海边落日的做法",
      "家常菜"
    ]
  },
  {
    "id": "r牛油果拉西",
    "name": "🐮 牛油果拉西",
    "emoji": "🐮",
    "description": "牛油果拉西，家常美味",
    "ingredients": [
      "原味酸奶 (Plain yogurt)",
      "熟透的牛油果",
      "蜂蜜",
      "冷牛奶",
      "小豆蔻粉（可选）",
      "薄荷叶或坚果碎（可选，用于装饰）",
      "搅拌机（破壁机/榨汁机）"
    ],
    "steps": [
      "将牛油果对半切开，去核，剥去外皮，将果肉切成小块备用。",
      "在搅拌机中加入 120ml 原味酸奶、切好的牛油果块、1 汤匙蜂蜜以及 60ml 冷牛奶。",
      "（可选）加入一小撮小豆蔻粉以增加独特风味。",
      "启动搅拌机，**搅拌大约 1 分钟**直至液体变得完全顺滑和浓郁。",
      "将打好的饮品倒入杯中。",
      "（可选）在表面放上几片薄荷叶或撒上 5g 切碎的坚果作为装饰。"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "牛油果拉西的做法",
      "牛肉",
      "牛",
      "家常菜"
    ]
  },
  {
    "id": "r百香果橙子特调",
    "name": "🥤 百香果橙子特调",
    "emoji": "🥤",
    "description": "百香果橙子特调，家常美味",
    "ingredients": [
      "原料:",
      "工具"
    ],
    "steps": [
      "百香果腌制（因为量小不好配置，这里是两次的分量）",
      "茉莉绿茶调配（推荐比例=>茶 : 水 : 冰 = 1~2 : 50 : 30）",
      "橙子的处理（可在泡茶期间处理）",
      "正式调配"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "百香果橙子特调的做法",
      "家常菜"
    ]
  },
  {
    "id": "r砂糖椰子冰沙",
    "name": "🥤 砂糖椰子冰沙",
    "emoji": "🥤",
    "description": "砂糖椰子冰沙，家常美味",
    "ingredients": [
      "瓶装椰汁（瓶口较大为佳）",
      "咖啡调糖（黄色粗粒）"
    ],
    "steps": [
      "500ml 瓶装椰汁倒掉 200ml，立刻拧紧瓶盖。",
      "将这瓶椰汁放入冰箱冷冻区并冷冻 10 小时以上。",
      "将这瓶椰汁取出，若确认瓶中椰汁已彻底冻结，则在墙角、椅背、桌角等坚硬表面上用力抽打。（请务必确认表面不会因此受到损伤）",
      "当抽打到冻结椰汁变成冰沙状态，打开瓶盖倒出冰沙。",
      "在冰沙表面均匀撒上咖啡调糖或坚果碎。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "砂糖椰子冰沙的做法",
      "家常菜"
    ]
  },
  {
    "id": "r耙耙柑茶",
    "name": "🍵 耙耙柑茶",
    "emoji": "🍵",
    "description": "耙耙柑茶，家常美味",
    "ingredients": [
      "原料:",
      "工具"
    ],
    "steps": [
      "茉莉绿茶调配（推荐比例=>茶 : 水 : 冰 = 1~2 : 50 : 30）",
      "正式调配"
    ],
    "prepTimeMin": 20,
    "difficulty": "easy",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "耙耙柑茶的做法",
      "家常菜"
    ]
  },
  {
    "id": "r菠萝咖啡特调",
    "name": "🥤 菠萝咖啡特调",
    "emoji": "🥤",
    "description": "菠萝咖啡特调，家常美味",
    "ingredients": [
      "咖啡液（推荐浓缩或者冷萃）",
      "菠萝汁（鲜榨或者 nfc）",
      "冰块",
      "苏打水",
      "奶油",
      "牛奶",
      "糖",
      "海盐（可选）",
      "朗姆酒 （可选）"
    ],
    "steps": [
      "杯子里依次加入冰块，咖啡液，菠萝汁和苏打水",
      "奶油加糖打发至湿性发泡，加入朗姆酒和牛奶均匀只有流动性",
      "在第一部混合液上方倒入奶油",
      "奶油顶面撒上海盐"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "菠萝咖啡特调的做法",
      "家常菜"
    ]
  },
  {
    "id": "r酒酿醪糟",
    "name": "🥤 酒酿醪糟",
    "emoji": "🥤",
    "description": "酒酿醪糟，家常美味",
    "ingredients": [
      "糯米 800g（推荐使用圆糯米）",
      "安琪甜酒曲一包 (8g)（虽然按比例为每 1000g 糯米用 3g，但多放酒曲能提高成功概率）",
      "清水 720g + 600g（720 克用于蒸饭，后 500g 用于发酵）",
      "蒸锅（电饭煲即可）",
      "温度计（可选但推荐）",
      "干净密封玻璃或陶瓷容器 1 个"
    ],
    "steps": [
      "将 800g 糯米淘洗干净放入电饭煲，加入 720g 清水选择蒸饭模式",
      "蒸熟后将米饭倒出摊凉，使用干净的工具将其摊至 30°C （用温度计测量为宜，体感温热但不烫手）",
      "将 8g 安琪甜酒曲用 20ml 温水（约 30°C）化开，均匀撒在糯米饭中，同时翻拌均匀",
      "向糯米饭中加入 600g 清水帮助酒曲翻拌均匀。静置 2-3 分钟后发现糯米饭吸饱水分。这次加水可以让酒酿首次发酵便汤汁丰富",
      "用擀面杖在糯米饭中央挖一个小洞（便于出酒）",
      "将混合好的米饭装入干净容器中，轻轻压平表面，盖上盖子或保鲜膜密封好",
      "放置于 28 ～ 32°C 环境下发酵 24 ～ 48 小时。发酵期间不可剧烈摇晃或移动",
      "发酵成功标准为：中间凹槽有透明酒液渗出，整体略带酒香，无异味、不酸败",
      "发酵结束后可立即冷藏保存（过程中可以加入桂花），每次食用用干净工具取出，可冷藏保存 7 ～ 10 天",
      "可以继续二次发酵，加入 500ml 清水增加酒酿产量（800g 水以内即可）",
      "酒酿会一直持续发酵。如果想停止发酵，可以上锅蒸 10 分钟杀菌，或放入冰箱冷藏"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "酒酿醪糟的做法",
      "家常菜"
    ]
  },
  {
    "id": "r酸梅汤",
    "name": "🍲 酸梅汤",
    "emoji": "🍲",
    "description": "酸梅汤，家常美味",
    "ingredients": [
      "水",
      "乌枣",
      "乌梅",
      "山楂片（生）",
      "黄冰糖",
      "甘草",
      "陈皮",
      "红豆蔻",
      "干桂花"
    ],
    "steps": [
      "冲洗材料（干桂花和冰糖除外）， 1.5 升水常温浸泡两小时以上（干桂花和冰糖除外）",
      "开中大火煮沸，盖盖，转小火煮 40 分钟，为头煎",
      "将冰糖放入盆内，再将沥好用材的头汤趁热倒入，搅拌至冰糖融化。",
      "药材重新装回锅内再 600 毫升的水，开大火煮沸，盖盖，转中火，再煮 20 分钟为二煎",
      "最后将二煎和冰糖水趁热混合为成品。在成品 60-70℃加入干桂花（不要超过 80℃）加盖晾凉再放入冰箱冷藏 3 小时以上。",
      "饮用时记得将干桂花沥出。如饮茶般细啜，冰凉振齿，酸醒人、甜适度，滋味丰满而悠长"
    ],
    "prepTimeMin": 40,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "酸梅汤的做法",
      "家常菜"
    ]
  },
  {
    "id": "r酸梅汤（半成品加",
    "name": "🍲 酸梅汤（半成品加工）",
    "emoji": "🍲",
    "description": "酸梅汤（半成品加工），家常美味",
    "ingredients": [
      "酸梅晶固体饮料",
      "方糖（可选）",
      "北京二锅头酒（可选）"
    ],
    "steps": [
      "取饮用水 1177 克。",
      "放入酸梅晶固体饮料 60 克，使用汤匙顺时针搅拌 50 圈。",
      "再放入剩下 60 克酸梅晶固体饮料，再次使用汤匙顺时针搅拌 50 圈。",
      "放入 9 克的方糖，使用汤匙顺时针搅拌 100 圈。",
      "放入北京二锅头酒 48 克，用汤匙顺时针搅拌 30 圈。"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "酸梅汤（半成品加工）的做法",
      "家常菜"
    ]
  },
  {
    "id": "r金汤力",
    "name": "🍲 金汤力",
    "emoji": "🍲",
    "description": "金汤力，家常美味",
    "ingredients": [
      "金酒",
      "汤力水气泡水",
      "柠檬",
      "冰块",
      "新鲜绿叶（可选，装饰用）",
      "手动压汁器"
    ],
    "steps": [
      "将柠檬对半切（**刀方向垂直于柠檬的头尾连线**），并从其中的一半中切取一片柠檬备用",
      "再次将柠檬对半切，将得到的 4 角柠檬用压汁器压出柠檬汁置于容器中备用",
      "选择一个杯子，建议使用容量在 350~400 毫升的透明玻璃杯",
      "将 100 克冰块放置在杯底",
      "倒入 30~40 毫升金酒",
      "倒入 15 毫升柠檬汁（如果喜酸可以加多点或全加）",
      "用勺子搅拌均匀",
      "将之前准备的一片柠檬放置好",
      "缓慢沿杯壁注入汤力水直至满杯（不要倒在冰上，避免起泡流失）",
      "用勺子轻轻上下提拉将液体搅拌均匀（不要旋转搅拌，避免起泡流失）",
      "在液面放置好装饰用的绿叶（可选）"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "金汤力的做法",
      "家常菜"
    ]
  },
  {
    "id": "r金菲士",
    "name": "🥤 金菲士",
    "emoji": "🥤",
    "description": "金菲士，家常美味",
    "ingredients": [
      "金酒",
      "苏打气泡水",
      "柠檬",
      "冰块",
      "新鲜绿叶（可选，装饰用）",
      "手动压汁器",
      "雪克瓶（可选）"
    ],
    "steps": [
      "将柠檬对半切（**刀方向垂直于柠檬的头尾连线**），并从其中的一半中切取一片柠檬备用",
      "再次将柠檬对半切，将得到的 4 角柠檬用压汁器压出柠檬汁置于容器中备用",
      "选择一个杯子，建议使用容量在 350~400 毫升的透明玻璃杯",
      "将 100 克冰块放置在杯底",
      "倒入 30~40 毫升金酒",
      "倒入 20 毫升柠檬汁（如果喜酸可以加多点或全加）",
      "倒入 30~40 克蔗糖糖浆",
      "用勺子搅拌均匀",
      "将之前准备的一片柠檬放置好",
      "缓慢沿杯壁注入苏打气泡水直至满杯（不要倒在冰上，避免起泡流失）",
      "用勺子轻轻上下提拉将液体搅拌均匀（不要旋转搅拌，避免起泡流失）",
      "在液面放置好装饰用的绿叶（可选）",
      "将冰块、金酒、柠檬汁、蔗糖糖浆倒入雪克瓶，雪克均匀",
      "将充分雪克的产物倒到杯子中（如果里面的冰太碎了，可以选择过滤其中的冰，重新往杯中补充冰块）"
    ],
    "prepTimeMin": 80,
    "difficulty": "hard",
    "tags": [
      "sweet",
      "snack",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn"
    ],
    "takeoutKeywords": [
      "金菲士的做法",
      "家常菜"
    ]
  },
  {
    "id": "r油泼辣子",
    "name": "🧂 油泼辣子",
    "emoji": "🧂",
    "description": "油泼辣子，家常美味",
    "ingredients": [
      "蒜头",
      "干辣椒面",
      "盐",
      "熟白芝麻",
      "小米椒",
      "花生油（可用菜籽油替换）",
      "家庭小陶瓷碗",
      "家庭铁勺子",
      "五香粉 （可选）",
      "草寇（可选）",
      "小葱 （可选）",
      "八角",
      "花椒",
      "香叶",
      "白芷",
      "姜片（可选）",
      "糖",
      "白醋"
    ],
    "steps": [
      "拿出蒜头掰 2 个`小蒜头`去皮",
      "拿出砧板剁碎`小蒜头`、`小米椒`",
      "拿出碗倒入`花生油`",
      "油热放入`其他配料`和`小葱`,等到香料变焦，捞出扔掉",
      "拿出铁锅将碗内的油放入加热 2 分钟（菜籽油烧至冒烟）",
      "此时是空碗",
      "往空碗加入`干辣椒面`、`白芝麻`、`蒜末`、`小米椒`、`盐`、`五香粉`、`草寇`作为\"调料\"",
      "关火将油温冷却至 `210` 摄氏度",
      "将锅内热油倒入碗内并用勺子搅拌即可（可以在 `165` 摄氏度时加入同样\"调料\"的碗最后进行混合进行增辣）",
      "倒入热油稍微搅拌后放入白醋，此时会重新沸腾。继续进行搅拌，白醋增香。",
      "油泼辣子冷却到温热放白糖和味精，白糖可以是辣味柔和，不会那么的呛口"
    ],
    "prepTimeMin": 65,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "油泼辣子的做法",
      "家常菜"
    ]
  },
  {
    "id": "r油酥",
    "name": "🧂 油酥",
    "emoji": "🧂",
    "description": "油酥，家常美味",
    "ingredients": [
      "面粉",
      "油",
      "盐"
    ],
    "steps": [
      "面粉盛小碗里，加入盐",
      "加入 200 度的热油",
      "用筷子将其搅拌成无固状物体的糊状。"
    ],
    "prepTimeMin": 25,
    "difficulty": "easy",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "油酥的做法",
      "家常菜"
    ]
  },
  {
    "id": "r简易版炒糖色",
    "name": "🧂 简易版炒糖色",
    "emoji": "🧂",
    "description": "简易版炒糖色，家常美味",
    "ingredients": [
      "糖（任选其一）：",
      "炒糖色过程火不要太大！！！电磁炉温度不够，火候过了发苦，不够发甜"
    ],
    "steps": [
      "开火，并向锅中倒入 100ml 开水",
      "再向锅中倒入 100ml 油，与第一步间隔越短越好，此时锅为大火中火都可以，着急的话可以大火",
      "放入冰糖（如果冰糖过于耦合，可以提前敲碎，做到耦合度越低越好）",
      "调整火力为中火",
      "开始搅拌"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "简易版炒糖色的做法",
      "家常菜"
    ]
  },
  {
    "id": "r糖醋汁",
    "name": "🧂 糖醋汁",
    "emoji": "🧂",
    "description": "糖醋汁，家常美味",
    "ingredients": [
      "清水",
      "白糖",
      "白醋/米醋",
      "料酒",
      "生抽"
    ],
    "steps": [
      "按照比例将各调料在小碗中搅拌均匀",
      "按不同菜肴的方式处理完毕后，将配制好的糖醋汁倒入锅中",
      "根据各菜肴的不同，烹制 5-10 分钟",
      "大火收汁，可增加菜的浓度、香味和光泽"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "糖醋汁的做法",
      "家常菜"
    ]
  },
  {
    "id": "r草莓酱",
    "name": "🧂 草莓酱",
    "emoji": "🧂",
    "description": "草莓酱，家常美味",
    "ingredients": [
      "草莓",
      "白砂糖",
      "保鲜膜"
    ],
    "steps": [
      "草莓洗净去叶",
      "将草莓切碎放入合适的碗中",
      "将白糖倒入碗中与草莓搅拌均匀",
      "碗用保鲜膜覆盖静置 1 小时",
      "将静置的草莓和糖的混合物倒入不粘锅中开大火烧开",
      "烧开后转小火不断搅拌直至果酱呈粘稠状关火",
      "待草莓酱冷却后装入准备好的密封罐中"
    ],
    "prepTimeMin": 45,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "草莓酱的做法",
      "家常菜"
    ]
  },
  {
    "id": "r葱油",
    "name": "🧂 葱油",
    "emoji": "🧂",
    "description": "葱油，家常美味",
    "ingredients": [
      "油",
      "葱（大葱小葱都可以）",
      "姜",
      "洋葱",
      "料酒",
      "香菜（可选）",
      "开洋（可选）"
    ],
    "steps": [
      "开洋泡入 50 度温水中，加入 10ml 料酒去腥，泡 10 分钟后取出沥干水分",
      "葱，香菜洗净，切成 5cm 长的段，擦干表面水份",
      "洋葱切成丝，在锅里用热水煮 5 分钟，取出沥干水份",
      "姜去皮，切成片",
      "锅里倒入全部油，放入上述预处理好的材料，开中小火炸 20 分钟"
    ],
    "prepTimeMin": 35,
    "difficulty": "medium",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "葱油的做法",
      "家常菜"
    ]
  },
  {
    "id": "r蒜香酱油",
    "name": "🧂 蒜香酱油",
    "emoji": "🧂",
    "description": "蒜香酱油，家常美味",
    "ingredients": [
      "蒜头",
      "白芝麻",
      "花生油",
      "酱油",
      "蘸料碟"
    ],
    "steps": [
      "拍碎蒜头",
      "往蘸料碟中加入酱油",
      "起锅，加入花生油，等到油温滚烫后加入拍好的蒜头，炸半分钟",
      "半分钟后，关火，把热油倒入蘸料碟，用筷子搅拌即可"
    ],
    "prepTimeMin": 30,
    "difficulty": "easy",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "蒜香酱油的做法",
      "家常菜"
    ]
  },
  {
    "id": "r蔗糖糖浆",
    "name": "🧂 蔗糖糖浆",
    "emoji": "🧂",
    "description": "蔗糖糖浆，家常美味",
    "ingredients": [
      "白砂糖",
      "水",
      "可密封容器（建议使用高硼硅试剂瓶，便宜）"
    ],
    "steps": [
      "将称好的白砂糖的饮用水于容器混匀",
      "容器封盖放冰箱冷藏"
    ],
    "prepTimeMin": 20,
    "difficulty": "easy",
    "tags": [
      "stir_fry",
      "meat",
      "hearty",
      "home_style",
      "lunch",
      "dinner",
      "universal",
      "warm_weather",
      "cool_weather",
      "spring",
      "autumn",
      "cold_weather",
      "rainy",
      "comfort_food",
      "winter"
    ],
    "takeoutKeywords": [
      "蔗糖糖浆的做法",
      "家常菜"
    ]
  }
];

  // Convert curated to runtime format
  function normalizeCurated() {
    return CURATED.map(r => ({
      id: r.id,
      name: (r.e || "🍽️") + " " + r.n,
      emoji: r.e || "🍽️",
      description: r.d,
      ingredients: r.ig,
      steps: r.st,
      prepTimeMin: r.tm,
      difficulty: r.df,
      tags: r.tg,
      takeoutKeywords: r.tk,
    }));
  }

  const RECIPES = [...normalizeCurated(), ...REAL_RECIPES];


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
    if (temp > 38) return 'hot';
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

    // Session-based variation: same session = same results, different session = different results
    if (context.session) score += hashString(recipe.id + context.session) % 11;
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
