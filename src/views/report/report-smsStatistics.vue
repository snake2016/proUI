<template>
  <div class="list">
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/report_costpay.png" alt />
        <span class="title">短信统计报表筛选</span>
      </div>
      <div class="filter-term">
        <vue-scroll :ops="ops" ref="vs">
          <el-form label-position="top" label-width="100px" :model="filter" ref="rule_filter">
            <el-form-item label="租户" v-show="adminShow" prop="tenant">
              <el-select v-model="filter.tenant" filterable>
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in tenantAdminArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="开始时间" prop="startDate1">
              <el-date-picker
                :picker-options="pickerBefore"
                type="datetime"
                v-model="filter.startDate1"
                :clearable="false"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endDate1">
              <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                v-model="filter.endDate1"
                :clearable="false"
                :picker-options="pickerAfter"
              ></el-date-picker>
            </el-form-item> -->
             <el-form-item label="时间区间" prop="custDate">
                <customDatePicker 
                :value="filter.custDate" 
                @change="(val)=>{ filter.custDate = val}"
                ></customDatePicker>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="filter-func-btn">
        <el-button class="filter-func-btn-size" @click="resetForm('rule_filter')">重置</el-button>
        <el-button
          type="primary"
          class="filter-func-btn-size"
          @click="submitFilter('rule_filter','1','10')"
        >筛选</el-button>
      </div>
    </div>
    <div class="table">
      <div class="query-func-btn">
        <el-dropdown class="oneMore" trigger="click" @command="downloadFun">
          <el-button
            plain
            size="small"
            :class="tableData!=''?'importBtn':'default'"
            :disabled="tableData.length > 0?false:true"
          >
            导出报表
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="pdf">PDF下载</el-dropdown-item>
            <el-dropdown-item command="excel">Excel下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="titleData">
        <div class="noData" v-if="!tableData.length">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </div>
        <el-table
          :height="tableHeight"
          :data="tableData"
          class="tables"
          v-if="tableData.length"
          :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        >
          <el-table-column
            v-for="item in titleData"
            :prop="item.value"
            :label="item.label"
            :key="item.value"
            min-width="134"
          ></el-table-column>
        </el-table>
        <div class="page" v-if="tableData.length > 0">
          <el-pagination
            class="pageLeft"
            background
            @size-change="handleSizeChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="slot,sizes,total"
            :total="dataNum"
          >
            <span class="fontSize">显示</span>
          </el-pagination>
          <el-pagination
            class="pageRight"
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="dataNum"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRegionList, getAreaList } from "@/api/archivesAPI";
import { tenantList } from "@/api/tenant.js";
import {
  gasReportTenantSMS,
  gasReportAdminSMS,
  exportReport
} from "@/api/reportAPI";
import customDatePicker from './customDatePicker'
import { getFormateDate } from "@/utils/index.js";
export default {
  name: "report-smsStatistics",
  data() {
    return {
      titleDataAdmin: [
        //系统管理员报表表头
        {
          value: "tenantName",
          label: "租户"
        },
        {
          value: "success",
          label: "成功短信数"
        },
        {
          value: "fail",
          label: "失败短信数"
        },
        {
          value: "sum",
          label: "总数"
        }
      ],
      titleDataTenant: [
        //报表表头
        {
          value: "bizName",
          label: "业务名称"
        },
        {
          value: "success",
          label: "成功短信数"
        },
        {
          value: "fail",
          label: "失败短信数"
        },
        {
          value: "sum",
          label: "总数"
        }
      ],
      admin: false,
      tenantAdmin: false,
      adminShow: true,
      name: "",
      tenantAdminArr: [], //租户列表
      currentPage: 1, //当前页
      //初始化总条数
      dataNum: 0,
      dataNum1: 0,
      pageSize: 10, //每页显示多少条
      filter: {
        tenant: "",
        // startDate1: "",
        // endDate1: ""
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))]
        custDate:[]
      },
      tableHeight: "calc(100% - 50px)",
      tableData: [], //报表列表
      ops: window.scrollOps, // 滚动条
      //时间插件限制
    //   pickerBefore: {
    //     disabledDate: time => {
    //       let beginDateVal = this.filter.endDate1;
    //       if (beginDateVal) {
    //         return time.getTime() > beginDateVal.getTime();
    //       }
    //     }
    //   },
    //   pickerAfter: {
    //     disabledDate: time => {
    //       let beginDateVal1 = this.filter.startDate1;
    //       if (beginDateVal1) {
    //         return (
    //           time.getTime() <= beginDateVal1.getTime() - 24 * 60 * 60 * 1000
    //         );
    //       }
    //     }
    //   }
    };
  },
  computed: {},
  components: {customDatePicker},
  methods: {
    // 表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    //   this.filter.startDate = "";
    //   this.filter.endDate = "";
      this.filter.custDate=[]
      this.tableData = [];
    },
    // 查询报表
    submitFilter(formName, page, size) {
    //   if (this.filter.startDate1) {
    //     let startTime = this.filter.startDate1;
    //     let startDate = new Date(startTime).toJSON();
    //     // 开始时间格式化
    //     startDate = new Date(+new Date(startTime) + 8 * 3600 * 1000)
    //       .toISOString()
    //       .replace(/T/g, " ")
    //       .replace(/\.[\d]{3}Z/, "");
    //     this.filter["startDate"] = startDate;
    //   } else {
    //     this.filter["startDate"] = "";
    //   }
    //   if (this.filter.endDate1) {
    //     let endTime = this.filter.endDate1;
    //     let endDate = new Date(endTime).toJSON();
    //     // 结束时间格式化
    //     endDate = new Date(+new Date(endTime) + 8 * 3600 * 1000)
    //       .toISOString()
    //       .replace(/T/g, " ")
    //       .replace(/\.[\d]{3}Z/, "");
    //     this.filter["endDate"] = endDate;
    //   } else {
    //     this.filter["endDate"] = "";
    //   }
      this.filter["size"] = size;
      this.filter["current"] = page;
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      if (this.adminShow == true) {
        this.titleData = this.titleDataAdmin;
        gasReportAdminSMS(this.filter)
          .then(res => {
            loading.close();
            let data = res.data.data;
            if (res.data.code == 0) {
              if (data) {
                this.currentPage = data.current;
                this.dataNum = data.total;
                this.pageSize = data.size;
                if (data.records.length > 0) {
                  this.tableData = data.records;
                } else {
                  this.tableData = [];
                  this.$message.info("查询结果为空");
                }
              } else {
                this.tableData = [];
              }
            } else {
              this.tableData = [];
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            loading.close();
            if (err != 401 && err != 403) {
              this.$message.error("获取报表时发生错误");
              console.error("获取报表时发生错误", err);
            }
          });
      } else {
        this.titleData = this.titleDataTenant;
        gasReportTenantSMS(this.filter)
          .then(res => {
            loading.close();
            let data = res.data.data;
            if (res.data.code == 0) {
              if (data) {
                this.currentPage = data.current;
                this.dataNum = data.total;
                this.pageSize = data.size;
                if (data.records.length > 0) {
                  this.tableData = data.records;
                } else {
                  this.tableData = [];
                  this.$message.info("查询结果为空");
                }
              } else {
                this.tableData = [];
              }
            } else {
              this.tableData = [];
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            loading.close();
            if (err != 401 && err != 403) {
              this.$message.error("获取报表时发生错误");
              console.error("获取报表时发生错误", err);
            }
          });
      }
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.submitFilter("rule_filter", "1", size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.submitFilter("rule_filter", currentPage, this.pageSize);
    },
    // 下载导出
    downloadFun(command) {
      const loading = this.$loading({
        text: "下载中，请稍后...",
        customClass: "loadingSP",
        background: "rgba(255,255,255,0.8)"
      });
      if (this.adminShow == true) {
        if (command == "pdf") {
          let myObj = {
            method: "post",
            url: "/etf/notify/sms-system/export/pdf",
            fileName: "短信统计报表.pdf",
            data: this.filter
          };
          exportReport(myObj, "pdf", "", loading);
        } else if (command == "excel") {
          let myObj = {
            method: "post",
            url: "/etf/notify/sms-system/export/excel",
            fileName: "短信统计报表.xls",
            data: this.filter
          };
          exportReport(myObj, "excel", "", loading);
        }
      } else {
        if (command == "pdf") {
          let myObj = {
            method: "post",
            url: "/etf/notify/sms/export/pdf",
            fileName: "短信统计报表.pdf",
            data: this.filter
          };
          exportReport(myObj, "pdf", "", loading);
        } else if (command == "excel") {
          let myObj = {
            method: "post",
            url: "/etf/notify/sms/export/excel",
            fileName: "短信统计报表.xls",
            data: this.filter
          };
          exportReport(myObj, "excel", "", loading);
        }
      }
    },
    //获取租户列表
    getTenantListData() {
      tenantList({
        paged: false
      })
        .then(res => {
          if (res.data.code == 0) {
            this.tenantAdminArr = res.data.data;
          } else {
            this.$message.error("租户查询失败");
          }
        })
        .catch(res => {
          this.$message.error("租户查询发生错误-接口请求失败");
        });
    }
  },
  watch: {
      "filter.custDate":{
         handler(newVal, oldVal) {
            if(newVal==null){
                this.filter['startDate']=this.filter['endDate']=null;
                return
            }
            this.filter['startDate']=typeof newVal[0] == 'object'?getFormateDate(newVal[0],0):newVal[0]
            this.filter['endDate']=typeof newVal[1] == 'object'?getFormateDate(newVal[1],1):newVal[1]
        },
        immediate: true,
    }
  },
  mounted() {
    this.admin = this.$ls.get("userInfo").userLevel;
    this.tenantAdmin = this.$ls.get("userInfo").isTenantAdmin;
    this.name = this.$ls.get("userGradeName");
    if (this.admin == 0) {
      this.adminShow = true;
      this.getTenantListData();
    } else {
      this.adminShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  background: #f8f9fe;
  .filter {
    width: 270px;
    height: 100%;
    background: #ffffff;
    display: inline-block;
    float: left;
    padding-bottom: 14px;
    border-radius: 4px;
    ::v-deep .el-input__inner {
      width: 238px;
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-input__icon {
      line-height: 32px;
    }
    .filter-title {
      height: 64px;
      padding: 20px 16px 20px 16px;
      border-bottom: 1px solid #eef0f3;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 8px;
        margin-bottom: 5px;
      }
      .title {
        color: #222222;
        font-size: 16px;
        font-weight: 500;
        font-family: "SourceHanSansCN-Medium", "SourceHanSansCN";
      }
    }
    .filter-term {
      height: calc(100% - 110px);
      padding: 20px 0 0 16px;
      ::v-deep .el-form--label-top .el-form-item__label {
        padding: 0;
      }
      ::v-deep .el-form-item__label {
        line-height: 30px;
      }
      ::v-deep .el-form-item__content {
        line-height: 32px;
      }
    }
    .filter-func-btn {
      padding-top: 14px;
      box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
      width: 270px;
      height: 60px;
      float: right;
      .filter-func-btn-size {
        width: 110px;
        height: 32px;
        font-size: 12px;
        padding: 9px 15px;
        margin-left: 16px;
      }
    }
  }
  .table {
    width: calc(100% - 294px);
    height: 100%;
    background: #ffffff;
    margin-left: 24px;
    display: inline-block;
    padding: 24px 20px 14px;
    border-radius: 4px;
    .query-func-btn {
      margin-bottom: 24px;
      float: right;
      .importBtn {
        background: #fff;
        border-color: #2f87fe;
        color: #2f87fe;
      }
      // 导出列表按钮样式
      ::v-deep .el-dropdown {
        margin-left: 8px;
        .el-button {
          padding: 0;
          width: 110px;
          height: 32px;
          color: #2f87fe;
          background: #fff;
          border: 1px solid rgba(47, 135, 254, 1);
        }
        .el-button.is-disabled {
          background: #f7f7f7;
          color: #d1d1d1;
          border: 1px solid rgba(216, 216, 216, 1);
        }
        .reverse {
          transform: rotateZ(-180deg);
          transition: 0.3s;
        }
        .no-reverse {
          transform: rotateZ(0);
          transition: 0.3s;
        }
      }
    }
    .titleData {
      height: calc(100% - 56px);
      ::v-deep .el-table__empty-text {
        line-height: 30px !important;
        position: fixed;
        top: 47%;
        left: 50%;
        width: 200px;
      }
      .page {
        height: 30px;
        margin-top: 20px;
      }
      .pageLeft {
        float: left;
      }
      .pageRight {
        float: right;
      }
      .noData {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1;
        color: #999;
      }
      ::v-deep .el-table .cell {
        text-overflow: clip;
      }
    }
    ::v-deep .el-table::before {
      display: none;
    }
  }
}
</style>