<template>
  <div class="list">
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/report_title.png" alt />
        <span class="title">{{tenantType=='water'?'用水类型报表筛选':'用气类型报表筛选'}}</span>
      </div>
      <div class="term-title">
        <el-select v-model="reportType" @change="changeFilter(reportType,filter.countDimension)">
          <el-option label="统计" value="1"></el-option>
          <el-option label="明细" value="2"></el-option>
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
            <el-form-item label="统计维度" v-show="countDimen" prop="countDimension">
              <el-select
                v-model="filter.countDimension"
                @change="changeFilter(reportType,filter.countDimension)"
              >
                <el-option label="单价" value="1" v-has="'use_price'"></el-option>
                <el-option label="档案" value="2" v-has="'use_archives'"></el-option>
                <el-option label="区县小区" value="3" v-has="'use_region'"></el-option>
                <el-option label="档案+天" value="4" v-has="'use_day'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间类型" v-show="achives2" prop="timeType" :required="timeTypes">
              <el-select v-model="filter.timeType" @change="timeTypeFun(filter.timeType)">
                <el-option :label="tenantType=='water'?'用水时间':'用气时间'" value="1"></el-option>
                <el-option label="通讯时间" value="0"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="开始时间" prop="startDate1">
              <el-date-picker
                :picker-options="pickerBefore"
                type="datetime"
                v-model="filter.startDate1"
                placeholder="选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endDate1">
              <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                v-model="filter.endDate1"
                :picker-options="pickerAfter"
              ></el-date-picker>
            </el-form-item> -->
             <el-form-item label="时间区间" prop="custDate">
                <customDatePicker 
                :value="filter.custDate" 
                @change="(val)=>{ filter.custDate = val}"
                ></customDatePicker>
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
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in orgCodeArr"
                  :key="item.org_code"
                  :label="item.name"
                  :value="item.org_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
              <el-select v-model="filter.userType" @change="userTypeChange(filter.userType)">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in userTypeDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户子类" prop="userSubType" v-if="tenantType!=='water'">
              <el-select class="community" v-model="filter.userSubType" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in userSubclass2"
                  :key="item.sortValue"
                  :label="item.sortName"
                  :value="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名称" v-show="achives2" prop="userName">
              <el-input placeholder="用户名称" v-model="filter.userName"></el-input>
            </el-form-item>
            <el-form-item label="档案编号" v-show="achives2" prop="archivesNo">
              <el-input placeholder="档案编号" v-model="filter.archivesNo"></el-input>
            </el-form-item>
            <el-form-item label="档案标识" v-show="achives2" prop="archivesIdentity">
              <el-input placeholder="档案标识" v-model="filter.archivesIdentity"></el-input>
            </el-form-item>
            <el-form-item label="表具编号" v-show="achives2" prop="meterNo">
              <el-input placeholder="表具编号" v-model="filter.meterNo"></el-input>
            </el-form-item>
            <el-form-item label="价格名称" v-show="achives2&&tenantType!=='water'" prop="priceId">
              <el-select class="community" v-model="filter.priceId" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in priceArr"
                  :key="item.priceId"
                  :label="item.priceName"
                  :value="item.priceId"
                ></el-option>
              </el-select>
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
            <el-form-item label="详细地址" prop="addressName">
              <el-input placeholder="详细地址" v-model="filter.addressName"></el-input>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="filter-func-btn">
        <el-button
          class="filter-func-btn-size"
          @click="resetForm('rule_filter',filter.countDimension)"
        >重置</el-button>
        <el-button
          type="primary"
          class="filter-func-btn-size"
          @click="submitFilter('rule_filter',reportType,filter.countDimension,'1','10')"
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
            <el-dropdown-item :command="Down('pdf',reportType,filter.countDimension)">PDF下载</el-dropdown-item>
            <el-dropdown-item :command="Down('excel',reportType,filter.countDimension)">Excel下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          size="small"
          style="margin-left:10px;"
          v-show="column"
          @click="dialogFormVisible = true"
        >自定义列</el-button>
      </div>
      <div class="columnDialog">
        <el-dialog
          title="自定义列"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          @close="cancelColumn"
          height="355px"
          width="640px"
        >
          <div slot="title" class="header-title">
            <img class="columnIcon" src=" @/assets/imgs/temp/archives.png" />
            <span class="title-age">自定义列</span>
          </div>
          <vue-scroll :ops="ops" ref="vs">
            <div class="selectColumn">
              <span>列选择</span>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="columnCheckAll"
                class="checkAll"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="tableDetailColumn" @change="changeColumn">
              <el-checkbox
                v-for="item in titleDataDetail"
                :label="item.value"
                :key="item.value"
                :disabled="item.disable"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </vue-scroll>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="saveColumn">确 定</el-button>
            <el-button size="small" @click="cancelColumn">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="titleData">
        <div class="noData" v-if="!tableData.length">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </div>
        <el-table
          ref="table"
          :height="tableHeight"
          :data="tableData"
          class="tables"
          v-if="tableData.length"
          :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        >
          <el-table-column
            min-width="134"
            v-for="item in titleData"
            :prop="item.value"
            :label="item.label"
            :key="item.value"
            :show-overflow-tooltip="false"
            :width="item.value == 'archivesTime'||item.value == 'minDataTime'||item.value == 'minCommunicationTime'||item.value == 'maxDataTime' ||item.value == 'maxCommunicationTime' ||item.value == 'dataTime' ||item.value == 'communicationTime'  ? '170' :'' "
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
  getPricesListAll,
  getSysDataList
} from "@/api/archivesAPI";
import {
  orgstrutureTree,
  orgstrutureList,
  orgstrutureList_sys,
  orgstrutureSysTree
} from "@/api/tenant.js";
import {
  exportReport,
  gasReportPrice,
  gasReportAchives,
  gasReportRegion,
  gasReportDetail,
  gasReportAchivesDay
} from "@/api/reportAPI";
import { getTenantPlace_sys } from "@/api/loginAPI.js";
import { removeNullParams,getFormateDate } from "@/utils/index.js";
import customDatePicker from './customDatePicker'

export default {
  name: "report-useGas",
  data() {
    return {
      userTypeDD: [], //用户类型
      // city: "", //省市数据
      reportType: "1",
      countDimen: true, //统计维度默认展示
      achives2: false, //统计维度=档案时或报表类型为明细时展示
      company: false, //分公司默认隐藏
      companyShow: false, //分公司默认不必填
      timeTypes: false, //用气类型默认不必填
      column: false, //自定义列默认隐藏
      currentPage: 1, //当前页
      //初始化总条数
      dataNum: 0,
      dataNum1: 0,
      pageSize: 10, //每页显示多少条
      filter: {
        countDimension: "1",
        timeDimension: "",
        timeType: "",
        // startDate1: "",
        // endDate1: "",
        userType: "",
        userSubType: "",
        userName: "",
        archivesNo: "",
        archivesIdentity: "",
        meterNo: "",
        orgCodeD: "0",
        orgCodeB: "",
        priceId: "",
        regionCode: "",
        addressAreaCode: "",
        addressName: "",
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))],
        custDate:[],
      },
      rules_filter: {
        countDimension: [
          {
            required: true,
            message: "请选择统计维度",
            trigger: "change"
          }
        ],
        timeType: [
          {
            validator: (rule, value, callback) => {
              if ((value == null || value == "") && this.timeTypes) {
                callback(new Error("请选择时间类型"));
                return;
              }
              callback();
            }
          }
        ],
        // startDate1: [
        //   {
        //     required: true,
        //     message: "请选择时间",
        //     trigger: "change"
        //   }
        // ],
        // endDate1: [
        //   {
        //     required: true,
        //     message: "请选择时间",
        //     trigger: "change"
        //   }
        // ],
        custDate:[
            {
                required: true,
                message: "请选择时间",
                trigger: "change"
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
      priceArr: [], //价格列表
      orgArr: [], //组织机构列表
      orgCodeArrD: [], //分公司列表
      orgCodeArr: [], //营业厅列表
      orgcodeY: [], //分公司下所有营业厅列表
      userSubclass2: [],

      tableHeight: "calc(100% - 50px)",
      dialogFormVisible: false, //自定义列
      titleDataPrice: [
        //单价统计报表表头
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "userSubTypeDesc",
          label: "用户子类"
        },
        {
          value: "userCount",
          label: "用户数"
        },
        {
          value: "usePrice",
          label: "单价 (元/m³)"
        },
        {
          value: "sumAmount",
          label: "用气量 (m³)"
        },
        {
          value: "sumAmt",
          label: "用气金额 (元)"
        }
      ],
      titleDataAchives2: [],
      titleDataAchives: [
        //档案统计报表表头
        {
          value: "archivesNo",
          label: "档案编号",
          gas: true,
          water: true
        },
        {
          value: "userName",
          label: "用户名称",
          gas: true,
          water: true
        },
        {
          value: "userTypeDesc",
          label: "用户类型",
          gas: true,
          water: true
        },
        {
          value: "userSubTypeDesc",
          label: "用户子类",
          gas: true,
          water: false
        },
        {
          value: "meterNo",
          label: "表具编号",
          gas: true,
          water: true
        },
        {
          value: "regionName",
          label: "区县",
          gas: true,
          water: true
        },
        {
          value: "addressAreaName",
          label: "小区",
          gas: true,
          water: true
        },
        {
          value: "addressName",
          label: "表具地址",
          gas: true,
          water: true
        },
        {
          value: "certificateNo",
          label: "身份证号",
          gas: true,
          water: false
        },
        {
          value: "contactPhone",
          label: "手机号码",
          gas: true,
          water: false
        },
        {
          value: "archivesTime",
          label: "开户时间",
          gas: true,
          water: true
        },
        {
          value: "usePrice",
          label: "单价 (元/m³)",
          gas: true,
          water: false
        },
        {
          value: "sumAmount",
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "sumAmount",
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "sumAmt",
          label: "用气金额 (元)",
          gas: true,
          water: false
        },
        {
          value: "minReadingNum",
          label: "起方 (m³)",
          gas: true,
          water: true
        },
        {
          value: "minDataTime",
          v: 1,
          label: "起方时间",
          gas: true,
          water: true
        },
        {
          value: "minCommunicationTime",
          v: 2,
          label: "起方时间",
          gas: true,
          water: true
        },
        {
          value: "maxReadingNum",
          label: "止方 (m³)",
          gas: true,
          water: true
        },
        {
          value: "maxDataTime",
          v: 1,
          label: "止方时间",
          gas: true,
          water: true
        },
        {
          value: "maxCommunicationTime",
          v: 2,
          label: "止方时间",
          gas: true,
          water: true
        }
      ],
      titleDataRegion: [
        //小区统计报表表头
        {
          value: "regionName",
          label: "区县",
          gas: true,
          water: true
        },
        {
          value: "addressAreaName",
          label: "小区",
          gas: true,
          water: true
        },
        {
          value: "userTypeDesc",
          label: "用户类型",
          gas: true,
          water: true
        },
        {
          value: "userSubTypeDesc",
          label: "用户子类",
          gas: true,
          water: false
        },
        {
          value: "userCount",
          label: "用户数",
          gas: true,
          water: true
        },
        {
          value: "sumAmount",
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "sumAmount",
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "realUserCount",
          label: "实际用气户数",
          gas: true,
          water: false
        },
        {
          value: "realUserCount",
          label: "实际用水户数",
          gas: false,
          water: true
        },
        {
          value: "usePercentString",
          label: "使用率",
          gas: true,
          water: true
        },
        {
          value: "sumAmt",
          label: "用气金额 (元)",
          gas: true,
          water: false
        },
        {
          value: "avgAmount",
          label: "户均使用气量 (m³/户)",
          gas: true,
          water: false
        },
        {
          value: "avgAmount",
          label: "户均使用水量 (m³/户)",
          gas: false,
          water: true
        },
        {
          value: "communicationUserCount",
          label: "通讯户数",
          gas: true,
          water: true
        },
        {
          value: "communicationPercentString",
          label: "通讯率",
          gas: true,
          water: true
        }
      ],
      titleAchivesDay: [
        // 档案+天的表头数据
        {
          value: "archivesNo",
          label: "档案编号",
          gas: true,
          water: true
        },
        {
          value: "userName",
          label: "用户名称",
          gas: true,
          water: true
        },
        {
          value: "userTypeDesc",
          label: "用户类型",
          gas: true,
          water: true
        },
        {
          value: "userSubTypeDesc",
          label: "用户子类",
          gas: true,
          water: false
        },
        {
          value: "meterNo",
          label: "表具编号",
          gas: true,
          water: true
        },
        {
          value: "regionName",
          label: "区县",
          gas: true,
          water: true
        },
        {
          value: "addressAreaName",
          label: "小区",
          gas: true,
          water: true
        },
        {
          value: "addressName",
          label: "表具地址",
          gas: true,
          water: true
        },
        {
          value: "archivesTime",
          label: "开户时间",
          gas: true,
          water: true
        },
        {
          value: "dataTime",
          label: "用气日期",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          label: "用水日期",
          gas: false,
          water: true
        },
        {
          value: "usePrice",
          label: "单价 (元/m³)",
          gas: true,
          water: false
        },
        {
          value: "sumAmount",
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "sumAmount",
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "sumAmt",
          label: "用气金额 (元)",
          gas: true,
          water: false
        }
      ],
      checkAll: false, //全选
      isIndeterminate: true,
      columnObj: {}, // 将所有表头变换格式
      titleColumn: [], // 保存后的表头数据
      titleData: [], //报表表头数据
      // 默认展示列
      titleDataD: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号",
          gas: true,
          water: true
        },
        {
          value: "archivesIdentity",
          disable: true,
          label: "档案标识",
          gas: false,
          water: true
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称",
          gas: true,
          water: true
        },
        {
          value: "meterNo",
          disable: false,
          label: "表具编号",
          gas: true,
          water: false
        },
        {
          value: "useAmount",
          disable: true,
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "useAmount",
          disable: true,
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "useAmt",
          disable: true,
          label: "用气金额 (元)",
          gas: true,
          water: false
        },
        {
          value: "meterBalanceAmount",
          disable: true,
          label: "余额 (元)",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用气时间",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用水时间",
          gas: false,
          water: true
        },
        {
          value: "communicationTime",
          disable: true,
          label: "通讯时间",
          gas: true,
          water: true
        },
        {
          value: "addressName",
          disable: false,
          label: "表具地址",
          gas: false,
          water: true
        },
        {
          value: "readingNum",
          disable: false,
          label: "表底数 (m³)",
          gas: false,
          water: true
        }
      ],
      //明细最终报表表头(存档一份不变化的数据用来判断是否需要覆盖缓存)
      titleDataDCopy: [],
      // 默认展示表头的列数据名
      tableDetailColumn: [],
      tableDetailColumnGas: [
        "archivesNo",
        "userName",
        "meterNo",
        "useAmount",
        "useAmt",
        "meterBalanceAmount",
        "dataTime",
        "communicationTime"
      ], //燃气-默认展示表头
      tableDetailColumnWater: [
        "archivesNo",
        "archivesIdentity",
        "userName",
        "useAmount",
        "dataTime",
        "communicationTime",
        "addressName",
        "readingNum"
      ], //水务-默认展示表头
      /*
      明细报表表头（全部自定义列）
      gas-燃气用户是否显示
      water-水用户是否显示
      */
      titleDataDetail: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号",
          gas: true,
          water: true
        },
        {
          value: "archivesIdentity",
          disable: true,
          label: "档案标识",
          gas: false,
          water: true
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称",
          gas: true,
          water: true
        },
        {
          value: "userTypeDesc",
          disable: false,
          label: "用户类型",
          gas: true,
          water: true
        },
        {
          value: "userSubTypeDesc",
          disable: false,
          label: "用户子类",
          gas: true,
          water: false
        },
        {
          value: "meterNo",
          disable: false,
          label: "表具编号",
          gas: true,
          water: true
        },
        {
          value: "regionName",
          disable: false,
          label: "区县",
          gas: true,
          water: true
        },
        {
          value: "addressAreaName",
          disable: false,
          label: "小区",
          gas: true,
          water: true
        },
        {
          value: "addressName",
          disable: false,
          label: "表具地址",
          gas: true,
          water: true
        },
        {
          value: "usePrice",
          disable: false,
          label: "单价 (元/m³)",
          gas: true,
          water: false
        },
        {
          value: "readingNum",
          disable: false,
          label: "表底数 (m³)",
          gas: true,
          water: true
        },
        {
          value: "useAmount",
          disable: true,
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "useAmount",
          disable: true,
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "useAmt",
          disable: true,
          label: "用气金额 (元)",
          gas: true,
          water: false
        },
        {
          value: "meterBalanceAmount",
          disable: true,
          label: "余额 (元)",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用气时间",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用水时间",
          gas: false,
          water: true
        },
        {
          value: "communicationTime",
          disable: true,
          label: "通讯时间",
          gas: true,
          water: true
        },
        {
          value: "certificateNo",
          disable: false,
          label: "身份证号",
          gas: true,
          water: true
        },
        {
          value: "contactPhone",
          disable: false,
          label: "手机号码",
          gas: true,
          water: true
        }
      ],
      // 不可取消表头（固定列）
      noDisColumn: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号",
          gas: true,
          water: true
        },
        {
          value: "archivesIdentity",
          disable: true,
          label: "档案标识",
          gas: false,
          water: true
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称",
          gas: true,
          water: true
        },
        {
          value: "useAmount",
          disable: true,
          label: "用气量 (m³)",
          gas: true,
          water: false
        },
        {
          value: "useAmount",
          disable: true,
          label: "用水量 (m³)",
          gas: false,
          water: true
        },
        {
          value: "useAmt",
          disable: true,
          label: "用气金额 (元)",
          gas: true,
          water: false
        },
        {
          value: "meterBalanceAmount",
          disable: true,
          label: "余额 (元)",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用气时间",
          gas: true,
          water: false
        },
        {
          value: "dataTime",
          disable: true,
          label: "用水时间",
          gas: false,
          water: true
        },
        {
          value: "communicationTime",
          disable: true,
          label: "通讯时间",
          gas: true,
          water: true
        }
      ],
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
    // 自定义表头方法
    tColumns() {
      let arr = [];
      this.titleColumn = JSON.parse(
        window.localStorage.getItem("titleColumnReport")
      );
      let defaultColumn = JSON.parse(
        window.localStorage.getItem("titleColumnDefault")
      );
      // 判断local中的表头是否和代码相同，后续添加需要重新存local
      let str1 = JSON.stringify(defaultColumn); //缓存中的默认表头
      let str2 = JSON.stringify(this.titleDataDCopy); //代码中的默认表头（不可变）
      if (this.titleColumn && str1 == str2) {
        this.titleDataD = this.titleColumn;
        for (let i = 0; i < this.titleColumn.length; i++) {
          arr.push(this.titleColumn[i].value);
        }
        this.tableDetailColumn = arr;
        let checkedCount = this.titleColumn.length;
        this.checkAll = checkedCount === this.titleDataDetail.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.titleDataDetail.length;
      } else {
        window.localStorage.setItem(
          "titleColumnReport",
          JSON.stringify(this.titleDataD)
        );
        window.localStorage.setItem(
          "titleColumnDefault",
          JSON.stringify(this.titleDataDCopy)
        );
      }
    },
    // 改变自定义表头方法
    changeColumn(value) {
      let checkedCount = value.length;
      let t = [];
      value.forEach(v => {
        t.push({
          label: this.columnObj[v],
          value: v
        });
      });
      this.checkAll = checkedCount === this.titleDataDetail.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.titleDataDetail.length;
      this.titleColumn = t;
    },
    // 全选自定义表头
    columnCheckAll(val) {
      let arr = [];
      if (val) {
        this.titleColumn = this.titleDataDetail;
        for (let i = 0; i < this.titleColumn.length; i++) {
          arr.push(this.titleColumn[i].value);
        }
        this.tableDetailColumn = arr;
      } else {
        this.titleColumn = this.noDisColumn;
        let arr=[];
        this.noDisColumn.map(item=>{
          arr.push(item.value)
        })
        this.tableDetailColumn = arr;
      }
      this.isIndeterminate = false;
    },
    // 保存表头弹窗
    saveColumn() {
      if (this.titleColumn.length == "0") {
        this.titleColumn = this.titleDataD;
        this.dialogFormVisible = false;
        this.submitFilter(
          "rule_filter",
          this.reportType,
          this.filter.countDimension,
          this.currentPage,
          this.pageSize
        );
      } else {
        this.titleDataD = this.titleColumn;
        this.dialogFormVisible = false;
        this.submitFilter(
          "rule_filter",
          this.reportType,
          this.filter.countDimension,
          this.currentPage,
          this.pageSize
        );
      }
      window.localStorage.setItem(
        "titleColumnReport",
        JSON.stringify(this.titleDataD)
      );
      if (this.titleData.length > 0) {
        this.$nextTick(() => {
          this.$refs["table"].doLayout();
        });
      }
    },
    // 取消表头选择
    cancelColumn() {
      this.tColumns();
      this.dialogFormVisible = false;
    },
    // 表单重置方法
    resetForm(formName, c) {
      this.$refs[formName].resetFields();
      this.filter.countDimension = c;
      this.userSubclass2 = [];
      this.orgFun(this.filter.orgCodeD);
      this.tableData = [];
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
        if (this.admin == 0) {
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
    //获取价格列表
    getPricesListData(e) {
      if (e) {
        getPricesListAll({ tenantId: this.tenantId, orgCode: e })
          .then(res => {
            if (res.data.code == 0) {
              this.priceArr = res.data.data.records;
            } else {
              this.$message.error("价格查询失败");
            }
          })
          .catch(res => {
            this.$message.error("价格查询发生错误-接口请求失败");
          });
      } else {
        getPricesListAll()
          .then(res => {
            if (res.data.code == 0) {
              this.priceArr = res.data.data.records;
            } else {
              this.$message.error("价格查询失败");
            }
          })
          .catch(res => {
            this.$message.error("价格查询发生错误-接口请求失败");
          });
      }
    },
    // 用户子类联动
    userTypeChange(val) {
      this.filter.userSubType = "";
      if (val == "1") {
        getSysDataList({
          codes: "business"
        })
          .then(res => {
            if (res.data.code == 0) {
              this.userSubclass2 = res.data.data.business || [];
            } else {
              this.userSubclass2 = [];
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else if (val == "2") {
        getSysDataList({
          codes: "resident"
        })
          .then(res => {
            if (res.data.code == 0) {
              this.userSubclass2 = res.data.data.resident || [];
            } else {
              this.userSubclass2 = [];
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        this.userSubclass2 = [];
      }
    },
    // 切换筛选报表条件
    changeFilter(et, cd) {
      // achives2 -时间类型
      // countDimen -统计维度
      if ((et == 1 && cd == 2) || (et == 1 && cd == 4) || et == 2) {
        this.achives2 = true;
        this.timeTypes = true;
        if (et == 2) {
          if (this.tenantType === "water") {
            this.filter.countDimension = "2";
          } else {
            this.filter.countDimension = "1";
          }
          this.column = true;
          this.countDimen = false;
        } else {
          this.column = false;
          this.countDimen = true;
        }
      } else {
        this.achives2 = false;
        this.timeTypes = false;
        this.column = false;
        this.countDimen = true;
      }
      this.userSubclass2 = [];
      this.street = [];
      this.titleData = [];
      this.tableData = [];
    //   this.filter.startDate1 = "";
    //   this.filter.endDate1 = "";
      this.filter.custDate=[]
      this.filter.billDate = "";
      this.filter.orgCodeD = "0";
      this.filter.orgCodeB = "";
      this.filter.userType = "";
      this.filter.userSubType = "";
      this.filter.userName = "";
      this.filter.archivesIdentity = "";
      this.filter.archivesNo = "";
      this.filter.meterNo = "";
      this.filter.priceId = "";
      this.filter.regionCode = "";
      this.filter.addressAreaCode = "";
      this.filter.addressName = "";
      this.filter.timeType = "";
      this.orgFun(this.filter.orgCodeD);
      this.$nextTick(function() {
        this.$refs["rule_filter"].clearValidate();
      });
    },
    // 切换用气类型
    timeTypeFun(e) {
      if (e == 1) {
        this.titleDataAchives2 = this.titleDataAchives.filter(function(item) {
          return item.v != 2;
        });
      } else {
        this.titleDataAchives2 = this.titleDataAchives.filter(function(item) {
          return item.v != 1;
        });
      }
    },
    // 查询报表
    submitFilter(formName, reportT, cDimension, page, size) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        //   let startTime = this.filter.startDate1;
        //   let endTime = this.filter.endDate1;
        //   let startDate = new Date(startTime).toJSON();
        //   // 开始时间格式化
        //   startDate = new Date(+new Date(startTime) + 8 * 3600 * 1000)
        //     .toISOString()
        //     .replace(/T/g, " ")
        //     .replace(/\.[\d]{3}Z/, "");
        //   let endDate = new Date(endTime).toJSON();
        //   // 结束时间格式化
        //   endDate = new Date(+new Date(endTime) + 8 * 3600 * 1000)
        //     .toISOString()
        //     .replace(/T/g, " ")
        //     .replace(/\.[\d]{3}Z/, "");
          let orgArr = [];
          if (this.filter.orgCodeB) {
            orgArr.push(this.filter.orgCodeB);
          } else {
            this.orgCodeArr.map(key => {
              orgArr.push(key.org_code);
            });
          }
          this.filter["orgCode"] = orgArr;
        //   this.filter["startDate"] = startDate;
        //   this.filter["endDate"] = endDate;
          this.filter["size"] = size;
          this.filter["current"] = page;
          if (this.admin == 0) {
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
          if (reportT == 1 && cDimension == 1) {
            this.titleData = this.titleDataPrice;
            reqPromise = () => gasReportPrice(removeNullParams(this.filter));
          } else if (reportT == 1 && cDimension == 2) {
            this.titleData = this.titleDataAchives2;
            reqPromise = () => gasReportAchives(removeNullParams(this.filter));
          } else if (reportT == 1 && cDimension == 3) {
            this.titleData = this.titleDataRegion;
            reqPromise = () => gasReportRegion(removeNullParams(this.filter));
          } else if (reportT == 1 && cDimension == 4) {
            // 档案+天
            this.titleData = this.titleAchivesDay;
            reqPromise = () =>
              gasReportAchivesDay(removeNullParams(this.filter));
          } else if (reportT == 2) {
            if (this.titleDataD.length != 0) {
              this.titleData = this.titleDataD;
              let customColumn = [];
              this.titleData.forEach(v => {
                customColumn.push(v.value);
              });
              this.filter["customColumn"] = customColumn;
              reqPromise = () => gasReportDetail(removeNullParams(this.filter));
            } else {
              loading.close();
              this.tableData = [];
            }
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
      this.submitFilter(
        "rule_filter",
        this.reportType,
        this.filter.countDimension,
        "1",
        size
      );
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.submitFilter(
        "rule_filter",
        this.reportType,
        this.filter.countDimension,
        currentPage,
        this.pageSize
      );
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
        if (this.admin == 0) {
          this.filter.regionCode = "";
          this.region = [];
          this.filter.addressAreaCode = "";
          this.street = [];
          this.filter.orgCodeB = "";
          this.orgCodeArr = [];
          this.filter.priceId = "";
          this.priceArr = [];
        }
      } else {
        this.filter.orgCodeB = "";
        this.orgCodeArr = [];
        this.filter.priceId = "";
        this.priceArr = [];
        this.orgArr.map(item => {
          if (e == item.tenant_organization.org_code) {
            item.children.map(orgChildren => {
              this.orgCodeArr.push(orgChildren.tenant_organization);
            });
          }
        });
        // 获取租户下分公司的的省市
        this.getTenantPlaceVal(e);
        // 获取租户下分公司的价格
        this.getPricesListData(e);
      }
    },
    // 导出报表
    Down(e, r, d) {
      return {
        command: e,
        report: r,
        dimension: d
      };
    },
    // 下载导出导出
    downloadFun(command) {
      let reportTitle;
      if (this.tenantType == "water") {
        reportTitle = "用水";
      } else {
        reportTitle = "用气";
      }
      const loading = this.$loading({
        text: "下载中，请稍后...",
        customClass: "loadingSP",
        background: "rgba(255,255,255,0.8)"
      });
      if (
        command.command == "pdf" &&
        command.report == "1" &&
        command.dimension == "1"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/price/export/pdf",
          fileName: `${reportTitle}统计报表-单价.pdf`,
          data: this.filter
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (
        command.command == "excel" &&
        command.report == "1" &&
        command.dimension == "1"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/price/export/excel",
          fileName: `${reportTitle}统计报表-单价.xls`,
          data: this.filter
        };
        exportReport(myObj, "excel", "", loading);
      } else if (
        command.command == "pdf" &&
        command.report == "1" &&
        command.dimension == "2"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/archives/export/pdf",
          fileName: `${reportTitle}统计报表-档案.pdf`,
          data: this.filter
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (
        command.command == "excel" &&
        command.report == "1" &&
        command.dimension == "2"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/archives/export/excel",
          fileName: `${reportTitle}统计报表-档案.xls`,
          data: this.filter
        };
        exportReport(myObj, "excel", "", loading);
      } else if (
        command.command == "pdf" &&
        command.report == "1" &&
        command.dimension == "3"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/region/export/pdf",
          fileName: `${reportTitle}统计报表-区县小区.pdf`,
          data: this.filter
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (
        command.command == "excel" &&
        command.report == "1" &&
        command.dimension == "3"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/region/export/excel",
          fileName: `${reportTitle}统计报表-区县小区.xls`,
          data: this.filter
        };
        exportReport(myObj, "excel", "", loading);
      } else if (
        command.command == "pdf" &&
        command.report == "1" &&
        command.dimension == "4"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/archives-day/export/pdf",
          fileName: `${reportTitle}统计报表-档案+天.pdf`,
          data: this.filter
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (
        command.command == "excel" &&
        command.report == "1" &&
        command.dimension == "4"
      ) {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/archives-day/export/excel",
          fileName: `${reportTitle}统计报表-档案+天.xls`,
          data: this.filter
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/detail/export/pdf",
          fileName: `${reportTitle}量明细报表.pdf`,
          data: this.filter
        };
        // , { baseURL: "/reportP/" }
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/gas/usage-quantity/detail/export/excel",
          fileName: `${reportTitle}量明细报表.xls`,
          data: this.filter
        };
        exportReport(myObj, "excel", "", loading);
      }
    },
    // 数据字典
    dataDepement() {
      getSysDataList({
        codes: "userType"
      }).then(res => {
        if (res.data.code == 0) {
          this.userTypeDD = res.data.data.userType || []; //用户类型
        }
      });
    }
  },
  mounted() {
    this.dataDepement(); //数据字典
    let orgcodeName = this.$ls.get("userInfo");
    this.admin = orgcodeName.userLevel;
    if (this.admin == 0) {
      this.company = true;
      this.companyShow = true;
      this.getOrgTemplate_sys(this.tenantId);
      this.orgFun("0");
    } else {
      this.company = false;
      this.companyShow = false;
      this.orgCodeArr = this.$store.state.userInfo.businessHalls;
      if (this.city == undefined) {
        let citys = this.$ls.get("tenantPlaceCode").city;
        this.getRegionNameVal(citys); //默认加班区县列表
      } else {
        this.getRegionNameVal(this.city); //默认加班区县列表
      }
      this.getPricesListData(); //默认加载价格列表
    }
    if (this.tenantType == "water") {
      function filterWater(arr) {
        let newArr = arr.filter(item => {
          return item.water == true;
        });
        return newArr;
      }
      // 水用户的特殊处理(水的表头)
      this.filter.countDimension = "2";
      this.titleDataDetail = filterWater(this.titleDataDetail);
      this.titleDataD = filterWater(this.titleDataD);
      this.titleDataDCopy = this.titleDataD;
      this.tableDetailColumn = this.tableDetailColumnWater;
      this.noDisColumn = filterWater(this.noDisColumn);
      this.titleDataAchives = filterWater(this.titleDataAchives);
      this.titleAchivesDay = filterWater(this.titleAchivesDay);
      this.titleDataRegion = filterWater(this.titleDataRegion);
    } else {
      function filterGas(arr) {
        let newArr = arr.filter(item => {
          return item.gas == true;
        });
        return newArr;
      }
      this.filter.countDimension = "1";
      this.titleDataDetail = filterGas(this.titleDataDetail);
      this.titleDataD = filterGas(this.titleDataD);
      this.titleDataDCopy = this.titleDataD;
      this.tableDetailColumn = this.tableDetailColumnGas;
      this.noDisColumn = filterGas(this.noDisColumn);
      this.titleDataAchives = filterGas(this.titleDataAchives);
      this.titleAchivesDay = filterGas(this.titleAchivesDay);
      this.titleDataRegion = filterGas(this.titleDataRegion);
    }
    this.changeFilter(this.reportType, this.filter.countDimension);
    // 改变所有表头数据的格式
    this.columnObj = {};
    this.titleDataDetail.forEach(v => {
      this.columnObj[v.value] = v.label;
    });
    this.tColumns();
  },
  computed: {
    tenantId() {
      return this.$store.state.sysCheckedTenant.id;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    city() {
      this.filter.regionCode = "";
      return this.$store.state.tenantPlaceCode.city;
    },
    tenantType(){
      return this.$store.state.tenantType //租户类型
    }
  },
  watch: {
    tenantId() {
      // 营业厅列表初始化
      this.filter.orgCodeD = "0";
      this.orgCodeArrD = [];
      // 小区初始化
      this.street = [];
      this.filter.addressAreaCode = "";
      this.getOrgTemplate_sys(this.tenantId);
      this.orgFun("0");
    },
    userInfo(vr) {
      this.filter.orgCodeB = "";
      this.orgCodeArr = vr.businessHalls;
    },
    city() {
      this.getRegionNameVal(this.city);
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
    .columnDialog {
      ::v-deep .el-checkbox {
        width: 19%;
        margin-bottom: 22px;
      }
      .selectColumn {
        margin-bottom: 24px;
        color: #ababab;
        .checkAll {
          width: auto;
          float: right;
          margin-bottom: 0;
          margin-right: 40px;
        }
      }
      ::v-deep .el-dialog {
        height: 355px;
      }
      ::v-deep .el-dialog__body {
        height: calc(100% - 110px);
        padding: 24px 5px 10px 40px;
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