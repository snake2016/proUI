// IC卡基础混入组件
import icLib from "@/views/icManager/icClient/ic-lib.js";
import { isJson, hasLetter } from "@/utils/index.js";
import { getNowFormatDate, convertUTC } from "@/utils/index.js";
import { ajax_readIC, getIcCardDetail } from "@/api/icManager.js";
import {
  icCardTypeNames, //ic卡厂商名称--厂商code
} from "@/utils/queryList/queryList.js"
import dayjs from "dayjs";
export default {
  data() {
    return {
      ICDownLoadShow: false, 
      publicPath: process.env.BASE_URL,
      icDownLoadUrls: [
        { title: "金卡-明华usb.rar", url: "ic-install/SmartCard_goldcard_mh_usb.rar", md: "适用：金卡民用气量、工业气量、三价金额、五价金额" },
        { title: "天信-明华usb.rar", url: "ic-install/SmartCard_tancy_mh_usb.rar", md: "适用：天信FCC货币、非货币" },
        { title: "天信-握奇串口.rar", url: "ic-install/SmartCard_tancy_wq_com.rar", md: "适用：天信FCC货币、非货币、FCC-X双通道" },
      ],
      icStateShow: false, // IC卡状态弹窗
      icState: '', // ic卡操作状态
      ic_ip: "", // IC卡连接IP
      ic_ws: null, // IC卡-websocket对象
      ic_isOpen: false, // IC卡是否开启
      ic_loading: null, // 加载状态
      ic_suc_funcName: "", // 读卡/制卡等操作成功后的回调函数名称
      ic_make_data: {}, // 制卡或补卡时的请求参数，由于需要先请求制卡或补卡检查，需要保存请求参数以便二次调用
      ic_clear_data: {}, // 回收卡时的请求参数
      ic_recharge_data: {}, // ic卡充值时需要的请求参数
      ic_reissue_data: {}, // ic补气时需要的请求参数
      ic_cancel_data: {}, // ic退费时需要的请求参数
      convertUTC: convertUTC, // 带T时间格式化
      getNowFormatDate: getNowFormatDate, // 获取当前日期
      dayjs: dayjs,
      hasLetter: hasLetter, // 判断是否包含字母
      icLib: icLib, // ic卡功能码和公共函数
      overTimeIds: [], // 接收信息超时
      overTimeIs: false, // 是否超时
      icCardTypeNames: icCardTypeNames, // ic卡厂商名称--id
    }
  },
  mounted() {
  },
  methods: {
    // 下载后刷新
    refreshAfterDl() {
      location.reload(true);
    },
    // 关闭窗口
    closeDl() {
      // 附加事件处理
      if (this.closeICInstall && typeof (this.closeICInstall) === 'function') {
        this.closeICInstall();
      }
      this.ICDownLoadShow = false;
    },
    // 改变IC卡弹窗状态
    changeICState(state) {
      // this.icState = state;
      this.icStateShow = true;
    },
    // 连接服务器
    ic_connectServer(serverIP, serverPort) {
      this.ic_loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在连接服务器，请稍等...",
      });
      let msg = "连接失败";
      let that = this;
      return new Promise((resolve, reject) => {
        var ip = serverIP ? serverIP : "127.0.0.1";
        var port = serverPort ? serverPort : "8001";
        var host = "ws://" + ip + ":" + port + "/";
        console.info("正在连接服务器：", host);
        that.ic_ws = new WebSocket(host);
        try {
          if (window.WebSocket) { // 检测浏览器是否支持 WebSocket
            that.ic_ws = new WebSocket(host);
            that.ic_ws.onopen = e => {
              msg = "true";
              console.info("连接服务器成功");
              that.ic_isOpen = "true";
              resolve({ loading: that.ic_loading, msg: msg });
            };
            that.ic_ws.onmessage = e => {
              try {
                that.ws_onmessage(e);
              } catch (error) {
                console.error("接收消息时出错", error);
                if (that.ic_loading) { that.ic_loading.close(); }
                that.$alert("接收消息时出错", '发生错误', { confirmButtonText: '确定', type: "error" });
                return;
              }
            };
            that.ic_ws.onclose = e => {
              msg = "服务器连接中断";
              console.warn(msg);
              // 显示读卡器动态库下载程序
              that.ICDownLoadShow = true;
              that.$message.error(msg + "，请确认是否已安装IC卡组件");
              that.ic_isOpen = "ws_close";
              resolve({ loading: that.ic_loading, msg: msg });
            };
            that.ic_ws.onerror = e => {
              msg = "连接服务器失败";
              console.warn(msg);
              // 显示读卡器动态库下载程序
              that.ICDownLoadShow = true;
              that.$message.error(msg + "，请确认是否已安装IC卡组件");
              that.ic_isOpen = "ws_error";
              resolve({ loading: that.ic_loading, msg: msg });
            };
          }
        } catch (err) {
          msg = "请需要更换浏览器以支持WebSocket通信。";
          console.err(msg, err);
          that.$alert(msg, '连接失败', { confirmButtonText: '确定', type: "error" });
          that.ic_isOpen = "error";
          resolve({ loading: that.ic_loading, msg: msg});
        }
      })
    },
    // WebSocket发送消息
    wsSendMsg(funcode, data) {
      try {
        if (!funcode) {
          console.error("funcode为空");
          return false;
        } else {
          funcode = funcode.funcCode;
        }
        if (this.ic_isOpen === "true") {
          // 将消息编码成报文
          let message = icLib.encodeMessage(funcode, data, funcode);// token内容暂时定为funcode
          console.info("%c" + this.icState + "-->发送消息：", "color: #0000FF");
          console.info(message);
          this.ic_ws.send(message);
          // 超时处理
          this.overTimeIs = false;
          this.overTimeIds.forEach(item => {
            clearTimeout(item);
          })
          this.overTimeIds.push(setTimeout(() => {
            this.overTimeIs = true;
            if (this.ic_loading) { this.ic_loading.close(); }
            this.$alert('请检查动态库和连接是否正常，可留意稍后的错误提示(如果有)并重试。', '响应超时', { confirmButtonText: '确定', type: "error" });
          }, 40000))
        } else {
          console.error("服务器未连接");
          this.ic_loading.close();
          this.$alert('服务器尚未连接，无法发送消息。', '发送失败', { confirmButtonText: '确定', type: "error" });
          return;
        }
      } catch {
        this.ic_loading.close();
      }
      
    },
    // WebSocket接收到消息
    ws_onmessage(e) {
      let that = this;
      // 出错后的处理
      let errFunc = (msg, notError) => {
        if (!msg) { msg = "未知错误" }
        // notError为真时不打印错误信息
        if (!notError) { console.error(msg) }
        that.ic_loading.close();
        that.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
      }
      if (e.data == undefined || e.data == null || e.data == "") {
        errFunc("服务器返回的消息为空");
        return;
      }
      let rece = e.data.split("|"); // 按|分割
      if (rece.length > 1) {
        rece = rece[1];
      } else {
        errFunc("未收到有效响应");
        return;
      }
      // Json解析
      if (isJson(rece)) {
        rece = JSON.parse(rece);
      } else {
        errFunc("消息解析失败");
        return;
      }
      let errMsg = rece.result && rece.result.errMsg ? rece.result.errMsg : null; // 是否报错
      let result = rece.result; // 最终需要的结果
      console.info("收到消息解析完成：", result);
      // 超时处理
      if (that.overTimeIs) {
        console.error("在超时时间外收到了消息。");
      } else { // 未超时，清除定时器
        that.overTimeIds.forEach(item => {
          clearTimeout(item);
        })
      }
      if (!errMsg) {
        console.info("%cicState:" + this.icState + "√", "color: #228B22");
        that.ic_loading.close();
        if (that.icState == "读卡") {
          that.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: "读卡成功，正在获取IC卡信息...",
          });
          that.icCard_read_ajax(result);
        }
        else if (that.icState === "制卡检查" || that.icState === "补卡检查") {
          if (that.icState == "制卡检查") {
            // 制卡检查通过后调用生成IC卡号接口
            this.makeCardNo();
          } else if (that.icState == "补卡检查") {
            // 补卡检查通过后调用补卡动态库
            that.icState = "补卡";
            this.ic_markCard_ws();
          } else {
            this.$alert("IC卡操作状态丢失", '异常', { confirmButtonText: '确定', type: "error" });
          }
        }
        else if (that.icState == "制卡" || that.icState == "补卡") {
          if (that.icState == "制卡") {
            that.makeCard_ajax(); // 调用制卡接口
          } else {
            if (this.isDqbq) { // 丢气补气前的补卡无需调用补卡接口
              this.ic_cb_run();
            } else {
              that.buCard_ajax(); // 调用补卡接口
            }
          }
        }
        else if (that.icState == "回收卡检查") {
          this.ic_recovery_ws(); // 调用回收动态库
        }
        else if (this.icState == "回收卡") {
          if (this.isDqbq) { // 丢气补气前的回收卡无需调用回收卡接口
            this.ic_cb_run();
          } else {
            this.icHuishouAjax(); // 调用回收卡接口
          }
        }
        else if (this.icState == "充值检查") {
          // 充值动态库调用
          this.ic_recharge_ws();
        }
        else if (this.icState == "充值") {
          // 调用ic卡充值接口
          this.recharge_ic_ajax();
        }
        else if (this.icState == "补气检查") {
          // 调用补气接口
          this.ic_reissue_ajax();
        }
        else if (this.icState == "补气") {
          // 执行回调
          this.ic_cb_run(result);
        }
        else if (this.icState == "退费检查") {
          // 调用ic卡退费动态库
          this.ic_cancel_ws();
        }
        else if (this.icState == "退费") {
          // 调用退费接口
          this.ic_cancel_ajax();
        }
        else if (this.icState == "取消补气检查") {
          // 调用ic卡取消补气动态库（与退费动态库一致）
          this.ic_cancel_bq_ws();
        }
        else if (this.icState == "取消补气") {
          // 调用取消补气接口
          this.ic_cancel_bq_ajax();
        }
        else if (this.icState == "调价卡读卡") {
          // 执行读卡后的回调
          this.ic_cb_run(result);
        }
        else if (this.icState == "调价卡写卡") {
          // 执行读卡后的回调
          this.ic_cb_run(result);
        }
        else if (this.icState == "双通道调价卡读卡") {
          // 执行读卡后的回调
          this.ic_cb_run(result);
        }
        else if (this.icState == "双通道调价卡写卡") {
          // 执行读卡后的回调
          this.ic_cb_run(result);
        }
        else {
          console.error("出错：未知的icState");
        }
      } else {
        let msg = icLib.Base64.decode(errMsg);
        if (result.rs != null && icLib.errCodeList[result.rs]) {
          msg = icLib.errCodeList[result.rs];
        }
        msg = unescape(escape(msg).replace(/%00/g, "")); // 去除末尾的乱码字符%00
        errFunc(msg);
        // 批量制卡
        if (that.isMultiMake) {
          that.multiStepState = "error"; // 批量制卡标记出错
          that.multiErrmsg = msg; // 出错信息
          if (that.icState === "制卡检查") {
            that.multiStep = 2;
          } else if (that.icState === "制卡") {
            that.multiStep = 4;
          } else {
            console.error("批量制卡出错：意外的icState-" + that.icState);
          }
        }
        return;
      }
    },
    /* 读卡流程：调用动态库，按需传入回调->动态库读卡后调用读卡接口->执行回调 */
    // 1.读卡(用户卡)
    ICCard_read(cbName) {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: "服务器连接成功，读卡中...",
          });
          this.icState = "读卡"; // 读卡
          this.ic_suc_funcName = cbName; // 读卡后的回调函数
          this.wsSendMsg(icLib.icParams.readCard, {});
        } else {
          console.error(res.msg);
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 2.请求读卡接口
    icCard_read_ajax(result) {
      let data = {};
      if (result.cardNo) { data.icCardNo = result.cardNo } // 卡号
      ajax_readIC(data).then(res => {
        this.ic_loading.close();
        if (res.data && res.data.code == 0){
          // this.$message.success("IC卡信息获取成功");
          // 把读卡返回的结果也带过去
          // this.ic_cb_run({...res.data.data, dataByRead: {...result}}); // 执行回调函数
          this.icCard_getDetail({ ...res.data.data, dataByRead: { ...result } }); // 获取ic卡档案详情
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          if (result.cardNo == "") { // 未读取到卡号，如读取调价卡
            msg = "未插卡，或是新卡！";
          } else if (res.data.code == "590012") {
            msg = "IC卡不存在";
          }
          this.$alert("请求IC卡信息失败：" + msg, '发生错误', { confirmButtonText: '确定', type: "error" });
        }
      }).catch(err => {
        this.ic_loading.close();
        this.$alert("读卡接口请求出错", '发生错误', { confirmButtonText: '确定', type: "error" });
        console.error("读卡接口请求出错", err);
      })
    },
    // 请求ic卡档案详情接口
    icCard_getDetail(data) {
      let assignData = data;
      getIcCardDetail({ archivesId: data.archivesId }).then(res => {
        if (res.data && res.data.code == 0) {
          if (Object.prototype.toString.call(res.data.data) === '[object Object]') {
            this.$message.success("IC卡信息获取成功");
            let icInfo = res.data.data;
            Object.keys(icInfo).map((key, index) => {
              if (!assignData.hasOwnProperty(key) || assignData[key] === null || assignData[key] === "") { // 原info读卡接口中无此属性或值为空时添加
                assignData[key] = icInfo[key];
              }
            })
            if (assignData.archivesId) {
              this.$ls.set("icReadData_" + assignData.archivesId, assignData); // 保存ic卡读卡信息和接口信息
            }
            this.ic_cb_run(assignData);
          }
        } else {
          this.ic_cb_run(assignData);
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          console.error("获取IC卡档案信息失败：" + msg);
        }
      }).catch(err => {
        this.ic_cb_run(assignData);
        let msg = "获取IC卡档案时遇到错误";
        if (err != 401 && err != 403) {
          console.error(msg, err);
        }
      })
    },
    // 动态库调用成功后执行回调
    ic_cb_run(data) {
      if (this.ic_suc_funcName && typeof (this[this.ic_suc_funcName]) === 'function') {
        this[this.ic_suc_funcName](data);
      }
    },
  }
}