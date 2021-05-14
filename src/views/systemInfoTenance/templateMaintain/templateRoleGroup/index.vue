<template>
  <div class="template-role-group-page">
    <div class="template-role-group-title">
      <img class="columnIcon" src="@/assets/imgs/roleListIcon.png" />
      <span>模板角色组</span>
      <el-button
        class="add-role-group-btn"
        size="small"
        @click="createNewRoleGroup"
        v-has="'templateRoles_add'"
      >新建模板角色组</el-button>
    </div>
    <div class="template-role-group-content">
      <div class="template-role-group-wrap" v-if="tempGroupList.length > 0">
        <ul class="template-role-group-box">
          <li class="template-role-group-item" v-for="item in tempGroupList" :key="item.id">
            <div class="group-item-title">{{item.name}}</div>
            <div class="group-item-num">角色数量：{{item.template_role_list.length||0}}</div>
            <ul class="group-item-ul">
              <li class="group-item-li" v-for="val in (item.template_role_list||[])" :key="val.id">
                <img class="columnIcon" src="@/assets/imgs/roleTempIcon.png" />
                <span>{{val.name}}</span>
                <span style="margin: 0 4px">|</span>
                <span>{{val.org_name}}</span>
              </li>
            </ul>
            <div class="group-item-footer">
              <div
                class="group-item-footer-left"
                @click="deleteGroup(item.id)"
                v-has="'templateRoles_delete'"
              >
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  style="margin-right:4px;color: red"
                  path="fill: rgb(255,255,255)"
                >
                  <use xlink:href="#el-icon-shanchu-copy" />
                </svg>
                <span>删除模板</span>
              </div>
              <div
                class="group-item-footer-right"
                @click="getGroupDetails(item.id)"
                v-has="'templateRoles_modify'"
              >
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  style="margin-right:4px;color: red"
                  path="fill: rgb(255,255,255)"
                >
                  <use xlink:href="#el-icon-bianji" />
                </svg>
                <span>编辑角色组</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="details-empty-data" v-if="tempGroupList.length === 0">
        <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
        <div class="text">暂无模板角色组</div>
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :visible.sync="dialogAddPermissType"
      size="604px"
      @closed="closedDialog"
    >
      <template slot="title">
        <div class="drawer-dialog-title-wrap">
          <img class="columnIcon" src="@/assets/imgs/roleListIcon.png" />
          <span>{{isEdit?'编辑角色组':'新建模板角色组'}}</span>
        </div>
      </template>
      <template>
        <div class="role-group-content">
          <el-form
            ref="ruleRoleGroupForm"
            label-width="140px"
            label-position="left"
            class="role-group-form-content"
            :rules="roleGroupFormRules"
            :model="roleGroupForm"
          >
            <el-form-item label="模板角色组名称：" prop="roleName">
              <el-input size="small" v-model="roleGroupForm.roleName" placeholder="请输入模板角色组名称"></el-input>
            </el-form-item>
            <el-form-item label="已选角色数量：">
              <span>{{selectNumb}}</span>
            </el-form-item>
          </el-form>
          <div class="role-group-tree-content">
            <div class="role-group-content-left">
              <div class="role-group-content-left-title">组织结构</div>
              <div class="role-group-content-left-box">
                <vue-scroll :ops="ops">
                  <el-tree
                    :data="roleGroupData"
                    highlight-current
                    :props="defaultProps"
                    :default-expand-all="true"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span
                        :class="[{'active-left-tree':(checkboxData&&checkboxData[data.org_stru_template.id].length >0)||selectedData.id === data.org_stru_template.id }]"
                      >{{ data.org_stru_template.name }}</span>
                    </span>
                  </el-tree>
                </vue-scroll>
              </div>
            </div>
            <div class="role-group-content-right">
              <div class="role-group-content-right-title">角色模板</div>
              <div class="role-group-content-right-box">
                <vue-scroll :ops="ops" v-if="roleRightData.length > 0">
                  <el-checkbox-group v-model="checkedPermissBox" @change="onChangeCheckbox">
                    <div class="right-box-ul" v-for="(item,index) in roleRightData" :key="item.id">
                      <el-checkbox :label="item.id" :key="item.id">
                        <img class="columnIcon" src="@/assets/imgs/roleTempIcon.png" />
                        <span style="color: #409EFF">{{item.name}}</span>
                        <span style="margin: 0 4px;color: #409EFF">|</span>
                        <span style="color: #409EFF">{{selectedData.name}}</span>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </vue-scroll>
                <div
                  v-if="roleRightData.length === 0"
                  style="color:rgba(0,0,0,.3);width:100%;height: 60px;lineHeight: 60px; textAlign: center;"
                >暂无数据</div>
              </div>
            </div>
          </div>
          <div class="role-group-form-footer">
            <div v-if="isEdit" class="role-group-editform-footer">
              <el-button
                style="width: 80px;"
                class="el-button--primary"
                size="small"
                @click="changeGroupDetais"
              >保存</el-button>
              <el-button style="width: 80px;" @click="dialogAddPermissType = false" size="small">取消</el-button>
              <el-button
                @click="resetData"
                style="width: 80px;"
                class="editform-btn"
                size="small"
              >重置</el-button>
            </div>
            <div v-else>
              <el-button
                @click="addNewRoleGroup"
                style="width: 80px;"
                class="el-button--primary"
                size="small"
              >确认新增</el-button>
              <el-button @click="dialogAddPermissType = false" style="width: 80px;" size="small">取消</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
    <gc-confirm-again
      :visible="isDeleteTempGroup"
      title="此操作将删除模板权限组, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteTempGroup=false"
      @onOk="onOkDeleteGroup"
    />
  </div>
</template>
<script>
import {
  getRoleGroupList,
  addRoleGroup,
  getGroupTree,
  getRoleList,
  deleteRoleGroup,
  getRoleGroupDetails,
  changeRoleGroupDetails
} from "@/api/templateMaintain";

export default {
  name: "archives-list",
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      defaultProps: {
        children: "children",
        label: "label"
      },
      roleGroupFormRules: {
        roleName: [
          {
            required: true,
            message: "模板角色组名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("模板角色组名称不能为空");
                return;
              }
              if (value.toString().trim().length > 20) {
                callback("请勿超过20字数");
                return;
              }
              callback();
            }
          }
        ]
      },
      roleGroupForm: {
        roleName: "",
        id: ""
      },
      roleGroupData: [],
      treeTileData: [],
      dialogAddPermissType: false,
      selectedData: "", //弹框左侧选中的树状图数据
      roleRightData: [],
      roleDataList: [],
      checkboxData: undefined,
      checkedPermissBox: [],
      selectNumb: 0,
      data: [],
      tempRoleList: [], //获取所有的模板角色列表
      tempGroupList: [], // 获取模板权限组列表
      isEdit: false,
      editAllSelected: [], //刚进入编辑状态时，后台返回的所有被选中的
      isDeleteTempGroup: false,
      tempData: ""
    };
  },
  computed: {},
  components: {},
  created() {
    this.getRoleGroup();
  },
  methods: {
    // 获取模板权限组列表
    getRoleGroup() {
      getRoleGroupList()
        .then(res => {
          if (res.data.code == "0") {
            this.tempGroupList = res.data.data || [];
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取模板角色组详情
    getGroupDetails(attr) {
      getRoleGroupDetails({
        id: attr
      })
        .then(res => {
          if (res.data.code == "0") {
            this.dialogAddPermissType = true;
            this.isEdit = true;
            this.roleGroupForm.roleName = res.data.data.name || "";
            this.roleGroupForm.id = res.data.data.id || "";
            this.selectNumb = res.data.data.template_role_list.length || 0;
            this.editAllSelected = res.data.data.template_role_list || 0;
            this.getTreeList();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    onOkDeleteGroup() {
      deleteRoleGroup({
        id: this.tempData
      })
        .then(res => {
          this.isDeleteTempGroup = false;
          if (res.data.code == "0") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getRoleGroup();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          this.isDeleteTempGroup = false;
          this.$message.error(err.message);
        });
    },
    // 删除模板角色组
    deleteGroup(attr) {
      this.tempData = attr;
      this.isDeleteTempGroup = true;
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
    // 获取组织结构树，数据
    getTreeList() {
      getGroupTree().then(data => {
        if (data.data.code == "0") {
          this.treeTileData = this.convertData(data.data.data);
          this.roleGroupData = data.data.data;
          if (this.isEdit) {
            getRoleList({
              paged: false
            }).then(res => {
              if (res.data.code == "0") {
                let _treeData = _.cloneDeep(this.treeTileData);
                let _selectedData = {};
                (res.data.data || []).forEach(item => {
                  _treeData.forEach(val => {
                    if (val.id === item.org_stru_id) {
                      val["children"].push(item);
                    }
                  });
                });
                _treeData.forEach(val => {
                  _selectedData[val.id] = [];
                });
                let _permissionList = [];
                let data1 = res.data.data || [];
                (this.editAllSelected || []).forEach(val => {
                  let _itemJson = _.find(data1, v => {
                    return v.id === parseInt(val.id);
                  });
                  if (_itemJson) {
                    _permissionList.push(_itemJson);
                  }
                });
                this.roleDataList = _treeData;
                _permissionList.forEach(item => {
                  for (let i in _selectedData) {
                    if (item.org_stru_id === parseInt(i)) {
                      _selectedData[i].push(item.id);
                    }
                  }
                });
                this.checkboxData = _selectedData;
              } else {
              }
            });
          } else {
            this.getRightRoleList();
          }
        } else {
        }
      });
    },
    //  角色列表
    getRightRoleList() {
      getRoleList({
        paged: false
      }).then(res => {
        if (res.data.code == "0") {
          ///  此处逻辑让我很无语
          let _treeData = _.cloneDeep(this.treeTileData);
          let _selectedData = {};
          (res.data.data || []).forEach(item => {
            _treeData.forEach(val => {
              if (val.id === item.org_stru_id) {
                val["children"].push(item);
              }
            });
          });
          _treeData.forEach(val => {
            _selectedData[val.id] = [];
          });
          this.roleDataList = _treeData;
          this.checkboxData = _selectedData;
        } else {
        }
      });
    },
    //  打开创建新增权限组弹框
    createNewRoleGroup() {
      this.dialogAddPermissType = true;
      this.getTreeList();
    },
    // 选择checkbox
    onChangeCheckbox(attr) {
      this.checkboxData[this.selectedData.id] = attr;
      let num = 0;
      for (let i in this.checkboxData) {
        num += this.checkboxData[i].length;
      }
      this.selectNumb = num;
    },
    handleNodeClick(attr) {
      this.selectedData = attr.org_stru_template;
      let _selectData = _.find(this.roleDataList, item => {
        return item.id === attr.id;
      });
      this.checkedPermissBox = _.uniq(this.checkboxData[_selectData.id]);
      this.roleRightData = _selectData.children || [];
    },
    // 新增模板组
    addNewRoleGroup() {
      this.$refs.ruleRoleGroupForm.validate(valid => {
        if (valid) {
          if (this.selectNumb === 0) {
            return this.$message.error("请选择角色模板");
          } else {
            let _checkData = [];
            for (let i in this.checkboxData) {
              _checkData = _checkData.concat(this.checkboxData[i]);
            }
            let addTempGroupLoading = this.$loading({
              target: ".List",
              background: "rgba(255,255,255,0.7)"
            });
            addRoleGroup({
              name: this.roleGroupForm.roleName.toString().trim(),
              template_role_list: _checkData
            })
              .then(res => {
                addTempGroupLoading.close();
                if (res.data.code == "0") {
                  this.$message.success("添加成功");
                  this.getRoleGroup();
                  this.dialogAddPermissType = false;
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                addTempGroupLoading.close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    //  修改角色组
    changeGroupDetais() {
      this.$refs.ruleRoleGroupForm.validate(valid => {
        if (valid) {
          if (this.selectNumb === 0) {
            return this.$message.error("请选择角色模板");
          } else {
            let _checkData = [];
            for (let i in this.checkboxData) {
              _checkData = _checkData.concat(this.checkboxData[i]);
            }
            let changeTempLoading = this.$loading({
              target: ".List",
              background: "rgba(255,255,255,0.7)"
            });
            changeRoleGroupDetails(
              { id: this.roleGroupForm.id },
              {
                name: this.roleGroupForm.roleName.toString().trim(),
                template_role_list: _checkData
              }
            )
              .then(res => {
                changeTempLoading.close();
                if (res.data.code == "0") {
                  this.$message.success("修改成功");
                  this.getRoleGroup();
                  this.dialogAddPermissType = false;
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                changeTempLoading.close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    },
    //  重置数据
    resetData() {
      this.checkedPermissBox = [];
      this.selectNumb = 0;
      let _checkboxData = _.cloneDeep(this.checkboxData);
      for (let i in _checkboxData) {
        _checkboxData[i] = [];
      }
      this.checkboxData = _checkboxData;
    },
    closedDialog() {
      this.$refs.ruleRoleGroupForm.resetFields();
      this.roleGroupForm.roleName = "";
      this.roleGroupForm.id = "";
      this.selectedData = "";
      this.selectNumb = 0;
      this.isEdit = false;
      this.checkboxData = undefined;
      this.checkedPermissBox = [];
      this.roleRightData = [];
    }
  },
  mounted() {}
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
}
::v-deep .el-tree-node__content {
  line-height: 34px;
  height: 34px;
  color: #666666;
}
.drawer-dialog-title-wrap {
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