<template>
  <div class="priceContent">
    <div class="leftBox">
      <div class="left-header-box">
        <div class="BoxHead">
          <div class="BoxTitle">
            <img class="loginImg" src="@/assets/imgs/batchCreate/batchCreate-price.png" alt />
            <span>价格列表</span>
          </div>
          <el-button
            class="BoxBtn"
            size="small"
            @click="openAddPriceDialog"
            v-has="'priceManagement_add'"
          >新增价格</el-button>
        </div>
      </div>
      <div class="left-body-content" v-loading="loading">
        <vue-scroll :ops="ops">
          <div v-if="pricesList.length>0">
            <div
              v-for="(item,index) in pricesList"
              :key="index"
              :class="{ 'priceListRow': isActive2, 'activestyle': isActive==item.priceId }"
              @click="getPriceDetail(item,index)"
            >
              <div class="pricelistName">{{item.priceName}}</div>
              <div style="float:right;">
                <span
                  :class="['flagpoint',{'onUseing': item.statusMask == '在用'||item.statusMask == '待生效'},{'unUseing': item.statusMask == '禁用'||item.statusMask == '已删除'||item.statusMask == '停用'},{},{}]"
                ></span>
                <span>{{item.statusMask}}</span>
              </div>
            </div>
          </div>
          <div
            v-if="pricesList.length == 0"
            style="height:40px;line-height:40px;text-align:center;"
          >{{isCrossDomain&&!selectedOrg?'请选择组织机构':"暂无数据"}}</div>
          <div></div>
        </vue-scroll>
      </div>
    </div>
    <div class="rightBox">
      <div class="right-Head-box">
        <div class="right-Head">
          <div class="BoxTitle">
            <img class="loginImg" src="@/assets/imgs/batchCreate/batchCreate-price.png" alt />
            <span v-if="singlePriceDetail !== null">{{singlePriceDetail.priceName}}</span>
            <span v-if="timePriceDetail !== null">{{timePriceDetail.priceName}}</span>
            <span v-if="levelPriceDetail !==null">{{levelPriceDetail.priceName}}</span>
          </div>
          <div class="right-btn-box" v-if="pricesList.length>0">
            <el-button
              size="small"
              class="BoxBtn"
              style="width: 80px;border:1px solid #2F87FE;color:#2F87FE;"
              @click="openAdjustPriceDialog()"
              v-has="'priceManagement_modify'"
            >调价</el-button>
            <el-button
              size="small"
              class="BoxBtn"
              @click="editPriceVisible = true"
              v-has="'priceManagement_edit'"
            >编辑</el-button>
            <el-button
              class="BoxBtn"
              size="small"
              v-if="currentPrice && currentPrice.enableFlag == 2"
              v-has="'priceManagement_enable'"
              style="margin-left: 10px;margin-right: 10px;width: 80px;"
              @click="enableVisible = true"
            >启用</el-button>
            <el-button
              class="BoxBtn"
              size="small"
              v-if="currentPrice && currentPrice.enableFlag == 1"
              v-has="'priceManagement_disable'"
              style="margin-left: 10px;margin-right: 10px;width: 80px;"
              @click="disableVisible = true"
            >禁用</el-button>
            <el-button
              style="width: 80px;"
              size="small"
              :class="[{'deleteBtnPrice':delBtn}]"
              :disabled="delBtn"
              @click="delPrice()"
              v-has="'priceManagement_delete'"
            >删除</el-button>
          </div>
        </div>
      </div>
      <div class="BoxBody" v-loading="loading2">
        <vue-scroll :ops="ops" v-if="pricesList.length > 0">
          <!-- 价格详情 -->
          <div v-if="singlePriceDetail !== null">
            <!-- 单一计价 -->
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">价格版本：</div>
                <div class="price-title-content">{{singlePriceDetail.priceVersion}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">状态：</div>
                <div class="price-title-content">
                  <span
                    :class="['flagpoint',{'onUseing': singlePriceDetail.statusMask == '在用'||singlePriceDetail.statusMask == '待生效'},{'unUseing': singlePriceDetail.statusMask == '禁用'||singlePriceDetail.statusMask == '已删除'||singlePriceDetail.statusMask == '停用'}]"
                  ></span>
                  {{singlePriceDetail.statusMask}}
                </div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">用气性质：</div>
                <div class="price-title-content">{{singlePriceDetail.usageNaturename}}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">计费类型：</div>
                <div class="price-title-content">{{singlePriceDetail.billingTypeIdname}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">单一价格：</div>
                <div class="price-title-content">{{singlePriceDetail.singlePrice||'--'}}元/m³</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">生效日期：</div>
                <div
                  class="price-title-content"
                >{{singlePriceDetail.effectiveTime?singlePriceDetail.effectiveTime.substring(0,10):singlePriceDetail.effectiveTime}}</div>
              </el-col>
            </el-row>
          </div>
          <div v-if="timePriceDetail !== null">
            <!-- 分时计价 -->
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">价格版本：</div>
                <div class="price-title-content">{{timePriceDetail.priceVersion}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">状态：</div>
                <div class="price-title-content">
                  <span
                    :class="['flagpoint',{'onUseing': timePriceDetail.statusMask == '在用'||timePriceDetail.statusMask == '待生效'},{'unUseing': timePriceDetail.statusMask == '禁用'||timePriceDetail.statusMask == '已删除'||timePriceDetail.statusMask == '停用'}]"
                  ></span>
                  {{timePriceDetail.statusMask}}
                </div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">用气性质：</div>
                <div class="price-title-content">{{timePriceDetail.usageNaturename}}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">计费类型：</div>
                <div class="price-title-content">{{timePriceDetail.billingTypeIdname}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">单一价格：</div>
                <div class="price-title-content">{{timePriceDetail.singlePrice||'--'}} 元/m³</div>
              </el-col>
              <el-col :span="12" class="infoWidth">
                <div class="price-title-label">时间单位：</div>
                <div class="price-title-content">{{timePriceDetail.timeUnitCodename}}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">生效日期：</div>
                <div
                  class="price-title-content"
                >{{timePriceDetail.effectiveTime?timePriceDetail.effectiveTime.substring(0,10):timePriceDetail.effectiveTime}}</div>
              </el-col>
            </el-row>
          </div>
          <div v-if="levelPriceDetail !==null">
            <!-- 阶梯计价 -->
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">价格版本：</div>
                <div class="price-title-content">{{levelPriceDetail.priceVersion}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">状态：</div>
                <div class="price-title-content">
                  <span
                    :class="['flagpoint',{'onUseing': levelPriceDetail.statusMask == '在用'||levelPriceDetail.statusMask == '待生效'},{'unUseing':levelPriceDetail.statusMask == '禁用'||levelPriceDetail.statusMask == '已删除'||levelPriceDetail.statusMask == '停用'}]"
                  ></span>
                  {{levelPriceDetail.statusMask}}
                </div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">用气性质：</div>
                <div class="price-title-content">{{levelPriceDetail.usageNaturename}}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">计费类型：</div>
                <div class="price-title-content">{{levelPriceDetail.billingTypeIdname}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">周期开始日期：</div>
                <div
                  class="price-title-content"
                >{{levelPriceDetail.cycleStartTime?levelPriceDetail.cycleStartTime.substring(0,10):levelPriceDetail.cycleStartTime}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">计费周期：</div>
                <div class="price-title-content">{{levelPriceDetail.billingCycle||0}}&nbsp;月</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth">
                <div class="price-title-label">生效日期：</div>
                <div
                  class="price-title-content"
                >{{levelPriceDetail.effectiveTime?levelPriceDetail.effectiveTime.substring(0,10):levelPriceDetail.effectiveTime}}</div>
              </el-col>
              <el-col :span="6" class="infoWidth" v-if="levelPriceDetail.ladderPopulation == 1">
                <div class="price-title-label">人口基数：</div>
                <div class="price-title-content">{{levelPriceDetail.populationBase||0}}&nbsp;人</div>
              </el-col>
              <el-col :span="6" class="infoWidth" v-if="levelPriceDetail.ladderPopulation == 1">
                <div class="price-title-label">人口递增值：</div>
                <div
                  class="price-title-content"
                >{{levelPriceDetail.populationIncrease||0}}&nbsp;m³/人</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="6" class="infoWidth" v-if="isAllowPopulationLadder">
                <div class="price-title-label">是否人口阶梯：</div>
                <div class="price-title-content">
                  <span v-if="levelPriceDetail.ladderPopulation == 1">是</span>
                  <span v-if="levelPriceDetail.ladderPopulation == 0">否</span>
                </div>
              </el-col>
              <el-col :span="6" class="infoWidth" v-if="isAllowMonthAvg">
                <div class="price-title-label">是否按月均摊：</div>
                <div class="price-title-content">
                  <span v-if="levelPriceDetail.adjustLadder == 1">是</span>
                  <span v-if="levelPriceDetail.adjustLadder == 0">否</span>
                </div>
              </el-col>
              <el-col :span="6" class="infoWidth" v-if="levelPriceDetail.priceVersion !=1">
                <div class="price-title-label">是否重置余量：</div>
                <div class="price-title-content">
                  <span v-if="levelPriceDetail.resetSurplus == 0">是</span>
                  <span v-else>否</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <!--分时/阶梯 计价策略 -->
          <div v-if="timePriceDetail !==null">
            <div class="right-body-title">分时计价策略</div>
            <el-table
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
            >
              <el-table-column prop="key" label="顺序"></el-table-column>
              <el-table-column prop="times" label="调整时间"></el-table-column>
              <el-table-column prop="timeLength" label="时长"></el-table-column>
              <el-table-column prop="priceName" label="单价(元/m³)"></el-table-column>
            </el-table>
          </div>
          <div v-if="levelPriceDetail !==null">
            <div class="right-body-title">阶梯计价策略</div>
            <el-table
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
            >
              <el-table-column prop="key" label="阶梯"></el-table-column>
              <el-table-column prop="gasConsumption" label="用气量(m³)"></el-table-column>
              <el-table-column prop="pricesName" label="价格(元/m³)"></el-table-column>
            </el-table>
          </div>
          <!-- 价格版本明细 -->
          <div>
            <div class="right-body-title">产品版本明细</div>
            <el-table
              :data="PricesVersionList"
              highlight-current-row
              @current-change="currentChange"
              ref="singleTable"
              :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
              style="width: 100%"
            >
              <el-table-column prop="priceName" label="价格名称" width="180"></el-table-column>
              <el-table-column prop="priceVersion" label="版本号" width="180"></el-table-column>
              <el-table-column prop="effectiveTime" label="生效日期"></el-table-column>
              <el-table-column prop="statusMask" label="状态"></el-table-column>
            </el-table>
            <div class="page" v-if="PricesVersionList.length > 0">
              <el-pagination
                class="pageLeft"
                background
                :page-size.sync="pageSize"
                layout="slot,sizes,total"
                :total="total"
                @size-change="handleSizeChange"
              >
                <span class="fontSize">显示</span>
              </el-pagination>
              <el-pagination
                class="pageRight"
                background
                :page-size="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                layout="prev, pager, next, jumper"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </vue-scroll>
        <div class="details-empty-data" v-else>
          <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
          <div class="text">暂无数据</div>
        </div>
      </div>
    </div>
    <addPrice-dialog :show.sync="show" :attr="attr" v-if="show"></addPrice-dialog>
    <adjust-dialog
      ref="adjustDialog"
      :adjustShow.sync="adjustShow"
      :adjustShowAttr="adjustShowAttr"
      v-if="adjustShow"
    ></adjust-dialog>
    <gc-confirm-again
      :visible="delVisible"
      title="确定要删除该版本的价格吗"
      subTitle="删除后该价格将无法使用"
      @onCancel="delVisible=false"
      @onOk="submitDelPrice"
    />
    <gc-confirm-again
      :visible="enableVisible"
      title="确定要启用该价格吗"
      subTitle="启用后该价格可以使用"
      @onCancel="enableVisible=false"
      @onOk="enablePrice"
    />
    <gc-confirm-again
      :visible="disableVisible"
      title="确定要禁用该价格吗"
      subTitle="禁用后该价格将无法使用"
      @onCancel="disableVisible=false"
      @onOk="disablePrice"
    />
    <el-dialog
      custom-class="edit-price-content-wrap"
      :visible.sync="editPriceVisible"
      width="640px"
      top="20vh"
    >
      <div slot="title" class="header-title">
        <img class="loginImg" src="@/assets/imgs/batchCreate/batchCreate-price.png" />
        <span class="title-age">编辑价格信息</span>
      </div>
      <div class="edit-price-content">
        <el-form
          label-width="95px"
          ref="editPriceModalForm"
          :model="editPriceForm"
          :rules="editPriceFormRules"
        >
          <el-form-item label="价格名称" prop="priceName">
            <el-input size="small" v-model.trim="editPriceForm.priceName" style="width:100%;"></el-input>
          </el-form-item>
          <el-form-item label="用气性质" prop="usageNature">
            <el-select size="small" v-model="editPriceForm.usageNature" style="width:100%;">
              <el-option
                v-for="(item,index) in userSubclass"
                :key="index"
                :label="item.k"
                :value="item.v"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="editPrice"
        >确 定</el-button>
        <el-button style="width: 80px;" size="small" @click="editPriceVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPricesList,
  getPriceDetail,
  getPricesVersionList,
  deletePrices,
  disablePrices,
  enablePrices,
  editPrices
} from "@/api/priceAPI";
import { pricesMixin } from "./pricesMixin";
import { basisDataMixin } from "./basisDataMixin";
import addPriceDialog from "./addPriceDialog";
import adjustPriceDialog from "./adjustPriceDialog";
import _ from "lodash";

export default {
  name: "price-management",
  components: {
    "addPrice-dialog": addPriceDialog,
    "adjust-dialog": adjustPriceDialog
  },
  mixins: [pricesMixin, basisDataMixin],
  data() {
    return {
      loading: true,
      loading2: true,
      isActive2: true,
      isActive: "", //价格列表选中的行
      delVisible: false, //删除弹框
      enableVisible: false, //启用弹框
      disableVisible: false, //禁用弹框
      priceDetails: null, //选中的价格详情
      priceId: null, //当前选中价格ID
      pricesList: [], //左侧价格列表
      pricesList11: [],
      singlePriceDetail: null, //单一价详情
      levelPriceDetail: null, //阶梯价详情
      timePriceDetail: null, //分时价详情
      tableSelected: {}, //选中当前版本的价格
      tableData: [], //计价策略列表
      PricesVersionList: [], //价格版本明细
      editPriceVisible: false,
      editPriceForm: {
        priceName: null,
        usageNature: null
      },
      editPriceFormRules: {
        priceName: [
          { required: true, message: "请输入价格名称", trigger: "change" },
          { max: 20, message: "最多20个字符", trigger: "change" }
        ],
        usageNature: [
          { required: true, message: "请选择用气性质", trigger: "change" }
        ]
      },
      // 获取当前用户的选中的价格列表
      isShowAddBtn: "",
      currentPrice: {},
      isAllowPopulationLadder: false, // 是否开启人口阶梯
      isAllowMonthAvg: false, // 是否开启按月均摊
      // 是否是跨域运维
      isCrossDomain: this.$ls.get("userInfo").isCrossDomain
    };
  },
  created() {
    this.getPricesList();
    this.isShowAddBtn = JSON.parse(
      localStorage.getItem("vuejs__userGradeName")
    ).value;
    this.isAllowPopulationLadder =
      JSON.parse(localStorage.getItem("vuejs__tenantBasicConfig")).value
        .is_allow_population_ladder || false;
    this.isAllowMonthAvg =
      JSON.parse(localStorage.getItem("vuejs__tenantBasicConfig")).value
        .is_allow_month_avg || false;
  },
  computed: {
    delBtn: function() {
      //价格版本为1（priceVersion ==1），则删除置灰不可编辑
      return (
        this.priceDetails &&
        (this.priceDetails.priceVersion == 1 ||
          this.priceDetails.enableFlag == 3)
      );
    },
    selectedOrg() {
      return this.$store.state.selectedOrg;
    }
  },
  watch: {
    selectedOrg() {
      this.getPricesList();
    }
  },
  methods: {
    //获取价格列表
    getPricesList() {
      this.currentPage = 1;
      if (this.isCrossDomain && !this.selectedOrg) {
        // this.$message.error("请选择组织机构！");
        this.loading = false;
        this.loading2 = false;
        return false;
      } else {
        getPricesList({
          size: 1000
        })
          .then(res => {
            if (res.data.code == 0) {
              let datas = res.data.data.records;
              this.pricesList = datas;
              if (datas.length > 0) {
                if (this.isActive) {
                  let ishas = _.find(datas, item => {
                    return item.priceId === this.isActive;
                  });
                  this.currentPrice = ishas;
                  if (ishas) {
                    this.getPriceDetail(ishas, 0);
                  } else {
                    this.getPriceDetail(datas[0], 0);
                  }
                } else {
                  this.getPriceDetail(datas[0], 0);
                }
              } else {
                this.singlePriceDetail = {};
                this.levelPriceDetail = null;
                this.timePriceDetail = null;
                this.tableData = [];
                this.PricesVersionList = [];
                this.loading2 = false;
              }
              this.loading = false;
            } else {
              this.loading = false;
              // this.$message.error(`查询价格列表失败-${res.data.message}`);
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.error("区查询发生错误-接口请求失败");
          });
      }
    },
    //  选择当前版本的价格详情
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    currentChange(val) {
      this.tableSelected = val;
      this.getCurrentPriceDetails(val);
    },
    getCurrentPriceDetails(item) {
      this.loading2 = true;
      this.singlePriceDetail = null;
      this.levelPriceDetail = null;
      this.timePriceDetail = null;
      this.priceDetails = null;
      let obj = {
        priceId: item && item.priceId ? item.priceId : null,
        priceVersion: item && item.priceVersion ? item.priceVersion : null
      };
      getPriceDetail(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.loading2 = false;
            if (res.data.data.length == 0) {
              this.loading2 = false;
              return;
            }
            let billingType = item.billingTypeId;
            let datas = res.data.data;
            this.priceDetails = datas;
            this.priceId = datas.priceId;
            this.adjustShowAttr = datas;
            this.editPriceForm = {
              priceName: datas.priceName,
              usageNature: datas.usageNature + ""
            };
            this.enableFlagEnum.map(item => {
              if (datas.enableFlag == item.v) {
                datas["enableFlagname"] = item.k;
              }
            });
            this.userSubclass.map(item => {
              if (datas.usageNature == item.v) {
                datas["usageNaturename"] = item.k;
              }
            });
            this.billingTypeEnum.map(item => {
              if (datas.billingTypeId == item.v) {
                datas["billingTypeIdname"] = item.k;
              }
            });
            if (billingType == 1) {
              // 1-单一计费
              this.singlePriceDetail = datas;
            }
            if (billingType == 2) {
              // 2-阶梯计费
              let arr1 = datas.levelBorder.split("|");
              let arr2 = datas.levelPrice.split("|");
              let arr3 = [];
              let arr4 = [];
              let arr5 = arr1.map((item, index) => {
                if (index == arr1.length - 1) {
                  return item;
                } else {
                  let num = parseInt(arr1[0]);
                  for (let i = 0; i < index; i++) {
                    num += parseInt(arr1[i + 1]);
                  }

                  return num;
                }
              });
              let numberEnum = {
                "1": "一",
                "2": "二",
                "3": "三",
                "4": "四",
                "5": "五"
              };
              //格式化用气量
              for (let i = 0; i < arr1.length; i++) {
                if (i == 0) {
                  let obj1 = 0 + " ~ " + arr5[i];
                  arr4.push(obj1);
                } else {
                  let obj2 = arr5[i - 1] + " ~ " + arr5[i];
                  arr4.push(obj2);
                }
              }
              //格式化为价格策略
              for (let k = 0; k < arr4.length; k++) {
                for (let j = 0; j < arr2.length; j++) {
                  if (k == j) {
                    let tableObj = {
                      key: "第" + numberEnum[k + 1] + "阶梯",
                      gasConsumption: arr4[k],
                      pricesName: arr2[j]
                    };
                    arr3.push(tableObj);
                  }
                }
              }
              this.tableData = arr3;
              this.levelPriceDetail = datas;
            }
            if (billingType == 3) {
              // 3-分时计费
              let timePriceArr1 = datas.adjustTime.split("|"); //调整时间
              let timePriceArr2 = datas.timePeriod.split("|"); //分时时长
              let timePriceArr3 = datas.timePrice.split("|"); //分时价格
              let timePriceArr4 = [];
              //格式化为价格策略
              for (let g = 0; g < timePriceArr1.length; g++) {
                for (let h = 0; h < timePriceArr2.length; h++) {
                  if (g == h) {
                    let tableObj2 = {
                      key: g + 1,
                      times: timePriceArr1[g],
                      timeLength: timePriceArr2[g],
                      priceName: timePriceArr3[g]
                    };
                    timePriceArr4.push(tableObj2);
                  }
                }
              }

              this.tableData = timePriceArr4;
              this.timeUnitCodeEnum.map(item => {
                if (datas.timeUnitCode == item.v) {
                  datas["timeUnitCodename"] = item.k;
                }
              });
              this.timePriceDetail = datas;
            }
          } else {
            this.loading2 = false;
            // this.$message.error(`查询价格列表失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.loading2 = false;
          this.$message.error("查询价格详情失败-接口请求失败");
        });
    },
    addHighLight(priceId) {
      this.isActive = priceId; //新增项高亮
    },
    //获取价格详情
    getPriceDetail(item, index) {
      this.loading2 = true;
      this.singlePriceDetail = null;
      this.levelPriceDetail = null;
      this.timePriceDetail = null;
      this.priceDetails = null;
      this.tableData = [];
      this.PricesVersionList = [];
      this.isActive = item.priceId;
      this.currentPrice = _.find(this.pricesList, item => {
        return item.priceId === this.isActive;
      });
      this.currentPage = 1;
      let obj = {
        priceId: item.priceId,
        priceVersion: item.priceVersion
      };
      getPriceDetail(obj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.length == 0) {
              this.loading2 = false;
              return;
            }
            let billingType = item.billingTypeId;
            let datas = res.data.data;
            this.priceDetails = datas;
            this.priceId = datas.priceId;
            this.adjustShowAttr = datas;
            this.editPriceForm = {
              priceName: datas.priceName,
              usageNature: datas.usageNature + ""
            };
            this.enableFlagEnum.map(item => {
              if (datas.enableFlag == item.v) {
                datas["enableFlagname"] = item.k;
              }
            });
            this.userSubclass.map(item => {
              if (datas.usageNature == item.v) {
                datas["usageNaturename"] = item.k;
              }
            });
            this.billingTypeEnum.map(item => {
              if (datas.billingTypeId == item.v) {
                datas["billingTypeIdname"] = item.k;
              }
            });
            if (billingType == 1) {
              // 1-单一计费
              this.singlePriceDetail = datas;
            }
            if (billingType == 2) {
              // 2-阶梯计费
              let arr1 = datas.levelBorder.split("|");
              let arr2 = datas.levelPrice.split("|");
              let arr3 = [];
              let arr4 = [];
              let numberEnum = {
                "1": "一",
                "2": "二",
                "3": "三",
                "4": "四",
                "5": "五"
              };
              //格式化用气量
              for (let i = 0; i < arr1.length; i++) {
                if (i == 0) {
                  let obj1 = 0 + " ~ " + arr1[i];
                  arr4.push(obj1);
                } else {
                  let obj2 = arr1[i - 1] + " ~ " + arr1[i];
                  arr4.push(obj2);
                }
              }
              //格式化为价格策略
              for (let k = 0; k < arr4.length; k++) {
                for (let j = 0; j < arr2.length; j++) {
                  if (k == j) {
                    let tableObj = {
                      key: "第" + numberEnum[k + 1] + "阶梯",
                      gasConsumption: arr4[k],
                      pricesName: arr2[j]
                    };
                    arr3.push(tableObj);
                  }
                }
              }

              this.tableData = arr3;
              this.levelPriceDetail = datas;
            }
            if (billingType == 3) {
              // 3-分时计费
              let timePriceArr1 = datas.adjustTime.split("|"); //调整时间
              let timePriceArr2 = datas.timePeriod.split("|"); //分时时长
              let timePriceArr3 = datas.timePrice.split("|"); //分时价格
              let timePriceArr4 = [];
              //格式化为价格策略
              for (let g = 0; g < timePriceArr1.length; g++) {
                for (let h = 0; h < timePriceArr2.length; h++) {
                  if (g == h) {
                    let tableObj2 = {
                      key: g + 1,
                      times: timePriceArr1[g],
                      timeLength: timePriceArr2[g],
                      priceName: timePriceArr3[g]
                    };
                    timePriceArr4.push(tableObj2);
                  }
                }
              }

              this.tableData = timePriceArr4;
              this.timeUnitCodeEnum.map(item => {
                if (datas.timeUnitCode == item.v) {
                  datas["timeUnitCodename"] = item.k;
                }
              });
              this.timePriceDetail = datas;
            }
            this.getPricesVersionList(this.priceId);
          } else {
            this.loading2 = false;
            // this.$message.error(`查询价格列表失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.loading2 = false;
          this.$message.error("查询价格详情失败-接口请求失败");
        });
    },
    //获取价格版本明细 列表
    getPricesVersionList() {
      let obj = {
        current: this.currentPage,
        priceId: this.priceId,
        size: this.pageSize
      };
      getPricesVersionList(obj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.length == 0) {
              this.PricesVersionList = [];
              return;
            }
            let datas = res.data.data;
            this.total = datas.total; //总条数
            this.pages = datas.pages; //总页数
            this.currentPage = datas.current;
            this.pageSize = datas.size; //每页显示条数，默认10
            let data2s = datas.records;
            let enableFlagEnum = {
              "1": "在用",
              "2": "禁用",
              "3": "已删除",
              "9": "停用"
            };

            for (let i = 0; i < data2s.length; i++) {
              data2s[i].enableFlag = enableFlagEnum[data2s[i].enableFlag];
            }

            this.PricesVersionList = data2s;
            this.tableSelected = data2s[0] || {};
            this.setCurrent(this.tableSelected);
            this.loading2 = false;
          } else {
            this.loading2 = false;
            this.$message.error(`查询价格版本明细失败-${res.data.message}`);
          }
        })
        .catch(err => {
          this.loading2 = false;
          this.$message.error("查询价格版本明细失败-接口请求失败");
        });
    },
    //删除价格
    delPrice() {
      let effectiveTimetamp = new Date(
        this.priceDetails.effectiveTime
      ).getTime();
      if (effectiveTimetamp < new Date().getTime()) {
        this.$message.error("已生效价格不允许删除");
        return;
      }
      this.delVisible = true;
    },
    submitDelPrice() {
      let obj = {
        priceId: this.priceDetails.priceId,
        priceVersion: this.priceDetails.priceVersion
      };

      deletePrices(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除价格成功!");
            this.getPricesList();
          } else {
            this.$message.error(`删除价格失败-${res.data.message}`);
          }
          this.delVisible = false;
        })
        .catch(err => {
          this.delVisible = false;
          this.$message.error("删除价格失败-接口请求失败");
        });
    },
    //启用价格
    enablePrice() {
      let obj = {
        priceId: this.priceDetails.priceId
      };
      enablePrices(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("启用价格成功!");
            this.getPricesList();
          } else {
            this.$message.error(`启用价格失败-${res.data.message}`);
          }
          this.enableVisible = false;
        })
        .catch(err => {
          this.enableVisible = false;
          this.$message.error("启用价格失败-接口请求失败");
        });
    },
    //禁用价格
    disablePrice() {
      let obj = {
        priceId: this.priceDetails.priceId
      };
      disablePrices(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("禁用价格成功!");
            this.getPricesList();
          } else {
            this.$message.error(`禁用价格失败-${res.data.message}`);
          }
          this.disableVisible = false;
        })
        .catch(err => {
          this.disableVisible = false;
          this.$message.error("禁用价格失败-接口请求失败");
        });
    },
    //编辑价格
    editPrice() {
      this.$refs["editPriceModalForm"].validate(valid => {
        if (valid) {
          let obj = {
            priceId: this.priceDetails.priceId,
            priceName: this.editPriceForm.priceName,
            usageNature: this.editPriceForm.usageNature
          };
          for (let i in obj) {
            if (typeof obj[i] == "string" && obj[i].constructor == String) {
              obj[i] = obj[i].trim();
            }
          }
          editPrices(obj)
            .then(res => {
              if (res.data.code == 0) {
                this.editPriceVisible = false;
                this.$message.success("编辑价格成功!");
                this.getPricesList();
              } else {
                this.$message.error(`编辑价格失败-${res.data.message}`);
              }
            })
            .catch(err => {
              this.$message.error("编辑价格失败-接口请求失败");
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.loginImg {
  width: 20px;
  height: 20px;
  vertical-align: sub;
  margin-right: 10px;
}
.edit-price-content {
  padding: 24px 35px 10px 40px;
  position: relative;
  min-height: 210px;
  max-height: 390px;
  .edit-price-operation {
    position: absolute;
    left: 40px;
    bottom: -10px;
    color: #ababab;
    font-size: 14px;
    margin-top: 30px;
    margin-bottom: 10px;
    .operation_div {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
::v-deep .el-form-item__label {
  text-align: left;
}
::v-deep .edit-price-content-wrap .el-dialog__body {
}
@import "./index.scss";
</style>