<template>
  <el-dialog
    class="createPermissDialog"
    :visible.sync="isShowModal"
    width="760px"
    top="10vh"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <div slot="title" class="header-title">
      <img class="columnIcon" src="@/assets/imgs/permissIconDialog.png" />
      <span class="title-age">{{isShowEdit?'员工详情':'新增员工'}}</span>
    </div>

    <div class="dialog_changeDTU">
      <vue-scroll :ops="ops" ref="modelScroll">
        <div class="dialog_changeDTU-content-box">
          <el-form
            ref="addDepartEmpForm"
            label-width="100px"
            label-position="left"
            :rules="changeResourceFormRules"
            :model="permissJson"
          >
            <div class="base-info-title">基本信息</div>
            <el-row>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="员工姓名：" style="padding-right: 10px;" prop="name">
                  <span
                    class="item-content"
                    :title="noEditDetails.name"
                    v-if="isNoEdit"
                  >{{noEditDetails.name}}</span>
                  <el-input size="small" v-else v-model="permissJson.name" placeholder="请输入员工姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="所属部门：" style="padding-left: 10px;" prop="org_code">
                  <span
                    class="item-content"
                    :title="noEditDetails.org_name"
                    v-if="isNoEdit"
                  >{{noEditDetails.org_name}}</span>
                  <el-input
                    size="small"
                    v-else
                    disabled
                    v-model="permissJson.org_name"
                    placeholder="请选择部门"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="性别：" style="padding-right: 10px;" prop="gender">
                  <span
                    class="item-content"
                    v-if="isNoEdit"
                  >{{noEditDetails.gender === 0?"男":(noEditDetails.gender === 1?"女":"--")}}</span>
                  <el-select
                    v-else
                    size="small"
                    v-model="permissJson.gender"
                    placeholder="请选择性别"
                    style="width: 100%"
                  >
                    <el-option :key="0" label="男" :value="0"></el-option>
                    <el-option :key="1" label="女" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="所属角色：" prop="role_id" style="padding-left: 10px;">
                  <span
                    class="item-content"
                    :title="noEditDetails.roleName"
                    v-if="isNoEdit"
                  >{{noEditDetails.roleName}}</span>
                  <el-select
                    v-else
                    size="small"
                    v-model="permissJson.role_id"
                    placeholder="请选择角色"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="员工号：" style="padding-right: 10px;" prop="staff_no">
                  <span
                    class="item-content"
                    :title="noEditDetails.staff_no"
                    v-if="isNoEdit"
                  >{{noEditDetails.staff_no}}</span>
                  <el-input size="small" v-else v-model="permissJson.staff_no" placeholder="请输入员工号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="状态：" prop="resigned" style="padding-left: 10px;">
                  <span v-if="isNoEdit">{{noEditDetails.is_resigned?'离职':'在职'}}</span>
                  <el-select
                    v-else
                    size="small"
                    :disabled="!isShowEdit"
                    v-model="permissJson.is_resigned"
                    placeholder="请选择状态"
                    style="width: 100%"
                  >
                    <el-option label="在职" :value="false"></el-option>
                    <el-option label="离职" :value="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="手机号码：" style="padding-right: 10px;" prop="mobile">
                  <span
                    class="item-content"
                    :title="noEditDetails.mobile"
                    v-if="isNoEdit"
                  >{{noEditDetails.mobile}}</span>
                  <el-input size="small" v-else v-model="permissJson.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="办公电话：" style="padding-left: 10px;" prop="phone">
                  <span
                    class="item-content"
                    :title="noEditDetails.phone"
                    v-if="isNoEdit"
                  >{{noEditDetails.phone}}</span>
                  <el-input size="small" v-else v-model="permissJson.phone" placeholder="请输入办公电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="身份证号：" style="padding-right: 10px;" prop="id_card_no">
                  <span
                    class="item-content"
                    :title="noEditDetails.id_card_no"
                    v-if="isNoEdit"
                  >{{noEditDetails.id_card_no}}</span>
                  <el-input
                    size="small"
                    v-else
                    v-model="permissJson.id_card_no"
                    placeholder="请输入身份证号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}"
                v-if="isShowEdit"
              >
                <el-form-item label="登录账号：" style="padding-left: 10px;" prop="account_name">
                  <span
                    class="item-content"
                    :title="noEditDetails.account_name"
                    v-if="isNoEdit"
                  >{{noEditDetails.account_name}}</span>
                  <el-input
                    size="small"
                    v-else
                    v-model="permissJson.account_name"
                    placeholder="请输入登录账号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="备注：" prop="remark">
                  <span
                    class="remark-info"
                    :title="noEditDetails.remark"
                    v-if="isNoEdit"
                  >{{noEditDetails.remark}}</span>
                  <el-input size="small" v-else v-model="permissJson.remark" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="base-info-title" v-if="!isShowEdit">登录信息</div>
            <el-row v-if="!isShowEdit">
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <div id="login_name">
                  <el-form-item label="登录账号：" prop="account_name">
                    <span v-if="isNoEdit">{{noEditDetails.account_name}}</span>
                    <el-input
                      size="small"
                      v-else
                      v-model="permissJson.account_name"
                      placeholder="请输入登录账号"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12" :style="{'margin-bottom':isNoEdit?0:'14px','height': '40px'}">
                <el-form-item label="登录密码：" style="padding-left: 10px;" prop="account_password">
                  <span v-if="isNoEdit">{{noEditDetails.account_password}}</span>
                  <el-input
                    size="small"
                    v-else
                    disabled
                    v-model="permissJson.account_password"
                    placeholder="请输入登录密码"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </vue-scroll>
    </div>

    <div slot="footer" class="dialog-footer" :class="{'noPadding':isShow}">
      <el-button
        style="width: 80px;"
        class="el-button--primary"
        v-if="!isNoEdit"
        size="small"
        @click="sureOk"
      >{{isShowEdit?'确定修改':'确定新增'}}</el-button>
      <el-button style="width: 80px;" size="small" v-if="!isNoEdit" @click="closeDialog">取消</el-button>
      <el-button
        style="width: 80px;"
        class="el-button--primary"
        v-if="isNoEdit&&isLocked"
        v-has="'departStaffManage_modifystaff'"
        size="small"
        @click="changeEdit"
      >修改</el-button>
      <!-- <el-button style="width: 80px;border:1px solid #EC6B60;color:#EC6B60" @click="deleteEmp"  v-if="isNoEdit&&isLocked&&UserRoleName!=='营业员'&&UserRoleName !=='跨域运维操作员'" size="small">删除</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import {
  addNewDepartPerson,
  updatePersonInfo,
  deleteDepartPerson
} from "@/api/departStaffManage.js";
import { getTenantList } from "@/api/roleManage.js";
import $ from "jquery";
import _ from "lodash";

export default {
  name: "create-permiss-dialog",
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      tableHeight: "calc(100% - 52px)",
      permissJson: {
        name: "", //员工名称
        org_code: "", //所属租户组织机构
        org_name: "", // 所属租户组织名称
        role_id: "", //所属角色ID
        gender: 0, //性别
        staff_no: "", //员工号
        is_resigned: false, //在职或者离职
        mobile: "", //手机号
        phone: "", //联系电话
        id_card_no: "", //身份证
        emal: "", //电子邮箱
        remark: "", //备注
        account_name: "", //账号名
        account_password: "" // 账号密码
      },
      changeResourceFormRules: {
        name: [
          {
            required: true,
            message: "员工姓名不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("员工姓名不能为空");
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
        org_code: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change"
          }
        ],
        role_id: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        staff_no: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 16) {
                callback("请勿超过16字数");
                return;
              }
              callback();
            }
          }
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^1[3456789]\d{9}$/.test(value)) {
                callback("输入正确的手机号码");
                return;
              }
              callback();
            }
          }
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 18) {
                callback("请勿超过18字数");
                return;
              }
              callback();
            }
          }
        ],
        id_card_no: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 18) {
                callback("请勿超过18字数");
                return;
              }
              callback();
            }
          }
        ],
        remark: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 128) {
                callback("请勿超过128字数");
                return;
              }
              callback();
            }
          }
        ],
        account_name: [
          {
            required: true,
            message: "登录账号不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value.replace(/^\s+|\s+$/g, "").length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ]
      },
      isShowModal: false,
      tableData: [],
      activeOptions: [],
      currentPage: 1,
      roleList: [], // 实际上的角色列表
      allRoleList: [],
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 5,
      noEditDetails: {
        id: "", //  员工Id
        name: "", //员工名称
        org_code: "", //所属租户组织机构
        org_name: "", // 所属租户组织名称
        role_id: "", //所属角色ID
        roleName: "", // 所属角色名称
        gender: 0, //性别
        staff_no: "", //员工号
        is_resigned: false, //在职或者离职
        mobile: "", //手机号
        phone: "", //联系电话
        id_card_no: "", //身份证
        emal: "", //电子邮箱
        remark: "", //备注
        account_name: "", //账号名
        account_password: "" // 账号密码
      },
      editDetails: {
        id: "", //  员工Id
        name: "", //员工名称
        org_code: "", //所属租户组织机构
        org_name: "", // 所属租户组织名称
        role_id: "", //所属角色ID
        gender: 0, //性别
        staff_no: "", //员工号
        is_resigned: false, //在职或者离职
        mobile: "", //手机号
        phone: "", //联系电话
        id_card_no: "", //身份证
        emal: "", //电子邮箱
        remark: "", //备注
        account_name: "", //账号名
        account_password: "" // 账号密码
      },
      isNoEdit: false,
      UserRoleName: "",
      isShow: true
    };
  },
  props: [
    "showEmployeesDialog",
    "isShowEdit",
    "details",
    "showDetails",
    "orgJson",
    "addPermissform",
    "isLocked"
  ],
  mounted() {},
  created() {
    this.UserRoleName = this.$ls.get("userGradeName");
    this.isShow =
      this.$_has("departStaffManage_addstaff") ||
      this.$_has("departStaffManage_modifystaff");
    if (this.isShow) {
      this.getRoleList();
    }
  },
  watch: {
    showEmployeesDialog(newVal) {
      this.isShowModal = newVal;
      if (newVal) {
        if (!this.isShowEdit) {
          let _roleList = _.cloneDeep(this.allRoleList);
          this.roleList = _roleList.filter(item => {
            return item.org_stru_id === this.orgJson.orgStruId;
          });
          this.permissJson = {
            name: "", //员工名称
            org_code: this.orgJson.orgCode, //所属租户组织机构
            org_name: this.orgJson.orgName, // 所属租户组织名称
            role_id: "", //所属角色ID
            gender: 0, //性别
            staff_no: "", //员工号
            is_resigned: false, //在职或者离职
            mobile: "", //手机号
            phone: "", //联系电话
            id_card_no: "", //身份证
            emal: "", //电子邮箱
            remark: "", //备注
            account_name: "", //账号名
            account_password: "000000" // 账号密码
          };
        } else if (this.showDetails) {
          this.isNoEdit = true;
          let _roleList = _.cloneDeep(this.allRoleList);
          this.roleList = _roleList.filter(item => {
            return item.org_stru_id === this.orgJson.orgStruId;
          });
          this.noEditDetails = {
            id: this.details.id || "",
            name: this.details.name || "", //员工名称
            org_code: this.orgJson.orgCode || "", //所属租户组织机构
            org_name: this.orgJson.orgName || "", // 所属租户组织名称
            role_id: this.details.role_id || "", //所属角色ID
            roleName: this.details.role_name || "", // 角色名称
            gender: this.details.basic.gender, //性别
            staff_no: this.details.basic.staff_no || "", //员工号
            is_resigned: this.details.is_resigned || false, //在职或者离职
            mobile: this.details.basic.mobile || "", //手机号
            phone: this.details.basic.phone || "", //联系电话
            id_card_no: this.details.basic.id_card_no || "", //身份证
            remark: this.details.basic.remark || "", //备注
            account_name: this.details.account_name || "", //账号名
            account_password: this.details.account_password || "" // 账号密码
          };
        } else {
          let _roleList = _.cloneDeep(this.allRoleList);
          this.roleList = _roleList.filter(item => {
            return item.org_stru_id === this.orgJson.orgStruId;
          });
          this.permissJson = {
            id: this.details.id || "",
            name: this.details.name || "", //员工名称
            org_code: this.orgJson.orgCode || "", //所属租户组织机构
            org_name: this.orgJson.orgName || "", // 所属租户组织名称
            role_id: this.details.role_id || "", //所属角色ID
            gender:
              this.details.basic.gender == 2
                ? 0
                : this.details.basic.gender || 0, //性别
            staff_no: this.details.basic.staff_no || "", //员工号
            is_resigned: this.details.is_resigned || false, //在职或者离职
            mobile: this.details.basic.mobile || "", //手机号
            phone: this.details.basic.phone || "", //联系电话
            id_card_no: this.details.basic.id_card_no || "", //身份证
            remark: this.details.basic.remark || "", //备注
            account_name: this.details.account_name || "", //账号名
            account_password: this.details.account_password || "" // 账号密码
          };
        }
      }
    }
  },
  methods: {
    changeEdit() {
      this.isNoEdit = false;
      this.permissJson = _.cloneDeep(this.noEditDetails);
      if (this.permissJson.gender != 0 && this.permissJson.gender != 1) {
        this.permissJson.gender = 0; //性别不为男/女时，默认为男
      }
    },
    //
    getRoleList() {
      getTenantList().then(res => {
        if (res.data.code == "0") {
          this.allRoleList = (res.data.data || []).filter(item => {
            return item.is_admin !== true;
          });
        }
      });
    },
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
    //  删除员工
    deleteEmp() {
      deleteDepartPerson({
        id: this.noEditDetails.id
      })
        .then(res => {
          if (res.data.code == "0") {
            this.$refs.addDepartEmpForm.resetFields();
            this.$message.success("删除成功");
            this.closeDialog();
            this.$emit("getPersonList");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    // 确认数据
    sureOk() {
      for (let i in this.permissJson) {
        if (
          typeof this.permissJson[i] == "string" &&
          this.permissJson[i].constructor == String
        ) {
          this.permissJson[i] = this.permissJson[i].trim();
        }
      }
      this.$refs.addDepartEmpForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (this.isShowEdit) {
            let _permissJson = _.cloneDeep(this.permissJson);
            let _attr = {
              account_name: _permissJson.account_name,
              is_resigned: _permissJson.is_resigned,
              name: _permissJson.name,
              org_code: _permissJson.org_code,
              role_id: _permissJson.role_id,
              basic: {
                id_card_no: _permissJson.id_card_no,
                mobile: _permissJson.mobile,
                phone: _permissJson.phone,
                remark: _permissJson.remark,
                staff_no: _permissJson.staff_no,
                gender: _permissJson.gender
              }
            };
            updatePersonInfo({ id: _permissJson.id }, _attr)
              .then(res => {
                loading.close();
                if (res.data.code == "0") {
                  this.$refs.addDepartEmpForm.resetFields();
                  this.$message.success("更新成功");
                  this.closeDialog();
                  this.$emit("getPersonList");
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
            let attr = {
              name: _permissJson.name,
              org_code: _permissJson.org_code,
              role_id: _permissJson.role_id,
              account_name: _permissJson.account_name.replace(/^\s+|\s+$/g, ""),
              basic: {
                id_card_no: _permissJson.id_card_no,
                mobile: _permissJson.mobile,
                phone: _permissJson.phone,
                remark: _permissJson.remark,
                staff_no: _permissJson.staff_no,
                gender: _permissJson.gender
              }
            };
            addNewDepartPerson(attr)
              .then(res => {
                loading.close();
                if (res.data.code == "0") {
                  this.$message.success("添加成功");
                  this.closeDialog();
                  this.$emit("getPersonList");
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
          if (
            this.permissJson &&
            this.permissJson["name"] &&
            this.permissJson["role_id"]
          ) {
            this.$refs["modelScroll"].scrollIntoView("#login_name", 500); //将滚动条定位到出错的位置
          }
          return false;
        }
      });
    },
    closeDialog() {
      this.permissJson = {
        name: "", //员工名称
        org_code: "", //所属租户组织机构
        org_name: "", // 所属租户组织名称
        role_id: "", //所属角色ID
        gender: 0, //性别
        staff_no: "", //员工号
        is_resigned: false, //在职或者离职
        mobile: "", //手机号
        phone: "", //联系电话
        id_card_no: "", //身份证
        emal: "", //电子邮箱
        remark: "", //备注
        account_name: "", //账号名
        account_password: "" // 账号密码
      };
      this.$refs.addDepartEmpForm.resetFields();
      this.isNoEdit = false;
      this.$emit("closePersonDialog");
    }
  }
};
</script> 
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  .dialog_changeDTU {
    height: 384px;

    .dialog_changeDTU-content-box {
      padding: 10px 35px 10px 40px;
    }
    .remark-info {
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 90%;
      cursor: pointer;
    }
    .item-content {
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      cursor: pointer;
    }
  }
}
.header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.base-info-title {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(171, 171, 171, 1);
  height: 40px;
  line-height: 40px;
}
.columnIcon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}
::v-deep .el-dialog__footer {
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
  padding: 0 !important;
}
.noPadding {
  padding: 14px 0 14px 40px;
}
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
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
    width: 500px;
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

.operation {
  color: #ababab;
  font-size: 14px;
  margin-top: 24px;
  .operation_div {
    display: inline-block;
    margin-right: 20px;
  }
}
</style>   