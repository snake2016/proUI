<template>
  <div class="list">
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/report_error.png" alt />
        <span class="title">异常类型报表筛选</span>
      </div>
      <div class="term-title">
        <el-select v-model="reportType" @change="changeFilter(reportType)">
          <el-option label="欠费" value="0" v-has="'error_arrears'"></el-option>
          <el-option label="不用气" value="1" v-has="'error_gas'"></el-option>
          <el-option label="不上传" value="2" v-has="'error_upload'"></el-option>
          <el-option label="电量不足" value="3" v-has="'error_battery'"></el-option>
          <el-option label="掉电" value="4" v-has="'error_power'"></el-option>
          <el-option label="电磁干扰" value="5" v-has="'error_interfere'"></el-option>
          <el-option label="关阀" value="6" v-has="'error_valve'"></el-option>
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
            <!-- <el-form-item label="开始时间" prop="startDate1" :required="dateTime" v-show="noUseGas">
              <el-date-picker
                :picker-options="pickerBefore"
                type="datetime"
                v-model="filter.startDate1"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endDate1" :required="dateTime" v-show="noUseGas">
              <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                v-model="filter.endDate1"
                :picker-options="pickerAfter"
              ></el-date-picker>
            </el-form-item> -->
             <el-form-item label="时间区间" prop="custDate" :required="dateTime" v-show="noUseGas">
                <customDatePicker 
                :value="filter.custDate" 
                @change="(val)=>{ filter.custDate = val}"
                ></customDatePicker>
            </el-form-item>
            <el-form-item label="不上传天数" v-show="noUpdate" prop="day" :required="noUpdateDays">
              <el-input placeholder="不上传天数" v-model="filter.day" type="number"></el-input>
            </el-form-item>
            <el-form-item label="分公司" prop="orgCodeD" v-show="company" :required="companyShow">
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
            <el-form-item label="营业厅" prop="orgCodeB">
              <el-select v-model="filter.orgCodeB" placeholder="全部">
                <el-option label="全部" value="0"></el-option>
                <el-option
                  v-for="item in orgCodeArr"
                  :key="item.org_code"
                  :label="item.name"
                  :value="item.org_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
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
            <el-form-item label="表具类型" prop="meterType">
              <el-select v-model="filter.meterType" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(item,index) in meterTypeOptions"
                  :label="item.deviceTypeName"
                  :value="item.deviceTypeId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="阀门状态" prop="valveStatus" v-show="arrears">
              <el-select v-model="filter.valveStatus">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in valveStateDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="欠费金额" v-show="arrears" prop="amountOwed">
              <el-input placeholder="欠费金额" v-model="filter.amountOwed" type="number"></el-input>
            </el-form-item>
            <el-form-item label="区县" prop="regionCode">
              <el-select
                v-model="filter.regionCode"
                placeholder="区/县"
                filterable
                @change="getAreaDataVal(filter.regionCode)"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in region"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="小区" prop="addressAreaCode">
              <el-select v-model="filter.addressAreaCode" filterable placeholder="街道/小区/乡镇/村庄">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in street"
                  :key="item.addressAreaCode"
                  :label="item.addressAreaName"
                  :value="item.addressAreaCode"
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
            :disabled="tableData.length == 0"
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
  getRegionList,
  getAreaList,
  searchMeterTypeList,
  getSysDataList
} from "@/api/archivesAPI";
import { getTenantPlace_sys, getTenantPlace } from "@/api/loginAPI.js";
import {
  orgstrutureTree,
  orgstrutureList,
  orgstrutureList_sys,
  orgstrutureSysTree
} from "@/api/tenant.js";
import {
  exportReport,
  errorReportArrears,
  errorReportClose,
  errorReportNoUseGas,
  errorReportLowBattery,
  errorReportInterfere,
  errorReportNoNpdate,
  errorReportPowerDown
} from "@/api/reportAPI";
import { removeNullParams,getFormateDate } from "@/utils/index.js";
import customDatePicker from './customDatePicker'

export default {
  name: "report-error",
  data() {
    return {
      // city: "", //省市数据
      userTypeDD: [], //用户类型
      valveStateDD: [], //阀门状态
      reportType: "",
      reportTypeArr: [],
      noUseGas: false, //不用气类型时展示
      arrears: false, //欠费金额
      noUpdate: false, //不上传显示
      noUpdateDays: false, //不上传天数必填项
      company: false, //分公司默认隐藏
      companyShow: false, //分公司默认不必填
      dateTime: false, //时间默认不必填
      meterTypeOptions: [], //表类型列表
      currentPage: 1, //当前页
      //初始化总条数
      dataNum: 0,
      dataNum1: 0,
      pageSize: 10, //每页显示多少条
      filter: {
        // startDate1: "",
        // endDate1: "",
        billDate: "",
        userType: "",
        valveStatus: "",
        day: "",
        amountOwed: "0",
        orgCodeD: "0",
        orgCodeB: "0",
        priceId: "",
        regionCode: "",
        meterType: "",
        addressAreaCode: "",
        addressName: "",
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))],
        custDate:[]
      },
      rules_filter: {
        // startDate1: [
        //   {
        //     validator: (rule, value, callback) => {
        //       if ((value == null || value == "") && this.dateTime) {
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
        //       if ((value == null || value == "") && this.dateTime) {
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
              if ((value == null || value == "") && this.dateTime) {
                callback(new Error("请选择时间"));
                return;
              }
              callback();
            }
          }
        ],
        day: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.noUpdateDays) {
                callback(new Error("请输入不上传天数"));
                return;
              }
              let reg = /^([0]|[1-9][0-9]*)$/;
              if (!reg.test(value) && this.noUpdateDays) {
                callback(new Error("请输入正整数"));
                return;
              }
              if (value < 1 && this.noUpdateDays) {
                callback(new Error("请输入天数大于0"));
                return;
              }
              if (value.length > 10) {
                callback(new Error("最多输入10位正整数"));
                return;
              }
              callback();
            }
          }
        ],
        amountOwed: [
          {
            validator: (rule, value, callback) => {
              var n = /^\d{1,10}(\.\d{1,2})?$/;
              if (!n.test(value)) {
                callback("最多输入10位整数，2位小数");
                return;
              }
              callback();
            }
          }
        ],
        orgCodeD: [
          {
            validator: (rule, value, callback) => {
              if (
                (value == null || value == "" || value == "0") &&
                this.companyShow
              ) {
                callback(new Error("请选择分公司"));
                return;
              }
              callback();
            }
          }
        ]
      },
      region: [], //区县
      street: [], //小区
      orgArr: [], //组织机构列表
      orgCodeArrD: [], //分公司列表
      orgCodeArr: [], //营业厅列表
      orgcodeY: [], //分公司下所有营业厅列表
      orgcodeQ: "", //权限为营业厅时组织机构码
      userSubclass2: [],
      tableHeight: "calc(100% - 50px)",
      dialogFormVisible: false, //自定义列
      titleDataArrears: [
        //欠费用户报表表头
        {
          value: "archivesNo",

          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "amountOwed",
          label: "欠费金额 (元)"
        },
        {
          value: "valveStatusDesc",
          label: "阀门状态"
        }
      ],
      titleDataCloseFa: [
        //关阀用户报表表头
        {
          value: "archivesNo",
          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "meterBalanceAmount",
          label: "余额 (元)"
        },
        {
          value: "valveStatusDesc",
          label: "阀门状态"
        }
      ],
      titleDataNoUseGas: [
        //不用气用户报表表头
        {
          value: "archivesNo",
          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "unusedGasDays",
          label: "不用气天数"
        }
      ],
      titleDataPowerLow: [
        //电量不足用户报表表头
        {
          value: "archivesNo",

          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "voltage",
          label: "电压值 (V)"
        }
      ],
      titleDataInterference: [
        //电磁干扰用户报表表头
        {
          value: "archivesNo",

          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        }
      ],
      titleDataNoUpdate: [
        //不上传用户报表表头
        {
          value: "archivesNo",

          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "lastCommunicationTime",
          label: "最后通讯时间"
        },
        {
          value: "meterReading",
          label: "表底数 (m³)"
        },
      ],
      titleDataPowerDown: [
        //掉电用户报表表头
        {
          value: "archivesNo",

          label: "档案编号"
        },
        {
          value: "archivesIdentity",
          label: "档案标识"
        },
        {
          value: "userName",
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "meterNo",
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "addressName",
          label: "地址描述"
        },
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "voltage",
          label: "电压值 (V)"
        }
      ],
      titleData: [], //报表表头数据
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
    //   },
      orgStruId: "",
    };
  },
  components: {customDatePicker},
  methods: {
    // 表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    //   this.filter.startDate = "";
    //   this.filter.endDate = "";
      this.filter.custDate=[]
      this.tableData = [];
      this.orgFun(this.filter.orgCodeD);
    },
    // 系统级获取租户所在省市
    getTenantPlaceVal(c) {
      this.region = [];
      this.filter.regionCode = "";
      let tenantObj = {};
      tenantObj["tid"] = this.tenantId;
      tenantObj["code"] = c;
      getTenantPlace_sys(tenantObj)
        .then(res => {
          if (res.data.code == 0) {
            let city = res.data.data.basic;
            if (Object.keys(city).length != 0) {
              this.getRegionNameVal(city.city);
            }
          }
        })
        .catch(err => {
          this.$message.error("省市查询错误-接口请求失败");
        });
    },
    getRegionNameVal(data) {
      //市select事件
      this.region = [];
      this.street = [];
      this.filter.addressAreaCode = "";
      getRegionList({ regionCode: data })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data && res.data.data && res.data.data.records) {
              this.region = res.data.data.records;
            } else {
              this.$message.error("区查询发生错误-数据格式错误！");
            }
          } else {
            this.$message.error(`区查询数据查询失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("区查询发生错误-接口请求失败");
        });
    },
    getAreaDataVal(data) {
      //小区select事件
      this.street = [];
      if (this.filter.addressAreaCode) {
        this.filter.addressAreaCode = "";
      }
      if (data == "") {
        this.street = [];
      } else {
        // 系统级登陆
        if (this.isAdmin == 0) {
          getAreaList({
            regionCode: data,
            size: 9999,
            tenantId: this.tenantId,
            orgCode: this.filter.orgCodeD
          })
            .then(res => {
              if (res.data.code == 0) {
                if (res.data && res.data.data && res.data.data.records) {
                  this.street = res.data.data.records;
                } else {
                  this.$message.error("小区查询发生错误-数据格式错误！");
                }
              } else {
                this.$message.error(`小区查询数据查询失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("小区查询发生错误-接口请求失败");
            });
        } else {
          getAreaList({
            regionCode: data,
            size: 9999
          })
            .then(res => {
              if (res.data.code == 0) {
                if (res.data && res.data.data && res.data.data.records) {
                  this.street = res.data.data.records;
                } else {
                  this.$message.error("小区查询发生错误-数据格式错误！");
                }
              } else {
                this.$message.error(`小区查询数据查询失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("小区查询发生错误-接口请求失败");
            });
        }
      }
    },
    // 切换筛选报表条件
    changeFilter(et, implement) {
      if (et == "0") {
        this.arrears = true;
        this.noUseGas = false;
        this.noUpdate = false;
        this.noUpdateDays = false;
        this.dateTime = false;
      } else if (et == "1") {
        this.arrears = false;
        this.noUseGas = true;
        this.noUpdate = false;
        this.noUpdateDays = false;
        this.dateTime = true;
      } else if (et == "2") {
        this.arrears = false;
        this.noUseGas = false;
        this.noUpdate = true;
        this.noUpdateDays = true;
        this.dateTime = false;
      } else {
        this.arrears = false;
        this.noUseGas = false;
        this.noUpdate = false;
        this.dateTime = false;
        this.noUpdateDays = false;
      }
      this.orgFun(this.filter.orgCodeD);
      this.titleData = [];
      this.tableData = [];
      if (implement) {
        return false;
      }
      this.resetForm("rule_filter");
    },
    // 查询报表
    submitFilter(formName, reportT, page, size) {
      this.$refs[formName].validate(valid => {
        if (valid) {
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
          let orgArr = [];
          if (this.filter.orgCodeB == "0") {
            this.orgCodeArr.map(key => {
              orgArr.push(key.org_code);
            });
          } else {
            orgArr.push(this.filter.orgCodeB);
          }
          this.filter["orgCode"] = orgArr;
          this.filter["size"] = size;
          this.filter["current"] = page;
          if (this.isAdmin == 0) {
            this.filter["tenantId"] = this.tenantId;
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
          if (reportT == "0") {
            this.titleData = this.titleDataArrears;
            reqPromise = () =>
              errorReportArrears(removeNullParams(this.filter));
          } else if (reportT == "1") {
            this.titleData = this.titleDataNoUseGas;
            reqPromise = () =>
              errorReportNoUseGas(removeNullParams(this.filter));
          } else if (reportT == "2") {
            this.titleData = this.titleDataNoUpdate;
            reqPromise = () =>
              errorReportNoNpdate(removeNullParams(this.filter));
          } else if (reportT == "3") {
            this.titleData = this.titleDataPowerLow;
            reqPromise = () =>
              errorReportLowBattery(removeNullParams(this.filter));
          } else if (reportT == "4") {
            this.titleData = this.titleDataPowerDown;
            reqPromise = () =>
              errorReportPowerDown(removeNullParams(this.filter));
          } else if (reportT == "5") {
            this.titleData = this.titleDataInterference;
            reqPromise = () =>
              errorReportInterfere(removeNullParams(this.filter));
          } else if (reportT == "6") {
            this.titleData = this.titleDataCloseFa;
            reqPromise = () => errorReportClose(removeNullParams(this.filter));
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
    // 获取表类型
    getMeterTypeList() {
      searchMeterTypeList({ type: 1, tenantId: this.tenantId })
        .then(res => {
          if (res.data.code == 0) {
            let datas = res.data.data.records;
            let middleArr = datas.filter(item => {
              return item.remoteMode != 0;
            });
            this.meterTypeOptions = middleArr;
          } else {
            this.$message.error(`表类型查询失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("表类型查询失败-接口请求失败");
        });
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
              // //循环得出所有营业厅列表
              // for (let i = 0; i < this.orgArr.length; i++) {
              //   for (let j = 0; j < this.orgArr[i].children.length; j++) {
              //     this.orgCodeAll.push(
              //       this.orgArr[i].children[j].tenant_organization
              //     );
              //   }
              // }
              //   //循环拿到所有营业厅的orgcode
              //   for (let i = 0; i < this.orgCodeAll.length; i++) {
              //     this.businessAll.push(this.orgCodeAll[i].org_code);
              //   }
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
              // //循环得出所有营业厅列表
              // for (let i = 0; i < this.orgArr.length; i++) {
              //   for (let j = 0; j < this.orgArr[i].children.length; j++) {
              //     this.orgCodeAll.push(
              //       this.orgArr[i].children[j].tenant_organization
              //     );
              //   }
              // }
              //   //循环拿到所有营业厅的orgcode
              //   for (let i = 0; i < this.orgCodeAll.length; i++) {
              //     this.businessAll.push(this.orgCodeAll[i].org_code);
              //   }
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
    // 分公司联动营业厅
    orgFun(e) {
      if (e == "0") {
        if (this.isAdmin == 0) {
          this.filter.regionCode = "";
          this.region = [];
          this.filter.addressAreaCode = "";
          this.street = [];
          this.filter.orgCodeB = "0";
          this.orgCodeArr = [];
        }
      } else {
        this.filter.orgCodeB = "0";
        this.orgCodeArr = [];
        this.orgArr.map(item => {
          if (e == item.tenant_organization.org_code) {
            item.children.map(orgChildren => {
              this.orgCodeArr.push(orgChildren.tenant_organization);
            });
          }
        });
        // 获取租户下分公司的的省市
        this.getTenantPlaceVal(e);
      }
    },
    // 导出报表
    Down(e, r, d) {
      return {
        command: e,
        report: r
      };
    },
    // 下载导出导出
    downloadFun(command) {
      const loading = this.$loading({
        text: "下载中，请稍后...",
        customClass: "loadingSP",
        background: "rgba(255,255,255,0.8)"
      });
      if (command.command == "pdf" && command.report == "0") {
        let myObj = {
          method: "post",
          url: "/cpm/report/arrears/export/pdf",
          fileName: "欠费用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "0") {
        let myObj = {
          method: "post",
          url: "/cpm/report/arrears/export/excel",
          fileName: "欠费用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/cpm/report/unused-gas/export/pdf",
          fileName: "不用气用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/cpm/report/unused-gas/export/excel",
          fileName: "不用气用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/cpm/report/no-upload/export/pdf",
          fileName: "不上传用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/cpm/report/no-upload/export/excel",
          fileName: "不上传用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "3") {
        let myObj = {
          method: "post",
          url: "/cpm/report/low-battery/export/pdf",
          fileName: "电量不足用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "3") {
        let myObj = {
          method: "post",
          url: "/cpm/report/low-battery/export/excel",
          fileName: "电量不足用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "4") {
        let myObj = {
          method: "post",
          url: "/cpm/report/power-down/export/pdf",
          fileName: "掉电用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "4") {
        let myObj = {
          method: "post",
          url: "/cpm/report/power-down/export/excel",
          fileName: "掉电用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "5") {
        let myObj = {
          method: "post",
          url: "/cpm/report/interfere/export/pdf",
          fileName: "电磁干扰用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "5") {
        let myObj = {
          method: "post",
          url: "/cpm/report/interfere/export/excel",
          fileName: "电磁干扰用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "6") {
        let myObj = {
          method: "post",
          url: "/cpm/report/valve-closed/export/pdf",
          fileName: "关阀用户报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "6") {
        let myObj = {
          method: "post",
          url: "/cpm/report/valve-closed/export/excel",
          fileName: "关阀用户报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      }
    },
    // 数据字典
    dataDepement() {
      getSysDataList({
        codes: "userType,valveState"
      }).then(res => {
        if (res.data.code == 0) {
          this.userTypeDD = res.data.data.userType || []; //用户类型
          this.valveStateDD = (res.data.data.valveState || []).filter(
            val => val.sortValue !== "5"
          );
        } else {
        }
      });
    }
  },
  mounted() {
    this.dataDepement(); //数据字典查询
    let orgcodeName = this.$ls.get("userInfo");
    this.isAdmin = orgcodeName.userLevel;
    this.isTenantAdmin = orgcodeName.isTenantAdmin;
    if (this.isAdmin == 0) {
      this.company = true;
      this.companyShow = true;
      this.getOrgTemplate_sys(this.tenantId);
      this.getMeterTypeList(this.tenantId); //默认加载表类型
    } else {
      if (this.city == undefined) {
        let citys = this.$ls.get("tenantPlaceCode").city;
        this.getRegionNameVal(citys); //默认加班区县列表
      } else {
        this.getRegionNameVal(this.city); //默认加班区县列表
      }
      this.getMeterTypeList(); //默认加载表类型
      this.changeFilter("0"); //默认查询条件
      if (this.isTenantAdmin == true) {
        this.company = true;
        this.companyShow = true;
        this.getOrgTemplate();
        this.orgFun("0");
      } else {
        this.company = false;
        this.companyShow = false;
        // 营业厅列表初始化
        this.filter.orgCodeB = "0";
        this.orgCodeArr = this.$store.state.userInfo.businessHalls;
      }
    }
    // 水用户和燃气用户的筛选项显示
    if (this.tenantType == "water") {
      this.reportType = "2";
    } else {
      this.reportType = "0";
    }
    this.changeFilter(this.reportType, true);
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    city() {
      this.filter.regionCode = "";
      return this.$store.state.tenantPlaceCode.city;
    },
    tenantId() {
      return this.$store.state.sysCheckedTenant.id;
    },
    tenantType(){
      return this.$store.state.tenantType //租户类型
    }
  },
  watch: {
    userInfo(vr) {
      this.filter.orgCodeB = "0";
      this.orgCodeArr = vr.businessHalls;
    },
    city() {
      this.filter.regionCode = "";
      this.filter.orgCodeB = "0";
      this.getRegionNameVal(this.city);
    },
    tenantId() {
      // 分公司列表初始化
      this.filter.orgCodeD = "0";
      this.orgCodeArrD = [];
      this.filter.meterType = "";
      this.meterTypeOptions = [];
      // 小区初始化
      this.street = [];
      this.filter.addressAreaCode = "";
      this.getOrgTemplate_sys(this.tenantId);
      this.getMeterTypeList(this.tenantId);
      this.orgFun("0");
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