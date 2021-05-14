<template>
  <el-dialog
    class="createPermissDialog"
    :visible.sync="isShowModal"
    width="760px"
    top="10vh"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
  >
    <div slot="title" class="header-title">
      <img class="columnIcon" src="@/assets/imgs/部门icon.png" />
      <span class="title-age">{{isShowEdit?'修改部门信息':'新增部门信息'}}</span>
    </div>
    <div class="dialog_changeDTU">
      <el-form
        ref="departInfoDialog"
        label-width="100px"
        label-position="left"
        :rules="changeResourceFormRules"
        :model="permissJson"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称：" prop="name">
              <el-input v-model="permissJson.name" placeholder="请输入部门名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门类型:" prop="org_stru_id">
              <el-select
                :disabled="isSameLevel"
                size="small"
                v-model="permissJson.org_stru_id"
                placeholder="请选择部门类型"
                style="width: 100%"
                key="123000"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人：" style="padding-right: 10px;" prop="principal">
              <el-input v-model="permissJson.principal" placeholder="请输入负责人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="phone" style="padding-left: 10px;">
              <el-input v-model="permissJson.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在省份：" style="padding-right: 10px;" prop="province">
              <el-select
                size="small"
                v-model="permissJson.province"
                placeholder="请选择省份"
                key="123001"
                style="width: 100%"
                @change="selectProvince"
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在市：" style="padding-left: 10px;" prop="city">
              <el-select
                size="small"
                v-model="permissJson.city"
                placeholder="请选择城市"
                style="width: 100%"
                key="123003"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="地址：" prop="location">
            <el-input v-model="permissJson.location" placeholder="请输入地址"></el-input>
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
import {
  createDepartInfo,
  getAddress,
  updateDepartInfo,
  getTypeTreeList
} from "@/api/departStaffManage.js";
import { getTenantOrgList } from "@/api/roleManage.js";
import $ from "jquery";
import _ from "lodash";

export default {
  name: "create-permiss-dialog",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      permissJson: {
        name: "", // 名称
        org_stru_id: "", // 租户组织机构
        parent_id: "", // 父ID
        city: "", // 所在城市
        location: "", //所在地址
        phone: "", // 联系电话
        principal: "", //负责人
        province: "" // 所在省份
      },
      changeResourceFormRules: {
        name: [
          {
            required: true,
            message: "部门名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("部门名称不能为空");
                return;
              }
              if (value.toString().trim().length > 20) {
                callback("请勿超过20字数");
                return;
              }
              callback();
            }
          }
        ],
        org_stru_id: [
          {
            required: true,
            message: "请选择部门类型",
            trigger: "change"
          }
        ],
        principal: [
          //负责人
          {
            required: true,
            message: "负责人不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("负责人不能为空");
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
        phone: [
          {
            required: true,
            message: "手机号码不为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == "" || value == null) {
                callback("手机号码不为空");
                return;
              }
              let _test = /^1\d{10}$/;
              if (!_test.test(value)) {
                callback("请输入11位手机号码");
                return;
              }
              if (value.length > 11) {
                callback("请勿超过11字数");
                return;
              }
              callback();
            }
          }
        ],
        province: [
          {
            required: true,
            message: "请选择省份",
            trigger: "change"
          }
        ],
        location: [
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
        city: [
          {
            required: true,
            message: "请选择城市",
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
      pageSize: 5,
      typeList: [],
      provinceList: [],
      cityList: [],
      treeList: []
    };
  },
  props: [
    "showDepartDialog",
    "isShowEdit",
    "details",
    "addPermissform",
    "isSameLevel",
    "departId",
    "isChildren"
  ],
  created() {
    getAddress({
      regionCode: 0
    }).then(res => {
      if (res.data.code == 0) {
        this.provinceList = res.data.data.records || [];
      } else {
      }
    });
  },
  watch: {
    showDepartDialog(val) {
      this.isShowModal = val;
      if (val) {
        if (this.details.basic.province) {
          this.getCity(this.details.basic.province);
        }
        if (this.isChildren) {
          this.getTypeTree();
        } else {
          this.getType();
        }
      }
    }
  },
  mounted() {
    this.permissJson = this.details;
  },
  methods: {
    // 部门类型
    getType() {
      getTenantOrgList().then(res => {
        if (res.data.code == "0") {
          this.typeList = (res.data.data || []).filter(item => {
            return item.is_enabled === true;
          });
          this.permissJson = {
            name: this.details.name, // 名称
            org_stru_id: this.details.org_stru_id, // 租户组织机构
            parent_id: this.details.parent_id, // 父ID
            city: this.details.basic.city, // 所在城市
            location: this.details.basic.location, //所在地址
            phone: this.details.basic.phone, // 联系电话
            principal: this.details.basic.principal, //负责人
            province: this.details.basic.province // 所在省份
          };
          this.$refs.departInfoDialog.resetFields();
        } else {
        }
      });
    },
    findTreeChildren(attr) {
      let _attr = _.cloneDeep(attr);
      let _children = [];
      let _tree = arr => {
        (arr || []).forEach(item => {
          if (
            this.details.parent_id == null &&
            item.tenant_org_structure.is_enabled
          ) {
            _children = [item.tenant_org_structure];
          } else if (
            this.details.org_stru_id === item.id &&
            this.details.parent_id !== null &&
            item.tenant_org_structure.is_enabled
          ) {
            _children = item.children.map(item => {
              return item.tenant_org_structure;
            });
          } else if (item.children && item.children.length > 0) {
            _tree(item.children);
          }
        });
      };
      _tree(_attr);
      return _children;
    },
    // 获取树状态图
    getTypeTree() {
      getTypeTreeList().then(res => {
        if (res.data.code == "0") {
          this.typeList = this.findTreeChildren(res.data.data);
          this.permissJson = {
            name: this.details.name, // 名称
            org_stru_id: "", // 租户组织机构
            parent_id: this.details.parent_id, // 父ID
            city: this.details.basic.city, // 所在城市
            location: this.details.basic.location, //所在地址
            phone: this.details.basic.phone, // 联系电话
            principal: this.details.basic.principal, //负责人
            province: this.details.basic.province // 所在省份
          };
          this.$refs.departInfoDialog.resetFields();
        }
      });
    },
    //  所在城市
    getCity(attr) {
      getAddress({
        regionCode: attr
      }).then(res => {
        if (res.data.code == 0) {
          this.cityList = res.data.data.records || [];
        } else {
        }
      });
    },
    selectProvince(attr) {
      this.cityList = [];
      this.permissJson.city = "";
      this.getCity(attr);
    },
    // 选择省份
    selectCity(attr) {
      // this.permissJson.city = attr;
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
    getResList(page) {},
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
      this.$refs.departInfoDialog.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (this.isShowEdit) {
            let _permissJson = { ...this.permissJson };
            let attr = {
              name: _permissJson.name,
              basic: {
                city: _permissJson.city || "", // 所在城市
                location: _permissJson.location || "", //所在地址
                phone: _permissJson.phone || "", // 联系电话
                principal: _permissJson.principal || "", //负责人
                province: _permissJson.province || "" // 所在省份
              }
            };
            updateDepartInfo(
              {
                id: this.departId
              },
              attr
            )
              .then(res => {
                loading.close();
                if (res.data.code == "0") {
                  this.closeDialog();
                  this.$emit("updateDetails", this.departId);
                  this.$message.success("更新成功");
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          } else {
            let _permissJson = { ...this.permissJson };
            let attr = {
              name: _permissJson.name,
              org_stru_id: _permissJson.org_stru_id,
              parent_id: _permissJson.parent_id || null,
              basic: {
                city: _permissJson.city, // 所在城市
                location: _permissJson.location, //所在地址
                phone: _permissJson.phone, // 联系电话
                principal: _permissJson.principal, //负责人
                province: _permissJson.province // 所在省份
              }
            };
            createDepartInfo(attr)
              .then(res => {
                loading.close();
                if (res.data.code == "0") {
                  this.closeDialog();
                  this.$emit("getTree");
                  this.$message.success("新增成功");
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.cityList = [];
      this.$refs.departInfoDialog.resetFields();
      this.$emit("closePermissDialog");
    }
  }
};
</script> 
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  .dialog_changeDTU {
    padding: 20px 35px 0 40px;
  }
}
.header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
::v-deep .el-dialog__footer {
  // box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
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
  margin-top: 30px;
  .operation_div {
    display: inline-block;
    margin-right: 20px;
  }
}
</style>   