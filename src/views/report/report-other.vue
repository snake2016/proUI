<template>
  <div class="list">
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/other_report.png" alt />
        <span class="title">其他报表筛选</span>
      </div>
      <div class="term-title">
        <el-select v-model="reportType" @change="changeFilter(reportType)">
          <el-option label="开户建档" value="1" v-has="'other_open'"></el-option>
          <el-option label="抄表率" value="2" v-has="'other_reading'"></el-option>
          <el-option label="采集记录" value="3" v-has="'other_collection'"></el-option>
          <span slot="prefix" class="title-tips">报表类型:</span>
        </el-select>
      </div>
      <div class="filter-term">
        <vue-scroll :ops="ops" ref="vs">
          <el-form
            label-position="top"
            label-width="100px"
            :model="filter"
            ref="rule_filter"
            :rules="rules_filter"
          >
            <span id="a2"></span>
            <el-form-item
              label="租户"
              prop="tenantIds"
              :required="tenantRequired"
              v-show="tenantShow"
            >
              <el-select
                v-model="filter.tenantIds"
                filterable
                @change="changeTenantFun(filter.tenantIds)"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in tenantAdminArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分公司" prop="orgCodeD" :required="org" v-show="company">
              <el-select v-model="filter.orgCodeD" @change="orgFun(filter.orgCodeD)">
                <el-option label="全部" value="0"></el-option>
                <el-option
                  v-for="item in orgCodeArrD"
                  :key="item.org_code"
                  :label="item.name"
                  :value="item.org_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="采集开始时间"
              class="achiveDate"
              prop="startDate1"
              :required="collection"
              v-show="collection"
            >
              <el-date-picker
                :picker-options="pickerBefore"
                type="datetime"
                v-model="filter.startDate1"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="采集结束时间"
              class="achiveDate"
              prop="endDate1"
              :required="collection"
              v-show="collection"
            >
              <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                v-model="filter.endDate1"
                :picker-options="pickerAfter"
              ></el-date-picker>
            </el-form-item> -->
             <el-form-item label="采集时间" prop="custDate" :required="collection" v-show="collection">
                <customDatePicker 
                :value="filter.custDate" 
                @change="(val)=>{ filter.custDate = val}"
                ></customDatePicker>
            </el-form-item>
            <el-form-item label="营业厅" prop="orgCodeB" v-show="collection">
              <el-select v-model="filter.orgCodeB" placeholder="全部">
                <el-option label="全部" value="0"></el-option>
                <el-option
                  v-for="item in orgCodeArrB"
                  :key="item.org_code"
                  :label="item.name"
                  :value="item.org_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名称" v-show="collection" prop="userName">
              <el-input placeholder="用户名称" v-model="filter.userName"></el-input>
            </el-form-item>
            <el-form-item label="表具编号" v-show="collection" prop="meterNo">
              <el-input placeholder="表具编号" v-model="filter.meterNo"></el-input>
            </el-form-item>
            <el-form-item label="抄表日期" prop="meterReadingDate" :required="meterTime" v-show="readM">
              <el-date-picker
                v-model="filter.meterReadingDate"
                type="date"
                :clearable="false"
                placeholder="选择抄表日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              class="achiveDate"
              label="建档日期"
              prop="achivesDate"
              :required="achivesTime"
              v-show="openAc"
            >
              <el-date-picker
                v-model="filter.achivesDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="表类别" prop="meterCategory" v-show="readM">
              <el-select
                placeholder="表类别"
                v-model="filter.meterCategory"
                @change="changeMeter(filter.meterCategory)"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in meterCategoryDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表类型" prop="meterTypeId" v-show="meterTyS">
              <el-select v-model="filter.meterTypeId" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(item,index) in meterTypeOptions"
                  :label="item.meterTypeName"
                  :value="item.meterTypeId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表类型" prop="meterTypeId" v-show="deviceTyS">
              <el-select v-model="filter.meterTypeId" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(item,index) in meterTypeOptions"
                  :label="item.deviceTypeName"
                  :value="item.deviceTypeId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType" v-show="openAc">
              <el-select v-model="filter.userType">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in userTypeDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="filter-func-btn">
        <el-button class="filter-func-btn-size" @click="resetForm('rule_filter')">重置</el-button>
        <el-button
          type="primary"
          class="filter-func-btn-size"
          @click="submitFilter('rule_filter',reportType,'1','10')"
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
            <el-dropdown-item :command="Down('pdf',reportType)">PDF下载</el-dropdown-item>
            <el-dropdown-item :command="Down('excel',reportType)">Excel下载</el-dropdown-item>
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
            :width="item.value == 'standardFlow' || item.value == 'workingFlow' ? '155':item.value == 'standardSum' ||item.value == 'workingSum' ?'145':'' "
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
import {
  orgstrutureTree,
  orgstrutureList,
  orgstrutureList_sys,
  orgstrutureSysTree,
  tenantList
} from "@/api/tenant.js";
import { searchMeterTypeList, getSysDataList } from "@/api/archivesAPI";
import dayjs from "dayjs";
import { removeNullParams,getFormateDate } from "@/utils/index.js";
import { getMeterTypeList } from "@/api/tableInfoMaintain";
import {
  exportReport,
  otherReportOpen,
  otherReportReadMeter,
  otherReportCollection
} from "@/api/reportAPI";
import customDatePicker from './customDatePicker'

export default {
  name: "report-other",
  data() {
    return {
      userTypeDD: [], //用户类型
      meterCategoryDD: [], //表类别
      reportType: "1",
      tableHeight: "calc(100% - 50px)",
      tenantRequired: true, //租户默认必填
      readM: false, //抄表时间默认不展示
      openAc: true, //建档时间默认展示
      company: false, //分公司默认不展示
      collection: false, //采集记录查询条件默认不展示
      achivesTime: true, //建档时间默认必填
      meterTime: false, //抄表日期默认不必填
      org: false, //分公司默认不必填
      tenantShow: false, //租户默认不展示
      orgCod: "", //分公司营业员权限登陆时的orgcode
      tenantAdminArr: [], //租户列表
      meterTyS: false,
      deviceTyS: false,
      filter: {
        orgCodeD: "0",
        orgCodeB: "0",
        meterReadingDate: "",
        tenantIds: "",
        achivesDate: "",
        // startDate1: "",
        // endDate1: "",
        userName: "",
        meterNo: "",
        userType: "",
        meterCategory: "2",
        meterTypeId: "",
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))],
        custDate:[],
      },
      rules_filter: {
        tenantIds: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.tenantRequired) {
                callback(new Error("请选择租户"));
                return;
              }
              callback();
            }
          }
        ],
        orgCodeD: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "" || value == "0") && this.org) {
                callback(new Error("请选择分公司"));
                return;
              }
              callback();
            }
          }
        ],
        // startDate1: [
        //   {
        //     validator: (rule, value, callback) => {
        //       if ((value == null || value == "") && this.collection) {
        //         callback(new Error("请选择时间"));
        //         return;
        //       }
        //       callback();
        //     }
        //   }
        // ],
        // endDate1: [
        //   {
        //     validator: (rule, value, callback) => {
        //       if ((value == null || value == "") && this.collection) {
        //         callback(new Error("请选择时间"));
        //         return;
        //       }
        //       callback();
        //     }
        //   }
        // ],
         custDate: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.collection) {
                callback(new Error("请选择时间"));
                return;
              }
              callback();
            }
          }
        ],
        meterReadingDate: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.meterTime) {
                callback(new Error("请选择抄表时间"));
                return;
              }
              callback();
            }
          }
        ],
        achivesDate: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.achivesTime) {
                callback(new Error("请选择时间"));
                return;
              }
              callback();
            }
          }
        ]
      },
      orgArr: [], //组织机构列表
      orgCodeArrD: [], //分公司列表
      orgCodeArrB: [], //营业厅列表
      orgCodeArr: [], //分工下营业厅集合
      meterTypeOptions: [],
      titleData: [],
      titleDataOpen: [
        //开户建档报表表头
        {
          value: "userTypeName",
          label: "用户类型"
        },
        {
          value: "meterTypeName",
          label: "表类型"
        },
        {
          value: "archivesTime",
          label: "开户时间"
        },
        {
          value: "archivesCount",
          label: "开户数"
        }
      ],
      titleDataRead: [
        //抄表率报表表头
        {
          value: "meterCategory",
          label: "表类别"
        },
        {
          value: "meterTypeName",
          label: "表类型"
        },
        {
          value: "meterReadingTime",
          label: "抄表时间"
        },
        {
          value: "meterReadingRatePercent",
          label: "抄表率"
        },
        {
          value: "shouldMeterCount",
          label: "应抄表数量"
        },
        {
          value: "realMeterCount",
          label: "实际抄表数量"
        },
        {
          value: "lastMonthNoCount",
          label: "通讯过但近一月未通讯表数量"
        },
        {
          value: "noCommunicationCount",
          label: "从未通讯表数量"
        }
      ],
      titleDataCollection: [
        //采集记录报表表头
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "communicationTime",
          label: "采集时间"
        },
        {
          value: "dataTime",
          label: "用气时间"
        },
        {
          value: "readingNum",
          label: "表底数 (m³)"
        },
        {
          value: "standardFlow",
          label: "标况瞬时流量 (m³/h)"
        },
        {
          value: "standardSum",
          label: "标况累计流量 (m³)"
        },
        {
          value: "workingFlow",
          label: "工况瞬时流量 (m³/h)"
        },
        {
          value: "workingSum",
          label: "工况累计流量 (m³)"
        },
        {
          value: "pressure",
          label: "压力 (KPa)"
        },
        {
          value: "temperature",
          label: "温度 (℃)"
        }
      ],
      titleDataReadSys: [
        //抄表率报表表头系统级
        {
          value: "meterCategory",
          label: "表类别"
        },
        {
          value: "meterTypeName",
          label: "表类型"
        },
        {
          value: "meterReadingTime",
          label: "抄表时间"
        },
        {
          value: "meterReadingRatePercent",
          label: "抄表率"
        },
        {
          value: "tenantName",
          label: "租户名称"
        },
        {
          value: "shouldMeterCount",
          label: "应抄表数量"
        },
        {
          value: "realMeterCount",
          label: "实际抄表数量"
        },
        {
          value: "lastMonthNoCount",
          label: "通讯过但近一月未通讯表数量"
        },
        {
          value: "noCommunicationCount",
          label: "从未通讯表数量"
        }
      ],
      tableData: [],
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
    // 查询报表
    submitFilter(formName, reportT, page, size) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 开户建档时间
          if (this.filter.achivesDate) {
            this.filter["startTime"] = this.filter.achivesDate[0];
            this.filter["endTime"] = this.filter.achivesDate[1];
          }
          // 采集记录时间
        //   if (this.filter.startDate1) {
        //     let startTime = this.filter.startDate1;
        //     let endTime = this.filter.endDate1;
        //     let startDate = new Date(startTime).toJSON();
        //     // 开始时间格式化
        //     startDate = new Date(+new Date(startTime) + 8 * 3600 * 1000)
        //       .toISOString()
        //       .replace(/T/g, " ")
        //       .replace(/\.[\d]{3}Z/, "");
        //     let endDate = new Date(endTime).toJSON();
        //     // 结束时间格式化
        //     endDate = new Date(+new Date(endTime) + 8 * 3600 * 1000)
        //       .toISOString()
        //       .replace(/T/g, " ")
        //       .replace(/\.[\d]{3}Z/, "");
        //     this.filter["startDate"] = startDate;
        //     this.filter["endDate"] = endDate;
        //   }
          // 系统级租户为空时orgcode
          if (this.admin == 0 && this.filter.tenantIds == "") {
            this.filter["orgCode"] = "";
          } else {
            if (this.collection) {
              let orgArr = [];
              if (this.filter.orgCodeB == "0") {
                this.orgCodeArrB.map(key => {
                  orgArr.push(key.org_code);
                });
              } else {
                orgArr.push(this.filter.orgCodeB);
              }
              this.filter["orgCode"] = orgArr;
            } else {
              this.filter["orgCode"] = this.orgCodeArr;
            }
          }
          this.filter["size"] = size;
          this.filter["current"] = page;
          if (this.admin == 0) {
            this.filter["tenantId"] = this.filter.tenantIds;
          }
          for (let i in this.filter) {
            if (
              typeof this.filter[i] == "string" &&
              this.filter[i].constructor == String
            ) {
              this.filter[i] = this.filter[i].trim();
            }
          }
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          let reqPromise;
          if (reportT == 1) {
            this.titleData = this.titleDataOpen;
            reqPromise = () => otherReportOpen(removeNullParams(this.filter));
          } else if (reportT == 2) {
            if (this.admin == 0) {
              this.titleData = this.titleDataReadSys;
            } else {
              this.titleData = this.titleDataRead;
            }
            reqPromise = () =>
              otherReportReadMeter(removeNullParams(this.filter));
          } else if (reportT == 3) {
            this.titleData = this.titleDataCollection;
            reqPromise = () =>
              otherReportCollection(removeNullParams(this.filter));
          }
          reqPromise()
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
          this.$refs["vs"].scrollIntoView("#a2", 500);
        }
      });
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.submitFilter("rule_filter", this.reportType, "1", size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.submitFilter(
        "rule_filter",
        this.reportType,
        currentPage,
        this.pageSize
      );
    },
    // 表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.admin == 0) {
        this.orgCodeArrD = [];
        if (this.readM) {
          this.changeMeter(this.filter.meterCategory);
        } else {
          this.meterTypeOptions = [];
        }
      } else {
        if (this.readM) {
          this.changeMeter(this.filter.meterCategory);
        } else {
          this.changeMeter();
        }
      }
      this.tableData = [];
    },
    // 切换筛选报表条件
    changeFilter(et) {
      if (et == 1) {
        this.deviceTyS = true;
        this.meterTyS = false;
        this.openAc = true;
        this.readM = false;
        this.achivesTime = true;
        this.meterTime = false;
        this.collection = false;
        this.filter.meterCategory = "";
        this.filter.achivesDate = "";
        this.filter.userType = "";
        if (this.admin == 0) {
          this.tenantRequired = true;
          this.org = true;
          this.filter.orgCodeD = "0";
          this.filter.tenantIds = "";
          this.orgFun(this.filter.orgCodeD);
          this.changeTenantFun(this.filter.tenantIds);
        } else {
          this.changeMeter();
        }
        this.titleData = [];
        this.tableData = [];
        this.$nextTick(function() {
          this.$refs["rule_filter"].clearValidate();
        });
      } else if (et == 2) {
        this.deviceTyS = false;
        this.meterTyS = true;
        this.openAc = false;
        this.readM = true;
        this.meterTime = true;
        this.achivesTime = false;
        this.collection = false;
        this.filter.meterCategory = "2";
        this.filter.meterReadingDate = "";
        if (this.admin == 0) {
          this.tenantRequired = false;
          this.org = false;
          this.filter.orgCodeD = "0";
          this.filter.tenantIds = "";
          this.orgFun(this.filter.orgCodeD);
          this.changeTenantFun(this.filter.tenantIds);
        } else {
          this.changeMeter(this.filter.meterCategory);
        }
        this.titleData = [];
        this.tableData = [];
        this.$nextTick(function() {
          this.$refs["rule_filter"].clearValidate();
        });
      } else if (et == 3) {
        this.collection = true;
        this.openAc = false;
        this.readM = false;
        this.deviceTyS = true;
        this.meterTyS = false;
        this.achivesTime = false;
        this.meterTime = false;
        this.filter.userName = "";
        this.filter.meterNo = "";
        // this.filter.startDate1 = "";
        // this.filter.endDate1 = "";
        this.filter.custDate=[]
        this.filter.orgCodeB = "0";
        if (this.admin == 0) {
          this.tenantRequired = true;
          this.org = true;
          this.filter.orgCodeD = "0";
          this.filter.orgCodeB = "0";
          this.filter.tenantIds = "";
          this.orgFun(this.filter.orgCodeD);
          this.changeTenantFun(this.filter.tenantIds);
        } else {
          this.changeMeter();
        }
        this.titleData = [];
        this.tableData = [];
        this.$nextTick(function() {
          this.$refs["rule_filter"].clearValidate();
        });
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
    },
    // 切换租户
    changeTenantFun(t) {
      this.filter.orgCodeD = "0";
      this.orgCodeArrD = [];
      this.filter.meterTypeId = "";
      this.meterTypeOptions = [];
      if (t) {
        this.deviceTyS = true;
        this.meterTyS = false;
        if (this.readM) {
          this.getOrgTemplate_sys(t);
          this.changeMeter(this.filter.meterCategory);
        } else {
          this.getOrgTemplate_sys(t);
          this.changeMeter();
        }
      } else {
        this.deviceTyS = false;
        this.meterTyS = true;
        this.filter.orgCodeD = "0";
        this.orgCodeArrD = [];
        this.filter.meterTypeId = "";
        this.meterTypeOptions = [];
        if (this.readM) {
          this.changeMeter(this.filter.meterCategory);
        }
      }
    },
    // 获取表类型'
    changeMeter(m) {
      this.filter.meterTypeId = "";
      if (this.admin == 0) {
        if (this.filter.tenantIds) {
          this.deviceTyS = true;
          this.meterTyS = false;
          searchMeterTypeList({
            tenantId: this.filter.tenantIds,
            meterCategory: m,
            type: 1
          })
            .then(res => {
              if (res.data.code == 0) {
                if (this.reportType == 2 || this.reportType == 3) {
                  let datas = res.data.data.records;
                  let middleArr = datas.filter(item => {
                    return item.remoteMode != 0;
                  });
                  this.meterTypeOptions = middleArr;
                } else {
                  let datas = res.data.data.records;
                  this.meterTypeOptions = datas;
                }
              } else {
                this.$message.error(`表类型查询失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("表类型查询失败-接口请求失败");
            });
        } else {
          this.deviceTyS = false;
          this.meterTyS = true;
          getMeterTypeList({
            tenantId: this.filter.tenantIds,
            meterCategory: m,
            size: 999
          })
            .then(res => {
              if (res.data.code == 0) {
                if (this.reportType == 2 || this.reportType == 3) {
                  let datas = res.data.data.records;
                  let middleArr = datas.filter(item => {
                    return item.remoteMode != 0;
                  });
                  this.meterTypeOptions = middleArr;
                } else {
                  let datas = res.data.data.records;
                  this.meterTypeOptions = datas;
                }
              } else {
                this.$message.error(`表类型查询失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("表类型查询失败-接口请求失败");
            });
        }
      } else {
        this.deviceTyS = true;
        this.meterTyS = false;
        searchMeterTypeList({ meterCategory: m, type: 1 })
          .then(res => {
            if (res.data.code == 0) {
              if (this.reportType == 2 || this.reportType == 3) {
                let datas = res.data.data.records;
                let middleArr = datas.filter(item => {
                  return item.remoteMode != 0;
                });
                this.meterTypeOptions = middleArr;
              } else {
                let datas = res.data.data.records;
                this.meterTypeOptions = datas;
              }
            } else {
              this.$message.error(`表类型查询失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.$message.error("表类型查询失败-接口请求失败");
          });
      }
    },
    // 获取组织机构
    // 获取组织机构模板树
    getOrgTemplate() {
      orgstrutureList()
        .then(res => {
          let data = res.data.data;
          if (data.length > 0) {
            data.map(item => {
              if (item.name == "分公司") {
                this.orgStruId = item.id;
              }
            });
          }
          orgstrutureTree()
            .then(res => {
              let data1 = res.data.data;
              // 递归寻找分公司
              let faResult_orgArr = [];
              let faResult_orgCodeArrD = [];
              let fa = (arr, id) => {
                arr.map(item => {
                  if (
                    item.tenant_organization &&
                    item.tenant_organization.org_stru_id == id
                  ) {
                    faResult_orgArr.push(item);
                    faResult_orgCodeArrD.push(item.tenant_organization);
                  }
                  if (item.children && item.children.length) {
                    fa(item.children, id);
                  }
                });
              };
              fa(data1, this.orgStruId);
              this.orgArr = faResult_orgArr;
              this.orgCodeArrD = faResult_orgCodeArrD;
              this.orgFun(this.filter.orgCodeD);
            })
            .catch(err => {
              if (err != 401 && err != 403) {
                this.$message.error("获取分公司时发生错误");
                console.error("获取分公司时发生错误", err);
              }
            });
        })
        .catch(err => {
          if (err != 401 && err != 403) {
            this.$message.error("获取组织机构模板时发生错误");
            console.error("获取组织机构模板时发生错误", err);
          }
        });
    },
    // 组织机构系统级
    getOrgTemplate_sys(id) {
      orgstrutureList_sys({ tid: id })
        .then(res => {
          let data = res.data.data;
          if (data.length > 0) {
            data.map(item => {
              if (item.name == "分公司") {
                this.orgStruId = item.id;
              }
            });
          }
          orgstrutureSysTree({ tid: id })
            .then(res => {
              let data1 = res.data.data;
              // 递归寻找分公司
              let faResult_orgArr = [];
              let faResult_orgCodeArrD = [];
              let fa = (arr, id) => {
                arr.map(item => {
                  if (
                    item.tenant_organization &&
                    item.tenant_organization.org_stru_id == id
                  ) {
                    faResult_orgArr.push(item);
                    faResult_orgCodeArrD.push(item.tenant_organization);
                  }
                  if (item.children && item.children.length) {
                    fa(item.children, id);
                  }
                });
              };
              fa(data1, this.orgStruId);
              this.orgArr = faResult_orgArr;
              this.orgCodeArrD = faResult_orgCodeArrD;
              this.orgFun(this.filter.orgCodeD);
            })
            .catch(err => {
              if (err != 401 && err != 403) {
                this.$message.error("获取组织机构模板时发生错误");
                console.error("获取组织机构模板时发生错误", err);
              }
            });
        })
        .catch(err => {
          if (err != 401 && err != 403) {
            this.$message.error("获取组织机构模板时发生错误");
            console.error("获取组织机构模板时发生错误", err);
          }
        });
    },
    // 分公司变动下的营业厅
    orgFun(e) {
      let orgCodeArrs = [];
      this.orgCodeArr = [];
      this.orgCodeArrB = [];
      this.filter.orgCodeB = "0";
      this.orgArr.map(item => {
        // 切换分公司
        if (e == item.tenant_organization.org_code) {
          item.children.map(orgChildren => {
            orgCodeArrs.push(orgChildren.tenant_organization);
            this.orgCodeArrB.push(orgChildren.tenant_organization);
          });
          orgCodeArrs.map(allList => {
            this.orgCodeArr.push(allList.org_code);
          });
        } else if (e == "0") {
          // 系统级全部分公司
          if (this.admin == 0) {
            this.filter.orgCodeD = "0";
            this.orgCodeArr = [];
          } else {
            // 租户级全部分公司
            item.children.map(orgChildren => {
              orgCodeArrs.push(orgChildren.tenant_organization);
            });
            this.orgCodeArr = [];
            orgCodeArrs.map(allList => {
              this.orgCodeArr.push(allList.org_code);
            });
          }
        }
      });
    },
    // 导出报表
    Down(e, r) {
      return {
        command: e,
        report: r
      };
    },
    // 下载导出导出
    downloadFun(command) {
      const loading1 = this.$loading({
        text: "下载中，请稍后...",
        customClass: "loadingSP",
        background: "rgba(255,255,255,0.8)"
      });
      if (command.command == "pdf" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/cpm/report/open-account/export/pdf",
          fileName: "开户建档报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading1);
      } else if (command.command == "excel" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/cpm/report/open-account/export/excel",
          fileName: "开户建档报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading1);
      } else if (command.command == "pdf" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/reading/meter-reading/export/pdf",
          fileName: "抄表率报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading1);
      } else if (command.command == "excel" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/reading/meter-reading/export/excel",
          fileName: "抄表率报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading1);
      } else if (command.command == "pdf" && command.report == "3") {
        let myObj = {
          method: "post",
          url: "/etf/gas/collection/export/pdf",
          fileName: "采集记录报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading1);
      } else if (command.command == "excel" && command.report == "3") {
        let myObj = {
          method: "post",
          url: "/etf/gas/collection/export/excel",
          fileName: "采集记录报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading1);
      }
    },
    // 数据字典
    dataDepement() {
      getSysDataList({
        codes: "userType,meterCategory"
      }).then(res => {
        if (res.data.code == 0) {
          this.userTypeDD = res.data.data.userType || []; //用户类型
          // 表类别
          this.meterCategoryDD = (res.data.data.meterCategory || []).filter(
            val => val.sortValue !== "0" && val.sortValue !== "1"
          );
        }
      });
    }
  },
  mounted() {
    this.deviceTyS = true;
    this.meterTyS = false;
    this.collection = false;
    this.dataDepement(); //数据字典
    let orgcodeName = this.$ls.get("userInfo");
    this.admin = orgcodeName.userLevel;
    this.tenantAdmin = orgcodeName.isTenantAdmin;
    if (this.admin == 0) {
      this.tenantShow = true;
      this.tenantRequired = true;
      this.company = true;
      this.org = true;
      // 营业厅列表初始化
      this.filter.orgCodeB = "0";
      this.orgCodeArrB = [];
      this.getTenantListData();
    } else {
      this.tenantShow = false;
      this.tenantRequired = false;
      this.changeMeter();
      // 营业厅列表初始化
      this.filter.orgCodeB = "0";
      this.orgCodeArrB = this.$store.state.userInfo.businessHalls;
      if (this.tenantAdmin == true) {
        this.company = true;
        this.org = true;
        this.getOrgTemplate();
      } else {
        this.company = false;
        this.org = false;
        this.filter.orgCodeD = orgcodeName.orgCode;
        this.arr.map(key => {
          this.orgCodeArr.push(key.org_code);
        });
      }
    }
  },
  computed: {
    arr() {
      return this.$store.state.userInfo.businessHalls;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    arr() {
      this.orgCodeArr = [];
      this.arr.map(key => {
        this.orgCodeArr.push(key.org_code);
      });
    },
    userInfo(vr) {
      this.orgCodeArrB = vr.businessHalls;
    },
    "filter.custDate":{
        handler(newVal, oldVal) {
            this.filter['startDate']=typeof newVal[0] == 'object'?getFormateDate(newVal[0],0):newVal[0]
            this.filter['endDate']=typeof newVal[1] == 'object'?getFormateDate(newVal[1],1):newVal[1]
        },
        immediate: true,
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
    .term-title {
      width: 100%;
      height: 52px;
      padding: 10px 16px 10px 16px;
      background: #eaf3fe;
      ::v-deep .el-input__inner {
        color: #2f87fe;
      }
      ::v-deep .el-input--prefix .el-input__inner {
        padding-left: 70px;
      }
      .title-tips {
        display: inline-block;
        margin-top: 6px;
        color: #2f87fe;
      }
    }
    .filter-term {
      height: calc(100% - 162px);
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
      .achiveDate ::v-deep {
        .el-date-editor .el-range__icon {
          line-height: 24px;
        }
      }
      .achiveDate ::v-deep {
        .el-date-editor .el-range-separator {
          line-height: 26px;
        }
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
    .columnIcon {
      vertical-align: middle;
      margin-right: 8px;
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