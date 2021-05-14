/* 储值补气 */
import { NumToFix, hasLetter } from "@/utils/index.js";
import { recharge, reissue } from "@/api/recharge.js";
import { payModeQL } from "@/utils/queryList/queryList.js";
let payModeList = [];
for (let k in payModeQL) {
  payModeList.push({
    label: payModeQL[k],
    value: k
  })
}
export default {
  data() {
    return {
      storeTab: this.$route.query && this.$route.query.storeTab ? this.$route.query.storeTab : 1, // 储值补气tab切换
      payModeList: payModeList,
      payType: "1", // 默认支付方式为现金

      otherPayCostList: [], // 待收费的其他费用列表(缴费下面的)
      costRecordId_Money_QL: {}, // 待收费列表中id-->金额映射表
      otherFee: [], // 其他费用勾选列表
      otherFeeIds: '', // 其他费用id合计
      otherFeeTotal: 0, // 其他费用勾选合计
      paperCostRecordIds: {},
      rechargeMoney: 0, // 充值金额
      rechargeAmount: 0, // 充值气量
      checkNo: "", // 支票号
      bqForm: {
        bqMoney: 0, // 补气金额
        bqAmount: 0, // 补气量
        bqType: "1", // 补气类型
        reissueReason: "", // 补气原因,
      },
      bqFormRules: {
        // 补气金额
        bqMoney: [
          {
            validator: (rule, value, callback) => {
              if (this.gasOrMoney == 0) {
                if (isNaN(value)) {
                  callback(new Error("请输入合法的数字"));
                } else if (value < 0) {
                  callback(new Error("补气金额不可为负数"));
                } else if (value > 20000000) {
                  callback(new Error("补气金额超出最大值"));
                } else if (value == 0) {
                  callback(new Error("补气金额不可为0"));
                } else if (this.icInfo.icCardNo && isFloat(value)) {
                  callback(new Error("补气金额需为整数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        // 补气量
        bqAmount: [
          {
            validator: (rule, value, callback) => {
              if (this.gasOrMoney == 1) {
                if (isNaN(value)) {
                  callback(new Error("请输入合法的数字"));
                } else if (value < 0) {
                  callback(new Error("补气量不可为负数"));
                } else if (value > 2000000) {
                  callback(new Error("补气量超出最大值"));
                } else if (value == 0) {
                  callback(new Error("补气量不可为0"));
                } else if (this.icInfo.icCardNo && isFloat(value)) {
                  callback(new Error("补气量需为整数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        // 补气原因
        reissueReason: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.trim() == "") {
                callback(new Error("补气原因不可为空"));
              } else if (value.length > 64) {
                callback(new Error("补气原因不可超过64个字符"));
              } else {
                callback();
              }
            }
          }
        ],
      },
      paidIn: 0, // 实收金额
      gasOrMoney: 0, // 1气量表0金额表
      /*
      此处充值金额和实收金额规则分开的原因：
      充值金额和实收金额存在联动关系，如果用同一规则校验，校验时会相互干扰，
      如果规则独立，则可以做到，当一者的规则校验通过时，自动计算另一者的值。
      充值金额与充值气量分开也是同样的道理
      */
      // 充值气量表单校验
      rechargeGasRules: {
        rechargeAmount: [
          {
            validator: (rule, value, callback) => {
              let v = Number(this.rechargeAmount);
              if (isNaN(v)) {
                callback(new Error("请输入合法的数字"));
              } else if (v < 0) {
                callback(new Error("充值气量不可为负数"));
              } else if (v > 20000000) {
                callback(new Error("充值气量超出最大值"));
              } else if (v == 0 && this.otherFeeTotal == 0) {
                callback(new Error("充值气量不可为0"));
              } else if (this.icInfo.icCardNo && isFloat(v)) {
                callback(new Error("充值气量需为整数"));
              } else {
                callback();
              }
            }
          }
        ],
      },
      // 充值金额表单校验
      rechargeRules: {
        rechargeMoney: [
          {
            validator: (rule, value, callback) => {
              let v = Number(this.rechargeMoney);
              if (isNaN(v)) {
                callback(new Error("请输入合法的数字"));
              } else if (v < 0) {
                callback(new Error("充值金额不可为负数"));
              } else if (v > 20000000) {
                callback(new Error("充值金额超出最大值"));
              } else if (v == 0 && this.otherFeeTotal == 0) {
                callback(new Error("充值金额不可为0"));
              } else if (this.icInfo.icCardNo && isFloat(v)) {
                callback(new Error("充值金额需为整数"));
              } else {
                callback();
              }
            }
          }
        ],
      },
      // 实收金额表单校验
      shishouRules: {
        shishouMoney: [
          {
            validator: (rule, value, callback) => {
              let mixValue = NumToFix(this.otherFeeTotal, 2);
              let v = this.paidIn;
              if (isNaN(v)) {
                callback(new Error("请输入合法的数字"));
              } else if (v < mixValue) {
                callback(new Error("实收金额超出最小值"));
              } else if (v > 9999999999.99) {
                callback(new Error("实收金额超出最大值"));
              } else if (v == 0 && this.otherFeeTotal == 0) {
                callback(new Error("实收金额不可为0"));
              } else {
                callback();
              }
            }
          }
        ],
      },
      payStateShow: false, // 缴费成功的弹窗
      sucMsg: {
        title: '充值成功',
        subTitle: "已充值",
        number: "0",
        go: '继续',
      },
      sucType: 1, // 弹窗类型，1:远传表充值成功 2远程表补气成功
      confirmDialogVisible: false, //确认用户是否充值弹窗
      confirmTitle: '',//确认弹窗金额的title
    }

  },
  computed: {},
  mounted() {

  },
  methods: {
    // 改变充值和补气tab
    changeStoreTab(state) {
      this.storeTab = state;
    },
    // 充值和补气输入异常数据时重置操作
    rechargeResetReturn() {
      return; // 已修改异常处理
      this.rechargeMoney = 0;
      this.rechargeAmount = 0;
      // 重置阶梯价
      if (this.billingTypeId == 2) {
        this.levelPriceList = this.levelPriceList.map(item => {
          item.pay = 0;
          item.curAmount = 0;
          return item;
        });
      }
      // 更新实收金额
      this.paidIn = NumToFix(this.rechargeMoney + this.otherFeeTotal, 2, false);
    },
    // 充值金额变化-->计算充值气量和实收金额
    rechargeMoneyChange() {
      let ok = false;
      // 气量表
      if (this.gasOrMoney == 1) {
        ok = true;
      } else {
        this.$refs['rechargeForm'].validate(valid => {
          ok = valid ? true : false;
        })
      }
      if (!ok) { return; }
      this.rechargeMoney = NumToFix(Math.abs(this.rechargeMoney), 2, false);
      let value = this.rechargeMoney;
      // 单一计价
      if (this.billingTypeId == 1) {
        if (this.priceData.singlePrice && this.priceData.singlePrice != '--') {
          this.rechargeAmount = NumToFix(value / this.priceData.singlePrice, 4);
        }
      }
      // 阶梯计价
      else if (this.billingTypeId == 2) {
        // 0: 普表, 1: IC卡, 2: 远传表, 3: IC卡远传表
        if (Number(this.meterCategory) == 0 || Number(this.meterCategory) == 2) {
        }
        // IC卡表 - 阶梯试算功能
        else if (Number(this.meterCategory) == 1 || Number(this.meterCategory) == 3) {
          // 原阶梯试算数组和各阶余量数组
          let [list, cycSurplusList] = [this.levelPriceList, this.cycSurplusList];
          let totalQi = 0;
          let zero = false; // 当上级阶梯已经无剩余时，下级都是0
          if (list.length) {
            let remain = value;
            for (let i = 0; i < list.length; i++) {
              if (i > 0) {
                // 当前阶梯剩余金额 = 总输入金额 - 当前阶梯之前所有的金额总和
                remain = remain - list[i - 1].curAmount * list[i - 1].price;
              }
              // 上阶余量已为0
              if (zero) {
                list[i].pay = 0;
                list[i].curAmount = 0;
              }
              // 各阶余量数组中当前阶梯已为0时，跳过本阶梯
              else if (cycSurplusList[i] == 0) {
                list[i].curAmount = list[i].pay = 0;
              }
              // 当前剩余金额小于等于当前阶梯余量 或 最后一阶
              else if (i == list.length - 1 || remain <= cycSurplusList[i] * list[i].price) {
                list[i].pay = remain;
                list[i].curAmount = remain / list[i].price;
                zero = true;
              }
              // 减去当前阶梯气量后仍存在剩余
              else {
                list[i].pay = cycSurplusList[i] * list[i].price;
                list[i].curAmount = cycSurplusList[i];
              }
              list[i].pay = NumToFix(list[i].pay, 2, false); // 当前阶梯的试算金额
              list[i].curAmount = NumToFix(list[i].curAmount, 4); // 当前阶梯的试算气量
              totalQi += list[i].curAmount; // 累计试算气量
            }
            // 更新阶梯价格表
            this.levelPriceList = list;
            // 更新充值气量
            this.rechargeAmount = NumToFix(totalQi, 4);
          }
        }
      }
      // 更新应缴金额
      this.paidIn = NumToFix((value + Number(this.otherFeeTotal)), 2);
    },
    // 充值气量变化-->计算充值金额和实收金额
    rechargeAmountChange() {
      let ok = false;
      this.$refs['rechargeGasForm'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      this.rechargeAmount = NumToFix(Math.abs(this.rechargeAmount), 4);
      let value = this.rechargeAmount;
      // 单一计价
      if (this.billingTypeId == 1) {
        if (this.priceData.singlePrice && this.priceData.singlePrice != '--') {
          this.rechargeMoney = NumToFix(value * this.priceData.singlePrice, 2, false);
        }
      }
      // 阶梯计价
      else if (this.billingTypeId == 2) {
        // 0: 普表, 1: IC卡, 2: 远传表, 3: IC卡远传表
        if (Number(this.meterCategory) == 0 || Number(this.meterCategory) == 2) {
        }
        // IC卡表 - 阶梯试算功能
        else if (Number(this.meterCategory) == 1 || Number(this.meterCategory) == 3) {
          // 原阶梯试算数组和各阶余量数组
          let [list, cycSurplusList] = [this.levelPriceList, this.cycSurplusList];
          let money = 0; // 充值总金额
          let zero = false; // 当上级阶梯已经无剩余时，下级都是0
          if (list.length) {
            let remain = value; // 试算时的剩余气量
            for (let i = 0; i < list.length; i++) {
              if (i > 0) {
                // 当前阶梯剩余气量 = 总输入气量 - 当前阶梯之前的气量
                remain = remain - list[i - 1].curAmount;
                if (remain <= 0) { remain = 0 }
              }
              // 已无剩余气量 或者 各阶余量数组中当前阶梯已为0时，跳过本阶梯
              if (zero || cycSurplusList[i] == 0) {
                list[i].curAmount = list[i].pay = 0;
              }
              // 当前剩余气量小于等于当前阶梯剩余气量 或 最后一阶
              else if (i == list.length - 1 || remain <= cycSurplusList[i]) {
                list[i].pay = remain * list[i].price;
                list[i].curAmount = remain;
                zero = true;
              }
              // 减去当前阶梯气量后仍存在剩余
              else {
                list[i].pay = cycSurplusList[i] * list[i].price;
                list[i].curAmount = cycSurplusList[i];
              }
              list[i].pay = NumToFix(list[i].pay, 2, false); // 当前阶梯的试算金额
              list[i].curAmount = NumToFix(list[i].curAmount, 4); // 当前阶梯的试算余量
              money += list[i].pay;
            }
            // 更新阶梯价格表
            this.levelPriceList = list;
            // 更新充值金额
            this.rechargeMoney = NumToFix(money, 2, false);
          }
        }
      }
      // 更新实收金额
      this.paidIn = NumToFix((this.rechargeMoney + Number(this.otherFeeTotal)), 2);
    },
    // 实收金额变化-->计算充值金额
    paidInChange() {
      let ok = false;
      this.$refs['shishouMoney'].validate(valid => {
        ok = valid ? true : false;
      })
      if (!ok) { return; }
      this.paidIn = NumToFix(this.paidIn, 2);
      this.rechargeMoney = NumToFix(this.paidIn - this.otherFeeTotal, 2);
      if (this.gasOrMoney == 1) {
        this.rechargeMoneyChange();
      }
    },
    // 其他费用勾选变化
    otherCostChange() {
      let otherFeeTotal = 0; // 其他费用金额统计
      this.otherFee.forEach(item => {
        if (this.costRecordId_Money_QL[item]) {
          otherFeeTotal += this.costRecordId_Money_QL[item];
        }
      })
      this.otherFeeTotal = otherFeeTotal.toFixed(2); // 更新勾选其他费用合计
      this.paidIn = NumToFix(Number(this.rechargeMoney) + otherFeeTotal, 2); // 更新应缴费用
    },
    // 充值前验证
    rechargeVerify() {
      if (!this.archivesId) {
        this.$message.error("没有待充值的档案");
        return;
      }
      if (this.rechargeDisable) {
        this.$message.error("当前档案状态无法充值");
        return;
      }
      if (this.blackFlag) {
        this.$message.error("黑名单用户禁止充值");
        return;
      }
      let ok = 0;
      // 气量表
      if (this.gasOrMoney == 1) {
        // 充值气量校验
        this.$refs['rechargeGasForm'].validate(valid => {
          valid ? ok++ : null;
        })
      }
      // 金额表
      else {
        // 充值金额校验
        this.$refs['rechargeForm'].validate(valid => {
          valid ? ok++ : null;
        })
      }
      // 实收金额校验
      this.$refs['shishouMoney'].validate(valid => {
        valid ? ok++ : null;
      })
      if (ok < 2) { this.$message.error("请修正错误"); return; }
      if (this.payType == 4) {
        if (this.checkNo == "") {
          this.$message.error("请输入支票号");
          return;
        }
        if (this.checkNo.length > 18) {
          this.$message.error("支票号不可大于18位");
          return;
        }
      }
      let otherFeeIds = ""; // 其它费用的id
      let otherFeeTotal = 0; // 其他费用金额统计
      this.otherFee.forEach((item, index) => {
        if (index == 0) {
          otherFeeIds = String(item);
        } else {
          otherFeeIds = otherFeeIds + "," + String(item);
        }
        // 汇总勾选的其他费用金额
        if (this.costRecordId_Money_QL[item]) {
          otherFeeTotal += this.costRecordId_Money_QL[item];
        }
      })
      this.otherFeeIds = otherFeeIds;
      this.otherFeeTotal = otherFeeTotal.toFixed(2);
      if (!this.rechargeMoney) { // 只缴纳其他费用
        if (!otherFeeIds) {
          this.$message.error("没有待充值的费用");
          return;
        } else {
          if (this.payType == 4) {
            this.$alert('当仅缴纳其他费用时，无法使用支票付款，请选择其他付款方式，谢谢！', '提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
          } else {
            this.$confirm('充值金额为空，将只缴纳其他费用，是否继续充值？', '提示', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
            }).then(() => {
              this.meterCategoryJudge(true);
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '已取消充值'
              });
              console.error("已取消充值", err);
            });
          }
        }
      } else {
        // 1.IC卡表 2.IC远传表且不支持远传充值
        if (this.meterCategory == 1 || (this.meterCategory == 3 && this.remoteRechargeFlag != 1)) {
          if (this.icInfo.icCardNo == null) {
            this.$message.info("此表需读卡后才能充值");
            return;
          }
        }
        this.confirmTitle = "充值";
        this.confirmDialogVisible = true;
        // this.meterCategoryJudge();
      }
    },
    // 判断卡表类型 表类型 0:普表,1:IC卡,2:远传表,3:IC卡远传表
    // onlyOther为true时代表只缴纳其他费用，此时IC卡表不写卡
    meterCategoryJudge(onlyOther) {
      let type = Number(this.meterCategory);
      switch (type) {
        // IC卡表
        case 1:
          if (onlyOther) {
            this.recharge_ic_ajax(true);
          } else {
            this.recharge_ic()
          }
          break;
        // 远传表
        case 2:
          this.recharge();
          break;
        // IC卡远传表,读卡时调用ic卡充值，未读卡调用远传充值
        case 3:
          if (this.icInfo.icCardNo) {
            if (onlyOther) {
              this.recharge_ic_ajax(true);
            } else {
              this.recharge_ic();
            }
          } else {
            this.recharge();
          }
          break;
        // 其他
        default:
          this.$alert("抱歉：此表类型不支持充值。");
          break;
      }
    },
    // 远传表充值
    recharge() {
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
      const loading = this.$loading({
        background: "rgba(0,0,0,0.7)",
        text: "正在充值，请稍等...",
      });
      recharge({
        archivesId: this.archivesId,
        costRecordIds: this.otherFeeIds,
        paidAmount: paidAmount,
        payMode: this.payType,
        checkNo: this.payType == 4 ? this.checkNo : undefined,
        rechargeAmount: rechargeMoney,
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          let sucMsg = {
            title: '充值成功',
            subTitle: '已充值',
            go: '继续'
          }
          if (this.gasOrMoney == 1) {
            sucMsg.number = this.rechargeAmount; // 充值气量
          } else {
            this.paperCostRecordIds = res.data.data;
            sucMsg.number = this.rechargeMoney; // 充值金额
          }
          this.sucMsg = sucMsg;
          this.payStateShow = true;
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          this.$message.error("充值失败：" + msg);
        }
      }).catch(err => {
        loading.close();
        let msg = "充值时遇到了错误";
        console.error(msg, err);
        this.$message.error(msg);
      })
    },
    // 补气输入框失焦事件
    bqBlur(value) {
      if (this.gasOrMoney == 1) { // 气量表
        this.bqForm.bqAmount = Number(this.bqForm.bqAmount).toFixed(2);
      } else { // 金额表
        this.bqForm.bqMoney = Number(this.bqForm.bqMoney).toFixed(2);
      }
    },
    // 补气前的验证
    buqiVerify() {
      if (this.rechargeDisable) {
        this.$message.error("当前档案状态无法补气");
        return;
      }
      if (this.meterCategory == 3 && this.icInfo.icCardNo == null && this.remoteRechargeFlag != 1) {
        this.$message.info("此表需读卡后才能补气");
        // this.$alert('IC卡气量表请读卡后再进行补气操作', '提示', { confirmButtonText: '确定', type: "info" });
        return;
      }
      if (!this.archivesId) {
        this.$message.error("没有待补气的档案");
        return;
      }
      this.$refs["bqForm"].validate(valid => {
        if (valid) {
          // this.buqiCategoryJudge();
          this.confirmTitle = "补气";
          this.confirmDialogVisible = true;
        } else {
          this.$message.error("请修正错误");
        }
      })
    },
    //确认充值//补气
    rechargeGo() {
      this.confirmDialogVisible = false;
      setTimeout(() => {
        if (this.storeTab == 1) {
          this.meterCategoryJudge();
        } else if (this.storeTab == 2) {
          this.buqiCategoryJudge();
        }
      }, 100)
    },
    // 补气时判断卡表类型 表类型 0:普表,1:IC卡,2:远传表,3:IC卡远传表
    buqiCategoryJudge() {
      let type = Number(this.meterCategory);
      switch (type) {
        // IC卡表
        case 1:
          this.buqi_ic();
          break;
        // 远传表
        case 2:
          this.buqi();
          break;
        // IC卡远传表
        case 3:
          if (this.icInfo.icCardNo) {
            this.buqi_ic();
          } else {
            this.buqi();
          }
          break;
        // 其他
        default:
          this.$alert("抱歉：此表类型不支持补气。");
          break;
      }
    },
    // 补气
    buqi() {
      this.bqForm.bqMoney = Number(this.bqForm.bqMoney).toFixed(2);
      reissue({
        archivesId: this.archivesId,
        reason: this.bqForm.reissueReason.trim(),
        rechargeAmount: this.bqForm.bqMoney,
      }).then(res => {
        if (res.data.code == 0) {
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
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          this.$message.error("补气失败：" + msg);
        }
      }).catch(err => {
        console.error("补气请求中报错", err);
        this.$message.error("补气失败-请求失败")
      })
    },
    // 继续缴费
    goOn() {
      this.clearInfo();
      this.payStateShow = false;
    },
  },
}