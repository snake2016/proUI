<template>
  <div class="report-home">
    <!-- <div class="reportUp"> -->
    <div class="reportList" :class="{'allShow':!isShow}">
      <div class="HeaderBox">
        <img src="~@/assets/imgs/report/reporList.png" />
        <span class="title">报表列表</span>
      </div>
      <div class="reportClass">
        <vue-scroll :ops="ops" ref="vs">
          <div>
            <div class="reports">
              <img src="~@/assets/imgs/report/report_costpay.png" />
              <div class="report_text" @click="goCostPayReport">
                <div class="text1">收费类报表</div>
                <div class="text2">Charge Report</div>
              </div>
            </div>
            <div class="reports">
              <img src="~@/assets/imgs/report/report_notify.png" />
              <div class="report_text" @click="goSMSReport">
                <div class="text1">通知类报表</div>
                <div class="text2">Notification Report</div>
              </div>
            </div>
            <div class="reports">
              <img src="~@/assets/imgs/report/report_account.png" />
              <div class="report_text" @click="goAccountReport">
                <div class="text1">账户类报表</div>
                <div class="text2">Account Report</div>
              </div>
            </div>
            <div class="reports">
              <img src="~@/assets/imgs/report/report_error.png" />
              <div class="report_text" @click="goErrorReport">
                <div class="text1">异常类报表</div>
                <div class="text2">Abnormal Report</div>
              </div>
            </div>
            <div class="reports">
              <img src="~@/assets/imgs/report/report_title.png" />
              <div class="report_text" @click="goUseGasReport">
                <div class="text1">{{tenantType=='water'?'用水类报表':'用气类报表'}}</div>
                <div class="text2">{{tenantType=='water'?'Water Report':'Gas Report'}}</div>
              </div>
            </div>
            <div class="reports">
              <img src="~@/assets/imgs/report/other_report.png" />
              <div class="report_text" @click="goOtherReport">
                <div class="text1">其他报表</div>
                <div class="text2">Other Report</div>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div class="openAccount" v-has="'report_open'">
      <div class="HeaderBox">
        <img src="~@/assets/imgs/report/report_trend.png" />
        <span class="title">开户建档趋势</span>
        <div class="filter">
          <el-select
            v-model="orgCodeD"
            v-show="company"
            @change="orgFun(orgCodeD)"
            placeholder="分公司"
          >
            <el-option
              v-for="item in orgCodeArrD"
              :key="item.org_code"
              :label="item.name"
              :value="item.org_code"
            ></el-option>
          </el-select>
          <span class="dateTiem">
            <el-date-picker
              v-model="openTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="openAchivesData"
            ></el-date-picker>
          </span>
          <svg class="icon" aria-hidden="true" @click="fullFun(openSmall)">
            <use xlink:href="#el-icon-fangda" />
          </svg>
        </div>
      </div>
      <div class="trend" id="openAchivesTrend"></div>
    </div>
    <!-- </div> -->
    <!-- <div class="reportDown"> -->
    <div class="reportUse" v-has="'report_usegas'">
      <div class="HeaderBox">
        <img src="~@/assets/imgs/report/report_trend.png" />
        <span class="title">{{tenantType=='water'?'用水趋势':'用气趋势'}}</span>
        <div class="filter">
          <el-select
            v-model="orgCodeD"
            v-show="company"
            @change="orgFun(orgCodeD)"
            placeholder="分公司"
          >
            <el-option
              v-for="item in orgCodeArrD"
              :key="item.org_code"
              :label="item.name"
              :value="item.org_code"
            ></el-option>
          </el-select>
          <span class="dateTiem">
            <el-date-picker
              v-model="useTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="useQiData"
            ></el-date-picker>
          </span>
          <svg class="icon" aria-hidden="true" @click="fullUseFun(useSmall)">
            <use xlink:href="#el-icon-fangda" />
          </svg>
        </div>
      </div>
      <div class="trend" id="useQi"></div>
    </div>
    <div class="readMeter" v-has="'report_reading'">
      <div class="HeaderBox" style="border-bottom:none;">
        <div class="filter">
          <span class="readTime">
            <el-select
              v-model="orgCodeD"
              v-show="company"
              @change="orgFun(orgCodeD)"
              placeholder="分公司"
            >
              <el-option
                v-for="item in orgCodeArrD"
                :key="item.org_code"
                :label="item.name"
                :value="item.org_code"
              ></el-option>
            </el-select>
          </span>
          <span class="dateTiem readTime">
            <el-date-picker
              v-model="readObj.meterReadingTime"
              type="date"
              :clearable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="readMeterData"
              :picker-options="expireTimeOption"
            ></el-date-picker>
          </span>
        </div>
      </div>
      <div class="trend" id="readMeter"></div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import Vue from "vue";
import echarts from "echarts";
import liquidfill from "echarts-liquidfill";
import dayjs from "dayjs";
import full from "@/assets/imgs/report/full.png";
Vue.prototype.$echarts = echarts;
import {
  orgstrutureTree,
  orgstrutureList,
  orgstrutureList_sys,
  orgstrutureSysTree
} from "@/api/tenant.js";
import {
  openAchivesReport,
  useQiReport,
  readeMeterReport
} from "@/api/reportAPI";
export default {
  name: "report77",
  data() {
    return {
      admin: false,
      tenantAdmin: false,
      company: false, //分公司显示隐藏
      orgStruId: "",
      meterTime: "",
      orgCodeD: "",
      orgArr: [], //组织机构列表
      orrg: "",
      orgCodeArrD: [], //分公司列表
      orgCodeArr: [], //分工下营业厅集合
      openTime: "",
      dateArr: [],
      useTime: "",
      openObj: {},
      useObj: {},
      readObj: {
        meterReadingTime: new Date()
      },
      opendatas: [], //7条开户建档图表时间
      openCount: [], //7条开户数
      openAllDatas: [], //全部开户建档图表时间
      openAllCount: [], //全部开户数
      openSmall: "small", //开户小屏时展示
      useSmall: "small", //开户小屏时展示
      usedatas: [], //7天用气趋势图表时间
      useAmount: [], //7天用气量
      useAllDatas: [], //全部用气趋势图表时间
      useAllAmount: [], //全部用气量
      readdatas: "", //抄表时间
      readRate: "", //抄表率
      readRateArr: [], //抄表率
      _minTime: null,
      _maxTime: null,
      openAchiveDraw: "",
      useQiDraw: "",
      openOption: {},
      openOP: {},
      useOption: {},
      useOP: {},
      pickerOptions: {
        onPick: time => {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = 31 * 24 * 60 * 60 * 1000; // 31天
            this._minTime = time.minDate.getTime() - timeRange; // 最小时间
            this._maxTime = time.minDate.getTime() + timeRange; // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            this._minTime = this._maxTime = null;
          }
        },
        disabledDate: time => {
          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (this._minTime && this._maxTime) {
            return (
              time.getTime() < this._minTime || time.getTime() > this._maxTime
            );
          }
        }
      },
      ops: window.scrollOps, // 滚动条
      // 是否是跨域运维
      isCrossDomain: this.$ls.get("userInfo").isCrossDomain,
      isShow: true,
      expireTimeOption: {
        disabledDate(time) {
          return time.getTime() >= Date.now(); //禁用以前的日期，今天不禁用
        }
      },
    };
  },
  components: {},
  methods: {
    // 时间默认一个月
    getDate() {
      let dateEnd = new Date();
      let dateStart = dayjs()
        .subtract(31, "days")
        .format("YYYY-MM-DD");
      let dateStart1 = new Date(dateStart);
      let dateArr = [];
      this.dateArr[0] = dateStart1;
      this.dateArr[1] = dateEnd;
    },
    // 进入用气类报表
    goUseGasReport() {
      if (this.admin == 0 && !this.tenantId) {
        this.$message.error("请选择租户!");
      } else if (this.isCrossDomain && !this.selectedOrg) {
        this.$message.error("请选择组织机构！");
        return false;
      } else {
        // this.$router.push({ path: "/report-useGas" });
        this.$router.push(
          { path: "/report-useGas" || "/" },
          () => {},
          () => {}
        );
      }
    },
    // 进入收费类报表
    goCostPayReport() {
      if (this.admin == 0 && !this.tenantId) {
        this.$message.error("请选择租户!");
      } else if (this.isCrossDomain && !this.selectedOrg) {
        this.$message.error("请选择组织机构！");
        return false;
      } else {
        // this.$router.push({ path: "/report-costPay" });
        this.$router.push(
          { path: "/report-costPay" || "/" },
          () => {},
          () => {}
        );
      }
    },
    // 进入账户报表
    goAccountReport() {
      if (this.admin == 0 && !this.tenantId) {
        this.$message.error("请选择租户!");
      } else if (this.isCrossDomain && !this.selectedOrg) {
        this.$message.error("请选择组织机构！");
        return false;
      } else {
        // this.$router.push({ path: "/report-account" });
        this.$router.push(
          { path: "/report-account" || "/" },
          () => {},
          () => {}
        );
      }
    },
    // 进入异常类报表
    goErrorReport() {
      if (this.admin == 0 && !this.tenantId) {
        this.$message.error("请选择租户!");
      } else if (this.isCrossDomain && !this.selectedOrg) {
        this.$message.error("请选择组织机构！");
        return false;
      } else {
        // this.$router.push({ path: "/report-error" });
        this.$router.push(
          { path: "/report-error" || "/" },
          () => {},
          () => {}
        );
      }
    },
    // 进入系统通知类报表
    goSMSReport() {
      // this.$router.push({ path: "/report-smsStatistics" });
      this.$router.push(
        { path: "/report-smsStatistics" || "/" },
        () => {},
        () => {}
      );
    },
    // 进入其他报表
    goOtherReport() {
      if (this.isCrossDomain && !this.selectedOrg) {
        this.$message.error("请选择组织机构！");
        return false;
      } else {
        // this.$router.push({ path: "/report-other" });
        this.$router.push(
          { path: "/report-other" || "/" },
          () => {},
          () => {}
        );
      }
    },
    // 开户趋势小屏
    openAchivesSmall() {
      this.openAchiveDraw = echarts.init(
        document.getElementById("openAchivesTrend")
      );
      this.openOption = {
        color: ["#12B3C7"],
        title: {
          show: this.opendatas.length === 0,
          extStyle: {
            color: "grey",
            fontSize: 20
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0, //echart防止tooltip的抖动
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "20px",
          right: "20px",
          bottom: "10px",
          top: "40px",
          containLabel: true
        },
        xAxis: [
          {
            show: this.opendatas.length != 0,
            type: "category",
            data: this.opendatas,
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            axisLine: {
              //x轴
              lineStyle: {
                color: "#C4C6CF"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：户",
            minInterval: 1,
            show: this.opendatas.length != 0,
            nameTextStyle: {
              color: "#666666",
              fontSize: 10
            },
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#EBECF0"
              }
            }
          }
        ],
        series: [
          {
            name: "开户数量",
            type: "bar",
            barWidth: "21px",
            data: this.openCount,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            }
          }
        ]
      };
      this.openAchiveDraw.setOption(this.openOption);
      this.openAchiveDraw.resize();
    },
    // 开户趋势全屏
    openAchivesBig() {
      this.openAchiveDraw = echarts.init(
        document.getElementById("openAchivesTrend")
      );
      this.openOP = {
        color: ["#12B3C7"],
        title: {
          show: this.openAllDatas.length === 0,
          extStyle: {
            color: "grey",
            fontSize: 20
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0, //echart防止tooltip的抖动
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 50,
            type: "inside"
          },
          {
            show: true,
            start: 0,
            end: 50,
            type: "slider"
          }
        ],
        grid: {
          left: "50px",
          right: "50px",
          bottom: "50px",
          top: "40px",
          containLabel: true
        },
        xAxis: [
          {
            show: this.openAllDatas.length != 0,
            type: "category",
            data: this.openAllDatas,
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            axisLine: {
              //x轴
              lineStyle: {
                color: "#C4C6CF"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：户",
            minInterval: 1,
            show: this.openAllDatas.length != 0,
            nameTextStyle: {
              color: "#666666",
              fontSize: 10
            },
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#EBECF0"
              }
            }
          }
        ],
        series: [
          {
            name: "开户数量",
            type: "bar",
            barWidth: "21px",
            data: this.openAllCount,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            }
          }
        ]
      };
      this.openAchiveDraw.setOption(this.openOP);
      this.openAchiveDraw.resize();
    },
    // 用气趋势小屏
    uesQiFun() {
      this.useQiDraw = echarts.init(document.getElementById("useQi"));
      this.useOption = {
        color: ["#5C89FF"],
        title: {
          show: this.usedatas.length === 0,
          extStyle: {
            color: "grey",
            fontSize: 20
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0, //echart防止tooltip的抖动
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "20px",
          right: "20px",
          bottom: "0",
          top: "40px",
          containLabel: true
        },
        xAxis: [
          {
            show: this.usedatas.length != 0,
            type: "category",
            data: this.usedatas,
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            axisLine: {
              //x轴
              lineStyle: {
                color: "#C4C6CF"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：立方",
            show: this.usedatas.length != 0,
            nameTextStyle: {
              color: "#666666",
              fontSize: 10
            },
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#EBECF0"
              }
            }
          }
        ],
        series: [
          {
            name: this.tenantType=='water'?'用水量':"用气量",
            type: "bar",
            barWidth: "21px",
            data: this.useAmount,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            }
          }
        ]
      };
      this.useQiDraw.setOption(this.useOption);
      this.useQiDraw.resize();
    },
    // 用气趋势全屏
    uesQiFunBig() {
      this.useQiDraw = echarts.init(document.getElementById("useQi"));
      this.useOP = {
        color: ["#5C89FF"],
        title: {
          show: this.useAllDatas.length === 0,
          extStyle: {
            color: "grey",
            fontSize: 20
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0, //echart防止tooltip的抖动
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "50px",
          right: "50px",
          bottom: "50px",
          top: "40px",
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 50,
            type: "inside"
          },
          {
            show: true,
            start: 0,
            end: 50,
            type: "slider"
          }
        ],
        xAxis: [
          {
            show: this.useAllDatas.length != 0,
            type: "category",
            data: this.useAllDatas,
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            axisLine: {
              //x轴
              lineStyle: {
                color: "#C4C6CF"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：立方",
            show: this.useAllDatas.length != 0,
            nameTextStyle: {
              color: "#666666",
              fontSize: 10
            },
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#666666"
              }
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#EBECF0"
              }
            }
          }
        ],
        series: [
          {
            name: this.tenantType=='water'?'用水量':"用气量",
            type: "bar",
            barWidth: "21px",
            data: this.useAllAmount,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            }
          }
        ]
      };
      this.useQiDraw.setOption(this.useOP);
      this.useQiDraw.resize();
    },
    // 抄表率
    readMeterFun() {
      let readMeter = echarts.init(document.getElementById("readMeter"));
      let option = {
        title: {
          text: this.readdatas,
          subtext: "抄表率为" + this.readRate,
          right: "20",
          top: "center",
          textStyle: {
            fontSize: 16,
            color: "#2F87FE"
          },
          subtextStyle: {
            fontSize: 16,
            color: "#2F87FE"
          }
        },
        series: [
          {
            type: "liquidFill",
            data: this.readRateArr,
            color: ["#338BFF"],
            radius: "85%",
            center: ["25%", "50%"],
            backgroundStyle: {
              borderWidth: 5, //内边框宽度
              borderColor: "#BAD7FE", //背景内边框
              color: "rgba(255,255,255,49)", //背景颜色
              shadowColor: "#e3eeff", //阴影
              shadowBlur: 50 //阴影模糊
            },
            outline: {
              itemStyle: {
                borderColor: "#EBF3FF",
                borderWidth: 0,
                color: "none",
                shadowBlur: 0,
                shadowColor: "#fff"
              },
              borderDistance: 0
            },
            itemStyle: {
              //普通样式
              shadowBlur: 0 //阴影模糊
            },
            // emphasis: {
            //   itemStyle: {
            //     //悬停样式
            //     opacity: 0.9
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: ["50%", "40%"],
                color: "#5C97E5",
                fontSize: "24",
                formatter: function(param) {
                  if (param.value != 0) {
                    return (param.value * 100).toFixed(2) + "%";
                  }
                }
              }
            }
          }
        ]
      };
      readMeter.setOption(option);
    },
    // 开户数据接口
    openAchivesData(t) {
      this.openObj["startTime"] = t[0];
      this.openObj["endTime"] = t[1];
      if (this.admin == 0) {
        this.openObj["tenantId"] = this.tenantId;
      }
      openAchivesReport(this.openObj).then(res => {
        this.opendatas = [];
        this.openCount = [];
        this.openAllDatas = [];
        this.openAllCount = [];
        this.openAchivesSmall();
        let datas = res.data.data;
        if (datas.length != 0) {
          datas.map(data => {
            this.openAllDatas.push(data.archivesTime);
            this.openAllCount.push(data.archivesCount);
          });
          datas.map((data, index) => {
            if (index < 7) {
              this.opendatas.push(data.archivesTime);
              this.openCount.push(data.archivesCount);
            }
          });
          if (this.openSmall == "small") {
            this.openAchivesSmall();
            // this.openAchiveDraw.clear();
            // delete this.openOP.dataZoom;
            // this.openAchiveDraw.setOption(this.openOP);
          } else {
            this.openAchivesBig();
            // this.openAchiveDraw.clear();
            // this.openAchiveDraw.setOption(this.openOP);
          }
        }
      });
    },
    // 用气趋势数据接口
    useQiData(t) {
      this.useObj["startDate"] = t[0];
      this.useObj["endDate"] = t[1];
      if (this.admin == 0) {
        this.useObj["tenantId"] = this.tenantId;
      }
      useQiReport(this.useObj).then(res => {
        this.usedatas = [];
        this.useAmount = [];
        this.useAllDatas = [];
        this.useAllAmount = [];
        this.uesQiFun();
        let datas = res.data.data;
        if (datas.length != 0) {
          datas.map(data => {
            this.useAllDatas.push(data.dataTime);
            this.useAllAmount.push(data.sumAmount);
          });
          datas.map((data, index) => {
            if (index < 7) {
              this.usedatas.push(data.dataTime);
              this.useAmount.push(data.sumAmount);
            }
          });
          if (this.useSmall == "small") {
            this.uesQiFun();
          } else {
            this.uesQiFunBig();
          }
        }
      });
    },
    // 抄表率
    readMeterData(t) {
      this.readObj.meterReadingTime = t;
      if (this.admin == 0) {
        this.readObj["tenantId"] = this.tenantId;
      }
      readeMeterReport(this.readObj).then(res => {
        this.readRateArr = [];
        this.readMeterFun();
        let datas = res.data.data;
        if (datas != null) {
          this.readdatas = datas.meterReadingTime;
          if (datas.meterReadingRate != 0) {
            this.readRateArr.push(datas.meterReadingRate);
            this.readRate = (datas.meterReadingRate * 100).toFixed(2) + "%";
          } else {
            this.readRateArr.push(datas.meterReadingRate);
            this.readRate = datas.meterReadingRate + "%";
          }
          this.readMeterFun();
        } else {
          this.readRateArr = [0];
          this.readdatas = t;
          this.readRate = "0";
          this.readMeterFun();
        }
      });
    },
    getData(orgcode) {
      this.openObj["orgCode"] = orgcode;
      this.useObj["orgCode"] = orgcode;
      this.readObj["orgCode"] = orgcode;
      if (this.admin == 0) {
        this.openObj["tenantId"] = this.tenantId;
        this.useObj["tenantId"] = this.tenantId;
        this.readObj["tenantId"] = this.tenantId;
      }
      if (this.openTime) {
        this.openObj["startTime"] = dayjs(this.openTime[0]).format(
          "YYYY-MM-DD"
        );
        this.openObj["endTime"] = dayjs(this.openTime[1]).format("YYYY-MM-DD");
      }
      if (this.useTime) {
        this.useObj["startDate"] = dayjs(this.useTime[0]).format("YYYY-MM-DD");
        this.useObj["endDate"] = dayjs(this.useTime[1]).format("YYYY-MM-DD");
      }
      if (this.readObj.meterReadingTime) {
        this.readObj.meterReadingTime = dayjs(
          this.readObj.meterReadingTime
        ).format("YYYY-MM-DD");
      }
      if (this.isShow) {
        openAchivesReport(this.openObj).then(res => {
          this.opendatas = [];
          this.openCount = [];
          this.openAllDatas = [];
          this.openAllCount = [];
          this.openAchivesSmall();
          let datas = res.data.data;
          if (datas && datas.length != 0) {
            datas.map(data => {
              this.openAllDatas.push(data.archivesTime);
              this.openAllCount.push(data.archivesCount);
            });
            datas.map((data, index) => {
              if (index < 7) {
                this.opendatas.push(data.archivesTime);
                this.openCount.push(data.archivesCount);
              }
            });
            if (this.openSmall == "small") {
              this.openAchivesSmall();
            } else {
              this.openAchivesBig();
            }
          }
        });
        useQiReport(this.useObj).then(res => {
          this.usedatas = [];
          this.useAmount = [];
          this.useAllDatas = [];
          this.useAllAmount = [];
          this.uesQiFun();
          let datas = res.data.data;
          if (datas && datas.length != 0) {
            datas.map(data => {
              this.useAllDatas.push(data.dataTime);
              this.useAllAmount.push(data.sumAmount);
            });
            datas.map((data, index) => {
              if (index < 7) {
                this.usedatas.push(data.dataTime);
                this.useAmount.push(data.sumAmount);
              }
            });
            if (this.useSmall == "small") {
              this.uesQiFun();
            } else {
              this.uesQiFunBig();
            }
          }
        });
        readeMeterReport(this.readObj).then(res => {
          this.readRateArr = [];
          this.readMeterFun();
          let datas = res.data.data;
          if (datas != null) {
            this.readdatas = datas.meterReadingTime;
            if (datas.meterReadingRate != 0) {
              this.readRateArr.push(datas.meterReadingRate);
              this.readRate = (datas.meterReadingRate * 100).toFixed(2) + "%";
            } else {
              this.readRateArr.push(datas.meterReadingRate);
              this.readRate = datas.meterReadingRate + "%";
            }
            this.readMeterFun();
          } else {
            this.readRateArr = [0];
            this.readdatas = this.readObj.meterReadingTime;
            this.readRate = "0";
            this.readMeterFun();
          }
        });
      }
    },
    // 获取组织机构
    // 获取组织机构模板树
    getOrgTemplate() {
      orgstrutureList()
        .then(res => {
          let data = res.data.data;
          if (data&&data.length > 0) {
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
                if(arr){
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
                }
              };
              fa(data1, this.orgStruId);

              this.orgArr = faResult_orgArr;
              this.orgCodeArrD = faResult_orgCodeArrD;
              this.orgCodeD = this.orgCodeArrD[0]&&this.orgCodeArrD[0].org_code;
              this.orgFun(this.orgCodeD);
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
          if (data&&data.length > 0) {
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
                if(arr){
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
                }
              };
              fa(data1, this.orgStruId);
              
              this.orgArr = faResult_orgArr;
              this.orgCodeArrD = faResult_orgCodeArrD;
              this.orgCodeD = this.orgCodeArrD[0]&&this.orgCodeArrD[0].org_code;
              this.orgFun(this.orgCodeD);
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
    // 分公司变动下的营业厅
    orgFun(e) {
      let orgCodeArr = [];
      this.orgCodeArr = [];
      this.orgArr.map(item => {
        if (e == item.tenant_organization.org_code) {
          item.children.map(orgChildren => {
            orgCodeArr.push(orgChildren.tenant_organization);
          });
          orgCodeArr.map(allList => {
            this.orgCodeArr.push(allList.org_code);
          });
        }
      });
      this.getData(this.orgCodeArr);
    },
    // 开户放大缩小
    fullFun(e) {
      let openFull = document.getElementsByClassName("openAccount");
      if (e == "small") {
        this.openSmall = "big";
        for (var i = 0; i < openFull.length; i++) {
          openFull[i].style.position = "fixed";
          openFull[i].style.top = "0";
          openFull[i].style.left = "0";
          openFull[i].style.right = "0";
          openFull[i].style.bottom = "0";
          openFull[i].style.width = "100%";
          openFull[i].style.height = "100%";
          openFull[i].style.zIndex = "999";
        }
        this.openAchiveDraw.clear();
        this.openAchivesBig();
        this.openAchiveDraw.resize();
        // this.openAchiveDraw.clear();
        // this.openOP = Object.assign(this.openOption, {
        //   dataZoom: [
        //     {
        //       show: this.openAllDatas.length != 0,
        //       type: "inside"
        //     },
        //     {
        //       show: this.openAllDatas.length != 0,
        //       type: "slider"
        //     }
        //   ],
        //   grid: {
        //     left: "50px",
        //     right: "50px",
        //     bottom: "50px",
        //     top: "40px",
        //     containLabel: true
        //   },
        //   xAxis: [
        //     {
        //       show: this.openAllDatas.length != 0,
        //       type: "category",
        //       data: this.openAllDatas,
        //       axisTick: {
        //         show: false
        //       },
        //       axisLabel: {
        //         textStyle: {
        //           color: "#666666"
        //         }
        //       },
        //       axisLine: {
        //         //x轴
        //         lineStyle: {
        //           color: "#C4C6CF"
        //         }
        //       }
        //     }
        //   ],
        //   series: [
        //     {
        //       data: this.openAllCount,
        //       name: "开户数量",
        //       type: "bar",
        //       barWidth: "21px",
        //       itemStyle: {
        //         normal: {
        //           barBorderRadius: [30, 30, 0, 0]
        //         }
        //       }
        //     }
        //   ]
        // });
        // this.openAchiveDraw.setOption(this.openOP);
      } else {
        this.openSmall = "small";
        for (var i = 0; i < openFull.length; i++) {
          openFull[i].style.position = "relative";
          openFull[i].style.display = "inline-block";
          openFull[i].style.width = "50%";
          openFull[i].style.height = "calc(50% - 14px)";
          openFull[i].style.zIndex = "99";
        }
        this.openAchiveDraw.clear();
        this.openAchivesSmall();
        this.openAchiveDraw.resize();
        // this.openAchiveDraw.clear();
        // this.openOP = Object.assign(this.openOption, {
        //   grid: {
        //     left: "20px",
        //     right: "20px",
        //     bottom: "0",
        //     top: "40px",
        //     containLabel: true
        //   },
        //   xAxis: [
        //     {
        //       show: this.opendatas.length != 0,
        //       type: "category",
        //       data: this.opendatas,
        //       axisTick: {
        //         show: false
        //       },
        //       axisLabel: {
        //         textStyle: {
        //           color: "#666666"
        //         }
        //       },
        //       axisLine: {
        //         //x轴
        //         lineStyle: {
        //           color: "#C4C6CF"
        //         }
        //       }
        //     }
        //   ],
        //   series: [
        //     {
        //       data: this.openCount,
        //       name: "开户数量",
        //       type: "bar",
        //       barWidth: "21px",
        //       itemStyle: {
        //         normal: {
        //           barBorderRadius: [30, 30, 0, 0]
        //         }
        //       }
        //     }
        //   ]
        // });
        // delete this.openOP.dataZoom;
        // this.openAchiveDraw.setOption(this.openOP);
      }
    },
    // 用气放大缩小
    fullUseFun(e) {
      let useFull = document.getElementsByClassName("reportUse");
      if (e == "small") {
        this.useSmall = "big";
        for (var i = 0; i < useFull.length; i++) {
          useFull[i].style.position = "fixed";
          useFull[i].style.top = "0";
          useFull[i].style.left = "0";
          useFull[i].style.right = "0";
          useFull[i].style.bottom = "0";
          useFull[i].style.width = "100%";
          useFull[i].style.height = "100%";
          useFull[i].style.zIndex = "999";
        }
        this.useQiDraw.clear();
        this.uesQiFunBig();
        this.useQiDraw.resize();
      } else {
        this.useSmall = "small";
        for (var i = 0; i < useFull.length; i++) {
          useFull[i].style.position = "relative";
          useFull[i].style.display = "inline-block";
          useFull[i].style.width = "calc(50% - 24px)";
          useFull[i].style.height = "50%";
          useFull[i].style.zIndex = "99";
        }
        this.useQiDraw.clear();
        this.uesQiFun();
        this.useQiDraw.resize();
      }
    }
  },
  created() {
    this.isShow =
      this.$_has("report_open") &&
      this.$_has("report_usegas") &&
      this.$_has("report_reading");
  },
  mounted() {
    this.getDate();
    this.openTime = this.dateArr;
    this.useTime = this.dateArr;
    let orgcodeName = this.$ls.get("userInfo");
    this.admin = orgcodeName.userLevel;
    this.tenantAdmin = orgcodeName.isTenantAdmin;
    if (this.tenantAdmin == true) {
      this.company = true;
      this.getOrgTemplate();
    } else if (this.admin == 0) {
      this.company = true;
      if (this.tenantId) {
        this.getOrgTemplate_sys(this.tenantId);
      }
    } else {
      this.company = false;
      this.orgCodeD = orgcodeName.orgCode;
      if (!(this.isCrossDomain && !this.selectedOrg)) {
        if (this.arr) {
          this.arr.map(key => {
            this.orgCodeArr.push(key.org_code);
          });
        } else {
          this.orgCodeArr = [];
        }
        this.getData(this.orgCodeArr);
      }
    }
  },
  computed: {
    arr() {
      return this.$store.state.userInfo.businessHalls;
    },
    tenantId() {
      return this.$store.state.sysCheckedTenant.id;
    },
    selectedOrg() {
      return this.$store.state.selectedOrg;
    },
    tenantType(){
      return this.$store.state.tenantType //租户类型
    }
  },
  watch: {
    arr() {
      this.orgCodeArr = [];
      this.arr.map(key => {
        this.orgCodeArr.push(key.org_code);
      });
      this.getData(this.orgCodeArr);
    },
    tenantId() {
      this.getOrgTemplate_sys(this.tenantId);
    }
  }
};
</script>

<style lang="scss" scoped>
.report-home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: #f8f9fe;
  .HeaderBox {
    height: 50px;
    line-height: 50px;
    padding: 0 24px;
    border-bottom: 1px solid #e9e9e9;
    img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
      margin-bottom: 5px;
    }
    .title {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #222222;
    }
    .filter {
      display: inline-block;
      float: right;
      ::v-deep .el-input--suffix .el-input__inner {
        height: 32px;
        width: 144px;
      }
      ::v-deep .el-input__icon {
        line-height: 31px;
      }
      ::v-deep .el-range-editor.el-input__inner {
        width: 218px;
        height: 32px;
        padding: 0 10px;
      }
      ::v-deep .el-input__suffix {
        height: 32px;
      }
      .dateTiem {
        margin-left: 20px;
      }
      .readTime {
        ::v-deep .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          height: 32px;
          width: 144px;
        }
        ::v-deep .el-input__icon {
          color: #4e4e4eff;
          opacity: 0.6;
        }
        ::v-deep .el-input--suffix .el-input__inner {
          // background: transparent;
          color: #4e4e4eff;
          opacity: 0.6;
        }
        ::-webkit-input-placeholder {
          color: #ffffff;
        }
        ::v-deep .el-select .el-input.is-focus .el-input__inner {
          border-color: #ffffff;
        }
        ::v-deep .el-select .el-input__inner:focus {
          border-color: #ffffff;
        }
      }
      .icon {
        width: 18px;
        height: 18px;
        margin-left: 24px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
  .trend {
    height: calc(100% - 50px);
    padding-bottom: 10px;
  }
  #readMeter div {
    float: left;
    width: 50%;
  }
  // .reportUp {
  // height: calc(50% - 24px);
  // margin-bottom: 24px;
  // display: flex;
  .reportList {
    height: calc(50% - 14px);
    width: calc(50% - 24px);
    margin-bottom: 14px;
    margin-right: 24px;
    // height: 100%;
    display: inline-block;
    background-color: #ffffff;
    .reportClass {
      height: calc(100% - 50px);
      padding: 20px 5px 0 24px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      /*分辨率高于1601，采用下面的样式*/
      @media screen and (min-device-width: 1601px) {
        .reports {
          width: 50%;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          margin-bottom: 50px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }
          .report_text {
            line-height: 20px;
            display: inline-block;
            cursor: pointer;
            .text1 {
              font-size: 18px;
              color: #4e4e4e;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
            }
            .text2 {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      /*分辨率高于1366，低于1601采用下面的样式*/
      @media screen and (min-device-width: 1366px) and (max-device-width: 1601px) {
        .reports {
          width: 50%;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          margin-bottom: 29px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }
          .report_text {
            line-height: 20px;
            display: inline-block;
            cursor: pointer;
            .text1 {
              font-size: 18px;
              color: #4e4e4e;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
            }
            .text2 {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      /*分辨率低于1367，采用下面的样式*/
      @media screen and (max-device-width: 1367px) {
        .reports {
          width: 50%;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          margin-bottom: 20px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }
          .report_text {
            line-height: 20px;
            display: inline-block;
            cursor: pointer;
            .text1 {
              font-size: 18px;
              color: #4e4e4e;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
            }
            .text2 {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
    }
  }
  .reportList.allShow {
    width: 100%;
    height: 100%;
  }
  .openAccount {
    position: relative;
    width: 50%;
    // margin-bottom: 24px;
    height: calc(50% - 14px);
    display: inline-block;
    background-color: #ffffff;
  }
  // }
  // .reportDown {
  // height: 50%;
  // display: flex;
  .reportUse {
    width: calc(50% - 24px);
    margin-right: 24px;
    // height: 100%;
    height: 50%;
    display: inline-block;
    background-color: #ffffff;
  }
  .readMeter {
    width: 50%;
    // height: 100%;
    height: 50%;
    display: inline-block;
    background: url("~@/assets/imgs/report/readMeterbg.png") no-repeat center;
    background-size: cover;
  }
  // }
  // .report {
  //   width: 200px;
  //   height: 200px;
  //   border: 1px solid #000000;
  //   display: inline-block;
  //   margin-right: 20px;
  // }
}
</style>