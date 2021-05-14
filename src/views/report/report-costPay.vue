<template>
  <div class="list">
    <div class="filter">
      <div class="filter-title">
        <img src="@/assets/imgs/report/report_costpay.png" alt />
        <span class="title">收费类型报表筛选</span>
      </div>
      <div class="term-title">
        <el-select v-model="reportType" @change="changeFilter(reportType,filter.sType)">
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
            <el-form-item label="统计维度" v-show="countDimen" prop="sType">
              <el-select v-model="filter.sType" @change="changeFilter(reportType,filter.sType)">
                <el-option label="营业厅" value="0"></el-option>
                <el-option label="营业员" value="1"></el-option>
                <el-option label="区县小区" value="2"></el-option>
                <el-option label="用户渠道" value="3"></el-option>
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
            <el-form-item label="营业厅" prop="orgCodeB" v-show="businessShow">
              <el-select
                v-model="filter.orgCodeB"
                placeholder="全部"
                @change="changeOrgName(filter.orgCodeB)"
              >
                <el-option label="全部" value="0"></el-option>
                <el-option
                  v-for="item in orgCodeArr"
                  :key="item.org_code"
                  :label="item.name"
                  :value="item.org_code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业员" prop="staffId" v-show="staffShow">
              <el-select v-model="filter.staffId" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in orgNameArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
            <el-form-item label="用户名称" v-show="achives2" prop="userName">
              <el-input placeholder="用户名称" v-model="filter.userName"></el-input>
            </el-form-item>
            <el-form-item label="档案编号" v-show="achives2" prop="archivesNo">
              <el-input placeholder="档案编号" v-model="filter.archivesNo"></el-input>
            </el-form-item>
            <el-form-item label="档案标识" v-show="achives2" prop="archivesIdentity">
              <el-input placeholder="档案标识" v-model="filter.archivesIdentity"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" v-show="achives2" prop="contactPhone">
              <el-input placeholder="手机号码" v-model="filter.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="表具编号" v-show="achives2" prop="meterNo">
              <el-input placeholder="表具编号" v-model="filter.meterNo"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="payMode">
              <el-select v-model="filter.payMode" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in payModeDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费渠道" v-show="achives2" prop="payChannel">
              <el-select v-model="filter.payChannel" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in payChannelDD"
                  :key="item.sortValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用类型" v-show="achives2" prop="costOperationType">
              <el-select v-model="filter.costOperationType" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.sortName"
                  :value="item.sortValue"
                  v-for="item in costOperationTypeDD"
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
                <el-option value label="全部"></el-option>
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
        <el-button class="filter-func-btn-size" @click="resetForm('rule_filter',filter.sType)">重置</el-button>
        <el-button
          type="primary"
          class="filter-func-btn-size"
          @click="submitFilter('rule_filter',reportType,filter.sType,'1','10')"
        >筛选</el-button>
      </div>
    </div>
    <div class="table">
      <div class="query-func-btn">
        <div class="queryDate" v-if="tableData.length">
          <span>数据更新时间：</span>
          <span>{{lastUpdateTime}}</span>
        </div>
        <div class="queryBtn">
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
          <el-button
            size="small"
            style="margin-left:10px;"
            v-show="column"
            @click="dialogFormVisible = true"
          >自定义列</el-button>
        </div>
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
            :width="item.value == 'modifyTime' ? '170' :'' "
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
  getMeterTypeList,
  getSysDataList
} from "@/api/archivesAPI";
import { orgstrutureList_sys, orgstrutureList,orgstrutureTree,orgstrutureSysTree } from "@/api/tenant.js";
import {
  exportReport,
  gasReportPrice,
  gasReportAchives,
  gasReportRegion,
  gasReportDetail,
  getStaffList,
  gasReportCost,
  gasReportCostDetail
} from "@/api/reportAPI";
import { getTenantPlace_sys,getTenantPlace } from "@/api/loginAPI.js";
import { removeNullParams,getFormateDate } from "@/utils/index.js";
import customDatePicker from './customDatePicker'
export default {
  name: "report-costPay",
  data() {
    return {
      // city: "",
      userTypeDD: [], //用户类型
      costOperationTypeDD: [], //费用类型
      payModeDD: [], //支付方式
      payChannelDD: [], //收费渠道
      reportType: "1",
      countDimen: true, //统计维度默认展示
      achives2: false, //统计维度=档案时或报表类型为明细时展示
      date: true, //时间插件默认展示
      month: false, //月插件默认隐藏
      year: false, //年插件默认隐藏
      company: false, //分公司默认隐藏
      companyShow: false, //分公司默认不必填
      dates: true, //开始结束时间默认必填
      businessShow: false, //营业厅默认不展示
      staffShow: true, //营业员默认展示
      // orgBusiness: "", //营业厅code
      // Isbusiness: "", //登陆账号权限
      orgCodeArrD: [], //分公司列表
      orgCodeArr: [], //营业厅列表
      column: false, //自定义列默认隐藏
      currentPage: 1, //当前页
      //初始化总条数
      dataNum: 0,
      dataNum1: 0,
      pageSize: 10, //每页显示多少条
      filter: {
        sType: "0",
        // startDate1: "",
        // endDate1: "",
        userType: "",
        userName: null,
        archivesNo: null,
        archivesIdentity: null,
        contactPhone: null,
        payMode: "",
        payChannel: "",
        costOperationType: "",
        meterType: "",
        meterNo: null,
        orgCodeD: "0",
        orgCodeB: "0",
        staffId: "",
        regionCode: null,
        addressAreaCode: "",
        addressName: null,
        // custDate:[new Date(new Date().setHours(0,0,0)),new Date(new Date().setHours(23,59,59))],
        custDate:[],
      },
      rules_filter: {
        sType: [
          {
            required: true,
            message: "请选择统计维度",
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
        ]
      },
      region: [], //区县
      street: [], //小区
      orgArr: [], //组织机构列表
      // orgCodeArr: [], //营业厅列表
      orgNameArr: [], //营业员列表
      orgNames: {}, //营业员参数
      meterTypeOptions: [], //表类型枚举
      userSubclass2: [],
      userSubclass: [
        {
          k: "商业",
          v: "1",
          isMark: 1
        },
        {
          k: "工业",
          v: "2",
          isMark: 1
        },
        {
          k: "供热",
          v: "3",
          isMark: 1
        },
        {
          k: "公福",
          v: "4",
          isMark: 1
        },
        {
          k: "车用",
          v: "5",
          isMark: 1
        },
        {
          k: "自用",
          v: "6",
          isMark: 1
        },
        //7/8/9/10居民
        {
          k: "居民",
          v: "7",
          isMark: 2
        },
        {
          k: "壁挂炉",
          v: "8",
          isMark: 2
        },
        {
          k: "低保",
          v: "9",
          isMark: 2
        },
        {
          k: "煤改气",
          v: "10",
          isMark: 2
        }
      ],
      tableHeight: "calc(100% - 50px)",
      dialogFormVisible: false, //自定义列
      checkAll: false, //全选
      isIndeterminate: true,
      titleDataClerk: [
        //营业员统计报表表头
        {
          value: "staffName",
          label: "营业员"
        },
        {
          value: "rechargeCount",
          label: "充值笔数"
        },
        {
          value: "rechargeSum",
          label: "充值金额 (元)"
        },
        {
          value: "cancelRechargeCount",
          label: "退费笔数"
        },
        {
          value: "cancelRechargeSum",
          label: "退费金额 (元)"
        },
        {
          value: "otherCount",
          label: "其他收费笔数"
        },
        {
          value: "otherSum",
          label: "其他收费金额 (元)"
        },
        {
          value: "cancelOtherCount",
          label: "取消其他收费笔数"
        },
        {
          value: "cancelOtherSum",
          label: "取消其他收费金额 (元)"
        },
        {
          value: "giveawayCount",
          label: "补气笔数"
        },
        {
          value: "giveawaySum",
          label: "补气金额 (元)"
        },
        {
          value: "cancelGiveawayCount",
          label: "取消补气笔数"
        },
        {
          value: "cancelGiveawaySum",
          label: "取消补气金额 (元)"
        },
        {
          value: "totalFee",
          label: "费用合计 (元)"
        }
      ],
      titleDataBusiness: [
        //营业厅报表表头
        {
          value: "orgName",
          label: "营业厅"
        },
        {
          value: "rechargeCount",
          label: "充值笔数"
        },
        {
          value: "rechargeSum",
          label: "充值金额 (元)"
        },
        {
          value: "cancelRechargeCount",
          label: "退费笔数"
        },
        {
          value: "cancelRechargeSum",
          label: "退费金额 (元)"
        },
        {
          value: "otherCount",
          label: "其他收费笔数"
        },
        {
          value: "otherSum",
          label: "其他收费金额 (元)"
        },
        {
          value: "cancelOtherCount",
          label: "取消其他收费笔数"
        },
        {
          value: "cancelOtherSum",
          label: "取消其他收费金额 (元)"
        },
        {
          value: "giveawayCount",
          label: "补气笔数"
        },
        {
          value: "giveawaySum",
          label: "补气金额 (元)"
        },
        {
          value: "cancelGiveawayCount",
          label: "取消补气笔数"
        },
        {
          value: "cancelGiveawaySum",
          label: "取消补气金额 (元)"
        },
        {
          value: "totalFee",
          label: "费用合计 (元)"
        }
      ],
      titleDataRegion: [
        //小区统计报表表头
        {
          value: "regionName",
          label: "区县"
        },
        {
          value: "addressAreaName",
          label: "小区"
        },
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "rechargeCount",
          label: "充值笔数"
        },
        {
          value: "rechargeSum",
          label: "充值金额 (元)"
        },
        {
          value: "cancelRechargeCount",
          label: "退费笔数"
        },
        {
          value: "cancelRechargeSum",
          label: "退费金额 (元)"
        },
        {
          value: "otherCount",
          label: "其他收费笔数"
        },
        {
          value: "otherSum",
          label: "其他收费金额 (元)"
        },
        {
          value: "cancelOtherCount",
          label: "取消其他收费笔数"
        },
        {
          value: "cancelOtherSum",
          label: "取消其他收费金额 (元)"
        },
        {
          value: "giveawayCount",
          label: "补气笔数"
        },
        {
          value: "giveawaySum",
          label: "补气金额 (元)"
        },
        {
          value: "cancelGiveawayCount",
          label: "取消补气笔数"
        },
        {
          value: "cancelGiveawaySum",
          label: "取消补气金额 (元)"
        },
        {
          value: "totalFee",
          label: "费用合计 (元)"
        }
      ],
      titleDataUser: [
        //用户渠道统计报表表头
        {
          value: "userTypeDesc",
          label: "用户类型"
        },
        {
          value: "userSubTypeDesc",
          label: "用户子类"
        },
        {
          value: "payModeDesc",
          label: "付款方式"
        },
        {
          value: "meterTypeName",
          label: "表具类型"
        },
        {
          value: "rechargeCount",
          label: "充值笔数"
        },
        {
          value: "rechargeSum",
          label: "充值金额 (元)"
        },
        {
          value: "cancelRechargeCount",
          label: "退费笔数"
        },
        {
          value: "cancelRechargeSum",
          label: "退费金额 (元)"
        },
        {
          value: "otherCount",
          label: "其他收费笔数"
        },
        {
          value: "otherSum",
          label: "其他收费金额 (元)"
        },
        {
          value: "cancelOtherCount",
          label: "取消其他收费笔数"
        },
        {
          value: "cancelOtherSum",
          label: "取消其他收费金额 (元)"
        },
        {
          value: "giveawayCount",
          label: "补气笔数"
        },
        {
          value: "giveawaySum",
          label: "补气金额 (元)"
        },
        {
          value: "cancelGiveawayCount",
          label: "取消补气笔数"
        },
        {
          value: "cancelGiveawaySum",
          label: "取消补气金额 (元)"
        },
        {
          value: "totalFee",
          label: "费用合计 (元)"
        }
      ],
      columnObj: {}, // 将所有表头变换格式
      titleColumn: [], // 保存后的表头数据
      titleData: [], //报表表头数据
      titleDataD: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号"
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称"
        },
        {
          value: "userTypeDesc",
          disable: false,
          label: "用户类型"
        },
        {
          value: "meterNo",
          disable: false,
          label: "表具编号"
        },
        {
          value: "lastBuyQuantity",
          disable: false,
          label: "充值气量 (m³)"
        },
        {
          value: "paidAmount",
          disable: true,
          label: "充值金额 (元)"
        },
        {
          value: "modifyTime",
          disable: true,
          label: "收费时间"
        }
      ], //明细最终报表表头
      // 默认展示表头的列数据名
      tableDetailColumn: [
        "archivesNo",
        "userName",
        "userTypeDesc",
        "meterNo",
        "lastBuyQuantity",
        "paidAmount",
        "modifyTime"
      ],
      //明细报表表头
      titleDataDetail: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号"
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称"
        },
        {
          value: "addressAreaName",
          disable: false,
          label: "小区"
        },
        {
          value: "addressName",
          disable: false,
          label: "地址描述"
        },
        {
          value: "userTypeDesc",
          disable: false,
          label: "用户类型"
        },
        {
          value: "meterNo",
          disable: false,
          label: "表具编号"
        },
        {
          value: "meterTypeName",
          disable: false,
          label: "表具类型"
        },
        {
          value: "modifyTime",
          disable: true,
          label: "收费时间"
        },
        {
          value: "costOperationTypeDesc",
          disable: false,
          label: "费用类型"
        },
        {
          value: "costTypeDesc",
          disable: false,
          label: "费用子类"
        },
        {
          value: "payChannelDesc",
          disable: false,
          label: "收费渠道"
        },
        {
          value: "payModeDesc",
          disable: false,
          label: "支付方式"
        },
        {
          value: "lastBuyQuantity",
          disable: false,
          label: "充值气量 (m³)"
        },
        {
          value: "paidAmount",
          disable: true,
          label: "充值金额 (元)"
        },
        {
          value: "remoteBuyNumber",
          disable: false,
          label: "累购次数"
        },
        {
          value: "totalRechargeQuantity",
          disable: false,
          label: "累购气量 (m³)"
        },
        {
          value: "totalRechargeAmount",
          disable: false,
          label: "累购金额 (元)"
        },
        {
          value: "staffName",
          disable: false,
          label: "营业员"
        },
        {
          value: "orgName",
          disable: false,
          label: "营业厅"
        },
        {
          value: "archiveOrgName",
          disable: false,
          label: "建档机构"
        },
        {
          value: "certificateNo",
          disable: false,
          label: "身份证号"
        },
        {
          value: "archivesIdentity",
          disable: false,
          label: "档案标识",
        },
      ],
      // 不可取消表头
      noDisColumn: [
        {
          value: "archivesNo",
          disable: true,
          label: "档案编号"
        },
        {
          value: "userName",
          disable: true,
          label: "用户名称"
        },
        {
          value: "paidAmount",
          disable: true,
          label: "充值金额 (元)"
        },
        {
          value: "modifyTime",
          disable: true,
          label: "收费时间"
        }
      ],
      tableData: [], //报表列表
      lastUpdateTime: "", //数据更新时间
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
      orgStruId: ""
    };
  },
  computed: {},
  components: {customDatePicker},
  methods: {
    // 自定义表头方法
    tColumns() {
      let arr = [];
      this.titleColumn = JSON.parse(
        window.localStorage.getItem("titleColumnCostReport")
      );
      if (this.titleColumn) {
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
          "titleColumnCostReport",
          JSON.stringify(this.titleDataD)
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
        this.tableDetailColumn = [
          "archivesNo",
          "userName",
          "paidAmount",
          "modifyTime"
        ];
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
          this.filter.sType,
          this.currentPage,
          this.pageSize
        );
      } else {
        this.titleDataD = this.titleColumn;
        this.dialogFormVisible = false;
        this.submitFilter(
          "rule_filter",
          this.reportType,
          this.filter.sType,
          this.currentPage,
          this.pageSize
        );
      }
      window.localStorage.setItem(
        "titleColumnCostReport",
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
      this.filter.sType = c;
      this.filter.custDate=[]
      this.tableData = [];
      this.orgFun(this.filter.orgCodeD);
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
    // 系统级获取租户所在省市
    getTenantPlaceVal(c) {
      this.region = [];
      this.filter.regionCode = "";
      let tenantObj = {};
      tenantObj["tid"] = this.tenantId;
      tenantObj["code"] = c;
    let requestApi=this.isAdmin=='0'?getTenantPlace_sys(tenantObj):getTenantPlace(tenantObj)
      requestApi
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
    // 获取组织机构
    // 获取组织机构模板树 通用方法 兼容系统级和租户级
    getOrgTemplate_common(id){
     let isAdm=this.isAdmin==0;
     let requestApi=isAdm?orgstrutureList_sys({ tid: id }):orgstrutureList();
      requestApi
        .then(res => {
          let data = res.data.data;
          if (data.length > 0) {
            data.map(item => {
              if (item.name == "分公司") {
                this.orgStruId = item.id;
              }
            });
          }
          let requestTreeApi=isAdm? orgstrutureSysTree({ tid: id }): orgstrutureTree()
          requestTreeApi
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
            //   if(isAdm){
            //     this.orgCodeD = this.orgCodeArrD[0].org_code;
            //     this.orgFun(this.orgCodeD,this.isSpecialTenantAccount?true:'');
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
    // isSpecialTenantAccount 用于解决初始化时租户级分公司以上级别问题
    orgFun(e) {
        if (this.$ls.get("userGradeName") !== "营业员") {
            // 清空营业员数据
            this.filter.staffId=''
            this.orgNameArr=[]
        }
      if (e == "0") {
        if (this.isAdmin == 0 || this.isSpecialTenantAccount) {
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
    // 获取表类型
    getMeterTypeList(e) {
      if (e) {
        searchMeterTypeList({ type: 1, tenantId: this.tenantId })
          .then(res => {
            if (res.data.code == 0) {
              let datas = res.data.data.records;
              this.meterTypeOptions = datas;
            } else {
              this.$message.error(`表类型查询失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.$message.error("表类型查询失败-接口请求失败");
          });
      } else {
        searchMeterTypeList({ type: 1 })
          .then(res => {
            if (res.data.code == 0) {
              let datas = res.data.data.records;
              this.meterTypeOptions = datas;
            } else {
              this.$message.error(`表类型查询失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.$message.error("表类型查询失败-接口请求失败");
          });
      }
    },
    // 获取营业员
    changeOrgName(val) {
      if (this.isAdmin != 0) {
        this.orgNameArr = [];
        this.filter.staffId = "";
        this.orgNames["orgCode"] = val;
        this.orgNames["paged"] = false;
        this.orgNames["includeResigned"] = true;
        getStaffList(this.orgNames).then(res => {
          this.orgNameArr = res.data.data;
        });
      }
    },
    // 切换筛选报表条件
    changeFilter(et, cd) {
      if (et == 1) {
        this.achives2 = false;
        this.titleData = [];
        this.tableData = [];
        this.street = [];
        this.countDimen = true;
        this.dates = true;
        this.column = false;
        // this.filter.startDate1 = "";
        // this.filter.endDate1 = "";
        this.filter.custDate=[]
        this.filter.orgCodeD = "0";
        this.filter.orgCodeB = "0";
        this.filter.staffId = "";
        this.filter.userType = "";
        this.filter.userName = null;
        this.filter.archivesIdentity = null;
        this.filter.archivesNo = null;
        this.filter.meterNo = null;
        this.filter.contactPhone = null;
        this.filter.payMode = "";
        this.filter.payChannel = "";
        this.filter.costOperationType = "";
        this.filter.meterType = "";
        this.filter.regionCode = "";
        this.filter.addressAreaCode = "";
        this.filter.address = null;
        this.orgFun(this.filter.orgCodeD);
        this.$nextTick(function() {
          this.$refs["rule_filter"].clearValidate();
        });
      } else if (et == 2) {
        this.achives2 = true;
        this.column = true;
        this.countDimen = false;
        this.dates = false;
        this.titleData = [];
        this.tableData = [];
        this.street = [];
        this.filter.sType = "0";
        // this.filter.startDate1 = "";
        // this.filter.endDate1 = "";
        this.filter.custDate=[]
        this.filter.orgCodeD = "0";
        this.filter.orgCodeB = "0";
        this.filter.staffId = "";
        this.filter.userType = "";
        this.filter.userName = null;
        this.filter.archivesIdentity = null;
        this.filter.archivesNo = null;
        this.filter.meterNo = null;
        this.filter.contactPhone = null;
        this.filter.payMode = "";
        this.filter.payChannel = "";
        this.filter.costOperationType = "";
        this.filter.meterType = "";
        this.filter.regionCode = null;
        this.filter.addressAreaCode = "";
        this.filter.address = null;
        this.orgFun(this.filter.orgCodeD);
        this.$nextTick(function() {
          this.$refs["rule_filter"].clearValidate();
        });
      }
    },
    // //切换日期插件
    // dateM(e) {
    //   if (e == 1) {
    //     this.date = true;
    //     this.month = false;
    //     this.year = false;
    //     // this.filter.startDate = "";
    //     // this.filter.endDate = "";
    //   } else if (e == 2) {
    //     this.date = false;
    //     this.month = true;
    //     this.year = false;
    //     // this.filter.startDate = "";
    //     // this.filter.endDate = "";
    //   } else if (e == 3) {
    //     this.date = false;
    //     this.month = false;
    //     this.year = true;
    //     // this.filter.startDate = "";
    //     // this.filter.endDate = "";
    //   }
    // },
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
          if (this.Isbusiness == "营业厅") {
            orgArr.push(this.orgBusiness);
          } else {
            if (this.filter.orgCodeB && this.filter.orgCodeB != "0") {
              orgArr.push(this.filter.orgCodeB);
            } else {
              this.orgCodeArr.map(key => {
                orgArr.push(key.org_code);
              });
            }
          }
          this.filter["orgCode"] = orgArr;
        //   this.filter["startDate"] = startDate;
        //   this.filter["endDate"] = endDate;
          this.filter["size"] = size;
          this.filter["current"] = page;
          if (this.isAdmin == 0) {
            this.filter["tenantId"] = this.tenantId;
          }
          let summaryType = "";
          summaryType = Number(cDimension);
          this.filter["summaryType"] = summaryType;
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
          if (reportT == 1) {
            if (cDimension == 0) {
              this.titleData = this.titleDataBusiness;
            } else if (cDimension == 1) {
              this.titleData = this.titleDataClerk;
            } else if (cDimension == 2) {
              this.titleData = this.titleDataRegion;
            } else if (cDimension == 3) {
              this.titleData = this.titleDataUser;
            }
            gasReportCost(removeNullParams(this.filter))
              .then(res => {
                loading.close();
                let data = res.data.data;
                if (res.data.code == 0) {
                  if (data) {
                    this.currentPage = data.current;
                    this.dataNum = data.total;
                    this.pageSize = data.size;
                    if (data.totalResult) {
                      this.lastUpdateTime = data.totalResult.lastUpdateTime; //数据更新时间
                    }
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
          } else if (reportT == 2) {
            if (this.titleDataD.length != 0) {
              this.titleData = this.titleDataD;
              let customColumn = [];
              this.titleData.forEach(v => {
                customColumn.push(v.value);
              });
              this.filter["customColumn"] = customColumn;
              gasReportCostDetail(removeNullParams(this.filter))
                .then(res => {
                  loading.close();
                  let data = res.data.data;
                  if (res.data.code == 0) {
                    if (data) {
                      this.currentPage = data.current;
                      this.dataNum = data.total;
                      this.pageSize = data.size;
                      if (data.totalResult) {
                        this.lastUpdateTime = data.totalResult.lastUpdateTime; //数据更新时间
                      }
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
              loading.close();
              // this.$message.error("请选择收费明细报表表头!");
              this.tableData = [];
            }
          }
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
        this.filter.sType,
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
        this.filter.sType,
        currentPage,
        this.pageSize
      );
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
      const loading = this.$loading({
        text: "下载中，请稍后...",
        customClass: "loadingSP",
        background: "rgba(255,255,255,0.8)"
      });
      if (command.command == "pdf" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/etf/expense/recharge-summary/export/pdf",
          fileName: "收费统计报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "1") {
        let myObj = {
          method: "post",
          url: "/etf/expense/recharge-summary/export/excel",
          fileName: "收费统计报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      } else if (command.command == "pdf" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/expense/recharge-detail/export/pdf",
          fileName: "收费明细报表.pdf",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "pdf", "", loading);
      } else if (command.command == "excel" && command.report == "2") {
        let myObj = {
          method: "post",
          url: "/etf/expense/recharge-detail/export/excel",
          fileName: "收费明细报表.xls",
          data: removeNullParams(this.filter)
        };
        exportReport(myObj, "excel", "", loading);
      }
    },
    // 数据字典
    dataDepement() {
      getSysDataList({
        codes: "userType,costOperationType,payMode,payChannel"
      }).then(res => {
        if (res.data.code == 0) {
          this.userTypeDD = res.data.data.userType || []; //用户类型
          this.costOperationTypeDD = res.data.data.costOperationType || []; //费用操作类型
          this.payModeDD = res.data.data.payMode || []; //支付方式
          this.payChannelDD = res.data.data.payChannel || []; //收费渠道
        } else {
        }
      });
    }
  },
  mounted() {
    this.dataDepement(); //数据字典查询
    // 改变所有表头数据的格式
    this.columnObj = {};
    this.titleDataDetail.forEach(v => {
      this.columnObj[v.value] = v.label;
    });
    this.tColumns();
    let orgcodeName = this.$ls.get("userInfo");
    this.isAdmin = orgcodeName.userLevel;
    // isSpecialTenantAccount指租户级中分公司级以上的账号，组织结构代码为空
    this.isSpecialTenantAccount= orgcodeName.branchCompanyOrgCode?false:true;

    // 系统级登陆
    if (this.isAdmin == 0) {
      this.company = true;
      this.companyShow = true;
      this.businessShow = true;
      this.staffShow = false;
      this.getOrgTemplate_common(this.tenantId);
      this.getMeterTypeList(this.tenantId); //默认加载表类型
      this.orgFun("0");
    } else {
      // 租户级登陆
      this.company = false;
      this.companyShow = false;
      this.staffShow = true;
      if (this.city == undefined) {
        let citys = this.$ls.get("tenantPlaceCode").city;
        this.getRegionNameVal(citys); //默认加班区县列表
      } else {
        this.getRegionNameVal(this.city); //默认加班区县列表
      }
      this.getMeterTypeList(); //默认加载表类型列表
      if (this.Isbusiness == "营业厅") {
        this.businessShow = false;
        this.changeOrgName(this.orgBusiness);
      } else {
        this.businessShow = true;
        this.orgCodeArr = this.$store.state.userInfo.businessHalls;
      }
     // 20201210兼容四川泾阳在分公司以上级建立账号查看收费报表的方案
      if(this.isSpecialTenantAccount){
        this.company = true;
        this.companyShow = true;
        this.getOrgTemplate_common();
    // 100000无实际含义，只要是非0即可，用于初始化
        this.orgFun("100000");
      }
    }
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
    Isbusiness() {
      return this.$store.state.userInfo.orgStruName;
    },
    orgBusiness() {
      return this.$store.state.userInfo.orgCode;
    }
  },
  watch: {
    tenantId() {
      // 营业厅列表初始化
      this.filter.orgCodeD = "0";
      this.orgCodeArrD = [];
      this.filter.meterType = "";
      this.meterTypeOptions = [];
      // 小区初始化
      this.street = [];
      this.filter.addressAreaCode = "";
      this.getOrgTemplate_common(this.tenantId);
      this.getMeterTypeList(this.tenantId);
      this.orgFun("0");
    },
    userInfo(vr) {
      this.filter.orgCodeB = "0";
      this.orgCodeArr = vr.businessHalls;
    },
    city() {
      this.getRegionNameVal(this.city);
    },
    Isbusiness() {
      if (this.Isbusiness == "营业厅") {
        this.businessShow = false;
        this.changeOrgName(this.orgBusiness);
      } else {
        this.businessShow = true;
      }
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
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      .queryDate {
        color: #4e4e4e;
        font-size: 14px;
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
      ::v-deep .el-dialog__footer {
        .el-button {
          width: 80px;
          height: 32px;
        }
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