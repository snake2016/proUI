<template>
  <div class="msg-bs-manage-wrap">
    <div class="msg-bs-manage-left">
      <div class="msg-bs-manage-left-title-box">
        <div class="msg-bs-manage-left-title">
          <img class="columnIcon" src="@/assets/imgs/permissNameIcon.png" />
          <span>消息业务列表</span>
        </div>
      </div>
      <div class="msg-bs-manage-left-treebox">
        <div class="msg-bs-manage-left-tips-box">
          <div class="msg-bs-manage-left-tips">
            <div
              :class="['left-tips',{'active-btn': tabType === 'WeChat'}]"
              @click="changeTab('WeChat')"
            >
              <svg
                class="icon"
                aria-hidden="true"
                slot="reference"
                style="width: 14px;height: 14px;margin-left:8px;color: red; cursor: pointer"
                path="fill: rgb(255,255,255)"
                v-if="tabType === 'WeChat'"
              >
                <use xlink:href="#el-icon-weixin" />
              </svg>
              <svg
                class="icon"
                aria-hidden="true"
                slot="reference"
                v-else
                style="width: 14px;height: 14px;margin-left:8px;color: red; cursor: pointer"
                path="fill: rgb(255,255,255)"
              >
                <use xlink:href="#el-icon-weixin-copy" />
              </svg>
              <span style="margin-left:4px;">微信业务</span>
            </div>
            <div :class="['left-tips',{'active-btn': tabType === 'sms'}]" @click="changeTab('sms')">
              <svg
                class="icon"
                aria-hidden="true"
                slot="reference"
                style="width: 14px;height: 12px;margin-left:8px;color: red; cursor: pointer"
                path="fill: rgb(255,255,255)"
                v-if="tabType === 'sms'"
              >
                <use xlink:href="#el-icon-xiaoxi-copy" />
              </svg>
              <svg
                class="icon"
                aria-hidden="true"
                slot="reference"
                v-else
                style="width: 14px;height: 12px;margin-left:8px;color: red; cursor: pointer"
                path="fill: rgb(255,255,255)"
              >
                <use xlink:href="#el-icon-xiaoxi" />
              </svg>
              <span style="margin-left:4px;">短信业务</span>
            </div>
          </div>
        </div>
        <div class="msg-bs-manage-left-tree" v-if="tabType === 'WeChat'">
          <vue-scroll :ops="ops" v-if="wechatList.length > 0">
            <ul class="msg-bs-manage-menu">
              <li
                :class="['msg-bs-manage-menu-item',{'menu-active': wechatActive === item.notifyBizId}]"
                v-for="(item,index) in wechatList"
                :key="index+'222111000000012'"
                @click="onWechatClick(item)"
              >
                <div class="menu-item-left">
                  <span>{{item.bizName}}</span>
                  <el-tooltip class="item" effect="dark" content="该业务已配置" placement="top">
                    <svg
                      class="icon"
                      aria-hidden="true"
                      style="width: 14px;height: 12px;margin-left:8px;color: red; cursor: pointer"
                      path="fill: rgb(255,255,255)"
                      v-if="item.notifyConfigId"
                    >
                      <use xlink:href="#el-icon-biaoqian" />
                    </svg>
                  </el-tooltip>
                </div>
              </li>
            </ul>
          </vue-scroll>
          <div class="details-empty-data" v-if="wechatList.length === 0">
            <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div class="text">暂无数据</div>
          </div>
        </div>
        <div class="msg-bs-manage-left-tree" v-else>
          <vue-scroll :ops="ops" v-if="smsList.length > 0">
            <ul class="msg-bs-manage-menu">
              <li
                :class="['msg-bs-manage-menu-item',{'menu-active': smsActive === item.notifyBizId}]"
                v-for="(item,index) in smsList"
                :key="index+'00000012222'"
                @click="onSmsClick(item)"
              >
                <div class="menu-item-left">
                  <span>{{item.bizName}}</span>
                  <el-tooltip class="item" effect="dark" content="该业务已配置" placement="top">
                    <svg
                      class="icon"
                      aria-hidden="true"
                      style="width: 14px;height: 12px;margin-left:8px;color: red; cursor: pointer"
                      path="fill: rgb(255,255,255)"
                      v-if="item.notifyConfigId"
                    >
                      <use xlink:href="#el-icon-biaoqian" />
                    </svg>
                  </el-tooltip>
                </div>
              </li>
            </ul>
          </vue-scroll>
          <div class="details-empty-data" v-if="smsList.length === 0">
            <img class="image" src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div class="text">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="msg-bs-manage-right">
      <keep-alive>
        <wechatBusiness
          v-if="tabType === 'WeChat'"
          ref="wechatBusinessComp"
          :isWechatEdit="isWechatEdit"
          :wechatDetails="wechatDetails"
          @changeIsEdit="changeIsEdit"
          @savaWechatDetails="savaWechatDetails"
        />
        <smsBusiness
          v-else
          ref="smsBusinessComp"
          :isSmsEdit="isSmsEdit"
          :smsDetails="smsDetails"
          @changeSmsEdit="changeSmsEdit"
          @savaSmsDetails="savaSmsDetails"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import wechatBusiness from "./wechatBusiness.vue";
import smsBusiness from "./smsBusiness.vue";
import { getBusinessList, pushBusinessConfig } from "@/api/systemSettings.js";
import $ from "jquery";
import _ from "lodash";
import dayjs from "dayjs";

export default {
  name: "message-business-manage",
  components: { wechatBusiness, smsBusiness },
  data() {
    return {
      tabPosition: "",
      ops: window.scrollOps, // 滚动条
      tabType: "WeChat",
      //微信业务
      wechatActive: "",
      isWechatEdit: false,
      wechatDetails: {},
      wechatList: [],
      //短信业务
      smsActive: "",
      isSmsEdit: false,
      smsDetails: {},
      smsList: []
    };
  },
  created() {
    this.getWeChatList();
    this.getSmsList();
  },
  mounted() {},
  methods: {
    changeTab(attr) {
      this.tabType = attr;
    },
    // 点击微信业务
    onWechatClick(attr, index) {
      this.isWechatEdit = false;
      this.wechatActive = attr.notifyBizId || "";
      let _data = _.cloneDeep(attr || {});
      for (let i in _data) {
        if (i === "delaySendStartTime") {
          _.set(_data, "sendStartTime", _data[i]);
        } else if (i === "delaySendEndTime") {
          _.set(_data, "sendEndTime", _data[i]);
        }
      }
      if (index != 0) {
        this.$refs.wechatBusinessComp.clearCheckInformation();
      }
      this.wechatDetails = _data;
    },
    // 更改isEdit
    changeIsEdit() {
      this.isWechatEdit = !this.isWechatEdit;
    },
    //  获取微信列表
    getWeChatList() {
      getBusinessList({
        size: 500,
        notifyType: 1
      })
        .then(res => {
          if (res.data.code == 0) {
            this.wechatList = res.data.data.records || [];
            let _findWechat = _.find(this.wechatList, item => {
              return item.notifyBizId === this.wechatActive;
            });
            if (_findWechat) {
              this.onWechatClick(_findWechat);
            } else {
              this.onWechatClick(this.wechatList[0], 0);
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    //  保存微信数据
    savaWechatDetails(attr) {
      let _data = _.cloneDeep(attr);
      if (_data.sendMode == 2) {
        let today = dayjs().format("YYYY-MM-DD");
        if (!_data.sendStartTime || !_data.sendStartTime) {
          return this.$message.error("定时开始时间或者结束时间不能为空");
        } else {
          let _startTime = today + " " + _data.sendStartTime + ":00";
          let _endTime = today + " " + _data.sendEndTime + ":00";
          if (dayjs(_endTime).diff(dayjs(_startTime), "minutes") < 0) {
            return this.$message.error("结束时间必须不小于开始时间");
          }
        }
      } else {
        _.set(_data, "sendStartTime", null);
        _.set(_data, "sendEndTime", null);
      }
      pushBusinessConfig(_data)
        .then(res => {
          if (res.data.code == 0) {
            this.getWeChatList();
            this.isWechatEdit = false;
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取短信业务列表
    getSmsList() {
      getBusinessList({
        size: 500,
        notifyType: 2
      })
        .then(res => {
          if (res.data.code == 0) {
            this.smsList = res.data.data.records || [];
            let _findSms = _.find(this.smsList, item => {
              return item.notifyBizId === this.smsActive;
            });
            if (_findSms) {
              this.onSmsClick(_findSms);
            } else {
              this.onSmsClick(this.smsList[0]);
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 点击短信业务
    onSmsClick(attr) {
      this.isSmsEdit = false;
      this.smsActive = attr.notifyBizId || "";
      let _data = _.cloneDeep(attr || {});
      for (let i in _data) {
        if (i === "delaySendStartTime") {
          _.set(_data, "sendStartTime", _data[i]);
        } else if (i === "delaySendEndTime") {
          _.set(_data, "sendEndTime", _data[i]);
        }
      }
      if (this.tabType == "sms") {
        this.$refs.smsBusinessComp.clearCheckInformation();
      }

      this.smsDetails = _data;
    },
    //
    changeSmsEdit() {
      this.isSmsEdit = !this.isSmsEdit;
    },
    savaSmsDetails(attr) {
      let _data = _.cloneDeep(attr);
      if (_data.sendMode == 2) {
        let today = dayjs().format("YYYY-MM-DD");
        if (!_data.sendStartTime || !_data.sendStartTime) {
          return this.$message.error("定时开始时间或者结束时间不能为空");
        } else {
          let _startTime = today + " " + _data.sendStartTime + ":00";
          let _endTime = today + " " + _data.sendEndTime + ":00";
          if (dayjs(_endTime).diff(dayjs(_startTime), "minutes") < 0) {
            return this.$message.error("结束时间必须不小于开始时间");
          }
        }
      } else {
        _.set(_data, "sendStartTime", null);
        _.set(_data, "sendEndTime", null);
      }
      pushBusinessConfig(_data)
        .then(res => {
          if (res.data.code == 0) {
            this.getSmsList();
            this.isSmsEdit = false;
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}
</style>