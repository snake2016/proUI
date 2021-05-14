// ic卡退费(取消收费)
import { icCancelCharge_api, icCancelBuqi_api } from "@/api/icManager.js";
export default {
  methods: {
    // 获取退费参数
    getIcCancelParams(type, isBq) {
      return new Promise((resolve, reject) => {
        if (this.ic_cancel_data.code == null) {
          reject({ suc: 2, msg: "厂家码为空" })
        }
        if (this.ic_cancel_data.icCardNo == null) {
          reject({ suc: 2, msg: "IC卡号为空" })
        }
        // 退费前检查
        if (type == 1) {
          let data = {
            compcode: "",
            cardno: "",
            customerno: "",
            orderdate: "", // 储值日期
            ordernum: "", // 购买次数
            fgs: "",
            glz: "",
            alertLowLimit: "",
            overDraft: "",
            idleDays: "",
            upLimit: "",
            buyGasTwo: "",
            buyGasThree: "",
            keycode: "",
          }
          data.compcode = this.ic_cancel_data.code; // 厂家码
          data.cardno = this.ic_cancel_data.icCardNo; // ic卡号
          data.customerno = intAddZero(this.ic_cancel_data.archivesNo); // 档案编号
          if (isBq == 1) { // 退补气
            if (this.ic_cancel_data.icReissueOptTypeCode == 1) { // 丢气补气
              data.ordernum = this.ic_cancel_data.icBuyNumber; // 购买次数
            } else { // 换表补气和赠送补气
              data.ordernum = this.ic_cancel_data.icBuyNumber - 1; // 购买次数-1
            }
          } else { // 退充值
            data.ordernum = this.ic_cancel_data.icBuyNumber - 1; // 购买次数-1
          }
          if (this.gasOrMoney == 1) {   // 气量表
            data["ordertotal"] = this.ic_cancel_data.c_ordertotal; // 累储值量
            if (this.ic_cancel_data.icReissueOptTypeCode == 1) { // 丢气补气
              data["orderamount"] = this.ic_cancel_data.c_orderamount; // 本次储值量
            } else { // 换表补气和赠送补气
              data["orderamount"] = "0"; // 本次储值量
            }
          } else { // 金额表
            data["orderTotalFee"] = this.ic_cancel_data.c_orderTotalFee; // 累购金额
            if (this.ic_cancel_data.icReissueOptTypeCode == 1) { // 丢气补气
              data["orderFee"] = this.ic_cancel_data.c_orderFee; // 本次购买金额
            } else { // 换表补气和赠送补气
              data["orderFee"] = "0"; // 本次购买金额
            }
          }
          resolve({ suc: 1, data: data })
        }
        // 退费
        else if (type == 2) {
          let data = {
            compcode: "",
            alertLowLimit: "",
            overDraft: "",
            idleDays: "",
            upLimit: "",
            buyGasTwo: "",
            buyGasThree: "",
            meterID: "",
            cardStatus: "",
            orderTotalFee: "",
            billingMethod: "",
            priceType: "",
            oldPrice: "",
            oldSubInterval: "",
            oldChangeDate: "",
            newSubInterval: "",
            newChangeDate: "",
            sellDate: "",
            sheetDate: "",
            ControllerNo: "",
            NodeNo: "",
            meterNo: "", // 表具编号
            areaCode: "",
            cardno: "", // IC卡号
            customerno: "",
            orderdate: "",
            fgs: "",
            glz: "",
            keycode: "",
            ordernum: "", // 累购次数
            newPrice: "",
            priceVersion: "",
            billingCycle: "",
          }
          // d为默认值
          let get = (key, d) => {
            if (d == null) { d = "0" };
            if (this.ic_cancel_data[key]) {
              return this.ic_cancel_data[key];
            } else {
              return d;
            }
          }
          if (this.ic_cancel_data.code == this.icCardTypeNames['天信FCC-X双通道卡']) {
            // 示例 2020年9月28日7点：20092807
            data.newChangeDate = this.ic_cancel_data.effectiveTime ? this.dayjs(this.ic_cancel_data.effectiveTime).format("YYMMDDHH") : ""; //生效日期
          } else {
            // 示例 2020年9月28日：20200928
            data.newChangeDate = this.ic_cancel_data.effectiveTime ? this.dayjs(this.ic_cancel_data.effectiveTime).format("YYYYMMDD") : ""; //生效日期
          }
          data.oldChangeDate = data.newChangeDate;
          data.billingCycle = this.ic_cancel_data.billingCycle ? this.ic_cancel_data.billingCycle : "0";
          data.priceVersion = get("priceVersion", "1"); // 价格版本
          data.compcode = this.ic_cancel_data.code; // 厂家码
          data.cardno = this.ic_cancel_data.icCardNo; // ic卡号
          data.customerno = intAddZero(this.ic_cancel_data.archivesNo); // 档案编号
          data.meterNo = this.ic_cancel_data.meterNo; // 表具编号
          if (isBq == 1) { // 退补气
            if (this.ic_cancel_data.icReissueOptTypeCode == 1) { // 丢气补气
              data.ordernum = this.ic_cancel_data.icBuyNumber; // 购买次数
            } else { // 换表补气和赠送补气
              data.ordernum = this.ic_cancel_data.icBuyNumber - 1; // 购买次数-1
            }
          } else { // 退充值
            data.ordernum = this.ic_cancel_data.icBuyNumber - 1; // 购买次数-1
          }
          if (this.ic_cancel_data.billTypeId == 1) { // 单一价
            data.newPrice = String(get("singlePrice"));
            data.timeUnit = get("timeUnitCode", "");
          }
          else if (this.ic_cancel_data.billTypeId == 2) { // 阶梯价
            data.newPrice = get("levelPrice"); // 阶梯价
            data.oldPrice = get("levelPrice"); // 阶梯价
            data.timeUnit = get("timeUnitCode", "");
            data.stepCycleStartTime = this.ic_cancel_data.cycleStartTime ? this.convertUTC(this.ic_cancel_data.cycleStartTime, "").substring(2, 10) : "";
            data.newSubInterval = get("levelBorder"); // 阶梯边界
            data.oldSubInterval = get("levelBorder"); // 阶梯边界
          }
          else if (this.ic_cancel_data.billTypeId == 3) { // 分时价
            data.newPrice = get("timePrice");
            data.timeUnit = get("timeUnitCode", "");
            data.readjustTime = this.ic_cancel_data.adjustTime ? this.ic_cancel_data.adjustTime : undefined;
            data.newSubInterval = get("priceRange");
            data.priceType = "2";
          }
          if (this.gasOrMoney == 1) { // 气量表
            data["orderamount"] = this.ic_cancel_data.c_orderamount; // 本次储值量
            let cha = this.ic_cancel_data.c_ordertotal - this.ic_cancel_data.c_orderamount; // 累储值量-本次储值量
            if (!isNaN(cha)) {
              data["ordertotal"] = cha;
            }
          } else { // 金额表
            data["orderFee"] = this.ic_cancel_data.c_orderFee; // 本次购买金额
            let cha = this.ic_cancel_data.c_orderTotalFee - this.ic_cancel_data.c_orderFee; // 累购金额-本次购买金额
            if (!isNaN(cha)) {
              data["orderTotalFee"] = cha;
            }
          }
          resolve({ suc: 1, data: data })
        }
        else {
          reject({ suc: 2, msg: "获取退费参数时传参错误" })
        }
      })
    },
    /* 退费流程：退费检查->退费动态库写卡->退费接口 */
    // 1.退费检查
    ic_cancel_check(cbName, cancelData) {
      // 可选传如退费需要的参数
      if (cancelData != null && cancelData.constructor === Object) {
        this.ic_cancel_data = Object.assign({}, this.ic_cancel_data, cancelData);
      }
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡退费检查中...";
          let funcCode = this.icLib.icParams.cancelOrdersCheck; // 退费检查功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getIcCancelParams(1).then(res => {
            if (res.suc == 1) {
              this.icState = "退费检查";
              // 退费成功后的回调函数
              this.ic_suc_funcName = cbName;
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("退费检查参数错误", res);
              this.$alert("退费检查参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
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
    // 2.退费动态库写卡
    ic_cancel_ws() {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡退费中...";
          let funcCode = this.icLib.icParams.cancelOrders; // 退费功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getIcCancelParams(2).then(res => {
            if (res.suc == 1) {
              this.icState = "退费";
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("退费参数错误", res);
              this.$alert("退费参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
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
    // 3.退费接口调用
    ic_cancel_ajax() {
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在请求IC卡退费接口...",
      });
      let resData = {
        costRecordId: this.ic_cancel_data.costRecordId, // ic卡充值记录id
        reason: this.ic_cancel_data.c_reason, // ic卡储值取消原因
      }
      if (this.gasOrMoney == 1) {
        resData.rechargeAmount = "0.00";
        resData.rechargeQuantity = Number(this.ic_cancel_data["c_orderamount"]).toFixed(2); // 取消气量
      } else if (this.gasOrMoney == 0) {
        resData.rechargeAmount = Number(this.ic_cancel_data["c_orderFee"]).toFixed(2); // 取消金额
        resData.rechargeQuantity = "0.00";
      } else { console.error("调用ic_cancel_ajax时gasOrMoney值异常!") }
      resData.priceVersion = this.ic_cancel_data.priceVersion; // 价格版本
      icCancelCharge_api(resData).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          // 调用ic卡退费后的回调
          this.ic_cb_run();
        } else {
          let msg = "IC卡退费接口返回了一个错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$alert(msg, 'IC卡退费失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, res.data);
        }
      }).catch(err => {
        loading.close();
        let msg = "请求IC卡退费接口时遇到错误";
        if (err != 401 && err != 403) {
          this.$alert(msg, 'IC卡退费失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, err);
        }
      })
    },
    // 1.取消补气检查
    ic_cancel_bq_check(cbName, cancelData) {
      // 可选传如退费需要的参数
      if (cancelData != null && cancelData.constructor === Object) {
        this.ic_cancel_data = Object.assign({}, this.ic_cancel_data, cancelData);
      }
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡取消补气检查中...";
          let funcCode = this.icLib.icParams.cancelOrdersCheck; // 退费检查功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getIcCancelParams(1, 1).then(res => {
            if (res.suc == 1) {
              this.icState = "取消补气检查";
              // 退费成功后的回调函数
              this.ic_suc_funcName = cbName;
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("取消补气检查参数错误", res);
              this.$alert("取消补气检查参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
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
    // 2.退补气动态库写卡
    ic_cancel_bq_ws() {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡取消补气中...";
          let funcCode = this.icLib.icParams.cancelOrders; // 退费功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getIcCancelParams(2, 1).then(res => {
            if (res.suc == 1) {
              this.icState = "取消补气";
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("取消补气参数错误", res);
              this.$alert("取消补气参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
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
    // 3.取消补气接口调用
    ic_cancel_bq_ajax() {
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在请求IC卡取消补气接口...",
      });
      let resData = {
        costRecordId: this.ic_cancel_data.costRecordId, // ic卡充值记录id
        reason: this.ic_cancel_data.c_reason, // ic卡取消补气原因
        priceVersion: this.ic_cancel_data.priceVersion, // 价格版本
      }
      if (this.gasOrMoney == 1) { // 气量表
        resData.icBillingMode = 0; // ic卡表结算模式
      } else if (this.gasOrMoney == 0) { // 金额表
        resData.icBillingMode = 1; // ic卡表结算模式
      } else { console.error("调用ic_cancel_bq_ajax时gasOrMoney值异常!") }
      // 调用取消补气接口
      icCancelBuqi_api(resData).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          // 调用ic卡取消补气后的回调
          this.ic_cb_run();
        } else {
          let msg = "IC卡取消补气接口返回了一个错误";
          if (res.data.message) {
            msg = res.data.message;
          }
          this.$alert(msg, 'IC卡取消补气失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, res.data);
        }
      }).catch(err => {
        loading.close();
        let msg = "请求IC卡取消补气接口时遇到错误";
        if (err != 401 && err != 403) {
          this.$alert(msg, 'IC卡取消补气失败', { confirmButtonText: '确定', type: "error" });
          console.error(msg, err);
        }
      })
    },
  },
}