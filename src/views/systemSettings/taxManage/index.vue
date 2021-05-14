<template>
  <div class="tax-manage-wrap">
    <div class="tax-manage-title">
      <img class="columnIcon" src="@/assets/imgs/taxIcon.png" />
      <span>税率管理</span>
      <el-button
        class="add-tax-btn"
        v-has="'taxManage_add'"
        style="width: 116px;border:1px solid #2F87FE;color:#2F87FE;"
        size="small"
        @click="addTaxModal"
      >新增税率</el-button>
    </div>
    <div class="tax-manage-content">
      <div class="content-details-box" :style="{'height':'100%'}">
        <el-table
          :height="tableHeight"
          :data="tableData"
          class="tables"
          :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        >
          <template slot="empty" class="noData">
            <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
            <p style="margin:0px;">暂无数据</p>
          </template>
          <el-table-column prop="action" label="费用类型">
            <template slot-scope="scope">
              <span v-html="showType(scope.row)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="taxCode" label="税收编码"></el-table-column>
          <el-table-column prop="taxRate" label="税率"></el-table-column>
          <el-table-column label="操作" v-if="isShow">
            <template slot-scope="scope">
              <span
                style="color: rgba(47, 135, 254, 1);margin-right: 20px; cursor: pointer;"
                @click="editTax(scope.row)"
              >编辑</span>
              <span
                style="color: rgba(236, 107, 96, 1); cursor: pointer;"
                @click="deleteTaxMag(scope.row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      class="dialogAddResource"
      :visible.sync="showTaxModal"
      width="640px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearModal"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/taxIcon.png" />
        <span class="title-age">{{isEdit?"修改税率":"新增税率"}}</span>
      </div>
      <div class="dialog_resource--content">
        <el-form
          ref="addTaxForm"
          label-width="100px"
          label-position="left"
          class="ruleForm"
          :rules="changeResourceFormRules"
          :model="resourceJson"
        >
          <el-form-item label="费用类型：" class="item item-right" prop="costItemType">
            <el-select
              size="small"
              v-model="resourceJson.costItemType"
              :disabled="isEdit"
              style="width:210px"
            >
              <el-option
                v-for="item in costTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税收编码：" class="item item-right" prop="taxCode">
            <el-input
              size="small"
              v-model="resourceJson.taxCode"
              placeholder="请输入税收编码"
              style="width:210px"
            ></el-input>
          </el-form-item>
          <el-form-item label="税率：" class="item item-right" prop="taxRate">
            <el-input
              size="small"
              v-model="resourceJson.taxRate"
              placeholder="请输入税率"
              style="width:210px"
            ></el-input>
            <span style="color:rgba(153,153,153,1);font-size:12px;margin-left: 10px;">范围：0~1</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;margin-right:10px"
          class="el-button--primary"
          size="small"
          @click="sureAddTax"
        >{{isEdit?'确认修改':'确定新增'}}</el-button>
        <el-button style="width: 80px" size="small" @click="showTaxModal = false">取消</el-button>
      </div>
    </el-dialog>
    <gc-confirm-again
      :visible="isDeleteTaxMag"
      title="此操作将删除该税率, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteTaxMag=false"
      @onOk="onOkDeleteTaxMax"
    />
  </div>
</template>
<script>
import {
  getTaxList,
  addTax,
  updateTax,
  deleteTax
} from "@/api/systemSettings.js";
import _ from "lodash";

export default {
  data() {
    return {
      tableHeight: "calc(100%)",
      ops: window.scrollOps, // 滚动条
      showTaxModal: false,
      isEdit: false,
      // 费用类型
      costTypeList: [],
      resourceJson: {
        costItemType: "",
        taxCode: "",
        taxRate: ""
      },
      changeResourceFormRules: {
        costItemType: [
          {
            required: true,
            message: "费用类型不能为空",
            trigger: "change"
          }
        ],
        taxCode: [
          {
            required: true,
            message: "税收编码不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("税收编码不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32位数");
                return;
              }
              callback();
            }
          }
        ],
        taxRate: [
          {
            required: true,
            message: "税率不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("税率不能为空");
                return;
              }
              let _test = /^([1-9]\d*|0)(\.\d{1,4})?$/;
              if (!_test.test(value)) {
                callback("请输入符合规格的数字");
                return;
              }
              if (!(parseFloat(value) < 1)) {
                callback("范围：0~1");
                return;
              }
              callback();
            }
          }
        ]
      },
      tableData: [],
      // 防止多次点击
      isShowAddBtn: "",
      isDeleteTaxMag: false,
      tempData: "",
      isShow: true
    };
  },
  created() {
    this.isShowAddBtn = JSON.parse(
      localStorage.getItem("vuejs__userGradeName")
    ).value;
    let _costTypeList = [];
    let _costType = this.$ls.get("DataList").costType;
    for (let i in _costType.ids) {
      _costTypeList.push({
        name: _costType.ids[i],
        value: parseInt(i)
      });
    }
    this.costTypeList = _costTypeList;
    this.getList();
    this.isShow =
      this.$_has("taxManage_modify") && this.$_has("taxManage_delete");
  },
  methods: {
    //  获取税率列表
    getList() {
      getTaxList()
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data || [];
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    //  新增税率
    addNewTax() {
      let _taxRate = 0;
      if (Number(this.resourceJson.taxRate) == 0) {
        _taxRate = "0.00";
      } else {
        _taxRate = Number(this.resourceJson.taxRate);
      }
      let dialogLoading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      addTax({
        costItemType: this.resourceJson.costItemType,
        taxCode: this.resourceJson.taxCode.trim(),
        taxRate: _taxRate
      })
        .then(res => {
          dialogLoading.close();
          if (res.data.code == 0) {
            this.isEdit = false;
            this.showTaxModal = false;
            this.getList();
            this.$message.success("新增税率成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          dialogLoading.close();
          this.$message.error(err.message);
        });
    },
    //更新税率内容
    updateTax() {
      let _taxRate = 0;
      if (Number(this.resourceJson.taxRate) == 0) {
        _taxRate = "0.00";
      } else {
        _taxRate = Number(this.resourceJson.taxRate);
      }
      let dialogLoading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      updateTax({
        taxRateId: this.resourceJson.taxRateId,
        taxRate: _taxRate,
        taxCode: this.resourceJson.taxCode.trim()
      })
        .then(res => {
          dialogLoading.close();
          if (res.data.code == 0) {
            this.isEdit = false;
            this.showTaxModal = false;
            this.getList();
            this.$message.success("更改税率成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          dialogLoading.close();
          this.$message.error(err.message);
        });
    },
    //  打开新增税率弹框
    addTaxModal() {
      this.showTaxModal = true;
    },
    //  打开编辑税率弹框
    editTax(attr) {
      this.isEdit = true;
      this.showTaxModal = true;
      this.resourceJson = _.cloneDeep(attr);
    },
    // 确认删除税率
    onOkDeleteTaxMax() {
      deleteTax({
        taxRateId: this.tempData.taxRateId
      })
        .then(res => {
          this.isDeleteTaxMag = false;
          if (res.data.code == 0) {
            this.getList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isDeleteTaxMag = false;
          this.$message.error(err.message);
        });
    },
    //  删除该税率
    deleteTaxMag(attr) {
      this.isDeleteTaxMag = true;
      this.tempData = attr;
    },
    showType(attr) {
      let _type = _.find(this.costTypeList, item => {
        return item.value === attr.costItemType;
      });
      if (_type) {
        return _type.name;
      } else {
        return "";
      }
    },
    clearModal() {
      this.resourceJson = {
        costItemType: "",
        taxCode: "",
        taxRate: ""
      };
      this.$refs.addTaxForm.resetFields();
      this.isEdit = false;
      this.showTaxModal = false;
    },
    sureAddTax() {
      this.$refs.addTaxForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.updateTax();
          } else {
            this.addNewTax();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}
</style>