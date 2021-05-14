<template>
  <div class="account-open-set-config-wrap">
    <div class="account-open-set-config-left">
      <div class="left-title">
        <img class="columnIcon" src="@/assets/imgs/directive.png" />
        <span>开户指令集配置</span>
      </div>
      <div class="left-menu">
        <vue-scroll :ops="ops">
          <ul class="left-menu-ul">
            <li
              :class="[{ 'active-class': activeTab === item.meterTypeId }]"
              v-for="item in setList"
              :key="item.meterTypeId"
              :title="item.meterTypeName"
              @click="onClickTab(item)"
            >
              {{ item.meterTypeName }}
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="account-open-set-config-right">
      <div class="right-content" v-if="details !== null">
        <vue-scroll :ops="ops">
          <el-checkbox-group
            style="font-size: 14px"
            v-model="checkedList"
            @change="onChangeCheckbox"
          >
            <div
              v-for="item in details"
              :key="item.codeId"
              class="right-content-box"
            >
              <div v-if="item.codeId == 6">
                <div class="right-content-box-title">
                  <el-checkbox :label="item.codeId">{{
                    item.codeName
                  }}</el-checkbox>
                </div>
                <el-row>
                  <el-col :span="12" class="right-content-box-col">
                    <div class="col-label">上传周期模式</div>
                    <el-select
                      v-model="backTimeVal.uploadDayOrMonth"
                      placeholder="请选择"
                      class="return-time"
                      @change="backValChange"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    >
                      <el-option label="按天发送" value="0"></el-option>
                      <el-option label="按月发送" value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12" class="right-content-box-col">
                    <div class="col-label">上传时</div>
                    <el-input
                      :placeholder="backTimeDes.uploadHour"
                      size="small"
                      v-model="backTimeVal.uploadHour"
                      :title="
                        backTimeDes.uploadHour.length > 12
                          ? backTimeDes.uploadHour
                          : ''
                      "
                      class="col-input"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    ></el-input>
                  </el-col>
                  <el-col :span="12" class="right-content-box-col">
                    <div class="col-label">上传分</div>
                    <el-input
                      :placeholder="backTimeDes.uploadMinute"
                      size="small"
                      v-model="backTimeVal.uploadMinute"
                      :title="
                        backTimeDes.uploadMinute.length > 12
                          ? backTimeDes.uploadMinute
                          : ''
                      "
                      class="col-input"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    ></el-input>
                  </el-col>
                  <el-col
                    :span="12"
                    class="right-content-box-col"
                    v-if="backTimeVal.uploadDayOrMonth != 1"
                  >
                    <div class="col-label">隔几天上传</div>
                    <el-input
                      :placeholder="backTimeDes.uploadDaysOrOneDay"
                      size="small"
                      v-model="backTimeVal.uploadDaysOrOneDay"
                      :title="
                        backTimeDes.uploadDaysOrOneDay.length > 12
                          ? backTimeDes.uploadDaysOrOneDay
                          : ''
                      "
                      class="col-input"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    ></el-input>
                  </el-col>
                  <el-col :span="12" class="right-content-box-col" v-else>
                    <div class="col-label">某号上传</div>
                    <el-input
                      :placeholder="backTimeDes.uploadDaysOrOneDay"
                      size="small"
                      v-model="backTimeVal.uploadDaysOrOneDay"
                      :title="
                        backTimeDes.uploadDaysOrOneDay.length > 12
                          ? backTimeDes.uploadDaysOrOneDay
                          : ''
                      "
                      class="col-input"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="item.codeId === 162">
                <div class="right-content-box-title">
                  <el-checkbox :label="item.codeId">{{
                    item.codeName
                  }}</el-checkbox>
                </div>
                <el-row style="margin-bottom: 20px">
                  <el-col
                    :span="12"
                    v-for="(val, index) in item.params || []"
                    :key="index + 'demo001'"
                    class="right-content-box-col"
                  >
                    <template v-if="/模式/.test(val.paramDescribe)">
                      <div class="col-label">
                        {{ val.paramDescribe }}
                      </div>
                      <el-select
                        v-model="val.defaultValue"
                        placeholder="请选择"
                        class="return-time"
                        @change="backValChangeModel"
                        :disabled="checkedList.indexOf(item.codeId) == -1"
                      >
                        <el-option label="按天发送" value="0"></el-option>
                        <el-option label="按月发送" value="1"></el-option>
                      </el-select>
                    </template>
                    <template v-else-if="/或/.test(val.paramDescribe)">
                      <div :title="initModelItem(val)" class="col-label">
                        {{ model_label }}
                      </div>
                      <el-input
                        :placeholder="model_placehold"
                        size="small"
                        v-model="val.defaultValue"
                        :title="
                          val.paramsPrompt.length > 12 ? val.paramsPrompt : ''
                        "
                        class="col-input"
                        :disabled="checkedList.indexOf(item.codeId) == -1"
                      ></el-input>
                    </template>
                    <template v-else>
                      <div class="col-label">
                        {{ val.paramDescribe }}
                      </div>
                      <el-input
                        :placeholder="val.paramsPrompt"
                        size="small"
                        v-model="val.defaultValue"
                        :title="
                          val.paramsPrompt.length > 12 ? val.paramsPrompt : ''
                        "
                        class="col-input"
                        :disabled="checkedList.indexOf(item.codeId) == -1"
                      ></el-input>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                <div class="right-content-box-title">
                  <el-checkbox :label="item.codeId">{{
                    item.codeName
                  }}</el-checkbox>
                </div>
                <el-row style="margin-bottom: 20px">
                  <el-col
                    :span="12"
                    v-for="(val, index) in item.params || []"
                    :key="index + 'demo001'"
                    class="right-content-box-col"
                  >
                    <div class="col-label">{{ val.paramDescribe }}</div>
                    <el-input
                      :placeholder="val.paramsPrompt"
                      size="small"
                      v-model="val.defaultValue"
                      :title="
                        val.paramsPrompt.length > 12 ? val.paramsPrompt : ''
                      "
                      class="col-input"
                      :disabled="checkedList.indexOf(item.codeId) == -1"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-checkbox-group>
        </vue-scroll>
        <el-button
          class="right-content-btn el-button--primary"
          style="width: 100px"
          size="small"
          @click="saveData"
          >保存</el-button
        >
      </div>
      <div class="details-empty-data" v-else>
        <img class="image" src="@/assets/imgs/temp/noData.png" alt />
        <div class="text">无可配置的指令数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getConfigList,
  getCommandlist,
  saveCommandDetails
} from "@/api/accountOpenSetConfig.js";
import _ from "lodash";

export default {
  name: "account-open-set-config",
  data () {
    return {
      ops: window.scrollOps, // 滚动条
      setList: [],
      activeTab: "",
      details: null,
      checkedList: [],
      backTimeVal: {}, //表具回传周期
      backTimeDes: {}, //表具回传周期的描述
      model_label:'隔几天上传',
      model_placehold:'1-255天',
      model_item:{}
    };
  },
  created () {
    // let _tenantId = "";
    // try {
    //   _tenantId =
    //     JSON.parse(localStorage.getItem("vuejs__userInfo")).value || {};
    // } catch {}
    getConfigList().then(res => {
      if (res.data.code == 0) {
        let middleArr = res.data.data;
        this.setList =
          middleArr.filter(item => {
            return item.remoteMode != 0;
          }) || [];
        if (this.setList[0]) {
          this.activeTab = this.setList[0].meterTypeId;
          this.getComList({
            meterType: this.activeTab
          });
        }
      }
    });
  },
  watch: {},
  methods: {
    onChangeCheckbox (attr, fff) {
      let newDetails = _.cloneDeep(this.details);
      newDetails.forEach(item => {
        if (this.checkedList.indexOf(item.codeId) == -1) {
          if (item.codeId == 6) {
            this.backTimeVal = {
              uploadDay: null,
              uploadDayOrMonth: null,
              uploadDaysOrOneDay: null,
              uploadHour: null,
              uploadMinute: null
            };
          }
          item.params.map(val => {
            _.set(val, "defaultValue", null);
          });
        }
      });
      this.details = newDetails;
    },
    onClickTab (attr) {
      this.activeTab = attr.meterTypeId;
      this.checkedList = [];
      this.getComList({
        meterType: attr.meterTypeId
      });
    },
    getComList (obj) {
      getCommandlist(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.details = res.data.data;
            this.details.map(item => {
              if (item.codeId == 6) {
                item.params.map(val => {
                  this.$set(this.backTimeVal, val.paramName, val.defaultValue);
                  this.$set(this.backTimeDes, val.paramName, val.paramsPrompt);
                });
              }
            });
            this.checkedList = res.data.data
              .map(item => {
                if (item.config) {
                  return item.codeId;
                }
              })
              .filter(val => {
                return !!val;
              });
          } else {
            this.details = null;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    saveData () {
      let _attr = {
        meterTypeId: this.activeTab,
        list: []
      };
      let _param = [];
      let _checkList = _.cloneDeep(this.checkedList);
      let isNoOk = false;
      _checkList.forEach(item => {
        let _findJson = _.find(this.details, val => {
          return val.codeId === item;
        });
        if (_findJson) {
          if (_findJson.codeId == 6) {
            this.backTimeVal["uploadDay"] = this.backTimeVal[
              "uploadDaysOrOneDay"
            ];
            let newArr = [];
            for (let key in this.backTimeVal) {
              if (
                this.backTimeVal[key] == null ||
                this.backTimeVal[key] === ""
              ) {
                isNoOk = true;
                return this.$message.error("所勾选配置项参数不能为空");
              } else {
                let value = this.backTimeVal[key];
                if (typeof value == "string" && value.constructor == String) {
                  value = value.trim();
                }
                newArr.push(key + "=" + value);
              }
            }
            _param.push({
              commandId: item,
              params: newArr.join(",")
            });
          } else {
            let newArr = _findJson.params.map(v => {
              if (v.defaultValue == null || v.defaultValue == "") {
                isNoOk = true;
                return this.$message.error("所勾选配置项参数不能为空");
              } else {
                let value = v.defaultValue;
                if (typeof value == "string" && value.constructor == String) {
                  value = value.trim();
                }
                return v.paramName + "=" + value;
              }
            });
            _param.push({
              commandId: item,
              params: newArr.join(",")
            });
          }
        }
      });
      if (isNoOk) return;
      _.set(_attr, "list", _param);
      let dialogLoading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      saveCommandDetails(_attr)
        .then(res => {
          dialogLoading.close();
          if (res.data.code == 0) {
            this.$message.success("保存成功");
            this.getComList({
              meterType: this.activeTab
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          dialogLoading.close();
          this.$message.error(err.message);
        });
    },
    backValChange (val) {
      this.backTimeVal.uploadDaysOrOneDay = "";
      if (val == 1) {
        this.$set(this.backTimeDes, "uploadDaysOrOneDay", "1-28的整数(天)");
      } else {
        this.$set(this.backTimeDes, "uploadDaysOrOneDay", "1-255的整数(天)");
      }
    },
    // 监听修改上传周期的模式
    backValChangeModel(val){
      // 需要联动的值重置
      this.model_item.defaultValue = void(0)
    /**
     * val:
     *  0:按天发送
     *  1:按月发送
     */
      if(val == 1){
        this.model_label = '某号上传'
        this.model_placehold = '1-28的整数(天)'
      }else{
        this.model_label = '隔几天上传'
        this.model_placehold = '1-255的整数(天)'
      }
    },
    // 初始化时浅拷贝需要联动的对象
    initModelItem(e){
      this.model_item = e
      return
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-checkbox__label {
  color: #4e4e4e !important;
}
</style>