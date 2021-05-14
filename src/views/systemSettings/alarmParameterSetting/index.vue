<template>
  <div class="account-open-set-config-wrap alarm-setting">
    <div class="account-open-set-config-left alarm-setting-left">
      <div class="left-title alarm-left-title">
        <img class="columnIcon" src="@/assets/imgs/archives_details_alrm.png" />
        <span>报警参数配置</span>
      </div>
      <div class="table-type">
        <!-- <span class="fixed-text">设备类型：</span> -->
        <el-select v-model="value" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.sortValue"
            :label="item.sortName"
            :value="item.sortValue"
          ></el-option>
          <span slot="prefix" class="fixed-text">设备类型：</span>
        </el-select>
      </div>
      <div class="left-menu alarm-left-menu">
        <div class="empty" v-if="setList.length==0">
          <div>
            <img src="@/assets/imgs/temp/noData.png" alt />
            <span>暂无表具</span>
          </div>
        </div>
        <vue-scroll :ops="ops" v-else>
          <ul class="left-menu-ul" v-if="value==0">
            <li
              :class="[{'active-class': activeTab === item.meterTypeId}]"
              v-for="item in setList"
              :key="item.meterTypeId"
              :title="item.meterTypeName"
              @click="onClickTab(item)"
            >{{item.meterTypeName}}</li>
          </ul>
          <ul class="left-menu-ul" v-else-if="value==1">
            <li
              :class="[{'active-class': activeTab === item.dtuTypeId}]"
              v-for="item in setList"
              :key="item.dtuTypeId"
              :title="item.dtuTypeName"
              @click="onClickTab(item)"
            >{{item.dtuTypeName}}</li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="account-open-set-config-right alarm-right">
      <div class="right-content alarm-content" v-if="details.length!=0">
        <vue-scroll :ops="ops">
          <el-checkbox-group style="font-size: 14px" v-model="checkedList" @change="checkChange">
            <div
              v-for="item in details"
              :key="item.alarmId"
              class="right-content-box alarm-content-box"
            >
              <div class="control-padding">
                <div class="for-center">
                  <el-checkbox :label="item.alarmId">{{item.alarmName}}</el-checkbox>
                  <el-input
                    class="alarm-input"
                    :disabled="checkedList.indexOf(item.alarmId) == -1"
                    :placeholder="item.rulePrompt"
                    v-model="item.alarmValue"
                    :title="item.rulePrompt.length>10?item.rulePrompt:''"
                    v-if="item.alarmSort!=1&&item.alarmId!=4&&item.alarmId!=5&&item.alarmId!=6"
                  ></el-input>
                  <el-input
                    class="alarm-input"
                    :disabled="checkedList.indexOf(item.alarmId) == -1"
                    :placeholder="item.rulePrompt"
                    v-model="item.alarmValue.a"
                    :title="item.rulePrompt.length>10?item.rulePrompt:''"
                    v-if="item.alarmId==4||item.alarmId==5"
                  ></el-input>
                  <el-input
                    class="alarm-input"
                    :disabled="checkedList.indexOf(item.alarmId) == -1"
                    :placeholder="item.rulePrompt"
                    v-model="item.alarmValue"
                    :title="item.rulePrompt.length>10?item.rulePrompt:''"
                    v-if="item.alarmId==6&&
                    (activeBlock.protocolType=='6011001'
                    ||activeBlock.protocolType=='6011007'
                    ||activeBlock.protocolType=='6011004'
                    ||activeBlock.protocolType=='6011006'
                    )"
                  ></el-input>
                  <!-- <el-tooltip
                    placement="top"
                    effect="light"
                    v-show="item.alarmId === 8"
                  >
                    <div slot="content">
                      默认透支量为0
                    </div>
                    <el-button
                      icon="el-icon-question"
                      size="mini"
                      circle
                      plain
                      style="border: none; font-size: 18px"
                    >
                    </el-button>
                  </el-tooltip> -->
                </div>
                <div
                  v-if="(item.alarmId==4||item.alarmId==5)&&protocolTypeExist==-1"
                  class="one-checked"
                >
                  <span>是否阀控</span>
                  <el-radio
                    v-model="item.alarmValue.v"
                    label="0"
                    :disabled="checkedList.indexOf(item.alarmId) == -1"
                  >否</el-radio>
                  <el-radio
                    v-model="item.alarmValue.v"
                    label="1"
                    :disabled="checkedList.indexOf(item.alarmId) == -1"
                  >是</el-radio>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </vue-scroll>
        <el-button
          class="right-content-btn el-button--primary"
          style="width:100px;"
          size="small"
          :loading="dialogLoading"
          @click="saveData"
        >保存</el-button>
      </div>
      <div class="details-empty-data" v-else>
        <img class="image" src="@/assets/imgs/temp/noData.png" alt />
        <div class="text">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getConfigList,
  getDTUList,
  getAlarmlist,
  saveAlarm
} from "@/api/accountOpenSetConfig.js";
import { directiveSource } from "@/api/meterMonitorAPI";
import _ from "lodash";
export default {
  name: "alarm-parameter-setting",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      options: [],
      value: "", //默认远传表
      //当前活跃的表类型，和表类型列表
      setList: [],
      activeTab: "",
      details: [],
      checkedList: [],
      activeBlock: "", //当前处于的模块
      dialogLoading: false,
      protocolTypeExist: ""
    };
  },
  computed: {},
  watch: {
    activeBlock(newVal, oldVal) {
      // 初始化数据
      this.details = [];
      let initprotocolType = newVal.protocolType;
      let protocolTypes = [
        "6012002",
        "6012003",
        "6012004",
        "6012005",
        "6012006",
        "6012007",
        "6012011",
        "6012014",
        "6011002",
        "6011005"
      ];
      let index = protocolTypes.indexOf(initprotocolType);
      this.protocolTypeExist = index;
      // console.log(this.protocolTypeExist, "this.protocolTypeExist");
    }
  },
  created() {
    // this.getConfigList({
    //   type: this.value + 1
    // });
    this.getDirectiveSource({
      codes: "deviceCategory"
    }).then(() => {
      this.value = "0";
      this.getConfigList();
    });
  },
  mounted() {},
  methods: {
    // 勾选框变化
    checkChange(val) {
      this.details.map(item => {
        let exist = this.checkedList.indexOf(item.alarmId);
        if (exist == -1) {
          if (item.alarmId == 4 || item.alarmId == 5) {
            item.alarmValue.a = null;
            item.alarmValue.v = "0";
          } else {
            item.alarmValue = null;
          }
        }
      });
    },
    // 获取表类型列表
    getConfigList(obj) {
      // let _tenantId = "";
      // try {
      //   _tenantId =
      //     JSON.parse(localStorage.getItem("vuejs__userInfo")).value || {};
      // } catch {}
      // let _obj = { ...obj, tenantId: parseInt(_tenantId.tenantId || 0) };
      return getConfigList(obj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data && res.data.data) {
              let middleArr = res.data.data;
              this.setList = middleArr.filter(item => {
                return item.remoteMode != 0;
              });
              if (this.setList[0]) {
                this.activeTab = this.setList[0].meterTypeId;
                this.activeBlock = this.setList[0];
                this.getAlarmlist({
                  deviceSubType: this.setList[0].meterTypeId,
                  deviceType: this.value
                });
              } else {
                this.details = [];
              }
            } else {
              this.$message.error(`列表请求失败`);
            }
          } else {
            this.$message.error(`列表请求错误-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("列表请求错误-接口请求失败");
        });
    },
    // 获取dtu列表
    getDTUList() {
      return getDTUList()
        .then(res => {
          if (res.data.code == 0) {
            if (res.data && res.data.data) {
              this.setList = res.data.data;
              if (this.setList[0]) {
                this.activeTab = this.setList[0].dtuTypeId;
                this.activeBlock = this.setList[0];
                this.getAlarmlist({
                  deviceSubType: this.setList[0].dtuTypeId,
                  deviceType: this.value
                });
              } else {
                this.details = [];
              }
            } else {
              this.$message.error(`列表请求失败`);
            }
          } else {
            this.$message.error(`列表请求错误-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("列表请求错误-接口请求失败");
        });
    },
    onClickTab(attr) {
      this.details = []; //防止过渡页面内容的闪。
      this.activeBlock = attr;
      this.activeTab = attr.meterTypeId || attr.dtuTypeId;
      this.dialogLoading = false;
      // this.checkedList = [];
      this.getAlarmlist({
        deviceSubType: attr.meterTypeId || attr.dtuTypeId,
        deviceType: this.value
      });
    },
    // 下拉值发生改变
    selectChange(val) {
      // this.getConfigList({
      //   type: this.value + 1
      // });
      this.dialogLoading = false;
      if (val == 0) {
        this.getConfigList();
      } else {
        this.getDTUList();
      }
    },
    //获取告警类型
    getAlarmlist(obj) {
      return getAlarmlist(obj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data) {
              if (res.data.data.records) {
                let middleData = res.data.data.records;
                middleData.map(item => {
                  if (item["alarmId"] == 4 || item["alarmId"] == 5) {
                    if (
                      item["alarmValue"] != null &&
                      item["alarmValue"] !== ""
                    ) {
                      item["alarmValue"] = JSON.parse(item["alarmValue"]);
                    }
                  }
                });
                this.details = res.data.data.records;
                // console.log(this.details, "details");
                this.checkedList = res.data.data.records.map(item => {
                  if (item.isConfig) {
                    return item.alarmId;
                  }
                });
              } else {
                this.details = [];
              }
            } else {
              this.$message.error(`告警类型请求失败`);
            }
          } else {
            this.$message.error(`告警类型请求错误-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("告警类型请求错误-接口请求失败");
        });
    },
    // 保存数据
    saveData() {
      let _attr = {
        deviceSubType: this.activeTab,
        deviceType: this.value,
        list: []
      };
      let _param = [];
      let _checkList = _.cloneDeep(this.checkedList);
      let isNoOk = false;

      _checkList.forEach(item => {
        let _findJson = _.find(this.details, val => {
          return val.alarmId === item;
        });
        if (_findJson) {
          let newArr = [];
          if (_findJson["alarmSort"] == 1) {
            newArr = _findJson["rulePrompt"];
          } else if (_findJson["alarmId"] == 4 || _findJson["alarmId"] == 5) {
            if (this.protocolTypeExist != -1) {
              if (
                _findJson["alarmValue"]["a"] == null ||
                _findJson["alarmValue"]["a"] === ""
              ) {
                isNoOk = true;
                return this.$message.error("所勾选配置项参数不能为空");
              } else {
                let value = _findJson["alarmValue"]["a"];
                if (typeof value == "string" && value.constructor == String) {
                  value = value.trim();
                }
                newArr = {
                  a: value,
                  v: "0"
                };
                // newArr = JSON.stringify(newArr);
              }
            } else {
              if (
                _findJson["alarmValue"]["a"] == null ||
                _findJson["alarmValue"]["a"] === "" ||
                _findJson["alarmValue"]["v"] == null ||
                _findJson["alarmValue"]["v"] === ""
              ) {
                isNoOk = true;
                return this.$message.error("所勾选配置项参数不能为空");
              } else {
                let value = _findJson["alarmValue"]["a"];
                if (typeof value == "string" && value.constructor == String) {
                  value = value.trim();
                }
                newArr = {
                  a: value,
                  v: _findJson["alarmValue"]["v"]
                };
                // newArr = JSON.stringify(newArr);
              }
            }
          } else if (_findJson["alarmId"] == 6) {
            if (
              this.activeBlock.protocolType == "6011001" ||
              this.activeBlock.protocolType == "6011007" ||
              this.activeBlock.protocolType == "6011004" ||
              this.activeBlock.protocolType == "6011006"
            ) {
              if (
                _findJson["alarmValue"] == null ||
                _findJson["alarmValue"] === ""
              ) {
                isNoOk = true;
                return this.$message.error("所勾选配置项参数不能为空");
              } else {
                let value = _findJson["alarmValue"];
                if (typeof value == "string" && value.constructor == String) {
                  value = value.trim();
                }
                newArr = value;
              }
            } else {
              newArr = "1";
            }
          } else {
            if (
              _findJson["alarmValue"] == null ||
              _findJson["alarmValue"] === ""
            ) {
              isNoOk = true;
              return this.$message.error("所勾选配置项参数不能为空");
            } else {
              let value = _findJson["alarmValue"];
              if (typeof value == "string" && value.constructor == String) {
                value = value.trim();
              }
              newArr = value;
            }
          }
          if (_findJson["alarmId"] == 4 || _findJson["alarmId"] == 5) {
            if (newArr["a"].length != 0) {
              newArr = JSON.stringify(newArr);
              _param.push({
                alarmId: item,
                alarmValue: newArr
              });
            }
          } else {
            if (newArr.length != 0) {
              _param.push({
                alarmId: item,
                alarmValue: newArr
              });
            }
          }
        }
      });
      if (isNoOk) return;
      _.set(_attr, "list", _param);
      this.dialogLoading = true;
      saveAlarm(_attr)
        .then(res => {
          this.dialogLoading = false;
          if (res.data.code == 0) {
            this.$message.success("保存成功");
            this.getAlarmlist({
              deviceSubType: this.activeTab,
              deviceType: this.value
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.dialogLoading = false;
          this.$message.error(err.message);
        });
    },
    // 数据字典获取
    getDirectiveSource(obj) {
      return directiveSource(obj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data && res.data.data) {
              this.options = res.data.data.deviceCategory;
            } else {
              this.$message.error(`指令来源查询发生错误`);
            }
          } else {
            this.$message.error(`指令来源查询发生错误-${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("指令来源查询发生错误-接口请求失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
@import "../accountOpenSetConfig/index.scss";
</style>