<template>
  <div class="wechat-bs-wrap">
    <div class="wechat-bs-title">
      <img class="columnIcon" src="@/assets/imgs/infoIcon.png" />
      <span>{{noEditData.bizName}}</span>
    </div>
    <div class="wechat-bs-content">
      <div class="content-details-left-box">
        <div class="content-details-left">
          <el-form
            ref="ruleSmsBusinessRulesForm"
            label-width="150px"
            label-position="left"
            class="role-group-form-content"
            :model="editData"
            :rules="smsBusinessRules"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="业务名称："
                  prop="roleName"
                  :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
                >
                  <span v-if="!isSmsEdit">{{noEditData.bizName}}</span>
                  <el-input
                    v-else
                    v-model="editData.bizName"
                    disabled
                    style="width: 200px"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="通知类型："
                  :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
                >
                  <span v-if="!isSmsEdit">短信</span>
                  <el-input v-else value="短信" disabled size="small" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="是否开启推送："
                  :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
                >
                  <span
                    v-if="!isSmsEdit"
                    :class="[{'no-selected': noEditData.isOpen === null}]"
                  >{{noEditData.isOpen===null?'未设置':noEditData.isOpen === 1?'开启':'关闭'}}</span>
                  <el-radio-group v-else v-model="editData.isOpen">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="推送模式："
                  :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
                >
                  <span
                    v-if="!isSmsEdit"
                    :class="[{'no-selected': noEditData.sendMode===null}]"
                  >{{noEditData.sendMode===null?'未设置':noEditData.sendMode ===1?'实时':'定时'}}</span>
                  <el-radio-group v-else v-model="editData.sendMode">
                    <el-radio :label="1">实时</el-radio>
                    <el-radio :label="2">定时</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
                v-if="editData.sendMode === 2"
                :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
              >
                <el-form-item label="定时推送开始时间：" style="margin-bottom: 20px;" prop="sendStartTime">
                  <span
                    v-if="!isSmsEdit"
                    :class="[{'no-selected': !noEditData.sendStartTime}]"
                  >{{!noEditData.sendStartTime?'未设置':noEditData.sendStartTime}}</span>
                  <el-time-picker
                    placeholder="结束时间"
                    v-else
                    size="small"
                    style="width: 200px"
                    format="HH:mm"
                    value-format="HH:mm"
                    :disabled="editData.sendMode===1"
                    v-model="editData.sendStartTime"
                    :picker-options="{
                        selectableRange: '00:00:00- 23:59:59'
                      }"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
                v-if="editData.sendMode === 2"
                :style="{'margin-bottom':!isSmsEdit?0:'14px','height': '40px'}"
              >
                <el-form-item label="定时推送结束时间：" prop="sendEndTime">
                  <span
                    v-if="!isSmsEdit"
                    :class="[{'no-selected': !noEditData.sendEndTime}]"
                  >{{!noEditData.sendEndTime?'未设置':noEditData.sendEndTime}}</span>
                  <el-time-picker
                    placeholder="结束时间"
                    v-else
                    size="small"
                    style="width: 200px"
                    format="HH:mm"
                    value-format="HH:mm"
                    :disabled="editData.sendMode===1"
                    v-model="editData.sendEndTime"
                    :picker-options="{
                      selectableRange: (editData.sendStartTime||'00:00') + ':00 - 23:59:59'
                    }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="接收人类型：">
                  <span
                    v-if="!isSmsEdit"
                  >{{noEditData.receiveType === 3?'全部':noEditData.receiveType === 2?"用户":"员工"}}</span>
                  <el-radio-group disabled v-model="editData.receiveType" v-else>
                    <el-radio :label="3">全部</el-radio>
                    <el-radio :label="2">用户</el-radio>
                    <el-radio :label="1">员工</el-radio>
                  </el-radio-group>
                  <el-button
                    size="small"
                    style="margin-left: 10px"
                    v-if="isSmsEdit&&editData.receiveType !== 2"
                    @click="selectEmployee"
                    type="warning"
                    plain
                    round
                  >选择员工</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="content-footer" v-has="'messageBusinessManage_modify'">
          <el-button
            size="small"
            style="width: 116px;border:1px solid #2F87FE;color:#2F87FE;"
            v-if="!isSmsEdit"
            @click="changeBusiness"
          >修改消息业务</el-button>
          <el-button
            size="small"
            v-if="isSmsEdit"
            style="width: 80px;margin-right:10px;"
            class="el-button--primary"
            @click="saveBusiness"
          >保存</el-button>
          <el-button size="small" v-if="isSmsEdit" style="width: 80px;" @click="passBusiness">取消</el-button>
        </div>
      </div>
      <div class="content-details-right-box" v-if="editData.receiveType !== 2 ">
        <div class="right-box-title">已选员工({{empList.length}}个)</div>
        <div class="details-empty-data" v-if="empList.length === 0">
          <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
          <div class="text">暂无数据</div>
        </div>
        <ul class="right-box-content" v-if="empList.length > 0">
          <li v-for="item in empList" :key="item.id">
            <div class="title">{{item.name}}</div>
            <div class="content">
              <span>{{item.orgName}}</span>
              <span>{{item.role_name||''}}</span>
              <span>{{item.basic.mobile||''}}</span>
            </div>
          </li>
        </ul>
      </div>
      <el-dialog
        class="dialogAddResource"
        :visible.sync="showEmployeeModal"
        width="760px"
        top="20vh"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @closed="closedDialog"
      >
        <div slot="title" class="header-title">
          <img class="columnIcon" src="@/assets/imgs/permissIconDialog.png" />
          <span class="title-age">选择员工</span>
        </div>
        <div class="dialog_resource--content">
          <div class="titleDataEmp">
            <el-checkbox-group v-model="selectedList" @change="handleSelectionChange">
              <el-table
                ref="msTableRef"
                :data="tableData"
                tooltip-effect="dark"
                :height="tableHeight"
                :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
              >
                <template slot="empty" class="noData">
                  <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
                  <p style="margin:0px;">暂无数据</p>
                </template>
                <!-- <el-table-column
                type="selection"
                width="55" >
                </el-table-column>-->
                <el-table-column width="55" label>
                  <template slot-scope="scope">
                    <div>
                      <el-checkbox :label="scope.row.id">{{''}}</el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="部门名称"></el-table-column>
                <el-table-column prop="name" label="员工姓名"></el-table-column>
                <el-table-column label="角色">
                  <template slot-scope="scope">
                    <div>{{scope.row.role_name||''}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="手机号码">
                  <template slot-scope="scope">
                    <div>{{scope.row.basic.mobile||'--'}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-checkbox-group>
          </div>
          <div class="page-current-size">
            <div class="btnLeft">
              <el-button
                style="width: 80px;margin-right:10px;"
                class="el-button--primary"
                size="small"
                @click="onSureOk"
              >确认</el-button>
              <el-button style="width: 80px;" size="small" @click="closedDialog">取消</el-button>
            </div>
            <div class="pageRight">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="size"
                layout="prev, pager, next"
                :total="totalNum"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import _ from "lodash";
import { getStaffList } from "@/api/reportAPI";
import { getTreeOrg } from "@/api/systemSettings.js";
import { getTenantList } from "@/api/roleManage.js";

export default {
  name: "msg-bs-manage",
  components: {},
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      tableHeight: "300px",
      noEditData: {
        bizName: "",
        notifyType: 2, // 1:微信  2 短信
        isOpen: null,
        sendMode: null, // 1: 实时 2 定时
        sendStartTime: null,
        sendEndTime: null,
        receiveType: null
      },
      editData: {
        bizName: "",
        notifyType: 2, // 1:微信  2 短信
        isOpen: 0,
        sendMode: 1, // 1: 实时 2 定时
        sendStartTime: null,
        sendEndTime: null,
        receiveType: null
      },
      smsBusinessRules: {
        sendStartTime: [
          {
            required: true,
            message: "定时推送开始时间不能为空",
            trigger: "change"
          }
        ],
        sendEndTime: [
          {
            required: true,
            message: "定时推送结束时间不能为空",
            trigger: "change"
          }
        ]
      },
      showEmployeeModal: false,
      tableData: [],
      orgTreeList: [],
      empList: [],
      empContentList: [],
      selectedList: [],
      proSelectList: [],
      size: 5,
      page: 1,
      totalNum: 1,
      roleList: []
    };
  },
  props: {
    isSmsEdit: {
      type: Boolean,
      default: false
    },
    smsDetails: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    this.getTree();
  },
  watch: {
    smsDetails: {
      handler(newName, oldName) {
        // ...
        this.noEditData = { ...newName };
        this.editData = { ...newName };
        if (this.noEditData.staffDetailLists) {
          this.noEditData.staffDetailLists.forEach(item => {
            let findOrg = _.find(this.orgTreeList, val => {
              return val.org_code === item.org_code;
            });
            if (findOrg) {
              _.set(item, "orgName", findOrg.name);
            }
          });
          this.empList = this.noEditData.staffDetailLists;
          this.empContentList = this.noEditData.staffDetailLists;
        } else {
          this.empList = [];
          this.empContentList = [];
        }
      },
      immediate: true
    },
    isSmsEdit: {
      handler(newName, oldName) {
        // ...
        if (newName) {
        } else {
          // this.closedDialog()
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getRowKeys(row) {
      return row.id;
    },
    // 确认添加员工
    onSureOk() {
      this.empList = this.empContentList;
      this.showEmployeeModal = false;
    },
    changeBusiness() {
      let _data = _.cloneDeep(this.noEditData);
      for (let i in _data) {
        if (i === "isOpen" && _data[i] === null) {
          _data[i] = 0;
        } else if (i === "sendMode" && _data[i] === null) {
          _data[i] = 1;
        } else if (i === "delaySendStartTime") {
          _.set(_data, "sendStartTime", _data[i]);
        } else if (i === "delaySendEndTime") {
          _.set(_data, "sendEndTime", _data[i]);
        }
      }
      this.editData = _data;
      this.$emit("changeSmsEdit");
    },
    // 保存业务
    saveBusiness() {
      this.$refs.ruleSmsBusinessRulesForm.validate(valid => {
        if (valid) {
          let _array = this.empContentList.map(item => {
            return item.id;
          });
          if (_array.length > 0 && this.editData.receiveType !== 2) {
            _.set(this.editData, "receiveList", _array.join(","));
          }
          this.$emit("savaSmsDetails", this.editData);
        }
      });
    },
    //取消业务
    passBusiness() {
      let _noEditData = _.cloneDeep(this.noEditData);
      this.editData = _noEditData;
      if (this.noEditData.staffDetailLists) {
        this.noEditData.staffDetailLists.forEach(item => {
          let findOrg = _.find(this.orgTreeList, val => {
            return val.org_code === item.org_code;
          });
          if (findOrg) {
            _.set(item, "orgName", findOrg.name);
          }
        });
        this.empList = this.noEditData.staffDetailLists;
        this.empContentList = this.noEditData.staffDetailLists;
      } else {
        this.empList = [];
        this.empContentList = [];
      }
      this.$refs.ruleSmsBusinessRulesForm.resetFields();
      this.$emit("changeSmsEdit");
    },
    //选择员工
    selectEmployee() {
      this.showEmployeeModal = true;
      getTreeOrg()
        .then(res => {
          if (res.data.code == "0") {
            let temp = [];
            let _list = res.data.data || [];
            let rowDataToTreeData = arr => {
              let treeArr = arr;
              (treeArr || []).forEach(item => {
                temp.push(item.tenant_organization);
                if (item.children && item.children.length > 0) {
                  rowDataToTreeData(_.get(item, "children") || []);
                }
              });
            };
            rowDataToTreeData(_list);
            this.orgTreeList = temp;
            getStaffList({
              size: 5,
              page: this.page - 1,
              paged: true
            })
              .then(res => {
                if (res.data.code == "0") {
                  let _list = res.data.data || [];
                  _list.forEach(item => {
                    let findOrg = _.find(this.orgTreeList, val => {
                      return val.org_code === item.org_code;
                    });
                    if (findOrg) {
                      _.set(item, "orgName", findOrg.name);
                    }
                  });
                  this.tableData = _list;
                  this.totalNum = res.data.total_count;
                  // this.empList = this.noEditData.staffDetailLists;
                  let selectArray = [];
                  _list.forEach(item => {
                    let _findList = _.find(this.empContentList, val => {
                      return val.id === item.id;
                    });
                    if (_findList) {
                      selectArray.push(_findList);
                    }
                  });
                  this.selectedList = selectArray.map(item => {
                    return item.id;
                  });
                  this.proSelectList = selectArray.map(item => {
                    return item.id;
                  });
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleSelectionChange(attr) {
      let proSelected = _.cloneDeep(this.proSelectList);
      let afterSelected = _.cloneDeep(attr);
      let isReduce = _.difference(proSelected, afterSelected);
      let isAddNew = _.difference(afterSelected, proSelected);
      if (isReduce.length > 0) {
        this.empContentList = this.empContentList.filter(item => {
          return item.id !== isReduce[0];
        });
      } else {
        let addJson = _.find(this.tableData, item => {
          return item.id === isAddNew[0];
        });
        let _empList = _.cloneDeep(this.empContentList);
        _empList.push(addJson);
        this.empContentList = _empList;
      }
      this.proSelectList = attr;
    },
    // 获取租户级别  组织机构
    getTree() {
      getTreeOrg()
        .then(res => {
          if (res.data.code == "0") {
            let temp = [];
            let _list = res.data.data || [];
            let rowDataToTreeData = arr => {
              let treeArr = arr;
              (treeArr || []).forEach(item => {
                temp.push(item.tenant_organization);
                if (item.children && item.children.length > 0) {
                  rowDataToTreeData(_.get(item, "children") || []);
                }
              });
            };
            rowDataToTreeData(_list);
            this.orgTreeList = temp;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleCurrentChange(attr) {
      this.page = attr;
      this.selectEmployee();
    },
    //
    closedDialog() {
      this.selectedList = [];
      this.page = 1;
      this.empContentList = this.empList;
      this.showEmployeeModal = false;
    },
    //
    clearCheckInformation() {
      this.$refs.ruleSmsBusinessRulesForm.resetFields();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      this.getTree();
    });
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-dialog__header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
  .header-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}
.columnIcon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}
.dialog_resource--content {
  height: 394px;
  .titleDataEmp {
    height: calc(100% - 50px);
    padding: 20px 40px;
  }
  .page-current-size {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 40px;
    .btnLeft {
      width: 200px;
    }
    .pageRight {
      flex: 1;
      text-align: right;
      margin-right: -4px;
    }
  }
}
.titleDataEmp {
  // .lines{
  //   color:#ec6b60;
  // }
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    table-layout: auto;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #e9f6fe;
  }
  .el-table .cell,
  .el-table th > .cell {
    padding-right: 10px;
    padding-left: 10px;
  }
  height: calc(100% - 120px);
  .noData {
    margin-top: 100px;
  }
  .columnWidth {
    width: 80px;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    height: calc(100% - 48px) !important;
    padding: 0;
  }
  .el-table::before {
    display: none;
  }
  .noUse_button {
    font-size: 12px;
    border-radius: 14px;
    color: #2f87fe;
    border: 1px solid #2f87fe;
    float: right;
    width: 64px;
    height: 24px;
  }
  .noUse_button,
  .noUse_button.is-round {
    padding: 5px 14px;
  }
}
.wechat-bs-wrap {
  height: 100%;
  width: 100%;
  .wechat-bs-title {
    height: 36px;
    border-bottom: 1px solid rgba(170, 178, 193, 0.2);
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 550;
    color: rgba(34, 34, 34, 1);
    padding: 0 14px 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .columnIcon {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
  .wechat-bs-content {
    height: calc(100% - 36px);
    // padding: 10px;
    .content-details {
      height: calc(100% - 40px);
    }

    display: flex;
    justify-content: flex-start;
    // align-items: center;
    .content-details-left-box {
      width: 50%;
      height: 100%;
      padding-left: 10px;
      padding-top: 10px;
      .content-details-left {
        height: calc(100% - 40px);
        overflow: auto;
        .no-selected {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: rgba(201, 201, 201, 1);
        }
      }
      .content-footer {
        height: 40px;
        line-height: 40px;
      }
    }
    .content-details-right-box {
      width: 50%;
      height: 100%;
      background: #f5f8ff;
      padding: 24px 20px;
      position: relative;
      .details-empty-data {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
        color: #999;
      }
      .right-box-title {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: rgba(102, 102, 102, 0.7);
        line-height: 20px;
        margin-bottom: 16px;
      }
      .right-box-content {
        height: calc(100% - 40px);
        overflow: auto;
        padding: 10px 0;
        li {
          margin-bottom: 20px;
          .title {
            height: 20px;
            font-size: 16px;
            font-weight: 550;
            color: rgba(102, 102, 102, 0.8);
            line-height: 10px;
          }
          .content {
            font-size: 14px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: rgba(102, 102, 102, 0.6);
            span:nth-of-type(1) {
              margin-right: 10px;
              color: rgba(102, 102, 102, 0.6);
            }
            span:nth-of-type(2) {
              margin-right: 10px;
              color: rgba(102, 102, 102, 0.6);
            }
            span:nth-of-type(3) {
              margin-right: 10px;
              color: rgba(102, 102, 102, 0.6);
            }
          }
        }
      }
    }
  }
}
</style>