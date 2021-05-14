import { NumToFix, hasLetter } from "@/utils/index.js";
import { icRecharge_confirm, icReissueGas } from "@/api/recharge.js";
export default {
  data() {
    return {
      icInfo: {
        dataByRead: {},
      }, // ic卡信息
      paperDetails: {
        costRecordIds:''
      },
    }
  },
  computed: {
    // ic卡内余额
    calc_balance: {
      get() {
        if (this.icInfo && this.icInfo.dataByRead != null && this.icInfo.dataByRead.orderAmount != null) {
          if (this.gasOrMoney == 1) {
            return this.icInfo.dataByRead.orderAmount + ""; // 气量表
          } else if (this.gasOrMoney == 0) { // 金额表
            if (this.icInfo.dataByRead.orderFee) {
              return this.icInfo.dataByRead.orderFee + "";
            } else {
              return this.icInfo.dataByRead.orderAmount + "";
            }
          } else {
            return "0";
          }
        } else {
          return "--";
        }
      },
      set() { }
    },
  },
  mounted() {
  },
  methods: {
    // IC卡读卡后的处理
    afterIcRead(data) {
      this.icInfo = data;
      if (data && data.archivesId != null){
        this.archivesId = data.archivesId; // 档案id
        // 查询档案
        this.getArchiveData(data.archivesId);
        // 查询其他费用
        this.getOtherCost();
      }
    },
    // ic卡充值按钮点击 点重新读一次卡再充值
    recharge_ic() {
      this.ICCard_read('readBeforeRecharge');
    },
    // 读卡成功，待充值
    readBeforeRecharge(data) {
      this.icInfo = data; // 更新ic卡信息
      this.archivesId = data.archivesId; // 档案id
      // 查询档案
      this.getArchiveData(data.archivesId);
      // 查询其他费用
      this.getOtherCost(true);
      // 由于充值主要是档案id更新即可，所以档案详情的异步查询此处暂不处理
      setTimeout(() => {
        this.recharge_ic_b(); // 开始充值
      }, 200)
    },
    // 读卡成功，开始充值相关检查
    recharge_ic_b() {
      if (this.icInfo.dataByRead.companyCode == "601310" && this.rechargeMoney > 20000000) {
        this.$alert("充值金额超出最大值，请重新填写。（FCC-X最大充值金额为两千万）", '提示', { confirmButtonText: '确定', type: "error" });
        return;
      }
      if (this.icInfo == null || this.icInfo.icCardNo == null) {
        this.$alert("IC卡表请先读卡再充值", '提示', { confirmButtonText: '确定', type: "error" });
        return;
      }
      let data = this.icInfo;
      if (this.gasOrMoney == 1) { // 气量表
        data.curOrderAmount = this.rechargeAmount;
      } else { // 金额表
        data.curOrderFee = this.rechargeMoney;
      }
      // 实收金额
      data.paidIn = NumToFix(this.rechargeMoney + this.otherFeeTotal, 2);
      this.ic_recharge_data = data;
      let cbName = "icRechargeAfter";
      // ic卡充值检查
      this.ic_recharge_check(cbName);
    },
    // IC卡充值-请求接口 onlyOther为true时仅缴纳其他费用，无需读卡写卡
    recharge_ic_ajax(onlyOther) {
      let paidAmount = 0; // 实收金额=充值金额+其他费用金额
      if (this.rechargeMoney && !isNaN(this.rechargeMoney)) {
        paidAmount = NumToFix(paidAmount + Number(this.rechargeMoney), 2);
      }
      if (this.otherFeeTotal && !isNaN(this.otherFeeTotal)) {
        paidAmount = NumToFix(paidAmount + Number(this.otherFeeTotal), 2);
      }
      let rechargeMoney = 0; // 充值金额
      if (!this.rechargeMoney || isNaN(this.rechargeMoney)) {
        rechargeMoney = 0;
      } else {
        rechargeMoney = Number(this.rechargeMoney);
      }
      let resData = {
        archivesId: this.archivesId,
        paidAmount: paidAmount,
        payModel: this.payType,
        rechargeAmount: rechargeMoney,
      }
      if (this.icInfo.cycSurplus != null) {
        resData.cycSurplus = this.icInfo.cycSurplus;
      }
      // 其他费用
      if (this.otherFeeIds != null && this.otherFeeIds != "") { resData.costRecordIds = this.otherFeeIds }
      if (this.payType == 4) { resData.checkNo = this.checkNo }; // 支票号
      if (this.gasOrMoney == 1) {
        resData.rechargeQuantity = this.rechargeAmount; // 充值气量
        resData.rechargeAmount = 0; // TODO:充值金额
      } else {
        resData.rechargeQuantity = 0; // TODO:充值气量
        resData.rechargeAmount = this.rechargeMoney; // 充值金额
      }
      if (this.icInfo.cycEndTime != null) {
        resData.cycEndTime = this.icInfo.cycEndTime; // 周期截止时间
      }
      if (this.icInfo.cycleQuantity != null) {
        resData.cycleQuantity = this.icInfo.cycleQuantity; // 周期累积量
      }
      if (onlyOther) {
        this.ic_suc_funcName = "icRechargeAfter"; // 只缴纳其他费用成功后的回调
      }
      resData.priceVersion = this.icInfo.priceVersion; // 价格版本
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "已发出充值请求，请稍等...",
      });
      icRecharge_confirm(resData).then(res => {
        loading.close();
        if (res.data && res.data.code == 0) {
          this.paperDetails = res.data.data
          // 调用ic卡充值后的回调
          this.ic_cb_run();
        } else {
          let msg = res.data && res.data.message ? res.data.message : "IC卡充值接口返回了一个错误";
          if (res.data.code == "590012") {
            msg = "IC卡不存在";
          }
          this.$alert(msg, 'IC卡充值失败', { confirmButtonText: '确定', type: "error" });
        }
      }).catch(err => {
        loading.close();
        let msg = "充值时遇到了错误";
        console.error(msg, err);
        this.$alert(msg, 'IC卡充值失败', { confirmButtonText: '确定', type: "error" });
      })
    },
    // IC卡充值成功后的回调函数
    icRechargeAfter() {
      let sucMsg = {
        title: '充值成功',
        subTitle: '已充值',
        go: '继续'
      }
      this.paperCostRecordIds = this.paperDetails;
      if (this.gasOrMoney == 1) {
        sucMsg.number = this.rechargeAmount; // 充值气量
      } else {
        sucMsg.number = this.rechargeMoney; // 充值金额
      }
      this.sucMsg = sucMsg;
      this.payStateShow = true;
    },
    // ic卡补气前先读卡
    buqi_ic() {
      this.ICCard_read('readBeforeBuqi');
    },
    // 读卡成功，补气前刷新数据
    readBeforeBuqi(data) {
      this.icInfo = data; // 更新ic卡信息
      this.archivesId = data.archivesId; // 档案id
      // 查询档案
      this.getArchiveData(data.archivesId);
      // 查询其他费用
      this.getOtherCost(true);
      // 由于充值主要是档案id更新即可，所以档案详情的异步查询此处暂不处理
      setTimeout(() => {
        this.buqi_ic_b(); // 开始补气
      }, 200)
    },
    // IC卡补气
    buqi_ic_b() {
      if (this.icInfo == null || this.icInfo.icCardNo == null) {
        this.$alert("IC卡表请先读卡再充值", '提示', { confirmButtonText: '确定', type: "error" });
        return;
      }
      // 禁止刚制卡就丢气补气，因为卡内次数为0时进行丢气补气，卡内金额无变化
      if (this.icInfo.dataByRead.orderNum == "0" && this.bqForm.bqType == "1") {
        this.$alert("新制卡的档案不可丢气补气", '提示', { confirmButtonText: '确定', type: "error" });
        return;
      }
      this.ic_reissue_data = Object.assign({}, this.icInfo, this.bqForm);
      let cbName = "icReissueAfter";
      // ic卡补气检查
      this.ic_reissue_check(cbName);
    },
    // 补气接口请求
    ic_reissue_ajax() {
      let resData = {
        archivesId: this.archivesId, // 档案id
        reason: this.bqForm.reissueReason.trim(), // 补气原因
        reissueGasAmount: this.bqForm.bqMoney, // 补气金额
        reissueGasQuantity: this.bqForm.bqAmount, // 补气气量
        reissueGasType: this.bqForm.bqType, // 补气类型
        priceVersion: this.ic_reissue_data.priceVersion, // 价格版本
      };
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "已发出补气请求，请稍等...",
      });
      icReissueGas(resData).then(res => {
        loading.close();
        if (res.data.code == 0) {
          // 调用补气动态库
          this.ic_reissue_ws();
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          this.$message.error("补气失败：" + msg);
        }
      }).catch(err => {
        loading.close();
        console.error("补气请求中报错", err);
        this.$message.error("补气失败-请求失败")
      })
    },
    // 补气成功后的回调
    icReissueAfter() {
      let sucMsg = {
        title: '补气成功',
        subTitle: '已补气',
        go: '继续'
      }
      if (this.gasOrMoney == 1) {
        sucMsg.number = this.bqForm.bqAmount; // 补气量
      } else {
        sucMsg.number = this.bqForm.bqMoney; // 补气金额
      }
      this.sucMsg = sucMsg;
      this.payStateShow = true;
    },
    // 跳转到ic卡详情页
    gotoIcDetail() {
      if (this.icInfo.icCardNo == null) {
        this.$message.error("尚未读取到IC卡信息");
        return;
      }
      // 读卡成功后需要在传到档案详情页
      let key = "icReadData_" + this.icInfo.archivesId;
      this.$ls.set(key, this.icInfo);
      // 跳转
      this.$store.commit("spTabAdd", {
        preName: "ICDetail",
        sp_id: this.icInfo.archivesId,
        keepName: "ic-card-detail",
        title: "IC卡详情",
        path: "/ic-card-detail",
        query: {
          sp_id: this.icInfo.archivesId,
          makeCardFlag: 1
        }
      });
    },
  }
}