// IC卡参数设定
let icParams = {
  // ip: "",
  // port: "8001",
  makeCard: { // 制卡
    funcCode: "5007"
  },
  writeOrdersCheck: { // 写卡检查
    funcCode: "5011"
  },
  writeOrders: { // 写卡
    funcCode: "5010"
  },
  readCard: { // 读卡
    funcCode: "5001"
  },
  makeCardCheck: { // 制卡检查
    funcCode: "5009"
  },
  cancelOrdersCheck: { // 退费检查
    funcCode: "5013"
  },
  cancelOrders: { // 退费
    funcCode: "5012"
  },
  recoveryCardCheck: { // 回收卡检查
    funcCode: "5006"
  },
  recoveryCard: { // 回收卡
    funcCode: "5005"
  },
  readPriceCard: { // 调价卡读卡
    funcCode: "6001"
  },
  writePriceCard: { // 调价卡写卡
    funcCode: "6002"
  },
  readDbPriceCard: { // 双通道调价卡读卡
    funcCode: "6003"
  },
  writeDbPriceCard: { // 双通道调价卡写卡
    funcCode: "6004"
  },
}
// 数据域加密
let encodeMessage = (funcode, data, cardData, token, timeStamp, sign) => {
  if (data.constructor === Object) {
    data = JSON.stringify(data);
  }
  // 报文生成：功能码|响应码|数据域|检验位
  return funcode + "|" + data + "|" + cardData + "|" + token + "|"
    + timeStamp + "|" + sign;
  // +"|"+funcode+"|"+dataJson+"|"+checkCode;
}

let Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = (n & 3) << 4 | r >> 4;
      u = (r & 15) << 2 | i >> 6;
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o)
        + this._keyStr.charAt(u) + this._keyStr.charAt(a)
    }
    return t
  },
  decode: function (e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9+/=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = s << 2 | o >> 4;
      r = (o & 15) << 4 | u >> 2;
      i = (u & 3) << 6 | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r)
      }
      if (a != 64) {
        t = t + String.fromCharCode(i)
      }
    }
    t = Base64._utf8_decode(t);
    return t
  },
  _utf8_encode: function (e) {
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    let [r, c1, c2, c3] = [0, 0, 0, 0];
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3
          & 63);
        n += 3
      }
    }
    return t
  }
};
let errCodeList = {
  "16": "测试版，试用时间到",
  "17": "MAC1不等于MAC2",
  "18": "读卡器初始化错误。常见原因：端口设置错误、波特率、串口转换线坏了。",
  "19": "读卡器关闭错误",
  "163": "卡中买量未输入表中，不能购买",
  "165": "卡片购买量不足，不能退购！卡片上购买量为零",
  "4097": "充值次数必须大于0",
  "4131": "插入了错误的卡片，如：需插用户卡结果插入了调价卡",
  "4132": "操作失败：非调价卡",
  "25088": "无卡",
  "25217": "读取错误/数据错误",
  "25218": "文件结尾",
  "25536": "还有0次机会尝试校验",
  "25537": "还有1次机会尝试检验",
  "25538": "还有2次机会尝试校验",
  "25536": "复位失败",
  "25856": "EDC或写入错误",
  "25985": "更新失败",
  "26368": "长度错误",
  "26880": "状态错误",
  "26881": "状态错误",
  "27009": "错误的PUK码文件类型",
  "27010": "没有文件被选择",
  "27011": "没有重试的机会",
  "27013": "文件不存在或错误的PIN码",
  "27016": "写入文件失败",
  "27136": "错误的P1P2或未找到文件",
  "27264": "错误的参数指令",
  "27265": "P2值错误",
  "27266": "文件找不到",
  "27267": "记录不存在",
  "27268": "余额不足",
  "27270": "参数错误",
  "27392": "偏移值错误",
  "27904": "无效指令",
  "28160": "无效的类字节",
  "28416": "数据异常",
  "28656": "系统异常。常见原因：卡片插反了。",
  "32768": "api错误",
  "36864": "正常",
  "37634": "MAC错误",
  "37635": "文件被锁",
  "37889": "无余额",
  "37891": "找不到秘钥",
  "37894": "MAC错误",
  "65535": "通信错误"
}
export default {
  icParams: icParams,
  Base64: Base64,
  encodeMessage: encodeMessage,
  errCodeList: errCodeList,
}