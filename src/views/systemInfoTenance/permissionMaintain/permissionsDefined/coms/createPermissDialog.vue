<template>
  <el-dialog
    class="createPermissDialog"
    :visible.sync="showPermissDialog"
    width="640px"
    top="10vh"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <div slot="title" class="header-title">
      <img class="columnIcon" src="@/assets/imgs/permissDetails.png" />
      <span class="title-age">{{isShowEdit?'编辑权限':'新增权限'}}</span>
    </div>
    <div class="create-permiss-dialog">
      <el-form
        ref="addRolePermissForm"
        label-width="140px"
        label-position="left"
        :rules="changeResourceFormRules"
        :model="permissJson"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限描述：" prop="description">
              <el-input size="small" v-model="permissJson.description" placeholder="20字以内"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限等级：" prop="level">
              <el-select
                size="small"
                placeholder="请选择操权限等级"
                v-model="permissJson.level"
                style="width:100%"
                @focus="isShowModal=false"
              >
                <el-option label="系统级别" :value="0" :key="0"></el-option>
                <el-option label="租户级别" :value="1" :key="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用：" class="create-form-item" prop="isEnabled">
              <el-radio-group size="small" v-model="permissJson.isEnabled">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否开启RBAC:" prop="isRbacEnabled">
              <el-radio-group size="small" v-model="permissJson.isRbacEnabled">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否管理员默认：" prop="isTenantAdminDefault">
              <el-radio-group size="small" v-model="permissJson.isTenantAdminDefault">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为业务权限：" prop="isBusiness">
              <el-radio-group size="small" v-model="permissJson.isBusiness">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="操作类型：" prop="action">
            <el-select
              size="small"
              placeholder="请选择操作权限（Action）"
              v-model="permissJson.action"
              style="width:100%"
              @focus="isShowModal=false"
            >
              <el-option
                :label="item.actionName"
                :value="item.actionType"
                v-for="item in activeOptions"
                :key="item.actionType"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择资源：" prop="resourceDescription">
            <div class="select-resources-box" @click.stop>
              <!-- <div class="select-resources-input"></div> -->
              <el-input
                size="small"
                v-model="permissJson.resourceDescription"
                readonly
                placeholder="资源描述"
                @click.stop
                @focus="changeIsShowModal"
              ></el-input>
              <div class="select-resources-options" v-if="isShowModal">
                <el-table
                  :data="tableData"
                  class="tables"
                  :height="tableHeight"
                  :header-cell-style="{background:'#FAFAFA',color:'#222222',height: '52px',padding:'0'}"
                  @cell-click="clickRow"
                >
                  <el-table-column width="50px" prop="resourceId" label="ID"></el-table-column>
                  <el-table-column prop="description" label="资源描述"></el-table-column>
                  <el-table-column prop="subPath" label="路径"></el-table-column>
                </el-table>
                <el-pagination
                  class="page-nations"
                  small
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  :total="dataNum"
                ></el-pagination>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资源路径：" prop="subPath">
            <el-input size="small" v-model="permissJson.subPath" disabled placeholder="根据上述资源自动带出"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        style="width: 80px;"
        class="el-button--primary"
        size="small"
        @click="sureOk"
      >{{isShowEdit?'确定修改':'确定新增'}}</el-button>
      <el-button style="width: 80px;" size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import $ from "jquery";
import {
  getActiveAll,
  getResourceList,
  addNewPermiss,
  updatePermiss
} from "@/api/permissionMaintain.js";
import _ from "lodash";

export default {
  name: "create-permiss-dialog",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      ops: window.scrollOps, // 滚动条
      permissJson: {
        action: "",
        actionName: "",
        createStaffId: "",
        createTime: "",
        description: "",
        groupId: "",
        isBlacklist: "",
        isBusiness: 1,
        isEnabled: 1,
        isRbacEnabled: 1,
        isTenantAdminDefault: 1,
        level: 0,
        modifyStaffId: "",
        modifyTime: "",
        otherPolicyList: "",
        permissionId: "",
        resourceDescription: "",
        resourceId: "",
        subPath: ""
      },
      changeResourceFormRules: {
        description: [
          {
            required: true,
            message: "权限描述不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback("请勿超过20字数");
                return;
              }
              callback();
            }
          }
        ],
        level: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        isEnabled: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        isRbacEnabled: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        isTenantAdminDefault: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        isBusiness: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        action: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        resourceDescription: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        subPath: [
          {
            required: true,
            message: "路径不能为空",
            trigger: "change"
          }
        ]
      },
      isShowModal: false,
      tableData: [],
      activeOptions: [],
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 5
    };
  },
  props: ["showPermissDialog", "isShowEdit", "details", "addPermissform"],
  mounted() {
    let that = this;
    $(window).on("click", e => {
      this.isShowModal = false;
    });
  },
  created() {
    getActiveAll().then(res => {
      if (res.data.code == "00") {
        this.activeOptions = res.data.data || [];
      }
    });
    if (this.isShowEdit) {
      this.permissJson = _.cloneDeep(this.details);
    }
    this.getResList(1);
  },
  methods: {
    changeIsShowModal() {
      this.isShowModal = true;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getResList(currentPage);
    },
    clickRow(row, column, cell, event) {
      this.permissJson.resourceDescription = row.description;
      this.permissJson.resourceId = row.resourceId;
      this.permissJson.subPath = row.subPath;
      this.isShowModal = false;
    },
    getResList(page) {
      let _params = {
        size: 5,
        current: page
      };
      getResourceList(_params)
        .then(res => {
          if (res.data.code == "00") {
            this.tableData = res.data.data.records || [];
            this.dataNum = res.data.data.total || 0;
            this.currentPage = res.data.data.current;
            this.pageSize = res.data.data.size;
          }
        })
        .catch(() => {});
    },
    // 确认数据
    sureOk() {
      this.$refs.addRolePermissForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          for (let i in this.permissJson) {
            if (
              typeof this.permissJson[i] == "string" &&
              this.permissJson[i].constructor == String
            ) {
              this.permissJson[i] = this.permissJson[i].trim();
            }
          }
          if (this.isShowEdit) {
            let _actionName = _.find(this.activeOptions, item => {
              return item.actionType === this.permissJson.action;
            });
            let _permissJson = _.cloneDeep(this.permissJson);
            if (_actionName) {
              _.set(_permissJson, "actionName", _actionName.actionName);
            }
            updatePermiss(_permissJson)
              .then(res => {
                loading.close();
                if (res.data.code == "00") {
                  this.$message.success("修改权限描述成功");
                  this.$refs.addRolePermissForm.resetFields();
                  this.$emit("sureUpdateDetails", _permissJson);
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(error => {
                loading.close();
                this.$message.error(error.message);
              });
          } else {
            let _permissJson = { ...this.permissJson };
            _permissJson["groupId"] = this.addPermissform.groupId || 0;
            addNewPermiss(_permissJson)
              .then(res => {
                loading.close();
                if (res.data.code == "00") {
                  this.$message.success("添加成功");
                  this.closeDialog();
                  this.$emit("getTreeList");
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(error => {
                loading.close();
                this.$message.error(error.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.$refs.addRolePermissForm.resetFields();
      this.permissJson = {
        action: "",
        actionName: "",
        createStaffId: "",
        createTime: "",
        description: "",
        groupId: "",
        isBlacklist: "",
        isBusiness: 1,
        isEnabled: 1,
        isRbacEnabled: 1,
        isTenantAdminDefault: 1,
        level: "",
        modifyStaffId: "",
        modifyTime: "",
        otherPolicyList: "",
        permissionId: "",
        resourceDescription: "",
        resourceId: "",
        subPath: ""
      };
      this.$emit("closePermissDialog");
    }
  }
};
</script> 
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .el-dialog__footer {
  padding: 16px 40px;
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
}
.create-permiss-dialog {
  height: 390px;
  padding: 24px 35px 0 40px;
  overflow: auto;
  .dialog_changeDTU {
    width: 100%;
    height: 100%;
    padding-bottom: 10px;
  }
  .operation {
    color: #ababab;
    font-size: 14px;
    margin-top: 30px;
    margin-bottom: 10px;
    .operation_div {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
.columnIcon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}
.dialog-footer {
  text-align: left;
}
.select-resources-box {
  position: relative;
  .select-resources-input {
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .select-resources-options {
    position: absolute;
    left: 0;
    top: 42px;
    width: 412px;
    height: 360px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    z-index: 100;
  }
  .page-nations {
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: right;
  }
}
</style>   