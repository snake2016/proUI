<template>
  <div class="depart-staff-manage-wrap">
    <div class="depart-staff-manage-left">
      <div class="depart-staff-manage-left-title-box">
        <div class="depart-staff-manage-left-title">
          <img class="columnIcon" src="@/assets/imgs/permissNameIcon.png" />
          <span>部门层级结构列表</span>
          <!-- 四个条件，有选择机构+点击+该租户配置开关+有查看权限 -->
          <span class="certifym" @click="showCertfym=true" v-show="selectedData && !showCertfym && hasAuth && btAuthList['查看证书']">证书管理</span>
          <span class="certifym" @click="showCertfym=false" v-show="showCertfym">退出证书管理</span>
        </div>
      </div>
      <div class="depart-staff-manage-left-treebox">
        <div class="depart-staff-manage-left-tree" id="id">
          <vue-scroll :ops="ops" v-if="orgTreeData.length > 0">
            <el-tree
              :data="orgTreeData"
              highlight-current
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
              auto-expand-parent
              :default-expand-all="true"
              :expand-on-click-node="false"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span
                  :class="[{'active-tree':selectedData&&selectedData.id === data.id },{'data-locked':data.tenant_organization.is_locked,}]"
                >{{ data.name }}</span>

                <el-tooltip
                  class="item"
                  v-if="data.tenant_organization.is_locked"
                  effect="dark"
                  content="已锁定"
                  placement="top-start"
                >
                  <img src="@/assets/imgs/形状.png" style="width: 10px;height:14px;margin-left: 4px;" />
                </el-tooltip>
                <div
                  v-if="isShow"
                  :class="['custom-tree-node-icon',{'custom-tree-node-icon-active':selectedData.id === data.id }]"
                  @click.stop="(e)=>{clickRightBtn(data,e)}"
                >
                  <svg class="icon" aria-hidden="true" slot="reference" style="margin-right:4px">
                    <use xlink:href="#el-icon-sandian" />
                  </svg>
                </div>
              </div>
            </el-tree>
          </vue-scroll>
          <div class="depart-staff-manage-left-tree-empty" v-else>
            <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />

            <el-button
              size="small"
              style="margin-top: 20px;color:#2F87FE;border:1px solid #2F87FE"
              @click="createDepartInfo"
              v-has="'departStaffManage_addorg'"
            >
              <svg
                class="icon"
                aria-hidden="true"
                style="width: 16px;height: 14px;margin-right: 6px;"
              >
                <use xlink:href="#el-icon-tianjiawenjian" />
              </svg>创建部门信息
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="depart-staff-manage-right" v-if="selectedData && !showCertfym">
      <div class="depart-staff-manage-right-title">
        <img
          class="columnIcon"
          v-if="!selectedData.tenant_organization.is_locked"
          src="@/assets/imgs/部门icon.png"
        />
        <img class="columnIcon" v-else src="@/assets/imgs/部门icon-灰.png" />
        <span
          :class="[{'span-isLocked-title': !!selectedData.tenant_organization.is_locked}]"
        >{{selectedData.name}}</span>
        <el-tooltip
          class="item"
          v-if="!!selectedData.tenant_organization.is_locked"
          effect="dark"
          content="已锁定"
          placement="top-start"
        >
          <img src="@/assets/imgs/形状.png" style="width: 10px;height:14px;margin-left: 4px;" />
        </el-tooltip>
        <div class="right-title-btn">
          <el-button
            style="width: 116px;border:1px solid #2F87FE;color:#2F87FE;margin-right:10px"
            v-if="selectedData&&!selectedData.tenant_organization.is_locked"
            v-has="'departStaffManage_modifyorg'"
            size="small"
            @click="editDepart"
          >编辑部门信息</el-button>
          <el-button
            style="width: 88px;border:1px solid #2F87FE;color:#2F87FE;"
            v-if="selectedData&&selectedData.name!=='网上营业厅'&&!selectedData.tenant_organization.is_locked"
            v-has="'departStaffManage_addstaff'"
            size="small"
            @click="createNewPerson"
          >新增员工</el-button>
        </div>
      </div>
      <div class="depart-staff-manage-right-details" style="padding: 10px 16px;">
        <div class="details-box">
          <el-row style="padding: 8px 0;">
            <el-col :span="8" class="details-content">
              <span>部门类型：</span>
              <span v-html="changeTypeHtml(detailsContent)"></span>
            </el-col>
            <el-col :span="10" class="details-content">
              <span>负责人：</span>
              <span>{{detailsContent.basic.principal}}</span>
            </el-col>
          </el-row>
          <el-row style="padding: 8px 0;">
            <el-col :span="8" class="details-content">
              <span>手机号码：</span>
              <span>{{detailsContent.basic.phone}}</span>
            </el-col>
            <el-col :span="10" class="details-content">
              <span>所在省份：</span>
              <span v-html="changeProvince(detailsContent,true)"></span>
            </el-col>
          </el-row>
          <el-row style="padding: 8px 0;">
            <el-col :span="8" class="details-content">
              <span>所在市：</span>
              <span>{{cityName}}</span>
            </el-col>
            <el-col :span="10" class="details-content">
              <span>地址：</span>
              <span>{{detailsContent.basic.location}}</span>
            </el-col>
          </el-row>
          <div class="details-selected-employees">
            <span class="input-with-title">全部员工</span>
            <el-input
              size="small"
              placeholder="请输入搜索内容"
              v-model="selectValue"
              @keyup.enter.native="getPersonList"
              class="input-with-select"
            >
              <el-select v-model="selectType" style="width: 120px" slot="prepend">
                <el-option key="name" label="员工名称" value="name"></el-option>
                <el-option key="staffNo" label="员工号" value="staffNo"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="getPersonList"></el-button>
            </el-input>
          </div>
          <div class="employees-card-list">
            <vue-scroll :ops="ops" v-if="persList.length > 0">
              <ul class="employees-card-list-ul">
                <li
                  :class="['employees-card-list-li',{'employees-card-list-woman':item.basic.gender === 1},{'employees-card-list-man':item.basic.gender === 0}, {'resigned': item.is_resigned}]"
                  v-for="item in persList.filter(v=>{return v.org_code === selectedData.tenant_organization.org_code })"
                  :key="item.id"
                >
                  <div class="list-li-box">
                    <div class="btn-list-modal">
                      <div class="btn-query-details" @click="checkDetails(item)">查看详情</div>
                      <div
                        class="btn-change-details"
                        v-if="!selectedData.tenant_organization.is_locked"
                        v-has="'departStaffManage_modifystaff'"
                      >
                        <span
                          @click="changePersonInfo(item)"
                          v-has="'departStaffManage_modifystaff'"
                        >修改信息</span>
                        <span style="margin: 0 4px" v-if="userRoleName === '租户管理员'">|</span>
                        <span v-if="userRoleName === '租户管理员'" @click="changeAccount(item)">修改密码</span>
                      </div>
                    </div>
                    <el-row style="padding: 4px 0">
                      <el-col :span="24" class="text-item">
                        <span>姓名：</span>
                        <span>{{item.name}}</span>
                      </el-col>
                    </el-row>
                    <el-row style="padding: 4px 0">
                      <el-col :span="24" class="text-item">
                        <span>工号：</span>
                        <span>{{item.basic.staff_no}}</span>
                      </el-col>
                    </el-row>
                    <el-row style="padding: 4px 0">
                      <el-col :span="24" class="text-item">
                        <span>角色：</span>
                        <span>{{item.role_name}}</span>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
            </vue-scroll>
            <div class="details-empty-data" v-if="persList.length === 0">
              <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
              <div class="text">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="depart-staff-manage-right" v-else-if="showCertfym">
        <Certifym :selectedData="selectedData" :tid="selectedData.tenant_organization.tenant_id" :org_code="selectedData.tenant_organization.org_code"/>
    </div>
    <div class="depart-staff-manage-right" v-else>
      <div class="details-empty-data">
        <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
        <div class="text">暂无数据</div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="300px"
      :show-close="false"
      custom-class="delete-dialog"
    >
      <div class="content">
        <div class="confirm">
          <img src="~@/assets/imgs/alarm.png" alt />
          <span>您确定要将该条报警信息标记为已恢复吗？</span>
        </div>
        <div class="warn">
          <span>标记后将不可更改</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button>确 定</el-button>
        <el-button>取 消</el-button>
      </span>
    </el-dialog>
    <DepartDialog
      :showDepartDialog="showDepartDialog"
      :isShowEdit="isEditDepart"
      :details="newDepartsDetails"
      :isSameLevel="isSameLevel"
      :departId="departId"
      :isChildren="isChildren"
      @closePermissDialog="closePermissDialog"
      @getTree="getTree"
      @updateDetails="updateDetails"
    />
    <EmployeesDialog
      :showEmployeesDialog="showEmployeesDialog"
      :orgJson="orgJson"
      :details="empDetails"
      :showDetails="showDetails"
      :isLocked="selectedData&&!selectedData.tenant_organization.is_locked"
      :isShowEdit="isEditEmpDetails"
      @closePersonDialog="closePersonDialog"
      @getPersonList="getPersonList"
    />
    <ChangeAccount
      :showAccountDialog="showAccountDialog"
      :details="isEditEmpDetails"
      @closedAccountPassword="closedAccountPassword"
    />
    <gc-confirm-again
      :visible="isLockDepart"
      title="此操作将锁定部门, 是否继续"
      subTitle="锁定后该部门员工将无法登录"
      @onCancel="isLockDepart=false"
      @onOk="onOkLockDepart"
    />
    <gc-confirm-again
      :visible="isNoLockDepart"
      title="此操作将解锁部门, 是否继续"
      subTitle="解锁后该部门员工账号将正常使用"
      @onCancel="isNoLockDepart=false"
      @onOk="onOkUnLockDepart"
    />
    <gc-confirm-again
      :visible="isDeleteDepart"
      title="此操作将删除部门信息, 是否继续"
      subTitle="删除后数据将无法恢复"
      @onCancel="isDeleteDepart=false"
      @onOk="onOkDeleteDep"
    />
  </div>
</template>
<script>
import {
  getTenantTree,
  deleteDepart,
  getDepartInfoDetails,
  getAddress,
  getPersList,
  noLockDepartFun,
  lockDepartFun,
  getTypeTreeList
} from "@/api/departStaffManage.js";
import { getTenantOrgList, getTenantList } from "@/api/roleManage.js";
import DepartDialog from "./departDialog.vue";
import EmployeesDialog from "./employeesDialog.vue";
import ChangeAccount from "./changeAccount.vue";
import Certifym from "./certifym.vue"
import $ from "jquery";
import _ from "lodash";

export default {
  name: "depart-staff-manage",
  components: { DepartDialog, EmployeesDialog, ChangeAccount,Certifym },
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      orgTreeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      showDepartDialog: false,
      isEditDepart: false,
      isSameLevel: false,
      // 新增部门信息
      newDepartsDetails: {
        name: "", // 名称
        org_stru_id: "", // 租户组织机构
        parent_id: "", // 父ID
        basic: {
          city: "", // 所在城市
          location: "", //所在地址
          phone: "", // 联系电话
          principal: "", //负责人
          province: "", // 所在省份
          region_code: "" // 行政区域编码
        }
      },
      selectedData: "",
      departId: "",
      detailsContent: {
        org_stru_id: "",
        basic: {
          city: "",
          location: "",
          phone: "",
          principal: "",
          province: ""
        }
      },
      getTenantOrgList: [],
      typeList: [],
      provinceList: [],
      cityName: "",
      isChildren: false,
      dialogVisible: false,
      //////////////员工////////////
      persList: [],
      showEmployeesDialog: false,
      isEditEmpDetails: false,
      showDetails: false,
      orgJson: {
        orgCode: "",
        orgName: "",
        orgStruId: ""
      },
      selectType: "name",
      selectValue: "",
      empDetails: {},
      roleList: [],
      ////////修改密码///////
      showAccountDialog: false,
      OrgTreeList: [],
      userRoleName: "",
      //////锁定二次弹框/////
      isLockDepart: false,
      isNoLockDepart: false,
      isDeleteDepart: false,
      tempData: "",
      isShow: true,
      showCertfym:false,
      btAuthList: this.$store.state.btAuthList,
    };
  },
  computed:{
      hasAuth(){
          return this.$ls.get('tenantBasicConfig').is_login_verify_enabled
      }
  },
  created() {
    this.userRoleName = this.$ls.get("userGradeName");
    this.getTree();
    this.getType();
    this.getProvinceList();
    // this.getRoleList();
    this.getOrgTreeList();
    this.isShow =
      this.$_has("departStaffManage_addorg") ||
      this.$_has("departStaffManage_lock") ||
      this.$_has("departStaffManage_unlock") ||
      this.$_has("departStaffManage_deleteorg");
  },
  mounted() {
    $("body").on("click", () => {
      $("body")
        .find("#tree-depart-contextmenu")
        .remove();
    });
  },
  methods: {
    //转换类型
    changeTypeHtml(attr) {
      if (attr.org_stru_id) {
        let _findType = _.find(this.typeList, item => {
          return item.id === attr.org_stru_id;
        });
        if (_findType) {
          return _findType.name;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    //  获取数据0000
    getProvinceList() {
      getAddress({
        regionCode: 0
      }).then(res => {
        if (res.data.code == 0) {
          this.provinceList = res.data.data.records || [];
        }
      });
    },
    // 更改省份
    changeProvince(attr, flag) {
      if (attr.basic.province) {
        let _code = flag ? 0 : attr.basic.province;
        if (flag) {
          let _findType = _.find(this.provinceList, item => {
            return item.regionCode === attr.basic.province;
          });
          if (_findType) {
            return _findType.regionName;
          } else {
            return "";
          }
        }
      } else {
        return "";
      }
    },
    //
    getType() {
      getTenantOrgList().then(res => {
        if (res.data.code == "0") {
          this.typeList = (res.data.data || []).filter(item => {
            return item.is_enabled === true;
          });
        }
      });
    },
    closePermissDialog() {
      this.showDepartDialog = false;
      this.isEditDepart = false;
      this.isSameLevel = false;
      this.isChildren = false;
    },
    createDepartInfo() {
      (this.newDepartsDetails = {
        name: "", // 名称
        org_stru_id: "", // 租户组织机构
        parent_id: null, // 父ID
        basic: {
          city: "", // 所在城市
          location: "", //所在地址
          phone: "", // 联系电话
          principal: "", //负责人
          province: "", // 所在省份
          region_code: "" // 行政区域编码
        }
      }),
        (this.showDepartDialog = true);
      this.isEditDepart = false;
    },
    //
    getTree() {
      getTenantTree().then(res => {
        if (res.data.code == "0") {
          this.convertData(res.data.data || []);
        }
      });
    },
    // 整理树状图数据
    convertData(data) {
      let list = _.cloneDeep(data);
      let Index = 0;
      let getTree = arr => {
        let rArr = [];
        (arr || []).map((item, index) => {
          _.set(item, "name", item.tenant_organization.name);
          _.set(item, "treeIndex", Index);
          Index += 1;

          if (this.selectedData && this.selectedData.id === item.id) {
            this.selectedData = item;
          }
          if (item.children && item.children.length > 0) {
            getTree(item.children);
          }
        });
        return arr;
      };
      try {
        this.orgTreeData = getTree(list); // 权限树
      } catch (error) {
        // this.$message.error("权限树生成发生错误");
        console.error("权限树生成发生错误", error);
      }
    },
    handleNodeClick(attr) {
      $("body")
        .find("#tree-depart-contextmenu")
        .remove();
      this.selectedData = attr;
      this.detailsContent = attr.tenant_organization;
      this.selectValue = "";
      this.cityName = "";
      this.getPersonList();
      if (attr.tenant_organization.basic.province) {
        getAddress({
          regionCode: attr.tenant_organization.basic.province
        }).then(res => {
          if (res.data.code == 0) {
            let _findType = _.find(res.data.data.records || [], item => {
              return item.regionCode === attr.tenant_organization.basic.city;
            });
            if (_findType) {
              this.cityName = _findType.regionName;
            }
          }
        });
      }
    },
    //  点击右侧的三个点
    clickRightBtn(attr, e) {
      let judge = this.firstOrEndNode(attr);
      if (!this.isShow) return;
      this.drawRightMenu(e.x, e.y, attr, judge);
    },
    editDepart() {
      this.departId = this.selectedData.id;
      (this.newDepartsDetails = {
        name: this.selectedData.name, // 名称
        org_stru_id: this.selectedData.tenant_organization.org_stru_id, // 租户组织机构
        parent_id: this.selectedData.parentid, // 父ID
        basic: {
          city: this.selectedData.tenant_organization.basic.city || "", // 所在城市
          location: this.selectedData.tenant_organization.basic.location || "", //所在地址
          phone: this.selectedData.tenant_organization.basic.phone || "", // 联系电话
          principal:
            this.selectedData.tenant_organization.basic.principal || "", //负责人
          province: this.selectedData.tenant_organization.basic.province || "", // 所在省份
          region_code:
            this.selectedData.tenant_organization.basic.region_code || "" // 行政区域编码
        }
      }),
        (this.showDepartDialog = true);
      this.isEditDepart = true;
      this.isSameLevel = true;
    },
    // 绘画权限组的右键菜单
    drawRightMenu(x, y, val, judge) {
      $("body")
        .find("#tree-depart-contextmenu")
        .remove();
      let _height = document.body.clientHeight;
      let _X = x + 10;
      let _Y = _height - y - 15 > 144 ? y + 15 : y - 144;
      let contextmenuNode = $(
        "<div id='tree-depart-contextmenu' style='cursor: pointer;box-shadow:0px 0px 2px 0px rgba(0,54,128,0.2); position: fixed;left: " +
          _X +
          "px;top:" +
          _Y +
          "px;z-index: 1000;background: rgba(255,255,255,1);width: 140px;height: auto;'></div>"
      );
      let ulNode = $("<ul id='tree-depart-contextmenu-ul'></ul>");

      let liNodeTwo = $(
        "<li v-has=''departStaffManage_addorg'' style='color:#666666;width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>新增本级别部门</li>"
      ).on("click", () => {
        this.addSameLevelDepart(val);
      });

      if (
        judge !== "first" ||
        (this.userRoleName === "租户管理员" &&
          val.tenant_organization.org_code !== "1")
      ) {
        liNodeTwo.appendTo(ulNode);
      }
      let liNodeFour = $(
        "<li v-has=''departStaffManage_deleteorg'' style='color:#666666;width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>删除</li>"
      ).on("click", () => {
        this.deleteDep(val);
      });

      let liNodeFive = null;
      let liNodeThree = $(
        "<li v-has=''departStaffManage_addorg'' style='color:#666666;width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>新增子级部门</li>"
      ).on("click", () => {
        this.addChildLevelDepart(val);
      });
      if (val.tenant_organization.is_locked) {
        liNodeFive = $(
          "<li v-has=''departStaffManage_unlock'' style='color:#666666;width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>解除锁定</li>"
        ).on("click", () => {
          this.unLockDepart(val);
        });
      } else {
        liNodeFive = $(
          "<li v-has=''departStaffManage_lock'' style='color:#666666;width: 100%;height: 36px;text-align:left;line-height: 36px;padding-left: 20px;border-bottom: 1px solid rgba(217, 217, 217, 1);'>锁定</li>"
        ).on("click", () => {
          this.lockDepart(val);
        });
      }
      if (judge !== "end" && !val.tenant_organization.is_locked) {
        liNodeThree.appendTo(ulNode);
      }
      if (judge !== "first") {
        liNodeFive.appendTo(ulNode);
      }

      if (judge !== "first") {
        liNodeFour.appendTo(ulNode);
      }

      ulNode.appendTo(contextmenuNode);
      contextmenuNode.appendTo("body");
    },
    //  新增同级部门
    addSameLevelDepart(attr) {
      this.isSameLevel = true;
      (this.newDepartsDetails = {
        name: "", // 名称
        org_stru_id: attr.tenant_organization.org_stru_id, // 租户组织机构
        parent_id: attr.parentid, // 父ID
        basic: {
          city: "", // 所在城市
          location: "", //所在地址
          phone: "", // 联系电话
          principal: "", //负责人
          province: "", // 所在省份
          region_code: "" // 行政区域编码
        }
      }),
        (this.showDepartDialog = true);
      this.isEditDepart = false;
    },
    //增加子集部门
    addChildLevelDepart(attr) {
      this.newDepartsDetails = {
        name: "", // 名称
        org_stru_id: attr.tenant_organization.org_stru_id, // 租户组织机构
        parent_id: attr.id, // 父ID
        basic: {
          city: "", // 所在城市
          location: "", //所在地址
          phone: "", // 联系电话
          principal: "", //负责人
          province: "", // 所在省份
          region_code: "" // 行政区域编码
        }
      };
      this.isChildren = true;
      this.showDepartDialog = true;
      this.isEditDepart = false;
    },
    //确认锁定部门
    onOkLockDepart() {
      lockDepartFun({
        id: this.tempData.id
      })
        .then(res => {
          this.isLockDepart = false;
          if (res.data.code == "0") {
            if (
              this.selectedData &&
              this.selectedData.id === this.tempData.id
            ) {
              let _selectData = _.cloneDeep(this.selectedData);
              _.set(_selectData, "tenant_organization.is_locked", true);
              this.selectedData = _selectData;
            }
            this.getTree();
            this.$message.success("锁定成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isLockDepart = false;
          this.$message.error(err.message);
        });
    },
    // 开启锁定部门组织 弹框
    lockDepart(attr) {
      this.tempData = attr;
      this.isLockDepart = true;
    },
    firstOrEndNode(attr) {
      // let _attr = _.cloneDeep(attr);

      let findEnd = _attr => {
        let isOK = false;
        let _digui = arr => {
          (arr || []).forEach(item => {
            if (
              attr.tenant_organization.org_stru_id === item.id &&
              item.children &&
              item.children.length === 0
            ) {
              isOK = true;
            } else if (
              attr.tenant_organization.org_stru_id !== item.id &&
              item.children &&
              item.children.length > 0
            ) {
              _digui(item.children);
            }
          });
        };
        _digui(_attr);
        return isOK;
      };
      if (attr.parentid == null || attr.treeIndex == 0) {
        return "first";
      } else if (findEnd(this.OrgTreeList)) {
        return "end";
      } else {
        return false;
      }
    },
    // 获取组织机构树状态图
    getOrgTreeList() {
      getTypeTreeList().then(res => {
        if (res.data.code == "0") {
          this.OrgTreeList = res.data.data || [];
        }
      });
    },
    onOkUnLockDepart() {
      noLockDepartFun({
        id: this.tempData.id
      })
        .then(res => {
          this.isNoLockDepart = false;
          if (res.data.code == "0") {
            if (
              this.selectedData &&
              this.selectedData.id === this.tempData.id
            ) {
              let _selectData = _.cloneDeep(this.selectedData);
              _.set(_selectData, "tenant_organization.is_locked", false);
              this.selectedData = _selectData;
            }
            this.getTree();
            this.$message.success("解锁成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isNoLockDepart = false;
          this.$message.error(err.message);
        });
    },
    // 解除锁定
    unLockDepart(attr) {
      this.isNoLockDepart = true;
      this.tempData = attr;
    },
    // 确认删除组织结构
    onOkDeleteDep() {
      deleteDepart({
        id: this.tempData.id
      })
        .then(res => {
          this.isDeleteDepart = false;
          if (res.data.code == "0") {
            if (
              this.selectedData &&
              this.selectedData.id === this.tempData.id
            ) {
              this.selectedData = "";
              this.getTree();
            } else {
              this.getTree();
            }
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.isDeleteDepart = false;
          this.$message.error(err.message);
        });
    },
    // 删除组织结构
    deleteDep(attr) {
      this.isDeleteDepart = true;
      this.tempData = attr;
    },
    // 更新当前数据
    updateDetails(attr) {
      getDepartInfoDetails({
        id: attr
      }).then(res => {
        if (res.data.code == "0") {
          let _select = _.cloneDeep(this.selectedData);
          this.detailsContent = res.data.data;
          this.selectedData = {
            id: _select.id,
            name: res.data.data.name || "",
            parentid: _select.parentid,
            tenant_organization: res.data.data
          };
          getAddress({
            regionCode: this.selectedData.tenant_organization.basic.province
          }).then(res => {
            if (res.data.code == 0) {
              let _findType = _.find(res.data.data.records || [], item => {
                return (
                  item.regionCode ===
                  this.selectedData.tenant_organization.basic.city
                );
              });
              if (_findType) {
                this.cityName = _findType.regionName;
              }
            }
          });
          this.getTree();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    ///////////////////////////员工//////////////////////
    // 员工列表
    getPersonList() {
      let _attr = {
        paged: false,
        includeResigned: true,
        orgCode: this.selectedData.tenant_organization.org_code
      };
      _attr[this.selectType] = this.selectValue.trim() || "";
      getPersList(_attr).then(res => {
        if (res.data.code == "0") {
          let _persList = res.data.data || [];
          // _persList.forEach(item => {
          //   let _findRole = _.find(this.roleList, val => {
          //     return val.id === item.role_id;
          //   });
          //   if (_findRole) {
          //     _.set(item, "roleName", _findRole.name);
          //   }
          // });
          this.persList = _persList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // show新增员工弹框
    createNewPerson() {
      this.showEmployeesDialog = true;
      this.orgJson = {
        orgCode: this.selectedData.tenant_organization.org_code || "",
        orgName: this.selectedData.tenant_organization.name || "",
        orgStruId: this.selectedData.tenant_organization.org_stru_id || ""
      };
    },
    // 关闭员工弹框
    closePersonDialog() {
      this.showEmployeesDialog = false;
      this.isEditEmpDetails = false;
      this.showDetails = false;
    },
    // getRoleList() {
    //   getTenantList().then(res => {
    //     if (res.data.code == "0") {
    //       this.roleList = (res.data.data || []).filter(item => {
    //         return item.is_admin !== true;
    //       });
    //     }
    //   });
    // },
    // 查看员工详情
    checkDetails(attr) {
      this.showEmployeesDialog = true;
      this.isEditEmpDetails = true;
      this.showDetails = true;
      this.orgJson = {
        orgCode: this.selectedData.tenant_organization.org_code || "",
        orgName: this.selectedData.tenant_organization.name || "",
        orgStruId: this.selectedData.tenant_organization.org_stru_id || ""
      };
      this.empDetails = attr;
    },
    // 修改员工信息
    changePersonInfo(attr) {
      this.showEmployeesDialog = true;
      this.isEditEmpDetails = true;
      this.orgJson = {
        orgCode: this.selectedData.tenant_organization.org_code || "",
        orgName: this.selectedData.tenant_organization.name || "",
        orgStruId: this.selectedData.tenant_organization.org_stru_id || ""
      };
      this.empDetails = attr;
    },
    // 修改密码
    changeAccount(attr) {
      this.showAccountDialog = true;
      this.isEditEmpDetails = attr;
    },
    // 关闭密码弹框
    closedAccountPassword() {
      this.showAccountDialog = false;
      this.isEditEmpDetails = false;
      this.showDetails = false;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  width: 359px;
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
      right: 10px;
      top: 0;
    }
  }
  .custom-tree-node-icon-active {
    position: absolute;
    display: block;
    width: 30px;
    height: 34px;
    text-align: center;
    right: 10px;
    top: 0;
    padding-top: 1px;
  }
}
::v-deep .delete-dialog {
  .el-dialog__header {
    height: 25px;
    border-bottom: none;
  }
  .content {
    .confirm {
      position: relative;
      img {
        position: absolute;
        left: -10px;
        top: 0;
        margin-left: -18px;
        vertical-align: top;
        padding-top: 4px;
      }
      span {
        color: #222222;
      }
    }
    .warn {
      margin-top: 6px;
      span {
        color: #ababab;
        font-size: 12px;
      }
    }
  }
}
::v-deep .delete-dialog .el-dialog__footer {
  padding: 20px 40px 25px 60px;
  .el-button {
    border: 1px solid #ec6b60;
    color: #ec6b60;
    padding: 0;
    width: 80px;
    height: 32px;
  }
}
::v-deep .delete-dialog .el-dialog__body {
  padding: 0 40px 0 70px;
}
.custom-tree-node {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.certifym{
    position: absolute;
    right: 0;
    color: #2F87FE;
    font-size: 15px;
    cursor: pointer;
}
@import "./index.scss";
</style>