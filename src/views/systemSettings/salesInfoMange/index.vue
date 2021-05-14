<template>
  <div class="sales-info-manage-wrap">
    <div class="sales-info-manage-title">
      <img class="columnIcon" src="@/assets/imgs/scalsIcon.png" />
      <span>销方信息管理</span>
    </div>
    <div class="sales-info-manage-content">
      <div
        class="content-details-box"
        :style="{'height': isCanEdit == '租户管理员'?'calc(100% - 40px)':'100%'}"
      >
        <el-form
          ref="salesInfoManageForm"
          label-width="130px"
          label-position="left"
          class="role-group-form-content"
          :rules="changeResourceFormRules"
          :model="editData"
        >
          <el-row>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="销方客户名称：" prop="custName">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.custName}]"
                >{{noEditData.custName||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.custName"
                  placeholder="请输入销方客户名称"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="纳税人识别号：" prop="taxpayerIdenNum">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.taxpayerIdenNum}]"
                >{{noEditData.taxpayerIdenNum||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.taxpayerIdenNum"
                  placeholder="请输入纳税人识别号"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="开户行：" prop="openBank">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.openBank}]"
                >{{noEditData.openBank||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.openBank"
                  placeholder="请输入开户行"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="开户账号：" prop="bankAccount">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.bankAccount}]"
                >{{noEditData.bankAccount||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.bankAccount"
                  placeholder="请输入开户账号"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="地址：" prop="address">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.address}]"
                >{{noEditData.address||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.address"
                  placeholder="请输入地址"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="电话：" prop="phoneNumber">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.phoneNumber}]"
                >{{noEditData.phoneNumber||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.phoneNumber"
                  placeholder="请输入电话"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isEdit?0:'14px','height': '40px'}">
              <el-form-item label="授权码：" prop="authorizationCode">
                <span
                  v-if="!isEdit"
                  :class="[{'nodata-style':!noEditData.authorizationCode}]"
                >{{noEditData.authorizationCode||'暂无'}}</span>
                <el-input
                  size="small"
                  v-else
                  v-model="editData.authorizationCode"
                  placeholder="请输入授权码"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- v-if="isCanEdit == '租户管理员'" -->
      <div class="content-details-footer" v-has="'salesInfoManage_modify'">
        <el-button
          size="small"
          style="width: 80px;border:1px solid #2F87FE;color:#2F87FE"
          v-if="!isEdit"
          @click="openEdit"
        >修改</el-button>
        <el-button
          size="small"
          style="width: 80px;margin-right:10px"
          class="el-button--primary"
          v-if="isEdit"
          @click="releaseSales"
        >发布</el-button>
        <el-button size="small" style="width: 80px;margin-right:10px" v-if="isEdit" @click="pass">取消</el-button>
        <el-button size="small" style="width: 80px" v-if="isEdit" @click="resetData">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { getSaleInfo, releaseSalesInfo } from "@/api/systemSettings.js";

export default {
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      editData: {
        custName: "",
        taxpayerIdenNum: "",
        openBank: "",
        bankAccount: "",
        address: "",
        phoneNumber: "",
        authorizationCode: ""
      },
      noEditData: {
        custName: "",
        taxpayerIdenNum: "",
        openBank: "",
        bankAccount: "",
        address: "",
        phoneNumber: "",
        authorizationCode: ""
      },
      isEdit: false,
      changeResourceFormRules: {
        custName: [
          {
            required: true,
            message: "销方客户名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("销方客户名称不能为空");
                return;
              }
              if (value.toString().trim().length > 64) {
                callback("请勿超过64字数");
                return;
              }
              callback();
            }
          }
        ],
        taxpayerIdenNum: [
          {
            required: true,
            message: "纳税人识别号不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("纳税人识别号不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        openBank: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback();
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        bankAccount: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback();
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback();
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("电话不能为空");
                return;
              }
              if (value.toString().trim().length > 18) {
                callback("请勿超过18字数");
                return;
              }
              callback();
            }
          }
        ],
        authorizationCode: [
          {
            required: true,
            message: "授权码不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("授权码不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ]
      },
      isCanEdit: ""
    };
  },
  created() {
    getSaleInfo()
      .then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this.noEditData = res.data.data;
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
    this.isCanEdit = JSON.parse(
      localStorage.getItem("vuejs__userGradeName")
    ).value;
  },
  mounted() {},
  methods: {
    releaseSales() {
      for (let i in this.editData) {
        if (
          typeof this.editData[i] == "string" &&
          this.editData[i].constructor == String
        ) {
          this.editData[i] = this.editData[i].trim();
        }
      }
      this.$refs.salesInfoManageForm.validate(valid => {
        if (valid) {
          let dialogLoading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          releaseSalesInfo(this.editData)
            .then(res => {
              dialogLoading.close();
              if (res.data.code == 0) {
                this.$message.success("保存成功");
                let _editData = _.cloneDeep(this.editData);
                this.noEditData = _editData;
                this.isEdit = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              dialogLoading.close();
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    resetData() {
      this.editData = {
        custName: "",
        taxpayerIdenNum: "",
        openBank: "",
        bankAccount: "",
        address: "",
        phoneNumber: "",
        authorizationCode: ""
      };
      this.$refs.salesInfoManageForm.resetFields();
    },
    pass() {
      this.isEdit = false;
      this.editData = {
        custName: "",
        taxpayerIdenNum: "",
        openBank: "",
        bankAccount: "",
        address: "",
        phoneNumber: "",
        authorizationCode: ""
      };
      this.$refs.salesInfoManageForm.resetFields();
    },
    openEdit() {
      let _data = _.cloneDeep(this.noEditData);
      this.editData = _data;
      this.isEdit = true;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}
@import "./index.scss";
</style>