import { costTypeQL, costRecordStatusQL } from "@/utils/queryList/queryList.js";
import { otherCost_add, otherCost_edit, otherCost_del } from "@/api/recharge.js";
let costTypeList = [];
for (let k in costTypeQL) {
  costTypeList.push({
    label: costTypeQL[k],
    value: Number(k)
  })
}
export default {
  data () {
    return {
      ljTitle_zd: (_ => {
        return costTypeQL['91'] ? costTypeQL['91'] : "垃圾费"
      })(), // 垃圾费的标题
      dsTitle_zd: (_ => {
        return costRecordStatusQL['0'] ? costRecordStatusQL['0'] : "待收费"
      })(), // 待收费的标题
      otherCostList: [], // 其他费用列表
      otherCostShow: false, // 其他费用操作弹窗显示或隐藏
      otherCostDialogTitle: "登记其他费用", // 其他费用弹窗的标题
      otherCostForm: {
        costType: "", // 其他费用类型
        receivableAmount: "", // 其他费用金额
      },
      otherCostHandleType: 'add', // 其他费用的操作类型: 新增add 修改edit
      otherCostHandleId: null, // 其他费用明细记录id，删除和修改其他费用时的入参
      otherCostRules: {
        costType: [
          { required: true, message: '请选择费用类型', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== 0 && !value) {
                callback(new Error("请选择费用类型"));
              } else {
                callback();
              }
            }
          }
        ],
        receivableAmount: [
          { required: true, message: '请输入费用金额', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== 0 && !value) {
                callback(new Error("请输入费用金额"));
              }
              else if (isNaN(value)) {
                callback(new Error("请输入合法的数字"));
              }
              else if (value <= 0) {
                callback(new Error("费用金额需大于0"));
              }
              else if (String(value).split('.').length > 2) {
                callback(new Error("请输入合法的数字"));
              }
              else if (String(value).split('.').length == 2 && String(value).split('.')[1].length > 2) {
                callback(new Error("费用金额小数位最多两位"));
              }
              else if (value > 9999999999.99) {
                callback(new Error("费用金额超出最大值"));
              }
              else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      costTypeList: costTypeList, // 其他费用类型列表
      rubbishList: [], // 垃圾费列表
      rubbishListOpen: false, // 垃圾费列表展开状态
      rubbishTotal: 0, // 垃圾费合计金额
    }
  },
  mounted () {
  },
  methods: {
    onInput () {
      this.$forceUpdate();
    },
    // 修改其他费用
    otherCostEdit (item) {
      let { costRecordId, costType } = item;
      this.otherCostDialogTitle = "修改其他费用"
      this.otherCostHandleType = 'edit'; // 修改其他费用
      this.otherCostHandleId = costRecordId; // 其他费用明细id
      this.otherCostForm.costType = costType; // 费用类型
      this.otherCostForm.receivableAmount = item.receivableAmount; // 费用金额
      this.otherCostForm.reason = item.reason; // 与数据库统一字段为reason
      this.otherCostShow = true; // 显示其他费用的操作弹窗
    },
    // 登记其他费用按钮点击事件
    otherCostBtAction () {
      this.otherCostDialogTitle = "登记其他费用"
      this.otherCostHandleType = 'add'; // 新增其他费用
      this.otherCostShow = true; // 显示其他费用的操作弹窗
      this.otherCostForm = {
        costType: "", // 其他费用类型
        receivableAmount: "", // 其他费用金额
      }
    },
    // 删除其他费用
    otherCostDel (id, typeTxt) {
      if (!id) {
        this.$message.error("撤销登记费用失败：费用id为空");
        return;
      }
      this.$confirm(`是否确认撤销登记费用：${typeTxt}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        otherCost_del({ costRecordId: id }).then(res => {
          if (res.data.code == 0) {
            this.$message.success("撤销成功");
            this.otherDialogCancle(); // 关闭弹窗
            this.getOtherCost(); // 刷新其他费用列表
          } else {
            let msg = res.data && res.data.message ? res.data.message : "返回码错误";
            this.$message.error("撤销登记费用失败：" + msg);
          }
        }).catch(err => {
          this.$message.error("撤销登记费用时发生错误");
          console.error("撤销登记费用时发生错误", err);
        })
      }).catch(() => {
      });
    },
    // 其他费用提交前验证
    otherSubmitVarify () {
      this.$refs['otherCostForm'].validate(valid => {
        if (valid) {
          // 登记其他费用
          if (this.otherCostHandleType == 'add') {
            const loading = this.$loading({
              background: "rgba(255,255,255,0.7)"
            });
            otherCost_add({
              archivesId: this.archivesId, // 档案id
              costType: this.otherCostForm.costType, // 费用类型
              receivableAmount: this.otherCostForm.receivableAmount, // 费用金额
              reason: this.otherCostForm.reason // 备注
            }).then(res => {
              loading.close();
              if (res.data.code == 0) {
                this.$message.success("登记其他费用成功");
                this.otherDialogCancle(); // 关闭弹窗
                this.getOtherCost(); // 刷新其他费用列表
              } else {
                let msg = res.data && res.data.message ? res.data.message : "返回码错误";
                this.$message.error("登记其他费用失败：" + msg);
              }
            }).catch(err => {
              loading.close();
              this.$message.error("登记其他费用时发生错误");
              console.error("登记其他费用时发生错误", err);
            })
          }
          // 修改其他费用
          else if (this.otherCostHandleType == 'edit') {
            const loading = this.$loading({
              background: "rgba(255,255,255,0.7)"
            });
            otherCost_edit({
              costRecordId: this.otherCostHandleId, // 费用明细id
              costType: this.otherCostForm.costType, // 费用类型
              receivableAmount: this.otherCostForm.receivableAmount, // 费用金额
              reason: this.otherCostForm.reason // 备注
            }).then(res => {
              loading.close();
              if (res.data.code == 0) {
                this.$message.success("修改其他费用成功");
                this.otherDialogCancle(); // 关闭弹窗
                this.getOtherCost(); // 刷新其他费用列表
              } else {
                let msg = res.data && res.data.message ? res.data.message : "返回码错误";
                this.$message.error("修改其他费用失败：" + msg);
              }
            }).catch(err => {
              loading.close();
              this.$message.error("修改其他费用时发生错误");
              console.error("修改其他费用时发生错误", err);
            })
          }
        }
      })
    },
    // 其他费用弹窗关闭
    otherDialogCancle () {
      if (this.$refs['otherCostForm']) {
        this.$nextTick(function () {
          this.otherCostForm = {
            costType: "", // 其他费用类型
            receivableAmount: "", // 其他费用金额
          };
          this.$refs['otherCostForm'].clearValidate(); // 在nextTick中重置表单校验
        })
      }
      this.otherCostShow = false;
    },
  }
}