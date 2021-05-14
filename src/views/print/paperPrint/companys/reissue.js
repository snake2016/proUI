import { getLodop } from "@/api/LodopFuncs";
let amountLtoU = function (n) {
  var fraction = ['角', '分'];
  var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
  ];
  var IsNum = Number(n);
  if (!isNaN(IsNum)) {
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
          s += (digit[Math.floor(n * 100/10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
          var p = '';
          for (var j = 0; j < unit[1].length && n > 0; j++) {
              p = digit[n % 10] + unit[1][j] + p;
              n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整');
  }
  else {
      return "";
  }

};

function printPDF(type,data,printId){
	let LODOP = getLodop();
	let userName = JSON.parse(localStorage.getItem("vuejs__userNameComp")).value||'金卡云';
    LODOP.SET_PRINTER_INDEX(printId||0)
    LODOP.PRINT_INITA(10,10,762,400,"能源云票据打印");
	LODOP.ADD_PRINT_SHAPE(2,143,42,655,200,0,1,"#800000");
	LODOP.ADD_PRINT_SHAPE(1,172,44,654,1,0,1,"#800000");
	LODOP.ADD_PRINT_SHAPE(0,142,360,1,30,0,1,"#800000");
	LODOP.ADD_PRINT_SHAPE(1,307,44,653,1,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(24,185,408,30,userName);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(59,320,100,25,"收据");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(116,42,72,20,"收费日期：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(148,365,71,20,"用户号：");
	LODOP.ADD_PRINT_TEXT(117,131,150,20,data.pay_time||'');
	LODOP.ADD_PRINT_TEXT(148,50,72,20,"客户名称：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(147,139,214,20,data.user_name||'');
	LODOP.ADD_PRINT_TEXT(180,51,72,20,"用气地址：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(181,138,549,20,data.address_name||'');
	LODOP.ADD_PRINT_SHAPE(1,145,473,1,29,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(317,50,69,20,"备注：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.ADD_PRINT_TEXT(321,136,550,20,data.remark||'');
	LODOP.ADD_PRINT_TEXT(353,50,72,20,"开票日期：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(352,526,72,20,"收营员：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_TEXT(352,598,100,20,data.staff_name||'');
	LODOP.ADD_PRINT_TEXT(352,137,199,20,data.print_time||'');
	LODOP.ADD_PRINT_TEXT(148,478,100,20,data.archives_no||'');
	LODOP.ADD_PRINT_SHAPE(0,207,42,655,1,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(213,49,75,20,"类型：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.ADD_PRINT_TEXT(215,138,550,20,"补气");
	LODOP.ADD_PRINT_SHAPE(1,239,41,652,1,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(117,414,58,20,"流水号：");
	LODOP.ADD_PRINT_TEXT(246,48,79,20,"用气性质：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	if (data.user_type == 1) {
      LODOP.ADD_PRINT_TEXT(247, 139, 100, 20, "工商");
    } else if (data.user_type == 2) {
      LODOP.ADD_PRINT_TEXT(247, 139, 100, 20, "民用");
    }
	LODOP.ADD_PRINT_SHAPE(0,276,45,647,1,0,1,"#800000");
	LODOP.ADD_PRINT_SHAPE(0,275,357,1,33,0,1,"#800000");
	LODOP.ADD_PRINT_SHAPE(0,141,131,1,199,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(281,46,80,20,"购买金额：");
	LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
	LODOP.ADD_PRINT_SHAPE(0,276,472,1,33,0,1,"#800000");
	LODOP.ADD_PRINT_TEXT(286,362,100,20,"大写：");
	LODOP.ADD_PRINT_TEXT(282,476,100,20,amountLtoU(data.paid_amount||0));
	LODOP.ADD_PRINT_TEXT(282,140,100,20,data.paid_amount||'');
	LODOP.ADD_PRINT_TEXT(119,477,220,20,data.cost_record_id);
    if(type === 'pre'){
      LODOP.PRINT_SETUP()
    }else{
      LODOP.PRINT();
    }
}
export default printPDF