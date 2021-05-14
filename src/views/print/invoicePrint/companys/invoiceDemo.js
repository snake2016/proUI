import { getLodop } from "@/api/LodopFuncs";
//整数转化为浮点型
    function toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
 function invoicePrint(data) {
    let LODOP = getLodop();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate()
    LODOP.PRINT_INITA(0,-6,800,600,"电子发票");
    LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);
    LODOP.ADD_PRINT_RECT(19,164,431,571,0,1);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
    LODOP.ADD_PRINT_TEXT(110,192,85,26,"客户名称:");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(111,283,90,26,data.userName);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    // LODOP.ADD_PRINT_TEXT(114,194,53,26,"地址:");
    // LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    // LODOP.ADD_PRINT_TEXT(113,260,298,27,data.address);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    if(data.realAmt){
        LODOP.ADD_PRINT_TEXT(158,194,90,26,"气费:");
        LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
        LODOP.ADD_PRINT_TEXT(157,302,264,26,toDecimal2(data.realAmt)+"元");
        LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    }
    LODOP.ADD_PRINT_TEXT(320,192,83,26,"发票代码:");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(320,283,100,26,data.invoiceCode);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(356,191,83,26,"发票号：");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(431,282,101,26,year+'-'+month+'-'+day);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(431,188,88,26,"开票日期:");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.SET_PRINT_STYLEA(0,"QRCodeVersion",14);
    LODOP.ADD_PRINT_BARCODE(329,410,152,127,"QRCode",data.wechatUrl);
    LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
    LODOP.ADD_PRINT_TEXT(54,231,269,26,data.tenantName+"缴费收据");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
    LODOP.ADD_PRINT_TEXT(111,380,55,26,"日期:");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(109,445,112,26,year+'-'+month+'-'+day);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(248,190,346,26,"以上信息已开具增值税电子发票，如有需要请扫描");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_LINE(235,187,236,558,2,1);
    LODOP.ADD_PRINT_LINE(148,196,149,559,2,1);
    LODOP.ADD_PRINT_TEXT(279,189,347,26,"下方二维码，自行下载打印");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(356,282,100,26,data.invoiceNo);
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(390,190,84,26,"开票金额：");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    LODOP.ADD_PRINT_TEXT(389,283,100,26,toDecimal2(data.invoiceAmt)+"元");
    LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    if(data.otherCostAmt){
        LODOP.ADD_PRINT_TEXT(195,194,96,26,"其他费用：");
        LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
        LODOP.ADD_PRINT_TEXT(195,302,266,26, toDecimal2(data.otherCostAmt)+"元");
        LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
    }
    LODOP.PRINT_SETUP()
}
export default invoicePrint