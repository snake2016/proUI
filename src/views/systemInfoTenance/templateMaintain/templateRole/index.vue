<template>
  <div class="template-role-page">
    <div class="template-role-left">
      <div class="template-role-left-title-box">
        <div class="template-role-left-title">
          <img class="columnIcon" src="@/assets/imgs/groupJg.png" />
          <span>组织结构</span>
        </div>
      </div>
      <div class="template-role-left-treebox">
        <div class="template-role-left-tree" id="id">
          <vue-scroll :ops="ops">
            <el-tree
              default-expand-all
              :data="roleData"
              highlight-current
              :props="defaultProps"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.org_stru_template.name }}</span>
              </span>
            </el-tree>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div class="template-role-right">
      <div class="template-role-right-title-box">
        <div class="template-role-right-title">
          <img class="columnIcon" src="@/assets/imgs/tempIcon.png" />
          <span>角色列表</span>
          <el-button
            size="small"
            class="create-template-btn"
            @click="onCreateRole"
            v-has="'templateRole_add'"
          >新建模板角色</el-button>
        </div>
      </div>
      <div class="template-role-right-details">
        <div
          style="height: 100%; overflow: hidden auto;"
          id="scrollIdBox"
          v-if="roleDataList.length > 0 "
        >
          <div
            v-for="item in roleDataList"
            :key="item.id"
            :class="['details-item',{'selectedActive': roleTreeSelected.id === item.id }]"
          >
            <div :class="['details-item-box',`detailsItem${item.id}`]">
              <div class="details-item-title">{{item.name}}</div>
              <ul class="details-item-ul">
                <li v-for="val in item.children" :key="val.id">
                  <div class="item-title">{{val.name}}</div>
                  <div class="item-org">所属组织：{{item.name}}</div>
                  <div class="item-footer">
                    <div class="item-footer-left" @click="queryDetails(val)">
                      <svg
                        class="icon"
                        aria-hidden="true"
                        slot="reference"
                        style="margin-right:4px;height: 12px;width: 18px;"
                        path="fill: rgb(255,255,255)"
                      >
                        <use xlink:href="#el-icon-see-details-copy" />
                      </svg>
                      <span>查看详情</span>
                    </div>
                    <div
                      class="item-footer-right"
                      @click="editRole(val)"
                      v-has="'templateRole_modify'"
                    >
                      <svg
                        class="icon"
                        aria-hidden="true"
                        slot="reference"
                        style="margin-right:4px;height: 12px;width: 18px;"
                        path="fill: rgb(255,255,255)"
                      >
                        <use xlink:href="#el-icon-bianji" />
                      </svg>
                      <span>编辑角色</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="details-empty-data" v-if="roleDataList.length === 0">
          <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
          <div class="text">暂无角色列表</div>
        </div>
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :visible.sync="showDrawerDialog"
      size="400px"
      @closed="closedDrawer"
    >
      <template slot="title">
        <div class="drawer-dialog-title-wrap">
          <img class="columnIcon" src="@/assets/imgs/tempIcon.png" />
          <span v-if="isCreateRole">新建模板角色</span>
          <span v-if="isRoleDetails">角色详情</span>
          <span v-if="isEditRole">编辑角色</span>
        </div>
      </template>
      <template>
        <div class="role-content">
          <el-form
            ref="ruleRoleTempForm"
            label-width="140px"
            label-position="left"
            class="role-form-content"
            :rules="roleFormRules"
            :model="roleForm"
          >
            <el-form-item label="角色名称：" prop="name">
              <div
                style="padding-left:10px;"
                v-if="isRoleDetails&&!showBtn"
              >{{editFormDetails.name}}</div>
              <el-input size="small" v-else v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="所属组织机构：" prop="org_stru_id">
              <div
                style="padding-left:10px;"
                v-if="isRoleDetails&&!showBtn"
                v-html="changeHtml(editFormDetails.org_stru_id)"
              ></div>
              <el-select
                v-else
                size="small"
                v-model="roleForm.org_stru_id"
                placeholder="请选择组织机构"
                style="width: 100%"
              >
                <el-option
                  v-for="item in treeTileData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="role-tree-content">
            <div class="role-tree-content-title">权限分配</div>
            <div class="role-tree-content-box">
              <vue-scroll :ops="ops">
                <el-tree
                  ref="tempPermissTree"
                  :data="permissionTreeData"
                  highlight-current
                  default-expand-all
                  :props="defaultProps"
                  show-checkbox
                  node-key="keyId"
                  @check-change="handleCheckChange"
                  :default-checked-keys="permissionDefaultKey"
                  :expand-on-click-node="false"
                  :check-on-click-node="true"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.description }}</span>
                  </span>
                </el-tree>
              </vue-scroll>
            </div>
          </div>
          <div class="role-form-footer">
            <div v-if="isCreateRole">
              <el-button
                @click="addTempModel"
                style="width: 80px;"
                class="el-button--primary"
                size="small"
              >创建</el-button>
              <el-button @click="showDrawerDialog=false" style="width: 80px;" size="small">取消</el-button>
            </div>
            <div v-if="isRoleDetails">
              <el-button
                v-if="!showBtn"
                v-has="'templateRole_delete'"
                @click="deleteRole"
                style="width: 80px;border:1px solid #EC6B60;color:#EC6B60"
                size="small"
              >删除</el-button>
              <el-button
                v-if="!showBtn"
                @click="editRolePermiss"
                v-has="'templateRole_modify'"
                size="small"
                style="width: 80px;border:1px solid #2F87FE;color:#2F87FE;margin-right:10px;"
              >编辑</el-button>
              <el-button
                v-if="showBtn"
                @click="updateTemp"
                style="width: 80px;"
                class="el-button--primary"
                size="small"
              >保存</el-button>
              <el-button
                v-if="showBtn"
                @click="passRolePermiss"
                style="width: 80px;"
                size="small"
              >取消</el-button>
            </div>
            <div v-if="isEditRole">
              <el-button
                @click="updateTemp"
                style="width: 80px;"
                class="el-button--primary"
                size="small"
              >保存</el-button>
              <el-button @click="showDrawerDialog=false" style="width: 80px;" size="small">取消</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
    <gc-confirm-again
      :visible="isDeleteRole"
      title="此操作将删除该角色, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteRole=false"
      @onOk="onOkDeleteRole"
    />
  </div>
</template>
<script>
import $ from "jquery";
import {
  getGroupTree,
  getRoleList,
  getTreeDataFromRole,
  addTempRole,
  updateTempRole,
  deleteTempRole
} from "@/api/templateMaintain.js";
import _ from "lodash";

export default {
  name: "permission-defined",
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      showDrawerDialog: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      roleFormRules: {
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("角色名称不能为空");
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
            message: "所属组织机构不能为空",
            trigger: "change"
          }
        ]
      },
      roleForm: {
        name: "",
        org_stru_id: "",
        id: "",
        permission_list: []
      },
      editFormDetails: {
        name: "",
        org_stru_id: "",
        id: "",
        permission_list: []
      },
      details: true,
      data: [],
      roleData: [],
      selectTreeData: "", //选中树的数据
      isShowEdit: false,
      showPermissDialog: false,
      // 获取组织树平铺数据
      treeTileData: [],
      //角色列表
      roleDataList: [],
      query: "",
      a: "",
      //权限分配树数据
      permissionTreeData: [],
      isCreateRole: false,
      isEditRole: false,
      isRoleDetails: false,
      showBtn: false,
      permissionDefaultKey: [],
      //
      roleTreeSelected: "",
      isDeleteRole: false
    };
  },
  created() {},
  mounted() {
    this.getTreeList();
  },
  methods: {
    // 编辑权限
    editRolePermiss() {
      this.showBtn = true;
      let _permissionTreeData = _.cloneDeep(this.permissionTreeData);
      let rowDataToTreeData = arr => {
        let newArr = [];
        //  arr 是返回的数据  parendId 父id
        arr.forEach(item => {
          _.set(item, "disabled", false);
          if (item.children && item.children.length > 0) {
            item.children = rowDataToTreeData(item.children);
          }
          newArr.push(item);
        });
        return newArr;
      };
      this.roleForm = _.cloneDeep(this.editFormDetails);
      this.permissionTreeData = rowDataToTreeData(_permissionTreeData);
    },
    // 取消编辑权限
    passRolePermiss() {
      this.showBtn = false;
      this.getRolePermissData(this.editFormDetails.id);
    },
    //
    changeHtml(attr) {
      let org = _.find(this.treeTileData, item => {
        return item.id === attr;
      });
      return org.name || "";
    },
    handleNodeClick(attr) {
      let _scrollIdBox = $("#scrollIdBox")[0];
      const jump = $(`.detailsItem${attr.id}`);
      const scrollTop = jump.position().top + _scrollIdBox.scrollTop - 2; // 获取需要滚动的距离
      // Chrome
      _scrollIdBox.scrollTo({
        top: scrollTop,
        behavior: "smooth" // 平滑滚动
      });
      this.roleTreeSelected = attr;
    },
    node(attr) {},
    // 将树状图数据平铺开来
    convertData(data) {
      // //递归弄成树状图
      let temp = [];
      let rowDataToTreeData = arr => {
        //  arr 是返回的数据  parendId 父id
        let treeArr = _.cloneDeep(arr);
        (treeArr || []).forEach(item => {
          if (item.children && item.children.length > 0) {
            _.set(item.org_stru_template, "children", []);
            temp.push(item.org_stru_template);
            item.children = rowDataToTreeData(item.children);
          } else {
            _.set(item.org_stru_template, "children", []);
            temp.push(item.org_stru_template);
          }
        });
      };
      rowDataToTreeData(data);
      return temp;
    },
    //获取组织结构树数据
    getTreeList() {
      getGroupTree().then(data => {
        if (data.data.code == "0") {
          this.treeTileData = this.convertData(data.data.data);
          this.roleData = data.data.data;
          this.getRightRoleList();
        } else {
        }
      });
    },
    // 获取当前租户的权限列表
    getPermissionList(data) {
      let list = [];
      if (data.children && data.children.length) {
        list = data.children;
      } else if (data.permissionList && data.permissionList) {
        list = data.permissionList;
      }
      let checkKeys = []; // 当前已勾选
      let allKeys = []; // 全选数据
      let getTree = arr => {
        let rArr = [];
        arr.map((item, index) => {
          let addItem = {};
          // 节点id分groupId和permissionId，为了唯一性添加前缀
          if (item.groupId) {
            addItem = {
              keyId: `g-${item.groupId}`,
              description: item.description,
              disabled: this.isRoleDetails && !this.showBtn
            };
            // item.check ? checkKeys.push(addItem.keyId) : null;
            item.enable
              ? allKeys.push(addItem.keyId)
              : (addItem.disabled = true); // 全选和不可选
          } else if (item.permissionId) {
            addItem = {
              keyId: `p-${item.permissionId}`,
              description: item.description,
              enable: item.enable,
              disabled: this.isRoleDetails && !this.showBtn
            };
            item.check ? checkKeys.push(addItem.keyId) : null;
            item.enable
              ? allKeys.push(addItem.keyId)
              : (addItem.disabled = true); // 全选和不可选
          } else {
            throw "节点id缺失：" + item.description;
          }
          // 递归生成children,children和permissionList均属于子节点
          let childItem = [];
          let permissionItem = [];
          if (item.children && item.children.length) {
            childItem = getTree(item.children);
          }
          if (item.permissionList && item.permissionList.length) {
            permissionItem = getTree(item.permissionList);
          }
          childItem.length || permissionItem.length
            ? (addItem.children = childItem.concat(permissionItem))
            : null;
          rArr.push(addItem);
        });
        return rArr;
      };
      try {
        this.permissionTreeData = getTree(list); // 权限树
        this.permissionDefaultKey = checkKeys; // 当前已勾选项
      } catch (error) {
        // this.$message.error("权限树生成发生错误");
      }
    },
    // 获取权限分配树状图
    getRolePermissData(attr) {
      getTreeDataFromRole({
        isBusiness: true,
        roleId: attr
      }).then(res => {
        if (res.data.code == "00") {
          this.getPermissionList(res.data.data);
          this.showDrawerDialog = true;
        }
      });
    },
    //  勾选权限分配数据
    handleCheckChange(data, checked, indeterminate) {},
    //  角色列表
    getRightRoleList() {
      getRoleList({
        paged: false
      }).then(res => {
        if (res.data.code == "0") {
          let _treeData = _.cloneDeep(this.treeTileData);
          (res.data.data || []).forEach(item => {
            _treeData.forEach(val => {
              if (val.id === item.org_stru_id) {
                val["children"].push(item);
              }
            });
          });
          this.roleDataList = _treeData;
        } else {
        }
      });
    },
    ////创建模板角色///////
    onCreateRole() {
      this.isCreateRole = true;
      this.showDrawerDialog = true;
      this.getRolePermissData(0);
    },
    //新增模板角色
    addTempModel() {
      this.$refs.ruleRoleTempForm.validate(valid => {
        if (valid) {
          let checkedKeys = this.$refs.tempPermissTree.getCheckedKeys() || [];
          let resKeys = [];
          checkedKeys.map(item => {
            if (item.length > 2 && item[0] == "p") {
              resKeys.push(item.split("-")[1]);
            }
          });
          let _permissForm = _.cloneDeep(this.roleForm);
          _permissForm["permission_list"] = resKeys;
          if (resKeys.length === 0) {
            return this.$message.error("权限不能为空");
          } else {
            let addTempLoading = this.$loading({
              target: ".List",
              background: "rgba(255,255,255,0.7)"
            });
            addTempRole({
              name: _permissForm.name.toString().trim(),
              org_stru_id: _permissForm.org_stru_id,
              permission_list: resKeys
            })
              .then(res => {
                addTempLoading.close();
                if (res.data.code == "0") {
                  this.$message.success("创建成功");
                  this.getRightRoleList();
                  this.showDrawerDialog = false;
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                addTempLoading.close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    //  查看详情
    queryDetails(attr) {
      this.isRoleDetails = true;
      this.showBtn = false;
      this.roleForm = {
        name: attr.name,
        id: attr.id,
        org_stru_id: attr.org_stru_id,
        permission_list: []
      };
      this.editFormDetails = {
        name: attr.name,
        id: attr.id,
        org_stru_id: attr.org_stru_id,
        permission_list: []
      };
      this.getRolePermissData(attr.id);
    },
    //  编辑角色
    editRole(attr) {
      this.isEditRole = true;
      this.roleForm = {
        name: attr.name,
        org_stru_id: attr.org_stru_id,
        id: attr.id,
        permission_list: []
      };
      this.getRolePermissData(attr.id);
    },
    //  更改模板角色
    updateTemp() {
      this.$refs.ruleRoleTempForm.validate(valid => {
        if (valid) {
          let checkedKeys = this.$refs.tempPermissTree.getCheckedKeys() || [];
          let resKeys = [];
          checkedKeys.map(item => {
            if (item.length > 2 && item[0] == "p") {
              resKeys.push(item.split("-")[1]);
            }
          });
          let _permissForm = _.cloneDeep(this.roleForm);
          _permissForm["permission_list"] = resKeys;
          if (resKeys.length === 0) {
            return this.$message.error("权限不能为空");
          } else {
            let editChangeLoading = this.$loading({
              target: ".List",
              background: "rgba(255,255,255,0.7)"
            });
            updateTempRole(
              { id: _permissForm.id },
              {
                name: _permissForm.name.toString().trim(),
                org_stru_id: _permissForm.org_stru_id,
                permission_list: _permissForm.permission_list
              }
            )
              .then(res => {
                editChangeLoading.close();
                if (res.data.code == "0") {
                  this.$message.success("更改成功");
                  this.getRightRoleList();
                  this.showDrawerDialog = false;
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                editChangeLoading.close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    onOkDeleteRole() {
      deleteTempRole({
        id: this.roleForm.id
      })
        .then(res => {
          this.isDeleteRole = false;
          if (res.data.code == "0") {
            this.$message.success("删除成功");
            this.getRightRoleList();
            this.showDrawerDialog = false;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isDeleteRole = false;
          this.$message.error(err.message);
        });
    },
    //删除角色模板
    deleteRole() {
      this.isDeleteRole = true;
    },
    // 取消编辑状态
    cancelEdit() {
      this.showBtn = false;
    },
    closedDrawer() {
      this.$refs.ruleRoleTempForm.resetFields();
      this.isCreateRole = false;
      this.isEditRole = false;
      this.isRoleDetails = false;
      this.roleForm = {
        name: "",
        id: "",
        org_stru_id: "",
        permission_list: []
      };
      this.editFormDetails = {
        name: "",
        id: "",
        org_stru_id: "",
        permission_list: []
      };
      this.permissionDefaultKey = [];
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: calc(100% - 107px);
}
::v-deep .el-tree {
  background: none;
}
::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #dce8ff;
  .custom-tree-node {
    color: #2f87fe;
  }
}

::v-deep .el-tree-node__content {
  line-height: 34px;
  height: 34px;
  color: #666666;
}
::v-deep .el-drawer__header {
  height: 50px;
  padding: 0px 20px;
  margin-bottom: 0px;
}
.drawer-dialog-title-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .columnIcon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-right: 8px;
  }
  span {
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 550;
    color: rgba(34, 34, 34, 1);
  }
}
@import "./index.scss";
</style>