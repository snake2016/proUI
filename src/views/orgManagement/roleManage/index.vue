<template>
  <div class="role-manage-wrap">
    <div class="role-manage-wrap-left">
      <div class="role-manage-wrap-left-title-box">
        <div class="role-manage-wrap-left-title">
          <img class="columnIcon" src="@/assets/imgs/列表icon.png" />
          <span>角色列表</span>
          <div class="role-manage-icon-btn">
            <img
              title="应用模板角色组"
              class="addModeIcon"
              src="@/assets/imgs/addGroupIcon.png"
              @click="applicationGroup"
              v-has="'roleManage_applys'"
            />
            <img
              title="应用模板角色"
              class="addModeRoleIcon"
              src="@/assets/imgs/addModeRoleIcon.png"
              @click="getApplicationRoleList"
              v-has="'roleManage_apply'"
            />
            <img
              title="新增角色"
              class="addModeIcon"
              src="@/assets/imgs/增加角色.png"
              @click="createNewRole"
              v-has="'roleManage_add'"
            />
          </div>
        </div>
      </div>
      <div class="role-manage-wrap-left-treebox">
        <div class="role-manage-wrap-left-tree" id="id">
          <vue-scroll :ops="ops" v-if="activeMenuTag === 'addNewRole'||roleList.length > 0">
            <ul class="role-manage-menu">
              <li
                :class="['role-manage-menu-item',{'activeMenu': activeMenuTag === item.id }]"
                v-for="item in roleList"
                :key="item.id"
                @click="onActiveMenu(item)"
              >
                <div class="menu-item-left" :title="item.name">
                  <span>{{item.name}}</span>
                  <span style="margin: 0 4px">|</span>
                  <span>{{item.orgName}}</span>
                  <el-tooltip
                    class="item"
                    v-if="item.src_template_id"
                    effect="dark"
                    content="角色来源于模板"
                    placement="top-start"
                  >
                    <img class="addModeIcon" src="@/assets/imgs/来自模板.png" style="margin-left: 4px;" />
                  </el-tooltip>
                </div>
                <div class="menu-item-right">
                  <span @click.stop="copePermiss(item)" title="拷贝角色权限" v-has="'roleManage_add'">
                    <svg
                      class="icon"
                      aria-hidden="true"
                      slot="reference"
                      style="width: 12px;height: 12px;margin-right:8px;color: red; cursor: pointer"
                      path="fill: rgb(255,255,255)"
                    >
                      <use xlink:href="#el-icon-fuzhi" />
                    </svg>
                  </span>
                  <span style="font-size: 12px;color: #C4D3E6" v-has="'roleManage_delete'">|</span>
                  <span @click.stop="deleteGroup(item)" title="删除角色" v-has="'roleManage_delete'">
                    <svg
                      class="icon"
                      aria-hidden="true"
                      slot="reference"
                      style="width: 12px;height: 12px;margin-left:8px;color: red; cursor: pointer"
                      path="fill: rgb(255,255,255)"
                    >
                      <use xlink:href="#el-icon-shanchu-copy1-copy" />
                    </svg>
                  </span>
                </div>
              </li>
              <li
                v-if="activeMenuTag === 'addNewRole'"
                :class="['role-manage-menu-item',{'activeMenu': activeMenuTag === 'addNewRole' }]"
              >
                <div class="menu-item-left">
                  <span>新角色</span>
                </div>
              </li>
            </ul>
          </vue-scroll>

          <div
            class="details-empty-data"
            v-if="activeMenuTag !== 'addNewRole'&&roleList.length === 0"
          >
            <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div class="text">暂无数据</div>
          </div>
        </div>
      </div>
    </div>

    <div class="role-manage-wrap-right">
      <div class="role-manage-wrap-right-title">
        <img class="columnIcon" src="@/assets/imgs/permissIcon.png" />
        <span>角色权限</span>
      </div>
      <vue-scroll class="scrollRoleBox" :ops="ops">
        <div class="role-manage-wrap-right-details" style="padding: 10px 16px;">
          <div class="details-box" v-if="activeMenuTag">
            <div class="details-onePart">
              <div class="title">基本信息</div>
              <el-form
                ref="ruleRoleManageForm"
                label-width="140px"
                label-position="left"
                class="role-group-form-content"
                :rules="roleFormRules"
                :model="roleForm"
              >
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="角色名称：" prop="name">
                      <el-input
                        v-model="roleForm.name"
                        placeholder="请输入角色名称"
                        size="small"
                        :disabled="!isShow"
                        style="width: 198px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-form-item label="所属组织机构：" prop="org_stru_id">
                      <!-- <span>1212</span> -->
                      <el-select
                        size="small"
                        v-model="roleForm.org_stru_id"
                        placeholder="请选择组织机构"
                        style="width: 198px"
                        :disabled="!isShow"
                        @change="changeSelect"
                      >
                        <el-option
                          v-for="item in orgList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="details-tree">
              <div class="details-tree-title">权限分配</div>
              <div
                class="details-tree-content"
                :style="{'height':isShow?'calc(100% - 40px)':'calc(100% )'}"
              >
                <div v-if="permissionTreeData.length > 0">
                  <el-tree
                    ref="roleManageRef"
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
                </div>
                <div class="details-empty-data" v-else>
                  <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
                  <div class="text">暂无数据</div>
                </div>
              </div>
            </div>
            <div class="role-manage-wrap-right-footer" v-if="isShow">
              <el-button
                v-if="activeMenuTag!=='addNewRole'"
                size="small"
                @click="saveRoleInfo"
                style="width: 80px;"
                class="el-button--primary"
              >保存</el-button>
              <el-button
                size="small"
                style="width: 80px;"
                v-if="activeMenuTag!=='addNewRole'"
                @click="passEdit"
              >取消</el-button>
              <el-button
                v-if="activeMenuTag==='addNewRole'"
                style="width: 80px;"
                class="el-button--primary"
                size="small"
                @click="createRole"
              >创建</el-button>
              <el-button
                style="width: 80px;"
                size="small"
                v-if="activeMenuTag==='addNewRole'"
                @click="passCreate"
              >取消</el-button>
            </div>
          </div>
          <div class="details-empty-data" v-else>
            <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div class="text">暂无数据</div>
          </div>
        </div>
      </vue-scroll>
    </div>
    <el-dialog
      class="showApplicationDialog"
      :visible.sync="showApplicationDialog"
      width="640px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closedApplicationDialog"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/tempIcon.png" />
        <span class="title-age">应用模板角色</span>
      </div>
      <div class="dialog_resource--content">
        <div class="content-resource">
          <el-checkbox-group v-model="checkedRoleList" @change="handleCheckedCitiesChange">
            <ul class="content-resource-ul">
              <li class v-for="item in roleDialogList" :key="item.id">
                <el-checkbox :label="item.id" :key="item.id">
                  <span>{{item.name}}</span>
                  <span style="margin: 4px">|</span>
                  <span>{{item.orgName}}</span>
                </el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureAddResource"
        >确认</el-button>
        <el-button style="width: 80px;" size="small" @click="showApplicationDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="showAppGroupDialog"
      :visible.sync="showAppGroupDialog"
      width="640px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closedAppGroupDialog"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/roleListIcon.png" />
        <span class="title-age">应用模板角色组</span>
      </div>
      <div class="dialog_appGroup--content">
        <div class="content-resource">
          <el-radio-group
            style="width: 100%;height: 100%;fontSize: 14px"
            v-model="checkedGroupList"
            @change="handleCheckedCitiesChange"
          >
            <ul class="content-resource-ul">
              <li v-for="item in groupDialogList" :key="item.id">
                <div class="title">
                  <el-radio :label="item.id" :key="item.id">
                    <span class="color: #4E4E4E;fontWeight:550;">{{item.name}}</span>
                  </el-radio>
                </div>
                <div class="content-details">
                  <div
                    class="content-details-ul"
                    v-for="val in item.template_role_list||[]"
                    :key="val.id"
                  >
                    <span>{{val.name}}</span>
                    <span style="margin: 4px;">|</span>
                    <span>{{val.org_name}}</span>
                  </div>
                  <div
                    class="content-details-empty"
                    v-if="(item.template_role_list||[]).length  === 0"
                  >暂无数据</div>
                </div>
              </li>
            </ul>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureAddGroup"
        >确认</el-button>
        <el-button style="width: 80px;" size="small" @click="showAppGroupDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <gc-confirm :visible="visibleRoleModal" @onCancel="onNoCoverRoleData" @onOk="onCoverRoleData" />
    <gc-confirm
      :visible="visibleRoleGroupModal"
      @onCancel="onNoCoverGroupData"
      @onOk="onCoverGroupData"
    />
    <gc-confirm-again
      :visible="isDeleteRole"
      title="确定删除角色吗"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteRole=false"
      @onOk="onOkDeleteRole"
    />
  </div>
</template>
<script>
import {
  getTenantList,
  getTenantOrgList,
  getRoleTree,
  updateRoleInfo,
  createRoleList,
  getRoleGpList,
  getRoleGpDetails,
  applicationList,
  addApplicationGroup,
  deleteRoleList
} from "@/api/roleManage.js";
import { getGroupTree, getRoleList } from "@/api/templateMaintain";
import $ from "jquery";
import _ from "lodash";

export default {
  name: "role-manage",
  components: {},
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      isCanEdit: false,
      orgList: [], // 组织机构
      roleList: [],
      activeMenuTag: "",
      roleForm: {
        org_stru_id: "",
        name: "",
        id: "",
        permission_list: [],
        tenant_id: ""
      },
      dialogVisible: false,
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
      permissionTreeData: [],
      permissionDefaultKey: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 应用模板角色
      showApplicationDialog: false,
      roleDialogList: [],
      checkedRoleList: [],
      // 应用权限组
      showAppGroupDialog: false,
      isSHowRoleGroup: false,
      groupDialogList: [],
      checkedGroupList: "",
      // 新增角色模板
      visibleRoleModal: false,
      // 新增角色模板组
      visibleRoleGroupModal: false,
      isShowAddBtn: "",
      isDeleteRole: false,
      isShow: true
    };
  },
  created() {
    this.getOrgList(); //
    this.isShowAddBtn = JSON.parse(
      localStorage.getItem("vuejs__userGradeName")
    ).value;
    this.isShow =
      this.$_has("roleManage_add") || this.$_has("roleManage_modify");
  },
  mounted() {},
  methods: {
    handleCheckedCitiesChange(attr) {},
    getRoleLists() {
      getTenantList({
        paged: false
      }).then(res => {
        if (res.data.code == "0") {
          let _list = (res.data.data || []).filter(item => {
            return item.is_admin !== true;
          });
          _list.forEach(item => {
            let findOrg = _.find(this.orgList, val => {
              return val.id === item.org_stru_id;
            });
            if (findOrg) {
              _.set(item, "orgName", findOrg.name);
            }
          });
          this.roleList = _list;
          let findActive = _.find(_list, item => {
            return item.id === this.activeMenuTag;
          });
          if (findActive) {
            this.onActiveMenu(findActive);
          } else if (this.activeMenuTag == "addNewRole") {
            let _tenantId = JSON.parse(localStorage.getItem("vuejs__userInfo"))
              .value.tenantId;
            this.onActiveMenu(
              {
                org_stru_id: "",
                name: "",
                permission_list: [],
                id: 0,
                tenant_id: _tenantId
              },
              true
            );
          } else {
            if (_list[0]) {
              this.onActiveMenu(_list[0]);
            }
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取组织结构
    getOrgList() {
      getTenantOrgList()
        .then(res => {
          if (res.data.code == "0") {
            this.orgList = res.data.data || [];
            this.getRoleLists();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    changeSelect() {
      this.getPermissList();
    },
    //
    getPermissList() {
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      let orgName = "";
      let _orgName = _.find(this.orgList, item => {
        return item.id == this.roleForm.org_stru_id;
      });
      if (_orgName) {
        orgName = _orgName.name;
      }
      getRoleTree({
        isBusiness: orgName && orgName === "营业厅" ? true : false,
        roleId: this.roleForm.id,
        tenantId: this.roleForm.tenant_id
      })
        .then(res => {
          loading.close();
          if (res.data.code == "00") {
            this.getPermissionList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    // 点击右侧列表
    onActiveMenu(attr, isActive) {
      if (!isActive) {
        this.activeMenuTag = attr.id;
      }
      this.roleForm = {
        org_stru_id: attr.org_stru_id,
        name: attr.name,
        permission_list: [],
        id: attr.id,
        tenant_id: attr.tenant_id
      };
      this.getPermissList();
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
              disabled: !this.isShow
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
              disabled: !this.isShow
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
    //  勾选权限分配数据
    handleCheckChange(data, checked, indeterminate) {},
    //保存
    saveRoleInfo() {
      this.$refs.ruleRoleManageForm.validate(valid => {
        if (valid) {
          let checkedKeys = this.$refs.roleManageRef.getCheckedKeys() || [];
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
            updateRoleInfo(
              { id: _permissForm.id },
              {
                name: _permissForm.name.toString().trim(),
                org_stru_id: _permissForm.org_stru_id,
                permission_list: _permissForm.permission_list
              }
            )
              .then(res => {
                if (res.data.code == "0") {
                  this.$message.success("更改成功");
                  this.getRoleLists();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    //创建新角色
    createNewRole() {
      this.activeMenuTag = "addNewRole";
      let _tenantId = JSON.parse(localStorage.getItem("vuejs__userInfo")).value
        .tenantId;
      this.onActiveMenu(
        {
          org_stru_id: "",
          name: "",
          permission_list: [],
          id: 0,
          tenant_id: _tenantId
        },
        true
      );
      this.$nextTick(() => {
        this.$refs.ruleRoleManageForm.resetFields();
      });
    },
    //  确认创建新角色
    createRole() {
      this.$refs.ruleRoleManageForm.validate(valid => {
        if (valid) {
          let checkedKeys = this.$refs.roleManageRef.getCheckedKeys() || [];
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
            createRoleList({
              name: _permissForm.name.toString().trim(),
              org_stru_id: _permissForm.org_stru_id,
              permission_list: _permissForm.permission_list
            })
              .then(res => {
                if (res.data.code == "0") {
                  this.$message.success("新增成功");
                  this.activeMenuTag = parseInt(res.data.id);
                  this.getRoleLists();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    // 拷贝权限
    copePermiss(attr) {
      this.activeMenuTag = "addNewRole";
      this.onActiveMenu(
        {
          org_stru_id: attr.org_stru_id,
          name: attr.name,
          permission_list: [],
          id: attr.id,
          tenant_id: attr.tenant_id
        },
        true
      );
    },
    getApplicationRoleList() {
      let _getRoleList = getRoleList({ paged: false });
      let _getGroupTree = getGroupTree();
      let _this = this;
      Promise.all([_getRoleList, _getGroupTree])
        .then(data => {
          let data0 = data[0].data.data || [];
          let data1 = data[1].data.data || [];
          // let data2= data[2].data.data||[];
          let _convertData = this.convertData(data1);
          data0.forEach(item => {
            let _item = _.find(_convertData, v => {
              return v.id === item.org_stru_id;
            });
            if (_item) {
              _.set(item, "orgName", _item.name);
            }
          });
          this.roleDialogList = data0;
          this.showApplicationDialog = true;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
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
    //  删除数据
    closedApplicationDialog() {
      this.checkedRoleList = [];
      this.showApplicationDialog = false;
    },
    sureAddResource() {
      if (this.checkedRoleList.length === 0) {
        return this.$message.error("请选择模板角色");
      }
      this.visibleRoleModal = true;
    },
    // 展示应用模板组
    applicationGroup() {
      getRoleGpList()
        .then(res => {
          this.isSHowRoleGroup = true;
          if (res.data.code == "0") {
            this.groupDialogList = res.data.data || [];
            this.showAppGroupDialog = true;
          } else {
            this.showAppGroupDialog = true;
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.showAppGroupDialog = true;
          this.$message.error(err.message);
        });
    },
    //
    closedAppGroupDialog() {
      this.showAppGroupDialog = false;
      this.checkedGroupList = "";
    },
    // 新增角色模板组
    sureAddGroup() {
      if (!this.checkedGroupList) {
        return this.$message.error("请选择模板角色组");
      }
      this.visibleRoleGroupModal = true;
    },
    // 取消创建数据
    passCreate() {
      this.activeMenuTag = "";
      this.getRoleLists();
    },
    //取消编辑数据
    passEdit() {
      this.getRoleLists();
    },
    //确认删除角色
    onOkDeleteRole() {
      deleteRoleList({
        id: this.tempData.id
      })
        .then(res => {
          this.isDeleteRole = false;
          if (res.data.code == "0") {
            this.$message.success("删除成功");
            if (this.activeMenuTag === this.tempData.id) {
              this.activeMenuTag = "";
              this.getRoleLists();
            } else if (this.activeMenuTag === "addNewRole") {
              let _tenantId = JSON.parse(
                localStorage.getItem("vuejs__userInfo")
              ).value.tenantId;
              this.getRoleLists();
            } else {
              this.getRoleLists();
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isDeleteRole = false;
          this.$message.error(err.message);
        });
    },
    // 删除角色列表
    deleteGroup(attr) {
      this.isDeleteRole = true;
      this.tempData = attr;
    },
    //   不覆盖角色（role)
    onNoCoverRoleData() {
      applicationList({
        override: false,
        template_role_id_list: this.checkedRoleList
      })
        .then(res => {
          this.showApplicationDialog = false;
          this.visibleRoleModal = false;
          if (res.data.code == "0") {
            this.$message.success("应用成功");
            this.getRoleLists();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.visibleRoleModal = false;
          this.$message.error(err.message);
        });
    },
    // 覆盖角色(role)
    onCoverRoleData() {
      applicationList({
        override: true,
        template_role_id_list: this.checkedRoleList
      })
        .then(res => {
          this.showApplicationDialog = false;
          this.visibleRoleModal = false;
          if (res.data.code == "0") {
            this.$message.success("应用成功");
            this.getRoleLists();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.visibleRoleModal = false;
          this.$message.error(err.message);
        });
    },
    //  不覆盖角色（group)
    onNoCoverGroupData() {
      addApplicationGroup({
        override: false,
        role_template_id: this.checkedGroupList
      })
        .then(res => {
          this.showAppGroupDialog = false;
          this.visibleRoleGroupModal = false;
          if (res.data.code == "0") {
            this.$message.success("应用成功");
            this.getRoleLists();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.visibleRoleGroupModal = false;
          this.$message.error(err.message);
        });
    },
    // 覆盖角色（group)
    onCoverGroupData() {
      addApplicationGroup({
        override: true,
        role_template_id: this.checkedGroupList
      })
        .then(res => {
          this.showAppGroupDialog = false;
          this.visibleRoleGroupModal = false;
          if (res.data.code == "0") {
            this.$message.success("应用成功");
            this.getRoleLists();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.visibleRoleGroupModal = false;
          this.$message.error(err.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 5px 10px 0;
}
::v-deep .el-message-box__headerbtn {
  display: none !important;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .el-dialog__footer {
  padding: 16px 40px;
  height: 60px;
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
}
::v-deep .el-tree-node__content {
  line-height: 34px;
  height: 34px;
  color: #666666;
}
::v-deep .el-radio__label {
  color: #4e4e4e !important;
  padding-left: 5px;
}
::v-deep .el-checkbox__label {
  color: #4e4e4e !important;
}
@import "./index.scss";
</style>