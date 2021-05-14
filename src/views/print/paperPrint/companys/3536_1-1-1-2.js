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
    let userName = JSON.parse(localStorage.getItem("vuejs__companyName")).value||'金卡云';
    LODOP.SET_PRINTER_INDEX(printId);
    LODOP.PRINT_INITA(3,6,577,10000,"打印控件功能演示_Lodop功能_不同高度幅面");
    LODOP.SET_PRINT_PAGESIZE(3,1505,45,"");
    LODOP.ADD_PRINT_TEXT(22,160,276,28,"冠县瑞鑫天然气分公司");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",18);
    LODOP.ADD_PRINT_TEXT(81,15,100,20,"用户编号：");
    LODOP.ADD_PRINT_TEXT(80,130,416,20,data.archives_no||'');
    LODOP.ADD_PRINT_TEXT(113,16,100,20,"用户姓名：");
    LODOP.ADD_PRINT_TEXT(112,131,416,20,data.user_name||'');
    LODOP.ADD_PRINT_TEXT(143,14,100,20,"用户地址：");
    LODOP.ADD_PRINT_TEXT(141,132,415,20,data.address_name||'');
    LODOP.ADD_PRINT_TEXT(175,15,101,20,"购气单价：");
    if(data.single_price){
      LODOP.ADD_PRINT_TEXT(176,131,418,20,data.single_price);
    }else{
      LODOP.ADD_PRINT_TEXT(176,131,418,20,data.level_price);
    }
    if(data.last_buy_quantity){
      LODOP.ADD_PRINT_TEXT(211,13,100,20,"充值气量：");
      LODOP.ADD_PRINT_TEXT(209,132,415,20,data.last_buy_quantity||'');
    }else{
      LODOP.ADD_PRINT_TEXT(211,13,100,20,"充值金额：");
      LODOP.ADD_PRINT_TEXT(209,132,415,20,data.paid_amount||'');
    }
    LODOP.ADD_PRINT_TEXT(243,12,100,20,"充值日期：");
    LODOP.ADD_PRINT_TEXT(243,129,414,20,data.pay_time||'');
    LODOP.ADD_PRINT_TEXT(280,12,100,20,"用户电话：");
    LODOP.ADD_PRINT_TEXT(281,129,416,20,data.user_mobile||'');
    LODOP.ADD_PRINT_TEXT(315,12,100,20,"用户类型：");
     if(data.user_type == 1){
      LODOP.ADD_PRINT_TEXT(316,126,415,20,"工商");
    }else{
      LODOP.ADD_PRINT_TEXT(316,126,415,20,"民用");
    }
    LODOP.ADD_PRINT_TEXT(354,13,100,20,"表具条码：");
    LODOP.ADD_PRINT_TEXT(355,128,418,20,data.meter_no||"");
    LODOP.ADD_PRINT_TEXT(388,11,100,20,"收费员：");
    LODOP.ADD_PRINT_TEXT(389,130,416,20,data.staff_name||'');
    LODOP.ADD_PRINT_TEXT(424,11,100,20,"燃气公司电话：");
    LODOP.ADD_PRINT_TEXT(419,126,418,20,'');
    LODOP.ADD_PRINT_RECT(-1,0,574,534,0,3);
    if(type === 'pre'){
      LODOP.PRINT_SETUP()
    }else{
      LODOP.PRINT();
    }
}
export default printPDF