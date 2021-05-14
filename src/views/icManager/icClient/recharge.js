// ic卡充值和补气
export default {
  methods: {
    // 充值参数准备
    getRechargeCardParams(type) {
      return new Promise((resolve, reject) => {
        if (!this.ic_recharge_data.code) {
          reject({ suc: 2, msg: "厂家码为空" })
        }
        if (this.ic_recharge_data.icCardNo == null) {
          reject({ suc: 2, msg: "IC卡号为空" })
        }
        // 1:充值检查  2:充值
        if (type == 1) {
          let data = {
            compcode: "",
            cardno: "",
            customerno: "",
            orderdate: "",
            ordernum: "",
            orderFee: "",
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
          data.compcode = this.ic_recharge_data.code; // 厂家码
          data.cardno = this.ic_recharge_data.icCardNo; // ic卡号
          if (this.ic_recharge_data.userNo) {
            data.customerno = this.ic_recharge_data.userNo; // 从能源云3.0迁移过来的老用户号
          } else {
            data.customerno = intAddZero(this.ic_recharge_data.archivesNo); // 档案编号
          }
          data.ordertotal = this.ic_recharge_data.totalRechargeQuantity; // 累储值量
          data.ordernum = this.ic_recharge_data.icBuyNumber * 1 + 1; // 累购次数
          // 气量表
          if (this.gasOrMoney == 1) {
            data.orderamount = this.ic_recharge_data.curOrderAmount; // 本次购气量
          }
          // 金额表
          else {
            data.orderFee = this.ic_recharge_data.curOrderFee; // 本次购气金额
          }
          resolve({
            suc: 1, data: data
          })
        } else if (type == 2) {
          let data = {
            "compcode": "0", // 厂家码
            "cardno": "0", // ic卡号
            "customerno": "0", // 档案编号
            "orderdate": "0", // 日期
            "ordernum": "0", // 累购次数
            "orderFee": "0", // 本次储值金额
            "ordertotal": "0", // 累储值量
            "billingMethod": "0",
            "fgs": "0", // 分公司
            "glz": "0", // 管理站
            "alertLowLimit": "0",
            "overDraft": "0",
            "idleDays": "0",
            "upLimit": "0",
            "buyGasTwo": "0",
            "buyGasThree": "0",
            "meterID": "0",
            "cardStatus": "0",
            "orderTotalFee": "0",
            "priceType": "0",
            "oldPrice": "0",
            "oldSubInterval": "0",
            "oldChangeDate": "0",
            "newSubInterval": "0",
            "sellDate": "0",
            "sheetDate": "0",
            "ControllerNo": "0",
            "NodeNo": "0",
            "meterNo": "0", // 表具编号
            "areaCode": "0",
            "billingCycle": "0",
            "keycode": "0",
          };
          data.compcode = this.ic_recharge_data.code; // 厂家码
          data.cardno = this.ic_recharge_data.icCardNo; // ic卡号
          if (this.ic_recharge_data.userNo) {
            data.customerno = this.ic_recharge_data.userNo; // 从能源云3.0迁移过来的老用户号
          } else {
            data.customerno = intAddZero(this.ic_recharge_data.archivesNo); // 档案编号
          }
          data.meterNo = this.ic_recharge_data.meterNo; // 表具编号
          data.orderdate = this.getNowFormatDate(""); // 购气日期
          data.ordernum = this.ic_recharge_data.icBuyNumber * 1 + 1; // 累购次数
          data.ordertotal = this.ic_recharge_data.totalRechargeQuantity; // 累计储值气量
          // 气量表
          if (this.gasOrMoney == 1) {
            data.orderFee = "0"; // 本次购气金额
            data.orderamount = this.ic_recharge_data.curOrderAmount; // 本次购气量
          }
          // 金额表
          else {
            data.orderFee = this.ic_recharge_data.curOrderFee; // 本次购气金额
            data.orderamount = "0"; // 本次购气量
          }
          // d为默认值
          let get = (key, d) => {
            if (d == null) { d = "0" };
            if (this.ic_recharge_data[key]) {
              return this.ic_recharge_data[key];
            } else {
              return d;
            }
          }
          data.priceType = Number(get("billTypeId")) - 1; // 计价类型
          data.newPrice = this.ic_recharge_data.newPrice || "";
          let normalIcCodes = [this.icCardTypeNames['天信气量CPU卡'], this.icCardTypeNames['天信金额CPU卡'], this.icCardTypeNames['天信FCC-X双通道卡']]
          if (normalIcCodes.indexOf(this.ic_recharge_data.code) == -1) { // 非上面的卡表类型时
            if (this.ic_recharge_data.billTypeId == 1) { // 单一价
              data.newPrice = String(get("singlePrice"));
              data.timeUnit = get("timeUnitCode", "");
            }
            else if (this.ic_recharge_data.billTypeId == 2) { // 阶梯价
              data.newPrice = get("levelPrice"); // 阶梯价
              data.oldPrice = get("levelPrice"); // 阶梯价
              data.timeUnit = get("timeUnitCode", "");
              data.stepCycleStartTime = this.ic_recharge_data.cycleStartTime ? this.convertUTC(this.ic_recharge_data.cycleStartTime, "").substring(2, 10) : "";
              data.newSubInterval = get("levelBorder"); // 阶梯边界
              data.oldSubInterval = get("levelBorder"); // 阶梯边界
            }
            else if (this.ic_recharge_data.billTypeId == 3) { // 分时价
              data.newPrice = get("timePrice");
              data.timeUnit = get("timeUnitCode", "");
              data.readjustTime = this.ic_recharge_data.adjustTime ? this.ic_recharge_data.adjustTime : undefined;
              data.newSubInterval = get("priceRange");
              data.priceType = "2";
            }
          }
          data.priceVersion = get("priceVersion", "1"); // 价格版本
          if (this.ic_recharge_data.code == this.icCardTypeNames['天信FCC-X双通道卡']) {
            // 示例 2020年9月28日7点：20092807
            data.newChangeDate = this.ic_recharge_data.effectiveTime ? this.dayjs(this.ic_recharge_data.effectiveTime).format("YYMMDDHH") : ""; //生效日期
          } else {
            // 示例 2020年9月28日：20200928
            data.newChangeDate = this.ic_recharge_data.effectiveTime ? this.dayjs(this.ic_recharge_data.effectiveTime).format("YYYYMMDD") : ""; //生效日期
          }
          data.oldChangeDate = data.newChangeDate;
          data.billingCycle = this.ic_recharge_data.billingCycle ? this.ic_recharge_data.billingCycle : "0";
          for(let i in data) {
            if (i == "ordernum" || i == "orderTotalFee") {
              data[i] = Number(data[i])
            } else {
              data[i] = String(data[i]); // 全转字符串
            }
          }
          resolve({
            suc: 1, data: data
          })
        } else {
          reject({
            suc: 2, msg: "获取充值参数时传参错误"
          })
        }
      })
    },
    // 1.充值前检查
    ic_recharge_check(cbName) {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "充值检查中...";
          this.icState = "充值检查";
          let funcCode = this.icLib.icParams.writeOrdersCheck; // 功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getRechargeCardParams(1).then(res => {
            if (res.suc == 1) {
              // 制卡结束后调用的回调函数名称
              this.ic_suc_funcName = cbName;
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              this.$alert("参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
            }
          }).catch(err => {
            this.ic_loading.close();
            let msg = "参数返回时出错";
            if (err.suc == 2) {
              msg = err.msg;
            }
            this.$alert(msg, '发生错误', { confirmButtonText: '确定', type: "error" });
            console.error(msg, err);
          })
          // 制卡检查成功后调用制卡接口
        }
      }).catch(err => {
        console.error("读卡时遇到错误", err);
        if (err.loading) { err.loading.close(); }
        this.$alert("未知错误", '读卡失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // 2.调用ic卡充值接口，在icRecharge.js中
    // 3.充值动态库调用
    ic_recharge_ws() {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡充值中...";
          this.icState = "充值"; // 充值
          let funcCode = this.icLib.icParams.writeOrders; // 功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getRechargeCardParams(2).then(res => {
            this.wsSendMsg(funcCode, res.data);
          }).catch(err => {
            this.ic_loading.close();
            let msg = "IC卡充值参数返回时出错";
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
    // 补气参数准备
    getReissueParams(type) {
      return new Promise((resolve, reject) => {
        // 补气前检查
        if (type == 1) {
          let data = {
            compcode: "",
            cardno: "",
            customerno: "",
            orderdate: "", // 储值日期
            ordernum: "", // 累购次数
            fgs: "",
            glz: "",
            alertLowLimit: "",
            overDraft: "",
            idleDays: "",
            upLimit: "",
            buyGasTwo: 0,
            buyGasThree: 0,
            keycode: "",
          }
          data.compcode = this.ic_reissue_data.code; // 厂家码
          data.cardno = this.ic_reissue_data.icCardNo; // ic卡号
          if (this.ic_reissue_data.userNo) {
            data.customerno = this.ic_reissue_data.userNo; // 从能源云3.0迁移过来的老用户号
          } else {
            data.customerno = intAddZero(this.ic_reissue_data.archivesNo); // 档案编号
          }
          data.orderdate = this.getNowFormatDate(""); // 储值日期
          if (this.ic_reissue_data.bqType == 1) { // 丢气补气
            data.ordernum = this.ic_reissue_data.icBuyNumber; // 累购次数不变
          } else { // 换表补气
            data.ordernum = this.ic_reissue_data.icBuyNumber * 1 + 1; // 累购次数+1
          }
          // 气量表
          if (this.gasOrMoney == 1) {
            data.ordertotal = this.ic_reissue_data.totalRechargeQuantity; // 累购气量
            data.orderamount = this.ic_reissue_data.bqAmount; // 本次购气量
          }
          // 金额表
          else {
            data.orderFee = this.ic_reissue_data.bqMoney; // 本次购气金额
            data.orderTotalFee = this.ic_reissue_data.totalRechargeAmount; // 累购金额
          }
          resolve({ suc: 1, data: data })
        }
        // 补气
        else if (type == 2) {
          let data = {
            compcode: "", // 厂家码
            alertLowLimit: "0",
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
            newChangeDate: "", // 生效日期
            sellDate: "",
            sheetDate: "",
            ControllerNo: "",
            NodeNo: "",
            meterNo: "",
            areaCode: "",
            newPrice: "", // 价格
            version: "1", // 版本
            priceVersion: "1", // 价格版本
            billingCycle: "", // 
            cardno: "", // IC卡号
            customerno: "", // 
            orderdate: "", // 购气日期
            ordernum: "", // 累购次数
            fgs: "",
            glz: "",
            keycode: "",
          }
          // d为默认值
          let get = (key, d) => {
            if (d == null) { d = "0" };
            if (this.ic_reissue_data[key]) {
              return this.ic_reissue_data[key];
            } else {
              return d;
            }
          }
          if (this.ic_reissue_data.code == null) {
            reject({ suc: 2, msg: "厂家码为空" })
          }
          if (this.ic_reissue_data.icCardNo == null) {
            reject({ suc: 2, msg: "IC卡号为空" })
          }
          data.compcode = this.ic_reissue_data.code; // 厂家码
          data.cardno = this.ic_reissue_data.icCardNo; // ic卡号
          data.billingCycle = this.ic_reissue_data.billingCycle ? this.ic_reissue_data.billingCycle : "0"; // 计费周期
          if (this.ic_reissue_data.code == this.icCardTypeNames['天信FCC-X双通道卡']) {
            // 示例 2020年9月28日7点：20092807
            data.newChangeDate = this.ic_reissue_data.effectiveTime ? this.dayjs(this.ic_reissue_data.effectiveTime).format("YYMMDDHH") : ""; //生效日期
          } else {
            // 示例 2020年9月28日：20200928
            data.newChangeDate = this.ic_reissue_data.effectiveTime ? this.dayjs(this.ic_reissue_data.effectiveTime).format("YYYYMMDD") : ""; //生效日期
          }
          data.oldChangeDate = data.newChangeDate;
          if (this.ic_reissue_data.userNo) {
            data.customerno = this.ic_reissue_data.userNo; // 从能源云3.0迁移过来的老用户号
          } else {
            data.customerno = intAddZero(this.ic_reissue_data.archivesNo); // 档案编号
          }
          data.writeOrderFlag = "0"; // 购气标志，0表示是补气操作
          if (this.gasOrMoney == null) {
            reject({ suc: 2, msg: "参数缺失，无法判断气量表还是金额表" })
          }
          data.priceType = Number(get("billTypeId")) - 1; // 计价类型
          data.priceVersion = get("priceVersion", "1"); // 价格版本
          if (this.ic_reissue_data.billTypeId == 1) { // 单一价
            data.newPrice = String(get("singlePrice"));
            data.timeUnit = get("timeUnitCode", "");
          }
          else if (this.ic_reissue_data.billTypeId == 2) { // 阶梯价
            data.newPrice = get("levelPrice"); // 阶梯价
            data.timeUnit = get("timeUnitCode", "");
            data.stepCycleStartTime = this.ic_reissue_data.cycleStartTime ? this.convertUTC(this.ic_reissue_data.cycleStartTime, "").substring(2, 10) : "";
            data.newSubInterval = get("levelBorder"); // 阶梯边界
          }
          else if (this.ic_reissue_data.billTypeId == 3) { // 分时价
            data.newPrice = get("timePrice");
            data.timeUnit = get("timeUnitCode", "");
            data.readjustTime = this.ic_reissue_data.adjustTime ? this.ic_reissue_data.adjustTime : undefined;
            data.newSubInterval = get("priceRange");
            data.priceType = "2";
          }
          // 气量表
          if (this.gasOrMoney == 1) {
            data.orderFee = "0"; // 本次购气金额
            data.orderTotalFee = "0"; // 累购金额
            data.ordertotal = this.ic_reissue_data.totalRechargeQuantity; // 累购气量
            data.orderamount = this.ic_reissue_data.bqAmount; // 本次购气量
          }
          // 金额表
          else {
            data.orderFee = this.ic_reissue_data.bqMoney; // 本次购气金额
            data.orderTotalFee = this.ic_reissue_data.totalRechargeAmount; // 累购金额
            data.ordertotal = "0"; // 累购气量
            data.orderamount = "0"; // 本次购气量
          }
          if (this.ic_reissue_data.bqType == 1) { // 丢气补气
            data.ordernum = this.ic_reissue_data.icBuyNumber; // 累购次数不变
          } else { // 换表补气或赠送补气
            data.ordernum = this.ic_reissue_data.icBuyNumber * 1 + 1; // 累购次数+1
          }
          resolve({ suc: 1, data: data })
        }
        else {
          reject({ suc: 2, msg: "获取补气参数时传参错误" })
        }
      })
    },
    // 1.补气检查
    ic_reissue_check(cbName) {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡补气检查中...";
          let funcCode = this.icLib.icParams.writeOrdersCheck; // 补气检查功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getReissueParams(1).then(res => {
            if (res.suc == 1) {
              this.icState = "补气检查";
              // 补气成功后的回调函数
              this.ic_suc_funcName = cbName;
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("补气检查参数错误", res);
              this.$alert("补气检查参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
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
    // 2.调用补气接口，在icRecharge.js中
    // 3.补气动态库调用
    ic_reissue_ws() {
      this.ic_connectServer().then(res => {
        if (res.loading) { res.loading.close(); }
        if (res.msg == "true") {
          let txt = "IC卡补气中...";
          let funcCode = this.icLib.icParams.writeOrders; // 补气功能码
          this.ic_loading = this.$loading({
            background: "rgba(0,0,0,0.7)",
            text: txt,
          });
          this.getReissueParams(2).then(res => {
            if (res.suc == 1) {
              this.icState = "补气";
              this.wsSendMsg(funcCode, res.data);
            } else {
              this.ic_loading.close();
              console.error("补气参数错误", res);
              this.$alert("补气参数返回错误：未知错误", '异常', { confirmButtonText: '确定', type: "error" });
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
  },
}