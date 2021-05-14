<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="920px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="$emit('update:adjustShow', false)"
      :adjustShow="adjustShow"
    >
      <div slot="title" class="header-title">
        <img class="loginImg" src="@/assets/imgs/batchCreate/batchCreate-price.png" alt />
        <span class="title-age">调价</span>
      </div>
      <div class="adjust-price-dialog-content">
        <el-form
          :model="addPriceForm"
          :rules="addPriceFormRules"
          ref="addPriceForm"
          label-width="110px"
          label-position="left"
        >
          <el-row class="addressRow">
            <el-col :span="24">
              <el-form-item label="价格名称" prop="priceName">
                <el-input v-model="addPriceForm.priceName" style="width:98%;" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用气性质" prop="usageNature">
                <el-select v-model="addPriceForm.usageNature" style="width:95%;" :disabled="true">
                  <el-option
                    v-for="(item,index) in userSubclass"
                    :key="index"
                    :label="item.k"
                    :value="item.v"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计费类型" prop="billingTypeId">
                <el-select
                  v-model="addPriceForm.billingTypeId"
                  clearable
                  style="width:95%;"
                  @change="changebillingType"
                >
                  <el-option
                    v-for="(item,index) in billingTypeEnum2"
                    :key="index"
                    :label="item.k"
                    :value="item.v"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="addPriceForm.billingTypeId == '1' || addPriceForm.billingTypeId == '3'"
            >
              <el-form-item label="单一价格" prop="singlePrice" required>
                <el-input v-model="addPriceForm.singlePrice" style="width:95%;">
                  <span slot="suffix">元/m³</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="addPriceForm.billingTypeId == '3'">
              <el-form-item label="时间单位" prop="timeUnitCode">
                <el-select
                  v-model="addPriceForm.timeUnitCode"
                  clearable
                  :popper-append-to-body="false"
                  style="width:98%;"
                  @change="changeTimeUnitCode"
                >
                  <el-option
                    v-for="(item,index) in timeUnitCodeEnum"
                    :key="index"
                    :label="item.k"
                    :value="item.v"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addPriceForm.billingTypeId == '2'">
              <el-form-item label="周期开始日期" prop="cycleStartTime">
                <el-date-picker
                  v-model="addPriceForm.cycleStartTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width:95%;"
                  :picker-options="pickerOptions"
                  @change="changeEffictive"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addPriceForm.billingTypeId == '2'">
              <el-form-item label="计费周期" prop="billingCycle" required>
                <el-input
                  v-model="addPriceForm.billingCycle"
                  placeholder="请输入计费周期"
                  style="width:95%;"
                  :disabled="billingCycleDisable"
                  @change="changeEffictive"
                >
                  <span slot="suffix">月</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="addPriceForm.ladderPopulation == '1'&&addPriceForm.billingTypeId =='2'"
            >
              <el-form-item label="人口基数" prop="populationBase" required>
                <el-input
                  v-model="addPriceForm.populationBase"
                  placeholder="请输入人口基数"
                  style="width:95%;"
                >
                  <span slot="suffix">人</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="addPriceForm.ladderPopulation == '1'&&addPriceForm.billingTypeId =='2'"
            >
              <el-form-item label="人口递增值" prop="populationIncrease" required>
                <el-input
                  v-model="addPriceForm.populationIncrease"
                  placeholder="请输入人口递增值"
                  style="width:95%;"
                >
                  <span slot="suffix">m³/人</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addPriceForm.billingTypeId == '2' && allowPopulationLadder">
              <el-form-item label="是否人口阶梯" prop="ladderPopulation">
                <el-radio-group v-model="addPriceForm.ladderPopulation">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="addPriceForm.billingTypeId == '2' && allowMonthAvg">
              <el-form-item label="是否按月均摊" prop="adjustLadder">
                <el-radio-group
                  v-model="addPriceForm.adjustLadder"
                  :value="addPriceForm.adjustLadder"
                  @change="getadjustLadderVal"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生效时间" prop="effectiveDate">
                <el-date-picker
                  v-model="addPriceForm.effectiveDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width:95%;"
                  :picker-options="pickerOptions2"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="prePriceTypeId == 2 && addPriceForm.billingTypeId == '2' && allowDefineCycSurplus"
            >
              <el-form-item label="是否重置余量" prop="resetSurplus">
                <el-radio-group
                  v-model="addPriceForm.resetSurplus"
                  :value="addPriceForm.resetSurplus"
                >
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 开始================================================== -->
        <div v-if="addPriceForm.billingTypeId == '2'">
          <div style="margin-bottom:15px;overflow: hidden;">
            <div style="float:left;font-weight:600;font-size:16px;">阶梯计价策略</div>
            <div style="float:right;">
              <span style="display: inline-block;margin-right: 10px;">阶梯数量</span>&nbsp;&nbsp;
              <el-input-number
                size="small"
                v-model="ladderNum"
                @change="ladderNumChange"
                :min="2"
                :max="5"
              ></el-input-number>
            </div>
          </div>

          <el-form :model="tableForm" ref="tableForm" class="laddertableForm">
            <el-table
              size="mini"
              class="bankTable"
              :data="tableForm.itemSetForm"
              stripe
              :header-cell-style="{background:'#DAE7FC',color:'#606266'}"
              style="width: 100%"
            >
              <el-table-column label="阶梯" width="100">
                <template slot-scope="scope">{{numberEnum[scope.$index]}}</template>
              </el-table-column>
              <el-table-column align="left" label="用气量(m³)">
                <template slot-scope="scope">
                  <el-row type="flex" :gutter="24" justify="left" style="width:300px;">
                    <el-col :span="11">
                      <!-- <span v-if="scope.$index == 0">0</span> -->
                      <el-form-item label-width="0" v-if="scope.$index == 0">
                        <el-input v-model.number="scope.row.startNum" :disabled="true"></el-input>
                      </el-form-item>
                      <el-form-item label-width="0" v-if="scope.$index != 0">
                        <el-input v-model="scope.row.startNum" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">~</el-col>
                    <el-col :span="11">
                      <el-form-item
                        label-width="0"
                        v-if="scope.$index == tableForm.itemSetForm.length-1"
                      >
                        <el-input v-model="scope.row.endNum" :disabled="true"></el-input>
                      </el-form-item>
                      <el-form-item
                        label-width="0"
                        :prop="`itemSetForm.${scope.$index}.endNum`"
                        :rules="tableRules.endNum"
                      >
                        <el-input
                          v-model="scope.row.endNum"
                          v-if="scope.$index != tableForm.itemSetForm.length-1"
                          @change="setNextRowStartNum(scope.row,scope.$index)"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column align="left" label="价格(元/m³)" width="160">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="`itemSetForm.${scope.$index}.priceNum`"
                    :rules="tableRules.priceNum"
                    label-width="0"
                  >
                    <el-input v-model="scope.row.priceNum"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.$index == 0 || scope.$index == 1">/</span>
                  <i
                    style="color: #EC6B60;font-size:14px;cursor:pointer"
                    v-if="scope.$index >1"
                    class="el-icon-delete"
                    @click="delLadderLevel(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>

        <div v-if="addPriceForm.billingTypeId == '3'">
          <div style="margin-bottom:15px;overflow: hidden;">
            <div style="float:left;font-weight:600;font-size:16px;">分时计价策略</div>
          </div>

          <el-form
            :model="timePriceForm"
            ref="timePriceForm"
            class="timetableForm"
            style="width:100%;margin:0 auto;"
          >
            <table cellspacing="0" style="width:100%;border-collapse: collapse;">
              <thead style="text-align: left;line-height: 40px;background: #DAE7FC;">
                <tr>
                  <th style="width:100px;padding-left: 10px;">顺序</th>
                  <th>调整时间</th>
                  <th>时长</th>
                  <th>价格(元/m³)</th>
                </tr>
              </thead>

              <tbody>
                <tr style="border-bottom:1px solid #F2F4F6;">
                  <td style="padding-left: 10px;">1</td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm.0.adjustTime"
                      :rules="timeTableRules.adjustTime"
                    >
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '0'"
                        v-model="timePriceForm.itemSetForm[0].adjustTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                      <!-- v-if="addPriceForm.timeUnitCode == '1' || addPriceForm.timeUnitCode == '3'" -->
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '1'"
                        v-model="timePriceForm.itemSetForm[0].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                      ></el-date-picker>
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '2'"
                        v-model="timePriceForm.itemSetForm[0].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="pickerOptions3"
                      ></el-date-picker>
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '3'"
                        v-model="timePriceForm.itemSetForm[0].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="DefultePickerOption"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm.0.timePeriod"
                      :rules="timeTableRules.timePeriod"
                    >
                      <el-input
                        v-model="timePriceForm.itemSetForm[0].timePeriod"
                        style="width:150px;"
                      >
                        <span slot="suffix" v-if="addPriceForm.timeUnitCode == '0'">小时</span>
                        <span
                          slot="suffix"
                          v-if="addPriceForm.timeUnitCode == '1' || addPriceForm.timeUnitCode == '3'"
                        >天</span>
                        <span slot="suffix" v-if="addPriceForm.timeUnitCode == '2'">月</span>
                      </el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm[0].timePrice"
                      :rules="timeTableRules.timePrice"
                    >
                      <el-input
                        v-model="timePriceForm.itemSetForm[0].timePrice"
                        style="width:150px;"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td style="padding-left: 10px;">2</td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm.1.adjustTime"
                      :rules="timeTableRules.adjustTime"
                    >
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '0'"
                        v-model="timePriceForm.itemSetForm[1].adjustTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                      <!-- v-if="addPriceForm.timeUnitCode == '1' || addPriceForm.timeUnitCode == '3'" -->

                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '1'"
                        v-model="timePriceForm.itemSetForm[1].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                      ></el-date-picker>
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '2'"
                        v-model="timePriceForm.itemSetForm[1].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="pickerOptions3"
                      ></el-date-picker>
                      <el-date-picker
                        v-if="addPriceForm.timeUnitCode == '3'"
                        v-model="timePriceForm.itemSetForm[1].adjustTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        :picker-options="DefultePickerOption"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm.1.timePeriod"
                      :rules="timeTableRules.timePeriod"
                    >
                      <el-input
                        v-model.number="timePriceForm.itemSetForm[1].timePeriod"
                        style="width:150px;"
                      >
                        <span slot="suffix" v-if="addPriceForm.timeUnitCode == '0'">小时</span>
                        <span
                          slot="suffix"
                          v-if="addPriceForm.timeUnitCode == '1' || addPriceForm.timeUnitCode == '3'"
                        >天</span>
                        <span slot="suffix" v-if="addPriceForm.timeUnitCode == '2'">月</span>
                      </el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item
                      label-width="0"
                      prop="itemSetForm.1.timePrice"
                      :rules="timeTableRules.timePrice"
                    >
                      <el-input
                        v-model="timePriceForm.itemSetForm[1].timePrice"
                        style="width:150px;"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: left;">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="submitAddPrice()"
        >确定调价</el-button>
        <el-button style="width: 80px;" size="small" @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { basisDataMixin } from "./basisDataMixin";
import { adjustPrices } from "@/api/priceAPI";
import { getTenantDetail } from "@/api/loginAPI";
import _ from "lodash";
import dayjs from "dayjs";

export default {
  name: "adjustPriceDialog",
  mixins: [basisDataMixin],
  props: {
    adjustShow: {
      type: Boolean,
      default: false
    },
    adjustShowAttr: {
      type: Object
    }
  },
  data() {
    var effectTimeCheck = (rule, value, callback) => {
      let endEffDate = this.getEffEndDateFn(
        this.addPriceForm.cycleStartTime,
        this.addPriceForm.billingCycle
      );
      if (this.addPriceForm.billingTypeId != 1) {
        if (new Date(value) > new Date(endEffDate)) {
          callback(new Error("第一个周期需包含生效日期"));
          return;
        }
      }
      callback();
    };
    return {
      billingTypeEnum2: [], //根据调价规则过滤计费类型
      allowDefineCycSurplus: false, //是否允许自定义各阶余量重置策略,默认不允许
      allowMonthAvg: false, //是否允许阶梯价开启按月均摊,默认不允许
      allowPopulationLadder: false, //是否允许阶梯价开启人口阶梯,默认不允许
      visible: this.adjustShow,
      billingCycleDisable: false, //计费周期 按月均摊为是时，不可编辑
      //阶梯计价策略--start=====================
      numberEnum: {
        "0": "一阶梯",
        "1": "二阶梯",
        "2": "三阶梯",
        "3": "四阶梯",
        "4": "五阶梯"
      },
      ladderNum: 5,
      //阶梯数量默认5阶原始值
      defaultFivesLadder: [
        { startNum: "", endNum: "", priceNum: "" },
        { startNum: "", endNum: "", priceNum: "" },
        { startNum: "", endNum: "", priceNum: "" },
        { startNum: "", endNum: "", priceNum: "" },
        { startNum: "", endNum: "", priceNum: "" }
      ],
      tableForm: {
        itemSetForm: []
      },
      tableRules: {
        endNum: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入用气量"));
                return;
              }
              if (value == 0) {
                callback(new Error("必须大于0"));
                return;
              }
              let res = /^[\d]{0,8}$/;
              if (!res.test(value)) {
                callback(new Error("最多8位正整数"));
                return;
              }
              callback();
            }
          }
        ],
        priceNum: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入价格"));
                return;
              }
              // var n = /^\d{1,4}(\.\d{1,4})?$/;
              var n = /^(0\.\d{0,3}[1-9]|\+?[1-9][0-9]{0,3})(\.\d{1,4})?$/; //匹配正浮点数
              if (!n.test(value)) {
                callback("最多4位正整数，4位小数");
                return;
              }
              callback();
            }
          }
        ]
      },
      //阶梯计价策略--end========================

      //分时计价策略--start======================
      timePriceForm: {
        itemSetForm: [
          { key: "1", adjustTime: "", timePeriod: "", timePrice: "" },
          { key: "2", adjustTime: "", timePeriod: "", timePrice: "" }
        ]
      },
      timeTableRules: {
        adjustTime: [
          { required: true, message: "请选择调整时间", trigger: "blur" }
        ],
        timePeriod: [
          { required: true, message: "请输入时长", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              var n = /^[1-9]([0-9])*$/;
              if (!n.test(value)) {
                callback("请输入整数");
                return;
              }
              callback();
            }
          }
        ],
        timePrice: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入价格"));
                return;
              }
              // var n = /^\d{1,4}(\.\d{1,4})?$/;
              var n = /^(0\.\d{0,3}[1-9]|\+?[1-9][0-9]{0,3})(\.\d{1,4})?$/; //匹配正浮点数
              if (!n.test(value)) {
                callback("最多4位正整数，4位小数");
                return;
              }
              callback();
            }
          }
        ]
      },
      //分时计价策略--end========================
      //新增价格表单
      addPriceForm: {
        priceName: null,
        usageNature: null,
        billingTypeId: "1",
        singlePrice: null,
        timeUnitCode: "0",
        cycleStartTime: null, //yyyy-MM-dd 00:00:00需要加时分秒
        billingCycle: null,
        populationBase: null,
        populationIncrease: null,
        ladderPopulation: 0,
        adjustLadder: 0,
        effectiveDate: null, //生效时间
        resetSurplus: 0 //是否重置
      },
      //新增价格表单验证规则
      addPriceFormRules: {
        priceName: [
          { required: true, message: "请输入价格名称", trigger: "change" },
          { max: 20, message: "最多20个字符", trigger: "blur" }
        ],
        adjustLadder: [
          { required: true, message: "请选择是否按月均摊", trigger: "change" }
        ],
        ladderPopulation: [
          { required: true, message: "请选择是否人口阶梯", trigger: "change" }
        ],
        usageNature: [
          { required: true, message: "请选择用气性质", trigger: "change" }
        ],
        billingTypeId: [
          { required: true, message: "请选择计费类型", trigger: "change" }
        ],
        singlePrice: [
          {
            validator: function(rule, value, callback) {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入单一价格"));
                return;
              }
              // var n = /^\d{1,4}(\.\d{1,4})?$/;
              var n = /^(0\.\d{0,3}[1-9]|\+?[1-9][0-9]{0,3})(\.\d{1,4})?$/; //匹配正浮点数
              if (!n.test(value)) {
                callback("最多4位正整数，4位小数");
                return;
              }
              callback();
            }
          }
        ],
        timeUnitCode: [
          { required: true, message: "请选择时间单位", trigger: "change" }
        ],
        cycleStartTime: [
          { required: true, message: "请选择周期开始日期", trigger: "change" }
        ],
        billingCycle: [
          {
            validator: function(rule, value, callback) {
              if (value == null || value.toString().trim() == "") {
                callback(new Error("请输入计费周期"));
                return;
              }
              var n = /^(([1-9])|(1\d)|(2[0-4]))$/;
              if (!n.test(value)) {
                callback("只能输入1-24正整数");
                return;
              }
              callback();
            }
          }
        ],
        populationBase: [
          {
            validator: function(rule, value, callback) {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入人口基数"));
                return;
              }
              var n = /^(?:\d|[12]\d|30)$/;
              if (!n.test(value)) {
                callback("输入格式不对，只能输入0-30");
                return;
              }
              callback();
            }
          }
        ],
        populationIncrease: [
          {
            validator: function(rule, value, callback) {
              if (value == null || value.toString().trim() == "") {
                //排除为0 的情况
                callback(new Error("请输入人口递增值"));
                return;
              }
              var n = /^\d{1,3}(\.\d{1,2})?$/;
              if (!n.test(value)) {
                callback("输入格式不对，最多输入3位整数，2位小数");
                return;
              }
              callback();
            }
          }
        ],
        effectiveDate: [
          { required: true, message: "请选择生效时间", trigger: "change" },
          {
            validator: effectTimeCheck,
            trigger: "change"
          }
        ],
        resetSurplus: [
          { required: true, message: "请选择是否重置", trigger: "change" }
        ]
      },
      //周期开始时间配置项，不能选择每个月29、20、31号
      pickerOptions: {
        disabledDate(time) {
          return new Date(time).getDate() > "28";
        }
      },
      DefultePickerOption: {
        disabledDate(time) {
          return;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          var times = Date.now();
          return time.getTime() < times;
        }
      },
      //时间单位为月时，只能选择每个月1日
      pickerOptions3: {
        disabledDate(time) {
          return new Date(time).getDate() > "1";
        }
      },
      prePriceTypeId: null //调价前的价格类型id
    };
  },
  created() {
    this.tableForm.itemSetForm = this.formatLadderArray(
      this.defaultFivesLadder
    );
    this.loadData();
    //获取租户业务配置
    this.getTenantDetails();
  },
  methods: {
    loadData() {
      let pricesDetails = this.adjustShowAttr;
      for (let key in pricesDetails) {
        if (pricesDetails[key] !== null) {
          if (key == "effectiveTime") {
            pricesDetails["effectiveDate"] = ""; //pricesDetails["effectiveTime"].slice(0, 10);
          } else {
            pricesDetails[key] = pricesDetails[key] + "";
          }
        }
      }
      //单一计价
      if (pricesDetails.billingTypeId == "1") {
        this.billingTypeEnum2 = this.billingTypeEnum.filter(function(item) {
          return item.v != "3"; //单一计费可以换：单一计费、阶梯计费
        });
      }
      //2-阶梯计费、
      if (pricesDetails.billingTypeId == "2") {
        var levelBorder = pricesDetails.levelBorder;
        var levelPrice = pricesDetails.levelPrice;
        var arr1 = levelBorder.split("|");
        var arr2 = levelPrice.split("|");
        var obj = { startNum: "", endNum: "", priceNum: "" };
        var arr4 = [];

        this.billingTypeEnum2 = this.billingTypeEnum.filter(function(item) {
          return item.v != "3"; //阶梯计费可以换：阶梯计费、单一计费。
        });

        for (var k = 0; k < arr1.length; k++) {
          if (k == 0) {
            var obj = { startNum: "0", endNum: arr1[k], priceNum: arr2[k] };
            arr4.push(obj);
          } else {
            let obj2 = {};
            if (k == arr1.length - 1) {
              obj2 = {
                startNum: arr4[k - 1].endNum,
                endNum: "99999999",
                priceNum: arr2[k]
              };
            } else {
              obj2 = {
                startNum: arr4[k - 1].endNum,
                endNum: Number(arr4[k - 1].endNum) + Number(arr1[k]) + "",
                priceNum: arr2[k]
              };
            }

            arr4.push(obj2);
          }
        }
        this.ladderNum = pricesDetails.ladderLevel;
        this.tableForm.itemSetForm = arr4;
      }

      // //3-分时计费
      if (pricesDetails.billingTypeId == "3") {
        let adjustTimeArr = pricesDetails["adjustTime"].split("|");
        let timePeriodArr = pricesDetails["timePeriod"].split("|");
        let timePriceArr = pricesDetails["timePrice"].split("|");
        this.billingTypeEnum2 = this.billingTypeEnum; //分时计费可以换：分时计费、3级及以下的阶梯计费、单一计费
        this.timePriceForm.itemSetForm = [
          {
            key: "1",
            adjustTime: adjustTimeArr[0],
            timePeriod: timePeriodArr[0],
            timePrice: timePriceArr[0]
          },
          {
            key: "2",
            adjustTime: adjustTimeArr[1],
            timePeriod: timePeriodArr[1],
            timePrice: timePriceArr[1]
          }
        ];
      }
      let _addPriceForm = JSON.parse(JSON.stringify(pricesDetails));
      this.prePriceTypeId = _addPriceForm.billingTypeId;
      this.addPriceForm = {
        priceName: _addPriceForm.priceName,
        usageNature: _addPriceForm.usageNature,
        billingTypeId: _addPriceForm.billingTypeId,
        singlePrice: _addPriceForm.singlePrice,
        timeUnitCode: _addPriceForm.timeUnitCode,
        cycleStartTime: _addPriceForm.cycleStartTime, //yyyy-MM-dd 00:00:00需要加时分秒
        billingCycle: _addPriceForm.billingCycle,
        populationBase: _addPriceForm.populationBase,
        populationIncrease: _addPriceForm.populationIncrease,
        ladderPopulation: parseInt(_addPriceForm.ladderPopulation) || 0,
        adjustLadder: parseInt(_addPriceForm.adjustLadder) || 0,
        effectiveDate: _addPriceForm.effectiveDate, //生效时间
        resetSurplus: parseInt(_addPriceForm.resetSurplus) || 0 //是否重置
      };
    },
    formatLadderArray(arr) {
      let datas = arr;
      for (let i = 0; i < datas.length; i++) {
        if (i == 0) {
          datas[i].startNum = "0";
        }
        if (i == datas.length - 1) {
          datas[i].endNum = "99999999";
        }
      }
      return datas;
    },
    //获取租户业务配置
    getTenantDetails() {
      getTenantDetail()
        .then(res => {
          let resultData = res.data;
          if (resultData.code == 0) {
            if (resultData && resultData.data) {
              if (resultData.data.business_config) {
                let configData = resultData.data.business_config;
                //是否允许自定义各阶余量重置策略,默认不允许
                this.allowDefineCycSurplus =
                  configData.is_allow_define_cyc_surplus !== undefined
                    ? configData.is_allow_define_cyc_surplus
                    : false;
                //是否允许阶梯价开启按月均摊,默认不允许
                this.allowMonthAvg =
                  configData.is_allow_month_avg !== undefined
                    ? configData.is_allow_month_avg
                    : false;
                //是否允许阶梯价开启人口阶梯,默认不允许
                this.allowPopulationLadder =
                  configData.is_allow_population_ladder !== undefined
                    ? configData.is_allow_population_ladder
                    : false;
              } else {
                this.$message.error(
                  "该租户未配置参数--初始周期累积量和上报类型"
                );
              }
            }
          } else {
            this.$message.error(`租户业务配置查询失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("获取租户业务配置发生错误-接口请求失败");
        });
    },
    changebillingType() {
      this.$refs.addPriceForm.clearValidate();
      this.changeEffictive();
    },
    changeEffictive() {
      if (this.addPriceForm.billingTypeId == 2) {
        //阶梯计费：开始日期<=生效日期必须< 截止日期
        let endEffDate = this.getEffEndDateFn(
          this.addPriceForm.cycleStartTime,
          this.addPriceForm.billingCycle
        );
        if (endEffDate) {
          this.pickerOptions2.disabledDate = function(time) {
            var times = Date.now();
            return (
              // time.getTime() < times || new Date(time) > new Date(endEffDate)
              // 不能小于当前日期
              time.getTime() < times
            );
          };
        } else {
          this.pickerOptions2.disabledDate = function(time) {
            var times = Date.now();
            return time.getTime() < times;
          };
        }
      } else {
        this.pickerOptions2.disabledDate = function(time) {
          var times = Date.now();
          return time.getTime() < times;
        };
      }
    },
    getEffEndDateFn(startTime, mAfter) {
      if (!startTime || !mAfter) {
        return "";
      }
      //获取生效日期边界值
      let d = new Date(startTime);
      d.setMonth(d.getMonth() + Number(mAfter));
      d.setDate(d.getDate() - 1); //开始日期<=生效日期必须< 截止日期
      let yy = d.getFullYear();
      let mm = d.getMonth() + 1;
      let dd = d.getDate();
      mm = mm < 10 ? "0" + mm : mm;
      dd = dd < 10 ? "0" + dd : dd;
      return yy + "-" + mm + "-" + dd;
    },
    getadjustLadderVal(val) {
      //按月均摊的阶梯价计费周期只可设置为12个月
      //按月均摊的周期开始日期的月日只能是1月1日
      if (val == "1") {
        this.addPriceForm.billingCycle = "12";
        this.billingCycleDisable = true;
        this.$refs.addPriceForm.clearValidate("billingCycle");
        this.addPriceForm.cycleStartTime = new Date().getFullYear() + "-01-01";
        this.pickerOptions.disabledDate = function(time) {
          return (
            new Date(time).getDate() != 1 || new Date(time).getMonth() + 1 != 1
          );
        };
        this.changeEffictive();
      } else {
        this.billingCycleDisable = false;
        this.pickerOptions.disabledDate = function(time) {
          return new Date(time).getDate() > "28";
        };
      }
    },
    //阶梯数量点击事件
    ladderNumChange(value) {
      if (value >= 2 && value <= 5) {
        let _data = this.tableForm.itemSetForm;
        _data[_data.length - 1].endNum = "";
        let _cloneData = [];
        for (let i = 0; i < value; i++) {
          if (_data[i]) {
            _cloneData.push(_data[i]);
          } else {
            let obj = { startNum: "", endNum: "", priceNum: "" };
            _cloneData.push(obj);
          }
        }
        this.tableForm.itemSetForm = this.formatLadderArray(_cloneData);
        this.$refs.tableForm.clearValidate(); //清空校验信息
      }
    },
    //用气量输入框验证逻辑
    setNextRowStartNum(row, index) {
      let datas = this.tableForm.itemSetForm;

      //同一阶最大值不能小于最小值()
      if (
        datas[index].startNum !== null &&
        datas[index].startNum !== "" &&
        Number(datas[index].endNum) <= Number(datas[index].startNum)
      ) {
        datas[index].endNum = "";

        return this.$message.error("同一阶最大值必须大于最小值");
      }

      //下一阶最大值存在，则上一阶的最大值不能大于下一阶最大值
      if (
        datas[index + 1].endNum !== null &&
        datas[index + 1].endNum !== "" &&
        Number(datas[index + 1].endNum) <= Number(datas[index].endNum)
      ) {
        datas[index].endNum = "";
        return this.$message.error("上一阶的最大值必须小于下一阶最大值");
      }

      //上一阶梯的最大值 是下一阶梯的最小值
      if (index + 1 !== datas.length) {
        //下一阶不是最后一阶
        //下一阶最小值 = 上一阶的最大值
        datas[index + 1].startNum = datas[index].endNum;
      }
    },
    //删除任意阶梯按钮事件
    delLadderLevel(index) {
      let datas = this.tableForm.itemSetForm;

      //使删除阶梯的上一阶最大值 赋值给 删除阶梯的的下一阶最小值
      if (index + 1 <= datas.length - 1 && datas[index - 1].endNum) {
        datas[index + 1].startNum = datas[index - 1].endNum;
        datas.splice(index, 1);
        this.tableForm.itemSetForm = this.formatLadderArray(
          this.tableForm.itemSetForm
        );
        this.$refs.tableForm.clearValidate();
        this.ladderNum = Number(this.tableForm.itemSetForm.length);
        return;
      }

      if (index + 1 <= datas.length - 1 && !datas[index - 1].endNum) {
        datas[index + 1].startNum = "";
        datas.splice(index, 1);
        this.tableForm.itemSetForm = this.formatLadderArray(
          this.tableForm.itemSetForm
        );
        this.$refs.tableForm.clearValidate();
        this.ladderNum = Number(this.tableForm.itemSetForm.length);
        return;
      }

      if (index == datas.length - 1) {
        datas.splice(index, 1);
        this.tableForm.itemSetForm = this.formatLadderArray(
          this.tableForm.itemSetForm
        );
        this.$refs.tableForm.clearValidate();
        this.ladderNum = Number(this.tableForm.itemSetForm.length);
        return;
      }
    },
    submitAddPrice() {
      if (this.addPriceForm.billingTypeId == "1") {
        this.addSinglePrice();
      }
      if (this.addPriceForm.billingTypeId == "2") {
        this.addLevelPrice();
      }
      if (this.addPriceForm.billingTypeId == "3") {
        this.addTimePrice();
      }
    },
    //单一价提交
    addSinglePrice() {
      this.$refs["addPriceForm"].validate(valid => {
        if (valid) {
          let obj = {
            billingTypeId: this.addPriceForm.billingTypeId,
            priceName: this.addPriceForm.priceName,
            usageNature: this.addPriceForm.usageNature,
            priceId: this.adjustShowAttr.priceId, //价格id
            effectiveDate: this.addPriceForm.effectiveDate.slice(0, 10), //生效日期
            singlePrice: this.addPriceForm.singlePrice
          };
          for (let i in obj) {
            if (typeof obj[i] == "string" && obj[i].constructor == String) {
              obj[i] = obj[i].trim();
            }
          }
          adjustPrices(obj)
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success("调价成功!");
                this.visible = false;
                this.$parent.getPricesList();
              } else {
                this.$message.error(`调价失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("调价失败-接口请求失败");
            });
        }
      });
    },
    //阶梯价提交
    addLevelPrice() {
      let p1 = new Promise((resolve, reject) => {
        this.$refs["addPriceForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
          }
        });
      });
      let p2 = new Promise((resolve, reject) => {
        this.$refs["tableForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
          }
        });
      });
      Promise.all([p1, p2]).then(() => {
        let levelBorderStr = ""; //阶梯边界
        let levelPriceStr = ""; //阶梯价格
        let data = this.tableForm.itemSetForm;
        for (let i = 0; i < data.length; i++) {
          if (i == data.length - 1) {
            levelBorderStr += "99999999";
          } else {
            let useGas = Number(data[i].endNum) - Number(data[i].startNum);
            levelBorderStr += useGas + "|";
          }

          if (i == data.length - 1) {
            levelPriceStr += data[i].priceNum;
          } else {
            levelPriceStr += data[i].priceNum + "|";
          }
        }
        let obj = {
          priceName: this.addPriceForm.priceName,
          usageNature: this.addPriceForm.usageNature,
          priceId: this.adjustShowAttr.priceId, //价格id
          effectiveDate: this.addPriceForm.effectiveDate.slice(0, 10), //生效日期
          billingTypeId: this.addPriceForm.billingTypeId,
          adjustLadder: this.allowMonthAvg
            ? this.addPriceForm.adjustLadder || 0
            : 0, //按月均摊
          billingCycle: this.addPriceForm.billingCycle, //计费周期,按月均摊的阶梯价只可设置为12
          cycleStartDate: this.addPriceForm.cycleStartTime.slice(0, 10), //周期开始日期,按月均摊的周期开始日期的月日只能是1月1日，最大只可选到28日
          ladderLevel: this.ladderNum, //阶梯级数
          ladderPopulation: this.allowPopulationLadder
            ? this.addPriceForm.ladderPopulation || 0
            : 0, //是否人口阶梯
          levelBorder: levelBorderStr, //this.levelBorder//阶梯边界,
          levelPrice: levelPriceStr, //this.levelPrice,//阶梯价格
          populationBase: this.addPriceForm.populationBase, //人口基数
          populationIncrease: this.addPriceForm.populationIncrease, //人口递增值
          resetSurplus: this.allowDefineCycSurplus
            ? this.addPriceForm.resetSurplus || 0
            : 0
        };
        for (let i in obj) {
          if (typeof obj[i] == "string" && obj[i].constructor == String) {
            obj[i] = obj[i].trim();
          }
        }
        adjustPrices(obj)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success("调价成功!");
              this.visible = false;
              this.$parent.getPricesList();
            } else {
              this.$message.error(`调价失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.$message.error("调价失败-接口请求失败");
          });
      });
    },
    //分时价提交
    addTimePrice() {
      let p1 = new Promise((resolve, reject) => {
        this.$refs["timePriceForm"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });

      let p2 = new Promise((resolve, reject) => {
        this.$refs["addPriceForm"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });

      Promise.all([p1, p2]).then(() => {
        let ruleFlag = this.checkRule();
        if (!ruleFlag) {
          return;
        }
        let datas = this.timePriceForm;
        let timePeriod =
          datas.itemSetForm[0].timePeriod +
          "|" +
          datas.itemSetForm[1].timePeriod;
        let timePrice =
          datas.itemSetForm[0].timePrice + "|" + datas.itemSetForm[1].timePrice;
        let adjustTime =
          datas.itemSetForm[0].adjustTime +
          "|" +
          datas.itemSetForm[1].adjustTime;
        let obj = {
          priceName: this.addPriceForm.priceName,
          usageNature: this.addPriceForm.usageNature,
          priceId: this.adjustShowAttr.priceId, //价格id
          effectiveDate: this.addPriceForm.effectiveDate.slice(0, 10), //生效日期
          billingTypeId: this.addPriceForm.billingTypeId,
          singlePrice: this.addPriceForm.singlePrice, //单一价格
          timeUnitCode: this.addPriceForm.timeUnitCode, //时间单位
          adjustTime: adjustTime, //调整时间 格式：yyyy-MM-dd HH:mm:ss|yyyy-MM-dd HH:mm:ss
          timePeriod: timePeriod, //分时时长 格式：时长1|时长2
          timePrice: timePrice //分时价格 格式：单价1|单价2
        };
        for (let i in obj) {
          if (typeof obj[i] == "string" && obj[i].constructor == String) {
            obj[i] = obj[i].trim();
          }
        }
        adjustPrices(obj)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success("调价成功!");
              this.visible = false;
              this.$parent.getPricesList();
            } else {
              this.$message.error(`调价失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.$message.error("调价失败-接口请求失败");
          });
      });
    },
    //分时计价业务验证逻辑
    checkRule() {
      let datas = this.timePriceForm;
      let timeUnitCode = this.addPriceForm.timeUnitCode;

      let selecttime1 = datas.itemSetForm[0].adjustTime; //调整时间1
      let time1 = Number(datas.itemSetForm[0].timePeriod); //时长1

      let selecttime2 = datas.itemSetForm[1].adjustTime; //调整时间2
      let time2 = Number(datas.itemSetForm[1].timePeriod); //时长1

      //当前时间
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      //
      let day31 = ["01", "03", "05", "07", "08", "10", "12"];
      let day30 = ["04", "06", "09", "11"];
      let day28 = ["02"];

      //时长单位为小时，循环周期为自然天
      if (timeUnitCode == "0") {
        let selecttime1Date1 = selecttime1.slice(0, 10);
        let selecttime1Date2 = selecttime2.slice(0, 10);
        let selecttime1Hours1 = Number(selecttime1.slice(11, 13));
        let selecttime1addlongtime1 = time1 + selecttime1Hours1;
        let selecttime1Hours2 = Number(selecttime2.slice(11, 13));
        let selecttime2addlongtime2 = time2 + selecttime1Hours2;

        if (selecttime1Date1 !== selecttime1Date2) {
          //调整时间1和调整时间1选择的日期不在同一天
          this.$message.error("调整时间1和调整时间2选择的日期不是同一天");
          return false;
        }

        if (selecttime1addlongtime1 > selecttime1Hours2) {
          //调整时间1选择的小时数 加上 时长1 必须小于等于 调整时间2选择的小时
          this.$message.error(
            "调整时间1选择的小时数 加上 时长1 必须小于等于 调整时间2选择的小时"
          );
          return false;
        }
        if (selecttime2addlongtime2 > 24) {
          //调整时间2选择的小时数 加上 时长2 必须小于等于 24小时
          this.$message.error(
            "调整时间2选择的小时数 加上 时长2 必须小于等于 24小时"
          );
          return false;
        }

        return true;
      }

      //时长单位为天，循环周期为自然月
      if (timeUnitCode == "1") {
        let selecttime1Month1 = selecttime1.slice(0, 7);
        let selecttime1Month2 = selecttime2.slice(0, 7);

        let selecttime1Day1 = Number(selecttime1.slice(8, 10));
        let selecttime1addlongtime1 = time1 + selecttime1Day1;

        let selecttime1Day2 = Number(selecttime2.slice(8, 10));
        let selecttime2addlongtime2 = time2 + selecttime1Day2;

        let currentDays;
        // let year = selecttime1.slice(0, 4);
        let selectMonth = selecttime1.slice(5, 7);
        let d31 = day31.includes(selectMonth);
        let d30 = day30.includes(selectMonth);
        let d28 = day28.includes(selectMonth);
        if (d31 == true) {
          currentDays = 31;
        }
        if (d30 == true) {
          currentDays = 30;
        }
        if (d28 == true) {
          let cond1 = year % 4 == 0;
          let cond2 = year % 100 != 0;
          let cond3 = year % 400 == 0;
          let cond = (cond1 && cond2) || cond3;
          if (cond) {
            currentDays = 29;
          } else {
            currentDays = 28;
          }
        }

        if (selecttime1Month1 !== selecttime1Month2) {
          //调整时间1和调整时间1选择的日期不在同一个月
          this.$message.error("调整时间1和调整时间2选择的日期不是同一个月");
          return false;
        }

        if (selecttime1addlongtime1 > selecttime1Day2) {
          //调整时间1选择的日 加上 时长1 必须小于等于 调整时间2选择的日
          this.$message.error(
            "调整时间1选择的日 加上 时长1 必须小于等于 调整时间2选择的日"
          );
          return false;
        }

        if (selecttime2addlongtime2 > currentDays) {
          //调整时间2选择的日数 加上 时长2 必须小于等于 选中月的最多天数
          this.$message.error(
            "调整时间2选择的日数 加上 时长2 必须小于等于 选中月的最多天数"
          );
          return false;
        }
        return true;
      }

      //时长单位为月，循环周期为年（顺延年）
      if (timeUnitCode == "2") {
        let selecttime1Month2 = this.timestamp(selecttime2.slice(0, 7));

        let selectyear1;
        let month1 = Number(selecttime1.slice(5, 7)) + Number(time1);
        if (month1 > 12) {
          selectyear1 =
            (Number(selecttime1.slice(0, 4)) + 1).toString() +
            "-" +
            (month1 - 12);
        } else {
          selectyear1 =
            selecttime1.slice(0, 4) +
            "-" +
            (month1 < 10 ? "0" + month1 : month1);
        }

        let selectyear2;
        let month2 = Number(selecttime2.slice(5, 7)) + Number(time2 - 1);
        if (month2 > 12) {
          selectyear2 = this.timestamp(
            (Number(selecttime2.slice(0, 4)) + 1).toString() +
              "-" +
              (month2 - 12)
          );
        } else {
          selectyear2 = this.timestamp(
            selecttime2.slice(0, 4) +
              "-" +
              (month2 < 10 ? "0" + month2 : month2)
          );
        }

        if (selecttime1Month2 < this.timestamp(selectyear1)) {
          //调整时间2选择的日期（年月）必须 大于等于 调整时间1的日期（月份）加 时长1
          this.$message.error(
            "调整时间2选择的日期（年月）必须 大于等于 调整时间1的日期（月份）加 时长1"
          );
          return false;
        }

        let select1month1 = selecttime1.slice(5, 7);
        let select1day1 = selecttime1.slice(8, 10);
        let currentyear = this.timestamp(
          (Number(selecttime1.slice(0, 4)) + 1).toString() +
            "-" +
            select1month1 +
            "-" +
            select1day1
        );

        if (selectyear2 > currentyear) {
          //调整时间2+时长2后的日期 必须小于等于 调整时间1一年后的日期
          this.$message.error(
            "调整时间2+时长2后的日期 必须小于等于 调整时间1一年后的日期"
          );
          return false;
        }
        //计算数据 调整时间2+时长2后的日期必须小于等于调整时间1一年后的日期
        let afertOneYear1 = dayjs(selecttime1)
          .add(12, "month")
          .format("YYYY-MM-DD");
        let afterYear2 = dayjs(selecttime2)
          .add(time2, "month")
          .format("YYYY-MM-DD");
        if (this.timestamp(afertOneYear1) < this.timestamp(afterYear2)) {
          this.$message.error({
            message: "调整时间2+时长2后的日期必须小于等于调整时间1一年后的日期",
            duration: 5000
          });
          return false;
        }
        return true;
      }

      //时长单位为天，循环周期为年（顺延年）
      if (timeUnitCode == "3") {
        let year = selecttime1.slice(0, 4);
        let timeunit = time1 + time2;
        let cond1 = year % 4 == 0;
        let cond2 = year % 100 != 0;
        let cond3 = year % 400 == 0;
        let cond = (cond1 && cond2) || cond3;
        let curretnYearDays;
        if (cond) {
          curretnYearDays = 366;
        } else {
          curretnYearDays = 365;
        }
        if (timeunit > curretnYearDays) {
          //时长1+时长2 必须小于等于 一年天数（365、366天）
          this.$message.error(
            "时长1+时长2 必须小于等于 一年天数（365、366天）"
          );
          return false;
        }
        let selecttimes1 = this.timestamp(selecttime1.slice(0, 10));
        let time1millisecond = Number(time1) * 86400000;
        let minday = selecttimes1 + time1millisecond;

        let selecttimes2 = this.timestamp(selecttime2.slice(0, 10));

        if (minday > selecttimes2) {
          //调整时间1(年月日)+时长2 必须小于 一年天数（365、366天）
          this.$message.error(
            "调整时间2的日期必须大于等于调整时间1的日期加上时长1"
          );
          return false;
        }

        let selecttimes2length = selecttimes2 + Number(time2) * 86400000;
        let maxday = this.timestamp(
          Number(selecttime1.slice(0, 4)) + 1 + "-" + selecttime1.slice(5, 10)
        );

        if (selecttimes2length > maxday) {
          //调整时间2+时长2 必须 小于等于 调整时间1一年后的日期
          this.$message.error(
            "调整时间2+时长2 必须 小于等于 调整时间1一年后的日期"
          );
          return false;
        }

        return true;
      }
    },
    /**
     * 日期转为时间戳
     * @param dateStr {string}
     * @return {number}
     */
    timestamp(dateStr) {
      if (
        !dateStr ||
        (typeof dateStr === "number" && (dateStr + "").length !== 13)
      ) {
        console.error("timestamp() -> 未传入有效参数，期望为格式化日期字符串");
        return false;
      } else if (typeof dateStr === "number" && (dateStr + "").length === 13) {
        console.warn(
          "timestamp() -> 参数期望为格式化日期字符串，却传入时间戳，已直接返回"
        );
        return dateStr;
      }
      var puredata = dateStr
          .replace(/-|年|月/g, "-")
          .replace(/日/g, "")
          .replace(/ /g, "-")
          .replace(/:/g, "-"),
        part = puredata.split("-"),
        date = new Date(
          part[0] ? part[0] : "",
          part[1] ? part[1] - 1 : "",
          part[2] ? part[2] : "",
          part[3] ? part[3] : "",
          part[4] ? part[4] : "",
          part[5] ? part[5] : ""
        );
      return date.getTime();
    },
    changeTimeUnitCode() {
      this.$refs.timePriceForm.clearValidate();
      this.timePriceForm = this.$options.data()["timePriceForm"];
    }
  },
  watch: {
    // 监听开始日期当改变时候重新选择生效日期
    "addPriceForm.cycleStartTime"(newVal, oldVal) {
      this.addPriceForm.effectiveDate = null;
    },
    "addPriceForm.billingCycle"(newVal, oldVal) {
      this.addPriceForm.effectiveDate = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.addressRow {
  ::v-deep .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
}
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}

.header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
::v-deep .el-dialog__footer {
  box-shadow: 0px -1px 4px 0px rgba(0, 33, 77, 0.1);
}
.adjust-price-dialog-content {
  max-height: 384px;
  min-height: 204px;
  overflow: auto;
  padding: 24px 35px 10px 40px;
}
.laddertableForm {
  width: 100%;
  margin: 0 auto;
  ::v-deep .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
}
.timetableForm {
  ::v-deep .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
}
.loginImg {
  width: 20px;
  height: 20px;
  vertical-align: sub;
  margin-right: 10px;
}
</style>