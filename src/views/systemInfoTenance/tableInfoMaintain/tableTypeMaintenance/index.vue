<template>
  <div class="table-type-maintenance-wrap">
    <div class="query1">
      <el-input
        placeholder="请输入内容"
        @keyup.enter.native="findList(1,10)"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <div style="width: 90px" slot="prepend">表类型名称</div>
        <el-button slot="append" icon="el-icon-search" @click="findList(1,10)"></el-button>
      </el-input>
      <el-button v-has="'meterType_add'" class="add-btn" size="small" @click="addType">新增表类型</el-button>
    </div>
    <div class="titleData1">
      <el-table
        :height="tableHeight"
        :data="tableData"
        class="tables"
        :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        @filter-change="filterChange"
      >
        <template slot="empty" class="noData">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </template>
        <el-table-column prop="meterTypeName" label="表类型名称"></el-table-column>
        <el-table-column label="表类别">
          <template slot-scope="scope,data">
            <div v-html="changeMeterName(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="manufacturerName"
          label="表具厂商名称"
          :filter-multiple="false"
          :column-key="'manufacturerName'"
          :filters="filterStatus"
        ></el-table-column>
        <el-table-column prop="remoteMode" label="远传模式">
          <template slot-scope="scope,data">
            <div v-html="changeRemoteModeName(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column label="计费方式">
          <template slot-scope="scope,data">
            <div v-html="changeBillingName(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="protocolName" label="协议类型名称"></el-table-column>
        <el-table-column label="业务领域">
          <template slot-scope="scope">
            <span>{{scope.row.realm=='water'?'水务':scope.row.realm=='gas'?'燃气':'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope,data">
            <span
              style="color: rgba(47, 135, 254, 1);margin-right: 20px;cursor: pointer"
              @click="changeMeterType(scope.row)"
            >{{isShow?'修改':'详情'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="tableData.length > 0">
        <el-pagination
          class="pageLeft"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="dataNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      custom-class="create-table-type-main"
      :visible.sync="showDialog"
      width="920px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearDialogData"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/meterTypeIcon.png" />
        <span class="title-age">{{isEdit?(isShow?'修改表具类型':'详情'):'新增表具类型'}}</span>
      </div>
      <div class="dialog_content_wrap">
        <el-form
          ref="tableTypeMaintenanceForm"
          label-width="120px"
          label-position="left"
          class="ruleForm"
          :model="details"
          :rules="tableTypeMainRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="表类型名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="meterTypeName"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.meterTypeName"
                  placeholder="请输入表类型名称"
                  style="width: 210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="表类别："
                style="padding-right: 20px;"
                class="item item-right"
                prop="meterCategory"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.meterCategory"
                  placeholder="请输入表类别"
                  style="width: 210px"
                  @change="changeType"
                >
                  <el-option
                    v-for="item in meterCategoryList"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="厂商名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="manufacturerId"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.manufacturerId"
                  placeholder="请选择厂商"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in vendorList"
                    :key="item.manufacturerId"
                    :label="item.manufacturerName"
                    :value="item.manufacturerId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="远传模式："
                style="padding-right: 20px;"
                class="item item-right"
                prop="remoteMode"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.remoteMode"
                  placeholder="请选择远传模式"
                  style="width: 210px"
                  @change="changeRemoteMode"
                >
                  <el-option
                    v-for="item in remoteModeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="计费方式："
                style="padding-right: 20px;"
                class="item item-right"
                prop="billingType"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.billingType"
                  placeholder="请选择计费方式"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in billTypeList"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="使用年限："
                style="padding-right: 20px;"
                class="item item-right"
                prop="useYears"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.useYears"
                  style="width: 210px"
                  placeholder="请输入使用年限"
                >
                  <span slot="suffix">年</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="details.meterCategory === 2|| details.meterCategory ===3">
              <el-form-item
                label="协议类型名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="protocolType"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.protocolType"
                  placeholder="请选择协议类型名称"
                  style="width: 210px"
                  @change="changeProtocolType"
                >
                  <el-option
                    v-for="item in protocolList"
                    :key="item.protocolType"
                    :label="item.protocolName"
                    :value="item.protocolType"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="details.meterCategory === 2|| details.meterCategory ===3">
              <el-form-item
                label="IOT平台协议："
                style="padding-right: 20px;"
                class="item item-right"
                prop="iotPlatformProtocol"
              >
                <el-input
                  size="small"
                  disabled
                  placeholder="IOT平台协议"
                  v-model="details.iotPlatformProtocol"
                  style="width: 210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="日用量上限："
                style="padding-right: 20px;"
                class="item item-right"
                prop="flowUpperLimit"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.flowUpperLimit"
                  style="width: 210px"
                  placeholder="请输入日用量上限"
                >
                  <span slot="suffix">m³</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="计量量程："
                style="padding-right: 20px;"
                class="item item-right"
                prop="meterRange"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.meterRange"
                  style="width: 210px"
                  placeholder="请输入计量量程"
                >
                  <span slot="suffix">m³</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="表具编号规则："
                style="padding-right: 20px;"
                class="item item-right"
                prop="meterNoRuleId"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.meterNoRuleId"
                  placeholder="请选择表具编号规则"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in meterTypeList"
                    :key="item.meterNoRuleId"
                    :label="item.ruleName"
                    :value="item.meterNoRuleId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="业务领域："
                style="padding-right: 20px;"
                class="item item-right"
                prop="realm"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.realm"
                  placeholder="请选择业务领域"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in tenantTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="details.meterCategory === 1|| details.meterCategory ===3">
              <el-form-item
                label="IC卡类型："
                style="padding-right: 20px;"
                class="item item-right"
                prop="icCardTypeId"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.icCardTypeId"
                  placeholder="请选择IC卡类型"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in ICCardList"
                    :key="item.icCardTypeId"
                    :label="item.name"
                    :value="item.icCardTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="details.meterCategory === 1|| details.meterCategory ===3">
              <el-form-item
                label="IC卡结算模式："
                style="padding-right: 20px;"
                class="item item-right"
                prop="icBillingMode"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.icBillingMode"
                  placeholder="请选择IC卡结算模式"
                  style="width: 210px"
                >
                  <el-option :key="0" label="气量" :value="0"></el-option>
                  <el-option :key="1" label="金额" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="details.remoteMode !==0">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>通讯编号与表号是否一致：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.deviceNoEnable" :disabled="showRadio||!isShow ">
                    <el-radio :label="1">一致</el-radio>
                    <el-radio :label="0">不一致</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="details.remoteMode !==0">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>是否有子机号：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.needSlaveNo" :disabled="showRadio||!isShow">
                    <el-radio :label="1">有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                    <el-radio :label="0">无</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="details.remoteMode ===2">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>是否有DTU采集器编号：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.needDtuNo" disabled>
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="0">无</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="details.remoteMode !==0">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>是否长期在线：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.longTermOnline" :disabled="!isShow">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="details.remoteMode !==0">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>是否有阀门：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.hasValve" :disabled="!isShow">
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="0">无</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="this.details.meterCategory ===3">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>IC卡远传表是否支持远程充值：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.remoteRechargeFlag" :disabled="!isShow">
                    <el-radio :label="1">支持</el-radio>
                    <el-radio :label="0">不支持</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="details.remoteMode !==0">
              <div class="form-item-col">
                <div class="form-label">
                  <span>*</span>
                  <span>表端是否显示余额：</span>
                </div>
                <div class="form-content">
                  <el-radio-group v-model="details.showBalance" :disabled="!isShow">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">不显示</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isShow">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureOnOk"
        >{{isEdit?'保存修改':'确认新增'}}</el-button>
        <el-button style="width: 80px;" size="small" @click="clearDialogData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMeterTypeList,
  getManufacturerList,
  getProtocolMappingList,
  getMeterTypeRuleList,
  getIcCardTypeList,
  addNewMeterType,
  updateNewMeterType,
  getMeterTypeDetails
} from "@/api/tableInfoMaintain.js";
import _ from "lodash";

export default {
  name: "table-type-maintenance",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      //当前页
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 10,
      filterStatus: [],
      manufacId: "",
      // 列表数据
      tableData: [],
      // 保存后的表头数据
      titleColumn: [],
      // 查询下拉数据
      fileTerm: "",
      //// 弹框里面的数据
      showDialog: false,
      isEdit: false,
      details: {
        meterTypeName: "", //表类型
        meterCategory: "", // 表类别
        manufacturerId: "", //厂商ID
        remoteMode: "", // 远传模式
        billingType: "", // 计费方式
        useYears: "", //使用年限
        protocolType: "", // 协议类型名称
        iotPlatformProtocol: "", //  IOT平台协议
        flowUpperLimit: "", // 日用量上限0-9999999999.9999
        meterRange: "", // 计量量程 0-9999999999.9999
        meterNoRuleId: "", // 表具编号规则
        icCardTypeId: "", // IC卡类型ID
        icBillingMode: "", //IC卡表结算模式
        deviceNoEnable: 0, // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
        needSlaveNo: 0, // 是否有子机号,只能是 0:无 1:有
        needDtuNo: 0, // 是否有dtu采集器编号
        longTermOnline: 0, // 是否长期在线,只能是0:否 1:是
        hasValve: 0, // 是否有阀门,只能是 0:无，1:有
        remoteRechargeFlag: 0, //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
        showBalance: 0, //表端是否显示余额,只能是 0:不显示 1:显示
        realm: "" //业务领域
      },
      tableTypeMainRules: {
        meterTypeName: [
          {
            required: true,
            message: "表类型不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        meterCategory: [
          {
            required: true,
            message: "请选择表类别",
            trigger: "change"
          }
        ],
        manufacturerId: [
          {
            required: true,
            message: "请选择厂商",
            trigger: "change"
          }
        ],
        remoteMode: [
          {
            required: true,
            message: "请选择远传模式",
            trigger: "change"
          }
        ],
        billingType: [
          {
            required: true,
            message: "请选择计费方式",
            trigger: "change"
          }
        ],
        useYears: [
          {
            required: true,
            message: "请输入使用年限",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              let _test = /^(\d|[1-9]\d|99)$/;
              if (!_test.test(value)) {
                callback("请输入0-99");
                return;
              }
              callback();
            }
          }
        ],
        flowUpperLimit: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /(^\d{1,10}$)|(^\d{1,10}\.\d{1,4}$)/;
              if (!_test.test(value)) {
                callback("请输入0-9999999999.9999");
                return;
              }
              callback();
            }
          }
        ],
        meterRange: [
          {
            required: true,
            message: "请输入计量量程",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /(^\d{1,10}$)|(^\d{1,10}\.\d{1,4}$)/;
              if (!_test.test(value)) {
                callback("请输入0-9999999999.9999");
                return;
              }
              callback();
            }
          }
        ],
        icCardTypeId: [
          {
            required: true,
            message: "请选择IC卡类型",
            trigger: "change"
          }
        ],
        icBillingMode: [
          {
            required: true,
            message: "请选择IC卡表结算模式",
            trigger: "change"
          }
        ],
        realm: [
          {
            required: true,
            message: "请选择业务领域",
            trigger: "change"
          }
        ]
      },
      allRemoteModeList: [
        {
          name: "非远传",
          value: 0
        },
        {
          name: "物联表",
          value: 1
        },
        {
          name: "DTU采集器",
          value: 2
        }
      ],
      remoteModeList: [
        {
          name: "非远传",
          value: 0
        },
        {
          name: "物联表",
          value: 1
        },
        {
          name: "DTU采集器",
          value: 2
        }
      ],
      billTypeList: [], //计费方式
      meterCategoryList: [], //  表类别
      ops: window.scrollOps, // 滚动条
      //  厂商列表
      vendorList: [],
      //  协议列表
      protocolList: [],
      // ic卡列表
      ICCardList: [],
      // 表规则列表
      meterTypeList: [],
      userRoleName: "",
      isShow: true,
      tenantTypeOptions: [
        {
          value: "gas",
          label: "燃气"
        },
        {
          value: "water",
          label: "水务"
        }
      ] //租户类型
    };
  },
  computed: {
    showRadio() {
      return this.details.remoteMode === 2 ? true : false;
    }
  },
  created() {
    this.findList(1, 10);
    this.userRoleName = this.$ls.get("userGradeName");
    let _billTypeList = [];
    let _billType = this.$ls.get("DataList").billType;
    for (let i in _billType.ids) {
      _billTypeList.push({
        label: _billType.ids[i],
        value: parseInt(i)
      });
    }
    this.billTypeList = _billTypeList;
    let _meterCategoryList = [];
    let _meterCategory = this.$ls.get("DataList").meterCategory;
    for (let i in _meterCategory.ids) {
      _meterCategoryList.push({
        label: _meterCategory.ids[i],
        value: parseInt(i)
      });
    }
    this.meterCategoryList = _meterCategoryList;
    //  厂商列表
    getManufacturerList({
      current: 1,
      size: 50
    }).then(res => {
      if (res.data.code == 0) {
        this.vendorList = res.data.data.records || [];
        this.filterStatus = (res.data.data.records || []).map(item => {
          return {
            text: item.manufacturerName,
            value: item.manufacturerId
          };
        });
      }
    });
    // 协议列表
    getProtocolMappingList({
      current: 1,
      size: 50
    }).then(res => {
      if (res.data.code == 0) {
        this.protocolList = res.data.data.records || [];
      }
    });
    // ic卡列表
    getIcCardTypeList({
      current: 1,
      size: 50
    }).then(res => {
      if (res.data.code == 0) {
        this.ICCardList = res.data.data.records || [];
      }
    });
    // 表规则列表
    getMeterTypeRuleList().then(res => {
      if (res.data.code == 0) {
        this.meterTypeList = res.data.data || [];
      }
    });
    this.isShow = this.$_has("meterType_modify");
  },
  methods: {
    filterChange(attr) {
      if (attr.manufacturerName.length === 0) {
        this.manufacId = "";
      } else {
        this.manufacId = attr.manufacturerName[0];
      }
      this.findList(1, this.pageSize);
    },
    // 改变表类别
    changeType(attr) {
      if (attr === 0) {
        this.details.icCardTypeId = "";
        this.details.icBillingMode = "";
        this.details.protocolType = "";
        this.details.iotPlatformProtocol = "";
        this.details.remoteMode = "";
        this.remoteModeList = this.allRemoteModeList.filter(item => {
          return item.value === 0;
        });
      } else if (attr === 1) {
        this.details.protocolType = "";
        this.details.iotPlatformProtocol = "";
        this.details.remoteMode = "";
        this.remoteModeList = this.allRemoteModeList.filter(item => {
          return item.value === 0;
        });
      } else if (attr === 2) {
        this.details.icCardTypeId = "";
        this.details.icBillingMode = "";
        this.details.remoteMode = "";
        this.remoteModeList = this.allRemoteModeList.filter(item => {
          return item.value !== 0;
        });
      } else {
        this.details.remoteMode = "";
        this.remoteModeList = this.allRemoteModeList.filter(item => {
          return item.value !== 0;
        });
      }
    },
    // 改变远传模式
    changeRemoteMode(attr) {
      if (attr === 2) {
        this.details.needDtuNo = 1;
        this.details.needSlaveNo = 1;
        this.details.deviceNoEnable = 0;
      } else {
        this.details.needDtuNo = 0;
      }
    },
    // 协议类型名称
    changeProtocolType(attr) {
      let findprop = _.find(this.protocolList, item => {
        return item.protocolType === attr;
      });
      if (findprop) {
        this.details.iotPlatformProtocol = findprop.iotPlatformProtocol;
      } else {
        this.details.iotPlatformProtocol = "";
      }
    },
    // 将表类别id换成表类别名称
    changeMeterName(attr) {
      let typeList = this.$ls.get("DataList").meterCategory.ids;
      return typeList[attr.meterCategory] || "";
    },
    // 将远传模式id  变成name
    changeRemoteModeName(attr) {
      let typeList = {
        "0": "非远传",
        "1": "物联网",
        "2": "DTU采集器"
      };
      return typeList[attr.remoteMode] || "";
    },
    // 将计费方式id  变成计费name
    changeBillingName(attr) {
      let typeList = this.$ls.get("DataList").billType.ids;
      return typeList[attr.billingType] || "";
    },

    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    // 精准查询列表
    findList(page, size) {
      // 传参
      let _attr = {
        current: page,
        size: size,
        meterTypeName: this.fileTerm,
        manufacturerId: this.manufacId
      };
      this.currentPage = page;
      this.pageSize = size;
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getMeterTypeList(_attr)
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.dataNum = res.data.data.total || 0;
            this.tableData = res.data.data.records || [];
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("查询数据失败-接口请求错误");
        });
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.findList(this.currentPage, size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.findList(currentPage, this.pageSize);
    },
    // 关闭弹框
    clearDialogData() {
      this.details = {
        meterTypeName: "", //表类型
        meterCategory: "", // 表类别
        manufacturerId: "", //厂商ID
        remoteMode: "", // 远传模式
        billingType: "", // 计费方式
        useYears: "", //使用年限
        protocolType: "", // 协议类型名称
        iotPlatformProtocol: "", //  IOT平台协议
        flowUpperLimit: "", // 日用量上限0-9999999999.9999
        meterRange: "", // 计量量程 0-9999999999.9999
        meterNoRuleId: "", // 表具编号规则
        icCardTypeId: "", // IC卡类型ID
        icBillingMode: "", //IC卡表结算模式
        deviceNoEnable: 0, // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
        needSlaveNo: 0, // 是否有子机号,只能是 0:无 1:有
        needDtuNo: 0, // 是否有dtu采集器编号
        longTermOnline: 0, // 是否长期在线,只能是0:否 1:是
        hasValve: 0, // 是否有阀门,只能是 0:无，1:有
        remoteRechargeFlag: 0, //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
        showBalance: 0, //表端是否显示余额,只能是 0:不显示 1:显示
        realm: "" //业务领域
      };
      this.$refs.tableTypeMaintenanceForm.resetFields();
      this.showDialog = false;
      this.isEdit = false;
    },
    // 点击OK
    sureOnOk() {
      for (let i in this.details) {
        if (
          typeof this.details[i] == "string" &&
          this.details[i].constructor == String
        ) {
          this.details[i] = this.details[i].trim();
        }
      }
      this.$refs.tableTypeMaintenanceForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (this.isEdit) {
            // 公共参数
            let attr = {
              meterTypeId: this.details.meterTypeId,
              meterTypeName: this.details.meterTypeName, //表类型
              meterCategory: this.details.meterCategory, // 表类别
              manufacturerId: this.details.manufacturerId, //厂商ID
              remoteMode: this.details.remoteMode, // 远传模式
              billingType: this.details.billingType, // 计费方式
              useYears: this.details.useYears, //使用年限
              flowUpperLimit: this.details.flowUpperLimit, // 日用量上限0-9999999999.9999
              meterRange: this.details.meterRange, // 计量量程 0-9999999999.9999
              meterNoRuleId: this.details.meterNoRuleId, // 表具编号规则
              icCardTypeId: this.details.icCardTypeId, // IC卡类型ID
              icBillingMode: this.details.icBillingMode, //IC卡表结算模式
              realm: this.details.realm //业务领域
            };
            if (this.details.remoteMode == 0) {
              //  非远传模式
              attr["protocolType"] = ""; // 协议类型名称
              attr["deviceNoEnable"] = 0; // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
              attr["needSlaveNo"] = 0; // 是否有子机号,只能是 0:无 1:有
              attr["needDtuNo"] = 0; // 是否有dtu采集器编号
              attr["longTermOnline"] = 0; // 是否长期在线,只能是0:否 1:是
              attr["hasValve"] = 0; // 是否有阀门,只能是 0:无，1:有
              attr["remoteRechargeFlag"] = 0; //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
              attr["showBalance"] = ""; //表端是否显示余额,只能是 0:不显示 1:显示
            } else {
              attr["protocolType"] = this.details.protocolType; // 协议类型名称
              attr["deviceNoEnable"] = this.details.deviceNoEnable; // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
              attr["needSlaveNo"] = this.details.needSlaveNo; // 是否有子机号,只能是 0:无 1:有
              attr["needDtuNo"] = this.details.needDtuNo; // 是否有dtu采集器编号
              attr["longTermOnline"] = this.details.longTermOnline; // 是否长期在线,只能是0:否 1:是
              attr["hasValve"] = this.details.hasValve; // 是否有阀门,只能是 0:无，1:有
              attr["remoteRechargeFlag"] = this.details.remoteRechargeFlag; //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
              attr["showBalance"] = this.details.showBalance; //表端是否显示余额,只能是 0:不显示 1:显示
            }
            updateNewMeterType(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  this.$message.success("修改成功");
                  this.findList(this.currentPage, this.pageSize);
                  this.clearDialogData();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          } else {
            let attr = {
              meterTypeName: this.details.meterTypeName, //表类型
              meterCategory: this.details.meterCategory, // 表类别
              manufacturerId: this.details.manufacturerId, //厂商ID
              remoteMode: this.details.remoteMode, // 远传模式
              billingType: this.details.billingType, // 计费方式
              useYears: this.details.useYears, //使用年限
              flowUpperLimit: this.details.flowUpperLimit, // 日用量上限0-9999999999.9999
              meterRange: this.details.meterRange, // 计量量程 0-9999999999.9999
              meterNoRuleId: this.details.meterNoRuleId, // 表具编号规则
              icCardTypeId: this.details.icCardTypeId, // IC卡类型ID
              icBillingMode: this.details.icBillingMode, //IC卡表结算模式
              realm: this.details.realm //业务领域
            };
            if (this.details.remoteMode == 0) {
              //  非远传模式
              attr["protocolType"] = ""; // 协议类型名称
              attr["deviceNoEnable"] = 0; // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
              attr["needSlaveNo"] = 0; // 是否有子机号,只能是 0:无 1:有
              attr["needDtuNo"] = 0; // 是否有dtu采集器编号
              attr["longTermOnline"] = 0; // 是否长期在线,只能是0:否 1:是
              attr["hasValve"] = 0; // 是否有阀门,只能是 0:无，1:有
              attr["remoteRechargeFlag"] = 0; //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
              attr["showBalance"] = ""; //表端是否显示余额,只能是 0:不显示 1:显示
            } else {
              attr["protocolType"] = this.details.protocolType; // 协议类型名称
              attr["deviceNoEnable"] = this.details.deviceNoEnable; // 通讯编号和表号是否一致,只能是 0:不一致,1:一致
              attr["needSlaveNo"] = this.details.needSlaveNo; // 是否有子机号,只能是 0:无 1:有
              attr["needDtuNo"] = this.details.needDtuNo; // 是否有dtu采集器编号
              attr["longTermOnline"] = this.details.longTermOnline; // 是否长期在线,只能是0:否 1:是
              attr["hasValve"] = this.details.hasValve; // 是否有阀门,只能是 0:无，1:有
              attr["remoteRechargeFlag"] = this.details.remoteRechargeFlag; //IC卡远传表是否支持远程充值,只能是0:不支持 1:支持
              attr["showBalance"] = this.details.showBalance; //表端是否显示余额,只能是 0:不显示 1:显示
            }
            addNewMeterType(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  this.$message.success("新增成功");
                  this.findList(this.currentPage, this.pageSize);
                  this.clearDialogData();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          }
        } else {
        }
      });
    },
    // 新增
    addType() {
      this.showDialog = true;
    },
    //  修改表类型
    changeMeterType(attr) {
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getMeterTypeDetails({
        meterTypeId: attr.meterTypeId
      })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.details = res.data.data;
            this.changeRemoteModeName(this.details.remoteMode);
            if (
              this.details.meterCategory == 0 ||
              this.details.meterCategory == 1
            ) {
              this.remoteModeList = this.allRemoteModeList.filter(item => {
                return item.value === 0;
              });
            } else {
              this.remoteModeList = this.allRemoteModeList.filter(item => {
                return item.value !== 0;
              });
            }
            this.showDialog = true;
            this.isEdit = true;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error(err.message);
        });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .el-dialog__footer {
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
}

::v-deep .el-radio__label {
  width: 30px;
  display: inline-block;
}
::v-deep .el-dialog__body {
  .dialog_content_wrap {
    .form-item-col {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      .form-label {
        width: 130px;
        padding-right: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span:nth-of-type(1) {
          width: 20px;
          display: inline-block;
          height: 100%;
          color: #f56c6c;
        }
      }
      .form-content {
        flex: 1;
      }
    }
  }
}
::v-deep .create-table-type-main .el-dialog__body {
  .dialog_content_wrap {
    width: 100%;
    min-height: 210px;
    max-height: 390px;
    padding: 24px 40px 0;
    position: relative;
    overflow: auto;
    .operation {
      color: #ababab;
      font-size: 14px;
      margin-bottom: 10px;
      margin-top: 20px;
      .operation_div {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
}
</style>