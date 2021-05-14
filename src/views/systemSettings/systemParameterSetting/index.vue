<template>
  <div class="sales-info-manage-wrap">
    <div class="sales-info-manage-title">
      <img class="columnIcon" src="@/assets/imgs/systemIconDemo.png" />
      <span>系统参数设置</span>
    </div>
    <div class="sales-info-manage-content">
      <div class="content-details-box">
        <vue-scroll :ops="ops">
          <el-form
            ref="ruleRoleGroupForm"
            label-width="210px"
            label-position="left"
            class="role-group-form-content"
            :rules="changeResourceFormRules"
          >
            <el-row v-if="!isEdit">
              <el-col :span="24" v-for="item in params" :key="item.code">
                <el-form-item :label="item.name+'：'">
                  <span>{{item.value?item.value:'--'}}&nbsp;{{item.code =='back_interval'?"天":"元"}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="24" v-for="item in editParams" :key="item.code">
                <el-form-item :label="item.name+'：'">
                  <el-input v-model="item.value" style="width:160px" size="small">
                    <span slot="suffix">{{item.code =='back_interval'?"天":"元"}}</span>
                  </el-input>
                  <span
                    style="color:rgba(153,153,153,1);font-size:12px;margin-left: 10px;"
                  >{{item.desc}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </vue-scroll>
      </div>
      <div class="content-details-footer" v-has="'systemParameterSetting_modify'">
        <el-button size="small" type="primary" v-if="!isEdit" @click="onEditParams" plain>编辑</el-button>
        <el-button size="small" type="primary" v-if="isEdit" @click="onSaveEdit">保存</el-button>
        <el-button size="small" v-if="isEdit" @click="onPassEdit">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { getSystemParams, createSystemParams } from "@/api/systemSettings.js";

export default {
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      isEdit: false,
      resourceJson: {
        costItemType: "",
        taxCode: "",
        taxRate: ""
      },
      // params: [
      //   {
      //     code: "overdraft_volume",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "信用额度（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "level1_balance",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "余额不足一级阈值（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "level2_balance",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "余额不足二级阈值（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "back_interval",
      //     desc: "0-255的整数",
      //     flag: 1,
      //     name: "退费间隔（日）",
      //     value: null
      //   }
      // ],
      params: [],
      // editParams: [
      //   {
      //     code: "overdraft_volume",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "信用额度（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "level1_balance",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "余额不足一级阈值（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "level2_balance",
      //     desc: "单位：元，范围：0~999999",
      //     flag: 0,
      //     name: "余额不足二级阈值（预付费）",
      //     value: null
      //   },
      //   {
      //     code: "back_interval",
      //     desc: "0-255的整数",
      //     flag: 1,
      //     name: "退费间隔（日）",
      //     value: null
      //   }
      // ],
      editParams: [],
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
          }
        ],
        taxRate: [
          {
            required: true,
            message: "税率不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getSystemDetails();
  },
  methods: {
    //获取详情
    getSystemDetails() {
      getSystemParams()
        .then(res => {
          if (res.data.code == 0) {
            let _record = res.data.data.records || [];
            this.params = _record;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    onEditParams() {
      let _params = _.cloneDeep(this.params);
      this.editParams = _params;
      this.isEdit = true;
    },
    onPassEdit() {
      this.isEdit = false;
    },
    onSaveEdit() {
      let _params = _.cloneDeep(this.editParams);
      let paramsJson = [];
      _params.forEach(item => {
        if (item.value) {
          paramsJson.push({
            code: item.code,
            value: item.value
          });
        }
      });
      createSystemParams(paramsJson)
        .then(res => {
          if (res.data.code == 0) {
            this.getSystemDetails();
            this.isEdit = false;
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>