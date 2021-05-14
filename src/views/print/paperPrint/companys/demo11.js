function printPDF(type,data,printId){
    LODOP.SET_PRINTER_INDEX(printId);
    LODOP.PRINT_INITA(10,10,762,400,'能源云票据打印');
    LODOP.ADD_PRINT_SHAPE(2,143,42,655,200,0,1,'#800000');
    LODOP.ADD_PRINT_SHAPE(1,172,44,654,1,0,1,'#800000');
    LODOP.ADD_PRINT_SHAPE(0,142,360,1,30,0,1,'#800000');
    LODOP.ADD_PRINT_SHAPE(1,307,44,653,1,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(24,185,408,30,userName);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',15);
    LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
    LODOP.SET_PRINT_STYLEA(0,'Bold',1);
    LODOP.ADD_PRINT_TEXT(59,320,100,25,'收据');
    LODOP.SET_PRINT_STYLEA(0,'FontSize',11);
    LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
    LODOP.SET_PRINT_STYLEA(0,'Bold',1);
    LODOP.ADD_PRINT_TEXT(116,42,72,20,'收费日期：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(148,365,71,20,'用户号：');
    LODOP.ADD_PRINT_TEXT(117,131,150,20,data.pay_time||''); 
    LODOP.ADD_PRINT_TEXT(148,50,72,20,'客户名称：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(147,139,214,20,data.user_name||'');
    LODOP.ADD_PRINT_TEXT(180,51,72,20,'用气地址：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(181,138,549,20,data.address_name);
    LODOP.ADD_PRINT_SHAPE(1,145,473,1,29,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(317,50,69,20,'备注：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
    LODOP.ADD_PRINT_TEXT(321,136,550,20,data.remark||'');
    LODOP.ADD_PRINT_TEXT(353,50,72,20,'开票日期：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(352,526,72,20,'收营员：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(352,598,100,20,data.staff_name||'');
    LODOP.ADD_PRINT_TEXT(352,137,199,20,data.print_time||'');
    LODOP.ADD_PRINT_TEXT(148,478,100,20,data.archives_no||'');
    LODOP.ADD_PRINT_SHAPE(0,207,42,655,1,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(213,49,75,20,'类型：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
    if (data.cost_type === null || data.cost_type === '' || data.cost_type === '11') {
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '气费')
    } else if(data.cost_type ==='21') {
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '清水费')
    }else if(data.cost_type ==='22'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '污水费')
    }else if(data.cost_type ==='91'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '垃圾费')
    }else if(data.cost_type ==='92'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '开户费')
    }else if(data.cost_type ==='93'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '过户费')
    }else if(data.cost_type ==='94'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, 'IC卡费')
    }else if(data.cost_type ==='95'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '安装费')
    }else if(data.cost_type ==='96'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '改装费')
    }else if(data.cost_type ==='97'){
      LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '维修费')
    };
    LODOP.ADD_PRINT_SHAPE(1,239,41,652,1,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(117,398,68,20,'流水号：');
    LODOP.ADD_PRINT_TEXT(248,52,67,20,'用气性质：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    if(data.user_type === 1){
      LODOP.ADD_PRINT_TEXT(247,139,100,20,'工商');
    }else{
      LODOP.ADD_PRINT_TEXT(247,139,100,20,'民用');
    };
    LODOP.ADD_PRINT_SHAPE(0,276,45,647,1,0,1,'#800000');
    LODOP.ADD_PRINT_SHAPE(0,275,357,1,33,0,1,'#800000');
    LODOP.ADD_PRINT_SHAPE(0,141,131,1,199,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(281,46,80,20,'购买金额：');
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_SHAPE(0,276,472,1,33,0,1,'#800000');
    LODOP.ADD_PRINT_TEXT(286,362,100,20,'大写：');
    LODOP.ADD_PRINT_TEXT(282,476,100,20,toUnName);
    LODOP.ADD_PRINT_TEXT(282,140,100,20,data.paid_amount||'');
    LODOP.ADD_PRINT_TEXT(119,477,220,20,data.cost_record_id||'');
    LODOP.ADD_PRINT_TEXT(248,360,110,20,'用气价格(元)：');
    LODOP.SET_PRINT_STYLEA(0,'FontSize',11);
    if(data.single_price){
      LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price);
    }else{
      LODOP.ADD_PRINT_TEXT(250,477,221,20,data.level_price);
    };
    if(type === 'pre'){
      LODOP.PRINT_SETUP();
    }else{
      LODOP.PRINT();
    };
}

function printPDF(type,data,printId){
    LODOP.SET_PRINTER_INDEX(printId);
    LODOP.PRINT_INITA(3,6,577,10000,'打印控件功能演示_Lodop功能_不同高度幅面');
    LODOP.SET_PRINT_PAGESIZE(3,1505,45,'');
    LODOP.ADD_PRINT_TEXT(22,160,276,28,'冠县瑞鑫天然气分公司');
    LODOP.SET_PRINT_STYLEA(0,'FontSize',18);
    LODOP.ADD_PRINT_TEXT(81,15,100,20,'用户编号：');
    LODOP.ADD_PRINT_TEXT(80,130,416,20,data.archives_no||'');
    LODOP.ADD_PRINT_TEXT(113,16,100,20,'用户姓名：');
    LODOP.ADD_PRINT_TEXT(112,131,416,20,data.user_name||'');
    LODOP.ADD_PRINT_TEXT(143,14,100,20,'用户地址：');
    LODOP.ADD_PRINT_TEXT(141,132,415,20,data.address_name||'');
    LODOP.ADD_PRINT_TEXT(175,15,101,20,'购气单价：');
    if(data.single_price){
      LODOP.ADD_PRINT_TEXT(176,131,418,20,data.single_price);
    }else{
      LODOP.ADD_PRINT_TEXT(176,131,418,20,data.level_price);
    };
    if(data.last_buy_quantity){
      LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值气量：');
      LODOP.ADD_PRINT_TEXT(209,132,415,20,data.last_buy_quantity||'');
    }else{
      LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值金额：');
      LODOP.ADD_PRINT_TEXT(209,132,415,20,data.paid_amount||'');
    };
    LODOP.ADD_PRINT_TEXT(243,12,100,20,'充值日期：');
    LODOP.ADD_PRINT_TEXT(243,129,414,20,data.pay_time||'');
    LODOP.ADD_PRINT_TEXT(280,12,100,20,'用户电话：');
    LODOP.ADD_PRINT_TEXT(281,129,416,20,data.user_mobile||'');
    LODOP.ADD_PRINT_TEXT(315,12,100,20,'用户类型：');
     if(data.user_type == 1){
      LODOP.ADD_PRINT_TEXT(316,126,415,20,'工商');
    }else{
      LODOP.ADD_PRINT_TEXT(316,126,415,20,'民用');
    };
    LODOP.ADD_PRINT_TEXT(354,13,100,20,'表具条码：');
    LODOP.ADD_PRINT_TEXT(355,128,418,20,data.meter_no||'');
    LODOP.ADD_PRINT_TEXT(388,11,100,20,'收费员：');
    LODOP.ADD_PRINT_TEXT(389,130,416,20,data.staff_name||'');
    LODOP.ADD_PRINT_TEXT(424,11,100,20,'燃气公司电话：');
    LODOP.ADD_PRINT_TEXT(419,126,418,20,'');
    LODOP.ADD_PRINT_RECT(-1,0,574,534,0,3);
    if(type === 'pre'){
      LODOP.PRINT_SETUP();
    }else{
      LODOP.PRINT();
    };
}
// 3536
function printPDF(type,data,printId){LODOP.SET_PRINTER_INDEX(printId);LODOP.PRINT_INITA(3,6,577,10000,'打印控件功能演示_Lodop功能_不同高度幅面');LODOP.SET_PRINT_PAGESIZE(3,1505,45,'');LODOP.ADD_PRINT_TEXT(22,160,276,28,'3624_0-0-0-1租户天然气分公司');LODOP.SET_PRINT_STYLEA(0,'FontSize',18);LODOP.ADD_PRINT_TEXT(81,15,100,20,'用户编号：');LODOP.ADD_PRINT_TEXT(80,130,416,20,data.archives_no||'');LODOP.ADD_PRINT_TEXT(113,16,100,20,'用户姓名：');LODOP.ADD_PRINT_TEXT(112,131,416,20,data.user_name||'');LODOP.ADD_PRINT_TEXT(143,14,100,20,'用户地址：');LODOP.ADD_PRINT_TEXT(141,132,415,20,data.address_name||'');LODOP.ADD_PRINT_TEXT(175,15,101,20,'购气单价：');if(data.time_price){LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price+'|'+data.time_price);}else if(!data.time_price&&data.single_price){  LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price);}else{LODOP.ADD_PRINT_TEXT(176,131,418,20,data.level_price);};if(data.last_buy_quantity){LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值气量：');LODOP.ADD_PRINT_TEXT(209,132,415,20,data.last_buy_quantity||'');}else{LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值金额：');LODOP.ADD_PRINT_TEXT(209,132,415,20,data.paid_amount||'');};LODOP.ADD_PRINT_TEXT(243,12,100,20,'充值日期：');LODOP.ADD_PRINT_TEXT(243,129,414,20,data.pay_time||'');LODOP.ADD_PRINT_TEXT(280,12,100,20,'用户电话：');LODOP.ADD_PRINT_TEXT(281,129,416,20,data.user_mobile||'');LODOP.ADD_PRINT_TEXT(315,12,100,20,'用户类型：');if(data.user_type == 1){LODOP.ADD_PRINT_TEXT(316,126,415,20,'工商');}else{LODOP.ADD_PRINT_TEXT(316,126,415,20,'民用');}LODOP.ADD_PRINT_TEXT(354,13,100,20,'表具条码：');LODOP.ADD_PRINT_TEXT(355,128,418,20,data.meter_no||'');LODOP.ADD_PRINT_TEXT(388,11,100,20,'收费员：');LODOP.ADD_PRINT_TEXT(389,130,416,20,data.staff_name||'');LODOP.ADD_PRINT_TEXT(424,11,100,20,'燃气公司电话：');LODOP.ADD_PRINT_TEXT(419,126,418,20,'');LODOP.ADD_PRINT_RECT(-1,0,574,534,0,3);if(type === 'pre'){LODOP.PRINT_SETUP()}else{LODOP.PRINT();};}
//  3536  分公司
function printPDF(type,data,printId){LODOP.SET_PRINTER_INDEX(printId);LODOP.PRINT_INITA(3,6,577,10000,'打印控件功能演示_Lodop功能_不同高度幅面');LODOP.SET_PRINT_PAGESIZE(3,1505,45,'');LODOP.ADD_PRINT_TEXT(22,160,276,28,'冠县瑞鑫天然气分公司');LODOP.SET_PRINT_STYLEA(0,'FontSize',18);LODOP.ADD_PRINT_TEXT(81,15,100,20,'用户编号：');LODOP.ADD_PRINT_TEXT(80,130,416,20,data.archives_no||'');LODOP.ADD_PRINT_TEXT(113,16,100,20,'用户姓名：');LODOP.ADD_PRINT_TEXT(112,131,416,20,data.user_name||'');LODOP.ADD_PRINT_TEXT(143,14,100,20,'用户地址：');LODOP.ADD_PRINT_TEXT(141,132,415,20,data.address_name||'');LODOP.ADD_PRINT_TEXT(175,15,101,20,'购气单价：');if(data.time_price){LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price+'|'+data.time_price);}else if(!data.time_price&&data.single_price){  LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price);}else{LODOP.ADD_PRINT_TEXT(176,131,418,20,data.level_price);};if(data.last_buy_quantity){LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值气量：');LODOP.ADD_PRINT_TEXT(209,132,415,20,data.last_buy_quantity||'');}else{LODOP.ADD_PRINT_TEXT(211,13,100,20,'充值金额：');LODOP.ADD_PRINT_TEXT(209,132,415,20,data.paid_amount||'');};LODOP.ADD_PRINT_TEXT(243,12,100,20,'充值日期：');LODOP.ADD_PRINT_TEXT(243,129,414,20,data.pay_time||'');LODOP.ADD_PRINT_TEXT(280,12,100,20,'用户电话：');LODOP.ADD_PRINT_TEXT(281,129,416,20,data.user_mobile||'');LODOP.ADD_PRINT_TEXT(315,12,100,20,'用户类型：');if(data.user_type == 1){LODOP.ADD_PRINT_TEXT(316,126,415,20,'工商');}else{LODOP.ADD_PRINT_TEXT(316,126,415,20,'民用');}LODOP.ADD_PRINT_TEXT(354,13,100,20,'表具条码：');LODOP.ADD_PRINT_TEXT(355,128,418,20,data.meter_no||'');LODOP.ADD_PRINT_TEXT(388,11,100,20,'收费员：');LODOP.ADD_PRINT_TEXT(389,130,416,20,data.staff_name||'');LODOP.ADD_PRINT_TEXT(424,11,100,20,'燃气公司电话：');LODOP.ADD_PRINT_TEXT(419,126,418,20,'');LODOP.ADD_PRINT_RECT(-1,0,574,534,0,3);if(type === 'pre'){LODOP.PRINT_SETUP()}else{LODOP.PRINT();};}
// 默认模板
function printPDF(type,data,printId){LODOP.SET_PRINTER_INDEX(printId);LODOP.PRINT_INITA(10,10,762,400,'能源云票据打印');LODOP.ADD_PRINT_SHAPE(2,143,42,655,200,0,1,'#800000');LODOP.ADD_PRINT_SHAPE(1,172,44,654,1,0,1,'#800000');LODOP.ADD_PRINT_SHAPE(0,142,360,1,30,0,1,'#800000');LODOP.ADD_PRINT_SHAPE(1,307,44,653,1,0,1,'#800000');LODOP.ADD_PRINT_TEXT(14,184,408,30,userName);LODOP.SET_PRINT_STYLEA(0,'FontSize',15);LODOP.SET_PRINT_STYLEA(0,'Alignment',2);LODOP.SET_PRINT_STYLEA(0,'Bold',1);LODOP.ADD_PRINT_TEXT(59,320,100,25,'收据');LODOP.SET_PRINT_STYLEA(0,'FontSize',11);LODOP.SET_PRINT_STYLEA(0,'Alignment',2);LODOP.SET_PRINT_STYLEA(0,'Bold',1);LODOP.ADD_PRINT_TEXT(116,42,72,20,'收费日期：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_TEXT(148,365,71,20,'用户号：');LODOP.ADD_PRINT_TEXT(117,131,150,20,data.pay_time||'');LODOP.ADD_PRINT_TEXT(148,50,72,20,'客户名称：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_TEXT(147,139,214,20,data.user_name||'');LODOP.ADD_PRINT_TEXT(180,51,72,20,'用气地址：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_TEXT(181,138,549,20,data.address_name);LODOP.ADD_PRINT_SHAPE(1,145,473,1,29,0,1,'#800000');LODOP.ADD_PRINT_TEXT(317,50,69,20,'备注：');LODOP.SET_PRINT_STYLEA(0,'Alignment',2);LODOP.ADD_PRINT_TEXT(321,136,550,20,data.remark||'');LODOP.ADD_PRINT_TEXT(353,50,72,20,'开票日期：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_TEXT(352,526,72,20,'收营员：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_TEXT(352,598,100,20,data.staff_name||'');LODOP.ADD_PRINT_TEXT(352,137,199,20,data.print_time||'');LODOP.ADD_PRINT_TEXT(148,478,100,20,data.archives_no||'');LODOP.ADD_PRINT_SHAPE(0,207,42,655,1,0,1,'#800000');LODOP.ADD_PRINT_TEXT(213,49,75,20,'类型：');LODOP.SET_PRINT_STYLEA(0,'Alignment',2);if (data.cost_type === null || data.cost_type === '' || data.cost_type === '11') {LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '气费')} else if(data.cost_type ==='21') {LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '清水费')}else if(data.cost_type ==='22'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '污水费')}else if(data.cost_type ==='91'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '垃圾费')}else if(data.cost_type ==='92'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '开户费')}else if(data.cost_type ==='93'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '过户费')}else if(data.cost_type ==='94'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, 'IC卡费')}else if(data.cost_type ==='95'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '安装费')}else if(data.cost_type ==='96'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '改装费')}else if(data.cost_type ==='97'){LODOP.ADD_PRINT_TEXT(215, 138, 550, 20, '维修费')};LODOP.ADD_PRINT_SHAPE(1,239,41,652,1,0,1,'#800000');LODOP.ADD_PRINT_TEXT(117,398,68,20,'流水号：');LODOP.ADD_PRINT_TEXT(248,56,73,20,'用气性质：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);if(data.user_type === 1){LODOP.ADD_PRINT_TEXT(247,139,100,20,'工商');}else{LODOP.ADD_PRINT_TEXT(247,139,100,20,'民用');};LODOP.ADD_PRINT_SHAPE(0,276,45,647,1,0,1,'#800000');LODOP.ADD_PRINT_SHAPE(0,275,357,1,33,0,1,'#800000');LODOP.ADD_PRINT_SHAPE(0,141,131,1,199,0,1,'#800000');LODOP.ADD_PRINT_TEXT(282,46,70,20,'购买金额：');LODOP.SET_PRINT_STYLEA(0,'Alignment',3);LODOP.ADD_PRINT_SHAPE(0,276,472,1,33,0,1,'#800000');LODOP.ADD_PRINT_TEXT(286,362,100,20,'大写：');LODOP.ADD_PRINT_TEXT(282,476,100,20,toUnName);LODOP.ADD_PRINT_TEXT(282,140,100,20,data.paid_amount||'');LODOP.ADD_PRINT_TEXT(119,477,220,20,data.cost_record_id||'');LODOP.ADD_PRINT_TEXT(248,360,110,20,'用气价格(元)：');LODOP.SET_PRINT_STYLEA(0,'FontSize',11);if(data.time_price){LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price+'|'+data.time_price);}else if(!data.time_price&&data.single_price){LODOP.ADD_PRINT_TEXT(250,477,221,20,data.single_price);}else{LODOP.ADD_PRINT_TEXT(250,477,221,20,data.level_price);};if(type === 'pre'){LODOP.PRINT_SETUP();}else{LODOP.PRINT();};}
// reissue
function printPDF(type,data,printId){LODOP.SET_PRINTER_INDEX(printId||0);LODOP.PRINT_INITA(10,10,762,400,'能源云票据打印');        LODOP.ADD_PRINT_SHAPE(2,143,42,655,200,0,1,'#800000');        LODOP.ADD_PRINT_SHAPE(1,172,44,654,1,0,1,'#800000');        LODOP.ADD_PRINT_SHAPE(0,142,360,1,30,0,1,'#800000');        LODOP.ADD_PRINT_SHAPE(1,307,44,653,1,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(14,182,408,30,userName);        LODOP.SET_PRINT_STYLEA(0,'FontSize',15);        LODOP.SET_PRINT_STYLEA(0,'Alignment',2);        LODOP.SET_PRINT_STYLEA(0,'Bold',1);        LODOP.ADD_PRINT_TEXT(59,320,100,25,'收据');        LODOP.SET_PRINT_STYLEA(0,'FontSize',11);        LODOP.SET_PRINT_STYLEA(0,'Alignment',2);        LODOP.SET_PRINT_STYLEA(0,'Bold',1);        LODOP.ADD_PRINT_TEXT(116,42,72,20,'收费日期：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_TEXT(148,365,71,20,'用户号：');        LODOP.ADD_PRINT_TEXT(117,131,150,20,data.pay_time||'');        LODOP.ADD_PRINT_TEXT(148,50,72,20,'客户名称：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_TEXT(147,139,214,20,data.user_name||'');        LODOP.ADD_PRINT_TEXT(180,51,72,20,'用气地址：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_TEXT(181,138,549,20,data.address_name||'');        LODOP.ADD_PRINT_SHAPE(1,145,473,1,29,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(317,50,69,20,'备注：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',2);        LODOP.ADD_PRINT_TEXT(321,136,550,20,data.remark||'');        LODOP.ADD_PRINT_TEXT(353,50,72,20,'开票日期：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_TEXT(352,526,72,20,'收营员：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_TEXT(352,598,100,20,data.staff_name||'');        LODOP.ADD_PRINT_TEXT(352,137,199,20,data.print_time||'');        LODOP.ADD_PRINT_TEXT(148,478,100,20,data.archives_no||'');        LODOP.ADD_PRINT_SHAPE(0,207,42,655,1,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(213,49,75,20,'类型：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',2);        LODOP.ADD_PRINT_TEXT(215,138,550,20,'补气');        LODOP.ADD_PRINT_SHAPE(1,239,41,652,1,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(117,414,58,20,'流水号：');        LODOP.ADD_PRINT_TEXT(248,56,73,20,'用气性质：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        if (data.user_type == 1) {LODOP.ADD_PRINT_TEXT(247, 139, 100, 20, '工商');} else if (data.user_type == 2) {LODOP.ADD_PRINT_TEXT(247, 139, 100, 20, '民用');};        LODOP.ADD_PRINT_SHAPE(0,276,45,647,1,0,1,'#800000');        LODOP.ADD_PRINT_SHAPE(0,275,357,1,33,0,1,'#800000');        LODOP.ADD_PRINT_SHAPE(0,141,131,1,199,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(282,46,70,20,'购买金额：');        LODOP.SET_PRINT_STYLEA(0,'Alignment',3);        LODOP.ADD_PRINT_SHAPE(0,276,472,1,33,0,1,'#800000');        LODOP.ADD_PRINT_TEXT(286,362,100,20,'大写：');        LODOP.ADD_PRINT_TEXT(282,476,100,20,toUnName);        LODOP.ADD_PRINT_TEXT(282,140,100,20,data.paid_amount||'');        LODOP.ADD_PRINT_TEXT(119,477,220,20,data.cost_record_id);if(type === 'pre'){LODOP.PRINT_SETUP()}else{LODOP.PRINT();};}




