// IC卡管理专用：制卡、补卡、回收卡
import { ajax_makeCardNo, ajax_makeIC, ajax_patchCard, ajax_huishou } from "@/api/icManager.js";
export default {
  data() {
    return {
      isDqbq: false,
    }
  },
  methods: {
    // 获取制卡/补卡/制卡准备/补卡准备的动态库参数
    getMakeCardParams() {
      return new Promise((resolve, reject) => {
        let icInfo = this.icInfo_ajax;
        if (icInfo == null) {
          reject({ suc: 2, msg: "操作终止：尚未查询IC卡档案信息" });
        }
        if (!icInfo.code) {
          reject({ suc: 2, msg: "厂家码为空" })
        }
        // 从接口中获取相应字段
        let get = (key, d) => {
          if (d == null) { d = "0" };
          if (icInfo[key]) {
            return icInfo[key];
          } else {
            return d;
          }
        }
        // 制卡或补卡检查的动态库参数
        if (this.icState == "制卡检查" || this.icState == "补卡检查") {
          let data = {};
          data.compcode = get("code"); // 厂家码
          resolve({ suc: 1, data: { compcode: data.compcode } })
        }
        // 制卡或补卡的动态库参数
        else if (this.icState == "制卡" || this.icState == "补卡") {
          // IC卡制卡参数
          let data = {
            "compcode": "", // 厂家码
            "cardno": "", // 卡号
            "customerno": "", // 档案编号
            "orderdate": "", // 制卡日期
            "ordernum": "0",
            "orderamount": "0",//购买数量
            "ordertotal": "0",//总购买量
            "fgs": "",
            "glz": "",
            "keycode": "0",//秘钥
            "newPrice": "", // 新价格
            "timeUnit": "",//时间单位
            "billingCycle": "",
            "newSubInterval": "",
            "priceType": "",
            "priceVersion": "",
            "newChangeDate": "",
            "upLimit": "99999",
            "alertLowLimit": "",
            "overDraft": "",
            "idleDays": "",
            "meterNo": "",
            "buyGasTwo": "",
            "buyGasThree": "",
            "meterID": "",
            "cardStatus": "",
            "orderFee": "",
            "orderTotalFee": "",
            "oldPrice": "",
            "oldSubInterval": "",
            "oldChangeDate": "",
            "billingMethod": "",
            "sellDate": "",
            "sheetDate": "",
            "ControllerNo": "",
            "NodeNo": "",
            "areaCode": "",
          }
          if (this.icCardNo == null) {
            resolve({ suc: 2, msg: "IC卡号为空" })
          }
          data.cardno = this.icCardNo; // IC卡号
          data.compcode = get("code"); // 厂家码
          if (icInfo.userNo) {
            data.customerno = icInfo.userNo; // 能源云3.0迁移过来的用户号
          } else {
            data.customerno = intAddZero(get("archivesNo", "")); // 用户号/档案编号
          }
          if (data.customerno == "") {
            resolve({ suc: 2, msg: "档案编号为空" })
          }
          data.orderdate = this.dayjs().format("YYYY-MM-DD"); // 制卡日期
          data.ordernum = get("icBuyNumber"); // 累购次数
          if (icInfo.billingTypeId == null) {
            icInfo.billingTypeId = icInfo.billTypeId; // 兼容后端接口的错误，此字段本来应为名为billingTypeId
          }
          data.priceType = Number(get("billingTypeId")) - 1; // 计价类型
          // 单一计价
          if (icInfo.billingTypeId == 1) {
            data.newPrice = String(get("singlePrice")); // 价格
            data.timeUnit = get("timeUnitCode", ""); // 时间单位
            data.billingCycle = "1"; // 结算周期
          }
          // 阶梯计价
          else if (icInfo.billingTypeId == 2) {
            if (icInfo.ladderPrice) {
              data.newPrice = get("ladderPrice"); // 价格
            } else {
              data.newPrice = get("levelPrice"); // 价格-cpm/icCard/infos接口
            }
            data.timeUnit = get("timeUnitCode", ""); // 时间单位
            data.billingCycle = get("billingCycle"); //结算周期
            data.stepCycleStartTime = icInfo.cycleStartTime ? this.convertUTC(icInfo.cycleStartTime, "").substring(2, 10) : ""; //阶梯开始时间
            if (icInfo.priceRange) {
              data.newSubInterval = get("priceRange"); // 价格区间
            } else {
              data.newSubInterval = get("levelBorder"); // 价格区间
            }
          }
          // 分时计价
          else if (icInfo.billingTypeId == 3) {
            data.newPrice = get("timePrice"); // 价格
            data.timeUnit = get("timeUnitCode", ""); // 时间单位
            data.readjustTime = icInfo.adjustTime ? icInfo.adjustTime : undefined; // 调整时间
            data.newSubInterval = get("priceRange"); // 调整时长
            data.priceType = "2"; // 天信分时计价表传价格启动状态：0--单一计费，1--阶梯计费，2--分时计费
          } else {
            let msg = "制卡已终止：此档案的价格信息异常！"
            throw msg;
          }
          data.priceVersion = get("priceVersion"); //价格版本，天信fcc-x双通道表具制卡时价格版本为1(compcode==601310)
          if (icInfo.code == this.icCardTypeNames['天信FCC-X双通道卡']) {
            // 示例 2020年9月28日7点：20092807
            data.newChangeDate = icInfo.effectiveTime ? this.dayjs(icInfo.effectiveTime).format("YYMMDDHH") : ""; //生效日期
          } else {
            // 示例 2020年9月28日：20200928
            data.newChangeDate = icInfo.effectiveTime ? this.dayjs(icInfo.effectiveTime).format("YYYYMMDD") : ""; //生效日期
          }
          data.oldChangeDate = data.newChangeDate;
          data.upLimit = "99999";//表存上限
          data.alertLowLimit = ""; // 报警气量
          data.meterNo = get("meterNo"); // 表号
          if (this.bukaForm && this.bukaForm.cardStatus == 1) {
            data.cardStatus = "0"; // 1表示为补开户卡
          }
          resolve({ suc: 1, data: data })
        } else {
          resolve({ suc: 2, msg: "异常：IC卡操作状态丢失" })
        }
      })
    },
    /* 制卡流程：1.制卡检查动态库->2.调接口生成卡号->3.制卡动态库写卡->4.1制卡接口落库 */
    /* 补卡流程：1.补卡检查动态库->3.补卡动态库写卡->4.2补卡接口落库 */
    // 1.制卡或补卡前检查
    /* 参数说明：
    * cbName: 制卡成功后的回调函数名称
    * type: 1为制卡 2为补卡
    * isMultiMake：是否为批量制卡，批量制卡时记录每一步的完成状态 
    * isQdbq：是否为丢气补气，丢气补气时无需调用补卡接口
    */
    ic_markCard_check(cbName, type, isMultiMake) {
      let ok = false;
      if (type == 2 && this.$refs['bukaForm']) {
        this.$refs['bukaForm'].validate(valid => {
          ok = valid ? true : false;
        })
        if (!ok) {
          // this.$message.error("请按提示修正或补全信息");
          return;
        }
      }
      if (isMultiMake) { // 批量制卡
        this.isMultiMake = true;
        this.multiStep = 2; // 批量制卡第2步：制卡检查
      } else {
        this.isMultiMake = false;
      }
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "制卡检查中...";
          this.icState = "制卡检查"; // 制卡检查
          let funcCode = this.icLib.icParams.makeCardCheck; // 功能码，制卡和补卡相同
          if (type == 2) {
            txt = "补卡检查中...";
            if (this.isCancelBq) {
              txt = "取消补气中，请勿离开"
            }
            this.icState = "补卡检查"; // 补卡检查
          }
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getMakeCardParams().then(res => {
            if (res.suc == 1) {
              // 制卡或结束后调用的回调函数名称
              this.ic_suc_funcName = cbName;
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              let msg = "参数返回错误：未知错误";
              if (res.msg) { msg = res.msg }
              console.error(msg, res);
              if (this.isMultiMake) {
                this.multiStepState = "error";
                this.multiErrmsg = `制卡检查时出错：${msg}`; // 出错信息
              }
              this.$alert(msg, '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
            if (err.suc == 2) {
              msg = err.msg;
            }
            if (this.isMultiMake) {
              this.multiStepState = "error";
              this.multiErrmsg = `制卡检查时出错：${msg}`; // 出错信息
            }
            this.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
            console.error(msg, err);
          })
          // 制卡检查成功后调用制卡接口
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        if (this.isMultiMake) {
          this.multiStepState = "error";
          this.multiErrmsg = `制卡检查时出错：连接失败`; // 出错信息
        }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 2.调用接口生成IC卡号
    makeCardNo() {
      if (this.isMultiMake) {
        this.multiStep = 3; // 批量制卡第3步：调接口生成卡号
      }
      if (this.icInfo_ajax.icCardTypeId == null) {
        if (this.isMultiMake) {
          this.multiStepState = "error";
          this.multiErrmsg = `生成卡号时出错：IC卡类型ID为空`; // 出错信息
        }
        this.$alert("无法生成IC卡号：IC卡类型ID为空", '异常', { confirmButtonText: '确定', type: "error" });
        return;
      }
      if (this.archiveId == null) {
        if (this.isMultiMake) { // 批量制卡
          this.multiStepState = "error";
          this.multiErrmsg = `生成卡号时出错：档案ID为空`; // 出错信息
        }
        this.$alert("无法生成IC卡号：档案ID为空", '异常', { confirmButtonText: '确定', type: "error" });
        return;
      }
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在生成IC卡号"
      });
      ajax_makeCardNo({
        archivesId: this.archiveId,
        icCardTypeId: this.icInfo_ajax.icCardTypeId
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          this.icCardNo = res.data.data.icCardNo; // ic卡号
          if (this.isMultiMake) { // 批量制卡
            this.curMakeInfo.icCardNo = this.icCardNo; // 批量制卡显示ic卡号
          }
          this.icState = "制卡";
          // 调用制卡或补卡动态库
          this.ic_markCard_ws();
        } else {
          // 已制过卡的卡号在档案详情中可以查询到
          let msg = "生成IC卡号失败";
          if (res.data.code == "590019") {
            msg = '重复制卡';
          } else {
            if (res.data.msg) { msg = res.data.msg }
          }
          if (this.isMultiMake) { // 批量制卡
            this.multiStepState = "error";
            this.multiErrmsg = `生成卡号时出错：${msg}`; // 出错信息
          }
          console.error(msg);
          this.$alert(msg, "生成IC卡号失败", { confirmButtonText: '确定', type: "error" });
        }
      }).catch(err => {
        loading.close();
        let msg = "生成IC卡号时遇到错误";
        let title = '制卡失败';
        if (err != 401 && err != 403) {
          console.error(msg, err);
          this.$alert(msg, '制卡失败', { confirmButtonText: '确定', type: "error" });
        }
        if (this.isMultiMake) { // 批量制卡
          this.multiStepState = "error";
          this.multiErrmsg = `生成IC卡号时遇到错误`; // 出错信息
        }
      })
    },
    // 3.制卡或补卡动态库调用
    ic_markCard_ws() {
      if (this.isMultiMake) {
        this.multiStep = 4; // 批量制卡第4步：调用制卡动态库
      }
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡连接成功，制卡中...";
          let funcCode = this.icLib.icParams.makeCard; // 功能码，制卡和补卡一致
          if (this.icState == "补卡") {
            txt = "IC卡连接成功，补卡中...";
            if (this.isCancelBq) {
              txt = "取消补气中，请勿离开";
            }
          }
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getMakeCardParams().then(res => {
            if (res.suc == 1) {
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              let msg = "参数返回错误：未知错误";
              if (res.msg) { msg = res.msg }
              console.error(msg, res);
              if (this.isMultiMake) { // 批量制卡
                this.multiStepState = "error";
                this.multiErrmsg = `调用制卡动态库时出错：${msg}`; // 出错信息
              }
              if (this.isCancelBq) {
                msg = "取消补气中，请勿离开";
              }
              this.$alert(msg, '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
            if (err.suc == 2) {
              msg = err.msg;
            }
            console.error(msg, err);
            if (this.isMultiMake) { // 批量制卡
              this.multiStepState = "error";
              this.multiErrmsg = `调用制卡动态库时出错：${msg}`; // 出错信息
            }
            this.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
          })
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        if (this.isMultiMake) { // 批量制卡
          this.multiStepState = "error";
          this.multiErrmsg = `调用制卡动态库时遇到错误`; // 出错信息
        }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 4.1.调用制卡接口
    makeCard_ajax() {
      if (this.isMultiMake) {
        this.multiStep = 5; // 批量制卡第5步：调用制卡接口
      }
      if (this.icInfo_ajax.icCardTypeId == null) {
        if (this.isMultiMake) { // 批量制卡
          this.multiStepState = "error";
          this.multiErrmsg = `调用制卡接口时出错：IC卡类型ID为空`; // 出错信息
        }
        this.$alert("无法调用制卡接口：IC卡类型ID为空", '异常', { confirmButtonText: '确定', type: "error" });
        return;
      }
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在请求制卡接口...",
      });
      ajax_makeIC({
        archivesId: this.archiveId, // 档案id
        icCardTypeId: this.icInfo_ajax.icCardTypeId,
        icCardNo: this.icCardNo, // ic卡号
        priceVersion: this.icInfo_ajax.priceVersion, // 价格版本
      }).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          // 执行制卡成功后的回调
          this.ic_cb_run();
        } else {
          // 已制过卡的卡号在档案详情中可以查询到
          let msg = "制卡接口返回了一个错误";
          if (res.data.code == "590019") {
            msg = "重复制卡";
          } else {
            msg = res.data && res.data.message ? res.data.message : "制卡接口请求失败";
          }
          this.$alert(msg, "调用制卡接口出错", { confirmButtonText: '确定', type: "error" });
          if (this.isMultiMake) { // 批量制卡
            this.multiStepState = "error";
            this.multiErrmsg = `调用制卡接口时出错：${msg}`; // 出错信息
          }
        }
      }).catch(err => {
        loading.close();
        let msg = "调用制卡接口时出错";
        if (err != 401 && err != 403) {
          this.$alert(msg, '制卡失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, err);
        }
        if (this.isMultiMake) { // 批量制卡
          this.multiStepState = "error";
          this.multiErrmsg = `调用制卡接口时出错：${msg}`; // 出错信息
        }
      })
    },
    // 4.2.调用补卡接口
    buCard_ajax() {
      let ok = false;
      this.$refs['bukaForm'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      if (this.icInfo_ajax.icCardId == null) {
        this.$alert("无法调用补卡接口：IC卡ID为空", '异常', { confirmButtonText: '确定', type: "error" });
        return;
      }
      let text = "正在请求补卡接口...";
      if (this.isCancelBq) {
        text = "取消补气中，请勿离开";
      }
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: text
      });
      ajax_patchCard({
        icCardId: this.icInfo_ajax.icCardId,
        patchCardCostNum: Number(this.bukaForm.money).toFixed(2),
        patchCardCostType: this.bukaForm.payType,
        patchCardReason: this.bukaForm.reason, // 补卡原因
        priceVersion: this.icInfo_ajax.priceVersion, // 价格版本
      }).then(res => {
        loading.close();
        this.icBukaShowChange(0); // 关闭补卡弹窗
        if (res.data && res.data.code == 0) {
          if (!this.isCancelBq) {
            this.$message.success("补卡成功，自动读卡中...")
            this.ICCard_read();
          }
        } else {
          let msg = res.data && res.data.message ? res.data.message : "补卡接口返回了一个错误";
          this.$alert(msg, '补卡失败', { confirmButtonText: '确定', type: "error" });
        }
      }).catch(err => {
        loading.close();
        this.icBukaShowChange(0); // 关闭补卡弹窗
        let msg = "请求补卡接口时遇到错误";
        if (err != 401 && err != 403) {
          this.$alert(msg, '补卡失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, err);
        }
      })
    },
    // 回收卡参数准备,回收卡和回收卡准备参数一样
    getClearCardParams() {
      return new Promise((resolve, reject) => {
        let data = { keycode: "" };
        if (!this.icInfo_ajax.code) {
          reject({ suc: 2, msg: "参数错误，厂家码为空" })
        }
        data.compcode = this.icInfo_ajax.code; // 厂家码
        resolve({
          suc: 1, data: data
        })
      })
    },
    // 1.IC卡回收前检查
    ic_recovery_check(cbName, flag) {
      if (flag == 1) {
        this.isDqbq = true; // 是丢气补气前的清卡，无需调用回收卡接口
      } else {
        this.isDqbq = false;
      }
      // let normalIcCodes = [this.icCardTypeNames['天信气量CPU卡'], this.icCardTypeNames['天信金额CPU卡'], this.icCardTypeNames['天信FCC-X双通道卡']]
      // if (normalIcCodes.indexOf(this.icInfo_ajax.code) == -1) { // 非上面的卡表类型时，即金卡的表
      //   this.ic_recovery_ws();//直接回收卡
      //   return;
      // }
      let ok = false;
      if (this.$refs['huishouForm'] && this.$refs['huishouForm'].validate) {
        this.$refs['huishouForm'].validate(valid => {
          ok = valid ? true : false;
        })
        if (!ok) {
          // this.$message.error("请按提示修正或补全信息");
          return;
        }
      }
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "回收卡检查中...";
          if (this.isCancelBq) {
            txt = "取消补气中，请勿离开"
          }
          this.icState = "回收卡检查"; // 回收卡检查
          let funcCode = this.icLib.icParams.recoveryCardCheck; // 功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          // 获取需要的参数后发送ws请求
          this.getClearCardParams().then(res => {
            this.ic_suc_funcName = cbName; // 回收后的回调函数名
            this.wsSendMsg(funcCode, res.data);
          }).catch(err => {
            this.ic_loading.close();
            let msg = "回收卡参数返回时出错";
            if (this.isCancelBq) {
              msg = "取消补气中时参数发生错误-101"
            }
            if (err.suc == 2) {
              msg = err.msg;
            }
            console.error(msg, err);
            this.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
          })
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 2.IC卡回收
    ic_recovery_ws() {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡回收中...";
          if (this.isCancelBq) {
            txt = "取消补气中，请勿离开"
          }
          this.icState = "回收卡"; // 回收卡
          let funcCode = this.icLib.icParams.recoveryCard; // 功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getClearCardParams().then(res => {
            this.wsSendMsg(funcCode, res.data);
          }).catch(err => {
            this.ic_loading.close();
            let msg = "回收卡参数返回时出错";
            if (this.isCancelBq) {
              msg = "取消补气中时参数发生错误-101"
            }
            if (err.suc == 2) {
              msg = err.msg;
            }
            console.error(msg, err);
            this.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
          })
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 3.IC卡回收请求接口
    icHuishouAjax() {
      if (this.icInfo_ajax.icCardId == null) {
        this.$alert("无法调用回收接口：IC卡ID为空", '异常', { confirmButtonText: '确定', type: "error" });
        return;
      }
      let ok = false;
      this.$refs['huishouForm'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      let text = "正在请求回收接口...";
      if (this.isCancelBq) {
        text = "取消补气中，请勿离开"
      }
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: text,
      });
      ajax_huishou({
        icCardId: this.icInfo_ajax.icCardId,
        clearCardReason: this.huishouForm.reason,
      }).then(res => {
        loading.close();
        if (typeof (this.icHuishouShowChange) === 'function') {
          this.icHuishouShowChange(0);
        }
        if (res.data && res.data.code == 0) {
          // 执行ic卡回收后的回调
          this.ic_cb_run();
        } else {
          let msg = "IC卡回收接口返回了一个错误";
          if (this.isCancelBq) {
            msg = "取消补气过程遇到了错误-102"
          }
          if (res.data.code == "590012") {
            msg = "IC卡不存在";
          } else if (res.data.message) {
            msg = res.data.message;
          }
          this.$alert(msg, 'IC卡回收失败', { confirmButtonText: '确定', type: "error" });
        }
      }).catch(err => {
        loading.close();
        if (typeof (this.icHuishouShowChange) === 'function') {
          this.icHuishouShowChange(0);
        }
        let msg = "请求IC卡回收接口时遇到错误";
        if (this.isCancelBq) {
          msg = "取消补气过程遇到了错误-103"
        }
        if (err != 401 && err != 403) {
          this.$alert(msg, 'IC卡回收失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, err);
        }
      })
    },
  },
}