<template>
  <div class="permissionDefinedPage">
    <div class="permission-defined-left">
      <div class="permission-defined-left-title-box">
        <div class="permission-defined-left-title">
          <img class="columnIcon" src="@/assets/imgs/permissNameIcon.png" />
          <span>权限组结构</span>
        </div>
      </div>

      <div class="permission-defined-left-treebox">
        <el-button
          v-if="data.length === 0"
          style="width: calc(100% - 20px);margin-bottom: 20px;margin-left: 10px"
          size="small"
          @click="createNewGroup"
        >
          <svg class="icon" aria-hidden="true" style="width: 16px;height: 14px;margin-right: 6px;">
            <use xlink:href="#el-icon-tianjiawenjian" />
          </svg>
          创建新组
        </el-button>
        <div class="permission-defined-left-tree" id="id">
          <vue-scroll :ops="ops" v-if="data.length > 0">
            <el-tree
              :data="data"
              highlight-current
              :props="defaultProps"
              node-key="keyId"
              @node-click="handleNodeClick"
              auto-expand-parent
              :default-expand-all="true"
              :expand-on-click-node="false"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  v-if="judgeFolder(data.keyId) === 'p'&&selectTreeData.keyId === data.keyId"
                  style="margin-right:4px"
                >
                  <use xlink:href="#el-icon-quanxian" />
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  v-if="judgeFolder(data.keyId) === 'p'&&selectTreeData.keyId !== data.keyId"
                  style="margin-right:4px"
                >
                  <use xlink:href="#el-icon-quanxian-copy" />
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  v-if="judgeFolder(data.keyId) === 'g'&&selectTreeData.keyId === data.keyId"
                  style="margin-right:4px"
                >
                  <use xlink:href="#el-icon-wenjianjia-copy" />
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  slot="reference"
                  v-if="judgeFolder(data.keyId) === 'g'&&selectTreeData.keyId !== data.keyId"
                  style="margin-right:4px"
                >
                  <use xlink:href="#el-icon-wenjianjia" />
                </svg>
                <span
                  :class="[{'active-tree':selectTreeData.keyId === data.keyId }]"
                  :title="data.description"
                >{{ data.description }}</span>
                <div
                  :class="['custom-tree-node-icon',{'custom-tree-node-icon-active':selectTreeData.keyId === data.keyId }]"
                  @click.stop="(e)=>{clickRightBtn(data,e)}"
                >
                  <svg class="icon" aria-hidden="true" slot="reference" style="margin-right:4px">
                    <use xlink:href="#el-icon-sandian" />
                  </svg>
                </div>
              </div>
            </el-tree>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div class="permission-defined-right">
      <div class="permission-defined-right-title">
        <img class="columnIcon" src="@/assets/imgs/permissDetails.png" />
        <span>权限详情</span>
      </div>
      <div class="permission-defined-right-details">
        <vue-scroll :ops="ops" v-if="isShowDetails">
          <div class="permiss-right-details-box">
            <div class="details-item">
              <span class="details-item-left">权限ID:</span>
              <span class="details-item-right">{{details.permissionId}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">权限描述:</span>
              <span class="details-item-right">{{details.description}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">权限等级:</span>
              <span class="details-item-right">{{details.level ==1?'租户级别':'系统级别'}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">是否启用:</span>
              <span class="details-item-right">{{details.isEnabled ==1?'是':'否'}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">是否开启RBAC:</span>
              <span class="details-item-right">{{details.isRbacEnabled==1?'是':'否'}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">是否管理员默认:</span>
              <span class="details-item-right">{{details.isTenantAdminDefault==1?'是':'否'}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">是否为业务权限:</span>
              <span class="details-item-right">{{details.isBusiness==1?'是':'否'}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">操作类型:</span>
              <span class="details-item-right">{{details.actionName}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">资源描述:</span>
              <span class="details-item-right">{{details.resourceDescription}}</span>
            </div>
            <div class="details-item">
              <span class="details-item-left">资源路径:</span>
              <span class="details-item-right">{{details.subPath}}</span>
            </div>
          </div>
        </vue-scroll>
        <div class="details-empty-data" v-if="!isShowDetails">
          <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
          <div class="text">暂无数据</div>
        </div>
      </div>
      <div class="permission-defined-right-footer" v-if="isShowDetails">
        <el-button
          style="width: 80px;border:1px solid #2F87FE;color:#2F87FE;margin-right:10px;"
          size="small"
          @click="onEditPermiss"
        >编辑</el-button>
        <el-button
          size="small"
          style="width: 80px;border:1px solid #EC6B60;color:#EC6B60"
          @click="deletePermiss(details)"
        >删除</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogAddPermissType"
      width="640px"
      top="10vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="addPermissGroupClosed"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/permissNameIcon.png" />
        <span class="title-age">{{isEditPermiss?'修改权限组':'创建新组'}}</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          :model="addPermissform"
          :rules="addPermissRules"
          ref="addPermissGroup"
          label-width="100px"
          label-position="left"
          class="ruleForm"
        >
          <el-form-item label="权限组名称" class="item item-right" prop="description">
            <el-input size="small" v-model="addPermissform.description" placeholder="请输入权限组名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="addGroupPermiss"
        >{{isEditPermiss?'确定修改':'确定新增'}}</el-button>
        <el-button size="small" style="width:80px" @click="dialogAddPermissType=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCreateSameLevel"
      width="640px"
      top="10vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="addPermissGroupClosed"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/permissNameIcon.png" />
        <span class="title-age">创建同级组</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          :model="addPermissform"
          :rules="addPermissRules"
          ref="addPermissGroup"
          label-width="100px"
          label-position="left"
          class="ruleForm"
        >
          <el-form-item label="权限组名称" class="item item-right" prop="description">
            <el-input size="small" v-model="addPermissform.description" placeholder="请输入权限组名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="addSameGroup"
        >确定新增</el-button>
        <el-button style="width:80px" size="small" @click="dialogCreateSameLevel=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showChangePermiss"
      width="640px"
      top="10vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closePermissDialog"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/permissDetails.png" />
        <span class="title-age">修改权限描述</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          :model="modalEditData"
          :rules="addPermissRules"
          ref="addPermissNameRole"
          label-width="130px"
          label-position="left"
          class="ruleForm"
        >
          <el-form-item label="修改权限描述：" class="item item-right" prop="description">
            <el-input
              size="small"
              style="width:100%"
              v-model="modalEditData.description"
              placeholder="请输入权限描述"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="updatePermissionName"
        >确定修改</el-button>
        <el-button style="width:80px" size="small" @click="showChangePermiss=false">取消</el-button>
      </div>
    </el-dialog>
    <CreatePermissDialog
      v-if="showPermissDialog"
      :isShowEdit="isShowEdit"
      :addPermissform="addPermissform"
      :showPermissDialog="showPermissDialog"
      @closePermissDialog="closePermissDialog"
      :details="modalEditData"
      @getTreeList="getTreeList"
      @sureUpdateDetails="sureUpdateDetails"
    />
    <gc-confirm-again
      :visible="isDeletePermiss"
      title="此操作将删除权限, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeletePermiss=false"
      @onOk="onOkDeletePermiss"
    />
    <gc-confirm-again
      :visible="isDeletePermissGroup"
      title="此操作将删除权限组, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeletePermissGroup=false"
      @onOk="onOkDeletePermissGroup"
    />
  </div>
</template>
<script>
import $ from "jquery";
import {
  addPermissionGroup,
  getPermissionTreeList,
  updatePermissionGroup,
  deletePermissionGroup,
  getPermissionDetails,
  updatePermiss,
  deletePermissDetails
} from "@/api/permissionMaintain.js";
import _ from "lodash";
import CreatePermissDialog from "./coms/createPermissDialog.vue";
export default {
  name: "permission-defined",
  components: {
    CreatePermissDialog
  },
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      isEditPermiss: false, //是否是编
      addPermissform: {
        parentId: "",
        description: "",
        groupId: ""
      },

      addPermissRules: {
        description: [
          {
            required: true,
            message: "权限组名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("权限组名称不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字符");
                return;
              }
              callback();
            }
          }
        ]
      },
      dialogAddPermissType: false,
      dialogCreateSameLevel: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      details: {
        action: "",
        actionName: "",
        createStaffId: "",
        createTime: "",
        description: "",
        groupId: "",
        isBlacklist: "",
        isBusiness: "",
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
      //编辑状态下传入modal框的数据
      modalEditData: {
        action: "",
        actionName: "",
        createStaffId: "",
        createTime: "",
        description: "",
        groupId: "",
        isBlacklist: "",
        isBusiness: "",
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
      data: [],
      selectTreeData: "", //选中树的数据
      isShowEdit: false,
      showPermissDialog: false,
      showChangePermiss: false,
      ///
      isShowDetails: false,
      //  按钮loading
      //
      isDeletePermiss: false,
      isDeletePermissGroup: false,
      tempData: ""
    };
  },
  created() {},
  mounted() {
    $("body").on("click", () => {
      $("body")
        .find("#tree-contextmenu")
        .remove();
    });
    this.getTreeList();
  },
  methods: {
    //   用来判断是否是文件夹
    judgeFolder(attr) {
      let _arr = attr.split("-");
      return _arr[0];
    },
    handleNodeClick(attr) {
      $("body")
        .find("#tree-contextmenu")
        .remove();
      if (this.judgeFolder(attr.keyId) === "p") {
        this.selectTreeData = attr;
        this.isShowDetails = true;
        this.getPermissDetails(attr);
      } else {
        this.selectTreeData = attr;
        this.isShowDetails = false;
      }
    },
    // 获取权限详情
    getPermissDetails(attr) {
      let _attr = attr.keyId.split("-");
      getPermissionDetails({
        permissionId: _attr[1]
      }).then(res => {
        if (res.data.code == "00") {
          if (res.data.data !== null) {
            if (this.isShowEdit) {
              this.showChangePermiss = true;
              this.modalEditData = res.data.data;
            } else {
              this.details = res.data.data;
            }
          }
        } else {
        }
      });
    },
    //
    onEditPermiss() {
      this.isShowEdit = true;
      this.showPermissDialog = true;
      this.modalEditData = { ...this.details };
    },
    // 确认更新详情数据
    sureUpdateDetails(attr) {
      this.details = attr;
      this.closePermissDialog();
      this.getTreeList();
    },
    // 更新项目权限
    updatePermissionName() {
      this.$refs.addPermissNameRole.validate(valid => {
        if (valid) {
          for (let i in this.modalEditData) {
            if (
              typeof this.modalEditData[i] == "string" &&
              this.modalEditData[i].constructor == String
            ) {
              this.modalEditData[i] = this.modalEditData[i].trim();
            }
          }
          let permissNameLoading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          updatePermiss(this.modalEditData)
            .then(res => {
              permissNameLoading.close();
              if (res.data.code == "00") {
                this.$message.success("修改权限描述成功");
                this.getTreeList();
                this.details = { ...this.modalEditData };
                this.showChangePermiss = false;
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(error => {
              permissNameLoading.close();
              this.$message.error(error.message);
            });
        } else {
          return false;
        }
      });
    },
    // 确认删除权限
    onOkDeletePermiss() {
      deletePermissDetails({
        id: this.tempData.permissionId
      })
        .then(res => {
          this.isDeletePermiss = false;
          if (res.data.code == "00") {
            this.$message.success("删除权限成功");
            this.getTreeList();
            this.closePermissDialog();
            this.selectTreeData = "";
            this.isShowDetails = false;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(error => {
          this.isDeletePermiss = false;
          this.$message.error(error.message);
        });
    },
    // 删除权限详情
    deletePermiss(attr) {
      this.isDeletePermiss = true;
      this.tempData = attr;
    },
    //
    addPermissGroupClosed() {
      this.addPermissform = {
        parentId: "",
        description: "",
        groupId: ""
      };
      this.$refs.addPermissGroup.resetFields();
      this.dialogCreateSameLevel = false;
    },
    //  修改详情
    node(attr) {},
    // 绘画权限组的右键菜单
    drawChildrenMenu(x, y, val) {
      $("body")
        .find("#tree-contextmenu")
        .remove();
      let _height = document.body.clientHeight;
      let _X = x + 10;
      let _Y = _height - y - 15 > 144 ? y + 15 : y - 144;
      let contextmenuNode = $(
        "<div id='tree-contextmenu' style='cursor: pointer;box-shadow:0px 0px 2px 0px rgba(0,54,128,0.2); position: fixed;left: " +
          _X +
          "px;top:" +
          _Y +
          "px;z-index: 1000;background: rgba(255,255,255,1);width: 130px;height: 180px;'></div>"
      );
      let ulNode = $("<ul id='tree-contextmenu-ul'></ul>");
      let liNodeOne = $(
        "<li style='width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;color:#666666'>新建权限</li>"
      ).on("click", () => {
        this.addPermissform = {
          parentId: val.parentId,
          description: "",
          groupId: val.groupId
        };
        this.showPermissDialog = true;
      });
      let liNodeSame = $(
        "<li style='width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;color:#666666'>新建本级组</li>"
      ).on("click", () => {
        this.dialogCreateSameLevel = true;
        this.isEditPermiss = false;
        this.addPermissform = {
          parentId: val.parentId,
          description: "",
          groupId: val.groupId
        };
      });
      let liNodeTwo = $(
        "<li style='width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;color:#666666'>新建子组</li>"
      ).on("click", () => {
        this.dialogAddPermissType = true;
        this.isEditPermiss = false;
        this.addPermissform = {
          parentId: val.parentId,
          description: "",
          groupId: val.groupId
        };
      });
      let liNodeThree = $(
        "<li style='width: 100%;height: 36px;color:#666666;text-align:left;line-height: 36px;padding-left: 20px;border-top: 1px solid rgba(217, 217, 217, 1);border-bottom: 1px solid rgba(217, 217, 217, 1);'>重命名</li>"
      ).on("click", () => {
        this.dialogAddPermissType = true;
        this.isEditPermiss = true;
        this.addPermissform = {
          parentId: val.parentId,
          description: val.description,
          groupId: val.groupId
        };
      });
      let liNodeFour = $(
        "<li style='width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;color:#666666'>删除</li>"
      ).on("click", () => {
        this.addPermissform = {
          parentId: val.parentId,
          description: val.description,
          groupId: val.groupId
        };
        this.deleteGroup();
      });
      liNodeSame.appendTo(ulNode);
      liNodeTwo.appendTo(ulNode);
      liNodeOne.appendTo(ulNode);
      liNodeThree.appendTo(ulNode);
      liNodeFour.appendTo(ulNode);
      ulNode.appendTo(contextmenuNode);
      contextmenuNode.appendTo("body");
    },
    // 绘画权限的右键菜单
    drawPermissionMenu(x, y, val) {
      $("body")
        .find("#tree-contextmenu")
        .remove();
      let _height = document.body.clientHeight;
      let _X = x + 10;
      let _Y = _height - y - 15 > 72 ? y + 15 : y - 72;
      let contextmenuNode = $(
        "<div id='tree-contextmenu' style='cursor: pointer;box-shadow:0px 0px 2px 0px rgba(0,54,128,0.2); position: fixed;left: " +
          _X +
          "px;top:" +
          _Y +
          "px;z-index: 1000;background: rgba(255,255,255,1);width: 130px;height: 72px;'></div>"
      );
      let ulNode = $("<ul id='tree-contextmenu-ul'></ul>");

      let liNodeThree = $(
        "<li style='width: 100%;color:#666666;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>修改权限描述</li>"
      ).on("click", () => {
        this.isShowEdit = true;
        this.getPermissDetails(val);
      });
      let liNodeFour = $(
        "<li style='width: 100%;color:#666666;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;'>删除</li>"
      ).on("click", () => {
        this.deletePermiss(val);
      });
      liNodeThree.appendTo(ulNode);
      liNodeFour.appendTo(ulNode);
      ulNode.appendTo(contextmenuNode);
      contextmenuNode.appendTo("body");
    },
    // 整理树状图数据
    convertData(data) {
      let list = _.cloneDeep(data);
      let getTree = arr => {
        let rArr = [];
        arr.map((item, index) => {
          let addItem = {};
          // 节点id分groupId和permissionId，为了唯一性添加前缀
          if (item.groupId) {
            addItem = {
              keyId: `g-${item.groupId}`,
              description: item.description,
              groupId: item.groupId,
              parentId: item.parentId
            };
          } else if (item.permissionId) {
            addItem = {
              keyId: `p-${item.permissionId}`,
              permissionId: item.permissionId,
              description: item.description,
              enable: item.enable
            };
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
        this.data = getTree(list); // 权限树
      } catch (error) {
        // this.$message.error("权限树生成发生错误");
        console.error("权限树生成发生错误", error);
      }
    },
    //获取树状图数据
    getTreeList() {
      getPermissionTreeList().then(data => {
        if (data.data.code == "00") {
          this.convertData(
            (data.data.data.children || []).concat(
              data.data.data.permissionList || []
            )
          );
        } else {
        }
      });
    },
    addSameGroup() {
      this.$refs.addPermissGroup.validate(valid => {
        if (valid) {
          let permissLoading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          for (let i in this.addPermissform) {
            if (
              typeof this.addPermissform[i] == "string" &&
              this.addPermissform[i].constructor == String
            ) {
              this.addPermissform[i] = this.addPermissform[i].trim();
            }
          }
          addPermissionGroup({
            description: this.addPermissform.description,
            parentId: this.addPermissform.parentId || 0,
            groupId: ""
          })
            .then(res => {
              let _data = res.data;
              permissLoading.close();
              if (_data.code == "00") {
                this.$message.success("添加成功");
                this.getTreeList();
                this.dialogCreateSameLevel = false;
              } else {
                this.$message.error(_data.message);
              }
            })
            .catch(err => {
              permissLoading.close();
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    // 新增或者修改权限组名称
    addGroupPermiss() {
      this.$refs.addPermissGroup.validate(valid => {
        if (valid) {
          if (this.isEditPermiss) {
            this.updateName();
          } else {
            this.addGroupName();
          }
        } else {
          return false;
        }
      });
    },
    // 新增权限组
    addGroupName() {
      for (let i in this.addPermissform) {
        if (
          typeof this.addPermissform[i] == "string" &&
          this.addPermissform[i].constructor == String
        ) {
          this.addPermissform[i] = this.addPermissform[i].trim();
        }
      }
      let permissLoading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      addPermissionGroup({
        description: this.addPermissform.description,
        parentId: this.addPermissform.groupId || 0,
        groupId: this.addPermissform.groupId
      })
        .then(res => {
          let _data = res.data;
          permissLoading.close();
          if (_data.code == "00") {
            this.$message.success("添加成功");
            this.getTreeList();
            this.dialogAddPermissType = false;
            this.isEditPermiss = false;
          } else {
          }
        })
        .catch(err => {
          permissLoading.close();
          this.$message.error(err.message);
        });
    },
    // 修改权限组名
    updateName() {
      let permissLoading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      for (let i in this.addPermissform) {
        if (
          typeof this.addPermissform[i] == "string" &&
          this.addPermissform[i].constructor == String
        ) {
          this.addPermissform[i] = this.addPermissform[i].trim();
        }
      }
      updatePermissionGroup({
        description: this.addPermissform.description,
        parentId: this.addPermissform.parentId,
        groupId: this.addPermissform.groupId
      })
        .then(res => {
          permissLoading.close();
          if (res.data.code == "00") {
            this.$message.success("更改成功");
            this.dialogAddPermissType = false;
            this.isEditPermiss = false;
            this.getTreeList();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          permissLoading.close();
          this.$message.error(err.message);
        });
    },
    // 创建新增权限组
    createNewGroup() {
      this.dialogAddPermissType = true;
    },
    // 确认删除权限
    onOkDeletePermissGroup() {
      deletePermissionGroup({
        id: this.addPermissform.groupId
      })
        .then(res => {
          this.isDeletePermissGroup = false;
          if (res.data.code == "00") {
            this.$message({
              type: "success",
              message: "删除权限组成功"
            });
            this.getTreeList();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          this.isDeletePermissGroup = false;
          this.$message.error(err.message);
        });
    },
    // 删除权限组
    deleteGroup() {
      this.isDeletePermissGroup = true;
      ///
    },
    // 点击三个点点点
    clickRightBtn(attr, e) {
      if (this.judgeFolder(attr.keyId) === "p") {
        this.drawPermissionMenu(e.x, e.y, attr);
      } else {
        this.drawChildrenMenu(e.x, e.y, attr);
      }
    },
    // 关闭权限弹窗
    closePermissDialog() {
      this.showPermissDialog = false;
      this.isShowEdit = false;
      this.modalEditData = {
        action: "",
        actionName: "",
        createStaffId: "",
        createTime: "",
        description: "",
        groupId: "",
        isBlacklist: "",
        isBusiness: "",
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
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .el-dialog__footer {
  height: 60px;
  padding: 16px 40px;
}
::v-deep .el-tree-node__content {
  width: 300px;
  line-height: 34px;
  height: 34px;
  position: relative;
  padding-right: 30px;
  color: #666666;
  .custom-tree-node-icon {
    display: none;
  }
  &:hover {
    .custom-tree-node-icon {
      position: absolute;
      display: block;
      width: 30px;
      height: 34px;
      text-align: center;
      padding-top: 1px;
      right: 0;
      top: 0;
    }
  }
  .custom-tree-node-icon-active {
    position: absolute;
    display: block;
    width: 30px;
    height: 34px;
    text-align: center;
    right: 0;
    top: 0;
    padding-top: 1px;
  }
}
//  修改权限描述
.dialog_changeDTU {
  height: 210px;
  padding: 24px 35px 10px 40px;
  padding: relative;
  .operation {
    position: absolute;
    left: 40px;
    bottom: 0px;
  }
}

.custom-tree-node {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>