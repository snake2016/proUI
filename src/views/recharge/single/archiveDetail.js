/* 档案详情 */
import {
  userTypeReverseList,
  billingTypeIdQL,
  costTypeQL,
  costRecordStatusQL,
  archiveStateQL,
} from "@/utils/queryList/queryList.js";
import {
  getArchivesDetail, // 档案详情查询
  getArchivesOther, // 其它费用记录
} from "@/api/archivesAPI.js"
import {
  convertUTC,
  NumToFix
} from "@/utils/index.js"
import { solveTimePrice } from "@/utils/privateFunc.js"

export default {
  data() {
    return {
      archivesId: null, // 档案id
      archiveStateQL: archiveStateQL, // 档案状态id->name映射表
      archivesData: {
        archivesNo: '',
        userName: "--", // 用户名称
        userType: "--", // 用户类型
        userMobile: "--", // 手机号
        certificateNo: "--", // 身份证号
        meterNo: "--", // 表具编号
        meterTypeName: "--", // 表类型名称
        address: "--", // 表具地址=regionName+addressAreaName+addressName
      },
      blackFlag: false, // 是否是黑名单
      billingTypeId: null, // 计费类型：1单一 2阶梯 3分时
      levelPriceList_left: [], // 左边显示的阶梯价数组
      cycSurplusList: [], // 各阶余量数组
      cycSurplusText: '--', // 左边显示的各阶余量文本
      levelPriceList: [], // 阶梯试算结果的数组
      numList: ['一', '二', '三', '四', '五'], // 数字数组
      priceData: {
        meterBalanceAmount: "--", // 剩余金额
        priceName: "--", // 价格名称
        billingType: "--", // 计费类型(名称)
        singlePrice: '--', // 单一价格
        levelPrice: '--', // 阶梯价格
        levelBorder: '--', // 阶梯边界
        ladderLevel: '--', // 阶梯级数
        cycSurplus: '--', // 各阶余量
        billingCycle: '--', // 计费周期
        cycleStartTime: '--', // 周期开始时间
        effectiveTime: '--', // 生效日期
        timePeriod: '--', // 分时时长
        timePrice: '--', // 分时价格
        timePrice_title: "", // 分时计价标题
        timePrice_arr: [], // 分时计价时间--价格数组
        timeUnitCode: '--', // 时间单位
      },
      meterCategory: 0, // 表类型 0:普表,1:IC卡,2:远传表,3:IC卡远传表
      remoteRechargeFlag: null, // IC卡远传表是否允许充值
      rechargeDisable: true, // 是否允许充值或补气, true时不允许
    }
  },
  // 路由监听
  watch: {
    rechargeFlag2(newVal, oldVal) {
    },
  },
  computed: {
    rechargeFlag2() {
      return this.$store.state.rechargeFlag;
    },
  },
  mounted() {
    if (this.sp_id && this.sp_id.indexOf("?sign") == -1) {
      this.archivesId = this.sp_id;
    }
    if (this.$route.query.archivesId) {
      this.archivesId = this.$route.query.archivesId;
    }
    if (this.archivesId) {
      this.fillInfo(this.archivesId);
    }
    // 重置更新档案的标识
    if (this.rechargeFlag2) {
      this.$store.commit("updateRechargeFlag", {
        key: "rechargeFlag",
        val: false
      });
    }
  },
  methods: {
    // 回填档案信息
    fillInfo(id) {
      // 关闭搜索结果
      this.closeSearch();
      // 页面信息初始化
      this.clearInfo();
      this.archivesId = id;
      // 查询档案
      this.getArchiveData(id);
      // 查询其他费用
      this.getOtherCost();
    },
    // 清空当前信息，页面信息初始化
    clearInfo() {
      if (this.archivesId != null) {
        this.archivesId = null;
      }
      this.rechargeDisable = true;
      // 搜索条件清空
      this.searchData = {
        userName: '', // 用户名
        tel: '', // 手机号
        regionCode: '', // 区县-编码
        addressAreaCode: '', // 街道小区-编码
        addressName: '', // 详细地址
        meterNo: '', // 表具编号
        archivesNo: '', // 档案编码
        archivesIdentity: '', // 档案标识
      }
      this.cdValue = 'userName'; // 重置搜索项为用户名称
      // 档案信息初始化
      this.archivesData = {
        archivesNo: '',
        userName: "--", // 用户名称
        userType: "--", // 用户类型
        userMobile: "--", // 手机号
        certificateNo: "--", // 身份证号
        meterNo: "--", // 表具编号
        meterTypeName: "--", // 表类型名称
        address: "--", // 表具地址
      }
      // 价格信息初始化
      this.priceData = {
        meterBalanceAmount: "--", // 剩余金额
        priceName: "--", // 价格名称
        billingType: "--", // 计费类型(名称)
        singlePrice: '--', // 单一价格
        levelPrice: '--', // 阶梯价格
        levelBorder: '--', // 阶梯边界
        ladderLevel: '--', // 阶梯级数
        cycSurplus: '--', // 各阶余量
        billingCycle: '--', // 计费周期
        cycleStartTime: '--', // 周期开始时间
        effectiveTime: '--', // 生效日期
        timePeriod: '--', // 分时时长
        timePrice: '--', // 分时价格
        timeUnitCode: '--', // 时间单位
      }
      this.billingTypeId = null; // 价格类型
      this.levelPriceList_left = '--'; // 左侧阶梯价格表
      this.levelPriceList = []; // 右侧阶梯试算
      this.cycSurplusText = '--'; // 左侧各阶余量
      this.priceData.timePrice_title = '--'; // 左侧分时计价标题
      this.priceData.timePrice_arr = '--'; // 左侧分时计价表
      this.rubbishList = []; // 垃圾费列表
      this.rubbishListOpen = false; // 垃圾费列表展开状态
      this.rubbishTotal = 0; // 垃圾费合计
      this.costRecordId_Money_QL = {}; // 其他费用id和名称映射表
      this.otherCostList = []; // 其他费用列表
      this.otherPayCostList = []; // 待收费的其他费用列表
      this.otherFee = []; // 其他费用勾选列表
      this.otherFeeIds = ''; // 其他费用勾选的id
      this.otherFeeTotal = 0; // 其他费用勾选合计
      this.rechargeMoney = 0; // 充值金额
      this.rechargeAmount = 0; // 充值气量
      this.paidIn = 0; // 应缴金额
      this.payType = "1"; // 支付方式
      this.checkNo = ""; // 支票号
      this.bqForm = {
        bqMoney: 0, // 补气金额
        bqAmount: 0, // 补气量
        bqType: "1", // 补气类型
        reissueReason: "", // 补气原因,
      }
      this.icInfo = { dataByRead: {} }; // ic卡信息
      if (this.$refs['rechargeForm']) { this.$refs['rechargeForm'].resetFields(); } // 重置充值金额表单
      if (this.$refs['rechargeGasForm']) { this.$refs['rechargeGasForm'].resetFields(); } // 重置充值气量表单
      if (this.$refs['shishouMoney']) { this.$refs['shishouMoney'].resetFields(); } // 重置实收表单
      if (this.$refs['bqForm']) { this.$refs['bqForm'].resetFields(); } // 重置实收表单
    },
    // 获取档案信息
    getArchiveData(id) {
      const loading = this.$loading({
        background: "rgba(255,255,255,0.7)",
        text: "正在获取档案信息，请稍等...",
      });
      getArchivesDetail({
        archivesId: id
      }).then(res => {
        loading.close();
        if (res.data.code == 0) {
          let { archives, price, meter, address, user } = res.data.data;
          if (!archives) { archives = {} };
          if (!price) { price = {} };
          if (!meter) { meter = {} };
          if (!address) { address = {} };
          if (!user) { user = {} };
          //允许充值的情形：非黑名单 && 在用 | 停用 | 已建档而且是系统计费
          if (archives.archivesStatus == 1 || archives.archivesStatus == 2 || (archives.archivesStatus == 0 && meter.billingType != 0)) {
            this.rechargeDisable = false;
          } else {
            this.rechargeDisable = true;
            this.$message.info("当前档案状态无法充值或补气");
          }
          this.blackFlag = user.blackFlag ? true : false; // 是否黑名单
          // 用户名称
          this.archivesData.userName = user.userName;
          // 用户类型
          this.archivesData.userType = userTypeReverseList[user.userType];
          // 档案编号
          this.archivesData.archivesNo = archives.archivesNo || '';
          // 手机号
          this.archivesData.userMobile = user.userMobile;
          // 身份证号
          this.archivesData.certificateNo = user.certificateNo;
          // 表具地址
          let qu = address.regionName ? address.regionName : ""; // 区
          let xiaoqu = address.addressAreaName ? address.addressAreaName : ""; // 小区
          let miaoshu = address.addressName ? address.addressName : ""; // 地址描述
          this.archivesData.address = qu + xiaoqu + miaoshu;
          // 价格名称
          this.priceData.priceName = price.priceName;
          // 价格类型id
          let billingTypeId = Number(price.billingTypeId);
          this.billingTypeId = billingTypeId;
          // 计费类型
          this.priceData.billingType = billingTypeIdQL[billingTypeId];
          // 剩余金额
          this.priceData.meterBalanceAmount = NumToFix(archives.meterBalanceAmount, 2);
          // 各阶余量
          this.priceData.cycSurplus = archives.cycSurplus;
          // 计费周期
          this.priceData.billingCycle = price.billingCycle;
          // 周期开始时间
          this.priceData.cycleStartTime = convertUTC(price.cycleStartTime);
          // 生效日期
          this.priceData.effectiveTime = convertUTC(price.effectiveTime);
          if (meter.meterType) {
            // 表具编号
            this.archivesData.meterNo = meter.meterNo;
            // 表类型名称
            this.archivesData.meterTypeName = meter.meterTypeName;
            // 表类别
            if (meter.meterType && meter.meterType.meterCategory) {
              this.meterCategory = meter.meterType.meterCategory;
              this.remoteRechargeFlag = meter.meterType.remoteRechargeFlag; // ic卡远传表是否允许充值补气
            }
            // 判断是IC卡气量表还是金额表
            if (meter.meterType && (meter.meterType.meterCategory == 1 && meter.meterType.icBillingMode == 0) || (meter.meterType.meterCategory == 3 && meter.meterType.icBillingMode == 0)) {
              this.gasOrMoney = 1;
            } else {
              this.gasOrMoney = 0;
            }
          }
          this.priceData.timePeriod = price.timePeriod; // 分时时长
          this.priceData.timePrice = price.timePrice; // 分时价格
          if (billingTypeId == 1) {
            if (parseInt(price.singlePrice).toString() != 'NaN') {
              this.priceData.singlePrice = price.singlePrice.toFixed(4);
            }
          }
          // 处理阶梯价格表
          else if (billingTypeId == 2) {
            // 阶梯价格
            this.priceData.levelPrice = price.levelPrice;
            // 阶梯量/阶梯边界
            this.priceData.levelBorder = price.levelBorder;
            // 处理阶梯价格
            this.getlevelPriceList();
          } else if (billingTypeId == 3) {
            if (price.priceDesc) {
              let r = solveTimePrice(price.priceDesc)
              if (r) {
                this.priceData.timePrice_title = r.title; // 分时价格的标题
                this.priceData.timePrice_arr = r.timePriceArr; // 数组:{时间:价格}
              }
            }
          } else {
            // 已经提示不能充值时不再重复提示
            if (!this.rechargeDisable) {
              this.$message.error("此档案价格信息异常！");
            }
            console.error("警告：此档案的billingTypeId异常")
          }
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          this.$message.error("档案详情查询失败：" + msg);
        }
      }).catch(err => {
        loading.close();
        this.$message.error("档案详情查询发生错误");
        console.error("档案详情查询发生错误", err)
      })
    },
    // 获取阶梯价格
    getlevelPriceList() {
      let [price, border, cycSurplus] = [this.priceData.levelPrice, this.priceData.levelBorder, this.priceData.cycSurplus];
      if (!price || price == '--' || !border || border == '--') { return; }
      // 阶梯价数组，阶梯余量数组，各阶余量数组
      let [levelPriceList, curBorderList, cycSurplusList] = [price.replace(/\s+/g, "").split("|"), border.replace(/\s+/g, "").split("|"), []];
      // 阶梯余量转阶梯量 （阶梯余量是仅当前阶梯量，阶梯量是累计量）
      let levelBorderList = curBorderList.map((item, index) => {
        if (index == 0) {
          return Number(item);
        }
        else if (index == curBorderList.length - 1) {
          return 99999999;
        }
        else {
          let r = 0;
          for (let i = 0; i <= index; i++) {
            r = r + Number(curBorderList[i]);
          }
          return r;
        }
      })
      if (cycSurplus) {
        cycSurplusList = cycSurplus.replace(/\s+/g, "").split("|");
        // 各阶余量页面显示文本
        this.cycSurplusText = cycSurplusList.map((item, index) => {
          if (index == cycSurplusList.length - 1) {
            return "∞"
          } else {
            return NumToFix(item, 4);
          }
        }).join(" | ");
      } else {
        // 各阶余量为空的情况
        cycSurplusList = curBorderList;
        this.cycSurplusText = "--";
      }
      this.cycSurplusList = cycSurplusList;
      if (levelPriceList.length != cycSurplusList.length) {
        console.warn("发现错误：阶梯价和各阶余量阶数不一致");
        // return;
      }
      let result = []; // 阶梯试算数组
      let levelPriceList_left = [];
      // 阶梯价数组最后一阶为无穷大
      levelPriceList.forEach((item, index) => {
        result.push({
          num: this.numList[index],
          border: index < curBorderList.length - 1 ? curBorderList[index] : "∞", // 阶梯边界
          price: item, // 阶梯价格
          curAmount: 0, // 试算时当前阶梯余量
          pay: 0, // 当前阶梯需要的金额
        })
        // 左边界
        let beforeBorder = index == 0 ? '0' : Number(levelBorderList[index - 1]).toFixed(0);
        let afterBorder = ""; // 右边界
        let soBorder = ""; // 组合结果
        if (index < levelBorderList.length - 1) {
          afterBorder = Number(levelBorderList[index]).toFixed(0);
          soBorder = beforeBorder + "" + "<" + this.numList[index] + "阶≤" + afterBorder;
        } else {
          afterBorder = "∞"
          soBorder = this.numList[index] + "阶>" + beforeBorder;
        }
        levelPriceList_left.push({
          border: soBorder + " m³",
          price: NumToFix(item, 4, true) + " 元/m³"
        })
      })
      // IC卡和IC卡远传表
      if (Number(this.meterCategory) == 1 || Number(this.meterCategory) == 3) {
        this.levelPriceList = result;
      }
      this.levelPriceList_left = levelPriceList_left;
    },
    // 获取其他费用
    // 参数secQuery表示是ic卡读卡前重新获取的，此时不修改右侧勾选项
    getOtherCost(secQuery) {
      getArchivesOther({ archivesId: this.archivesId, size: 999 }).then(res => {
        if (res.data.code == 0) {
          if (res.data && res.data.data && res.data.data.records) {
            let result = res.data.data.records;
            let otherCostList = []; // 其它费用列表
            let otherPayCostList = []; // 其他费用-待收费
            let otherFee = []; // 其他费用勾选
            let otherFeeTotal = 0; // 其他费用待收费总计
            let costRecordId_Money_QL = {};
            let rubbishList = []; // 垃圾费列表
            let rubbishTotal = 0; // 垃圾费合计金额
            result.forEach(item => {

              if (item && item instanceof Object) {
                if (item.costRecordStatus == 0 && item.receivableAmount) {
                  let addItem = {
                    costType: item.costType, // 费用子类id
                    type2: costTypeQL[item.costType], // 费用子类文字
                    costRecordStatus: item.costRecordStatus,
                    stateTxt: costRecordStatusQL[item.costRecordStatus],
                    paidAmount: item.paidAmount, // 实收金额
                    receivableAmount: item.receivableAmount, // 应收金额
                    all: costTypeQL[item.costType] + '：' + item.receivableAmount + '元', // 类别全名+金额
                    costRecordId: item.costRecordId, // 费用明细记录id
                    modifyTime: item.modifyTime ? item.modifyTime.substring(0, 10) : "未知时间", // 修改时间
                    reason: item.reason // 与数据库统一 备注字段为reason
                  }
                  // 其他费用列表，费用信息栏显示信息
                  otherCostList.push(addItem);
                  if (item.costType == 91) {
                    rubbishList.push(addItem);
                    // 累加合计金额
                    rubbishTotal = NumToFix(rubbishTotal + item.receivableAmount, 2);
                  }
                  // 缴费下的垃圾费显示时间
                  if (addItem.costType == 91) {
                    addItem.all = `${addItem.all} 【${addItem.modifyTime}】`;
                  }
                  // 缴费时显示的其他信息
                  otherPayCostList.push(addItem)
                  if (!secQuery) {
                    otherFee.push(item.costRecordId); // 其他费用勾选项
                    otherFeeTotal += item.receivableAmount; // 其他费用勾选合计
                  }
                  // 其他费用id --> 金额映射表
                  costRecordId_Money_QL[item.costRecordId] = item.receivableAmount;
                }
              }
            })
            this.otherCostList = otherCostList; // 更新左侧其他费用列表
            this.rubbishList = rubbishList; // 更新垃圾费列表
            this.rubbishTotal = rubbishTotal; // 更新垃圾费合计金额
            this.otherPayCostList = otherPayCostList; // 更新右侧缴费下面的其他费用列表
            if (!secQuery) {
              this.otherFee = otherFee; // 更新其他费用的勾选项
              this.otherFeeTotal = otherFeeTotal; // 更新其他费用已勾选合计
            }
            this.paidIn = NumToFix(this.rechargeMoney + otherFeeTotal, 2); // 更新应缴金额
            this.costRecordId_Money_QL = costRecordId_Money_QL;
          } else {
            this.$message.error("其他费用查询发生错误-数据格式错误");
          }
        } else {
          let msg = res.data && res.data.message ? res.data.message : "返回码错误";
          this.$message.error("其他费用查询失败：" + msg);
        }
      }).catch(err => {
        this.$message.error("其他费用查询发生错误-接口请求失败", err);
      })
    },
    // 跳转到档案缴费明细
    gotoArchiveDetail() {
      if (this.archivesId != null) {
        // 跳转详情，spTab处理
        this.$store.commit("spTabAdd", {
          preName: "archivesDetails",
          sp_id: String(this.archivesId),
          keepName: "archives-details",
          title: "档案详情",
          path: "/archives-details",
          query: {
            archivesId: String(this.archivesId),
            tab: "DetailsPayList",
            gasOrMoney: String(this.gasOrMoney)
          }
        });
      }
    },
  }
}