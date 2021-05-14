<template>
  <div class="wechat-bs-wrap">
    <div class="wechat-bs-title">
      <img class="columnIcon" src="@/assets/imgs/infoIcon.png" />
      <span>{{noEditData.bizName}}</span>
    </div>
    <div class="wechat-bs-content">
      <div class="content-details">
        <el-form
          ref="rulewechatRulesForm"
          label-width="150px"
          label-position="left"
          class="role-group-form-content"
          :model="editData"
          :rules="wechatRules"
        >
          <el-row>
            <el-col :span="24" :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}">
              <el-form-item label="业务名称：" prop="roleName">
                <span v-if="!isWechatEdit">{{noEditData.bizName}}</span>
                <el-input
                  v-else
                  v-model="editData.bizName"
                  disabled
                  style="width: 200px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}">
              <el-form-item label="通知类型：">
                <span v-if="!isWechatEdit">微信</span>
                <el-input v-else value="微信" disabled size="small" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}">
              <el-form-item label="是否开启推送：">
                <span
                  v-if="!isWechatEdit"
                  :class="[{'no-selected': noEditData.isOpen === null}]"
                >{{noEditData.isOpen === null?"未设置":noEditData.isOpen === 1?'开启':'关闭'}}</span>
                <el-radio-group v-else v-model="editData.isOpen">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}">
              <el-form-item label="推送模式：">
                <span
                  v-if="!isWechatEdit"
                  :class="[{'no-selected': noEditData.sendMode ===null}]"
                >{{noEditData.sendMode ===null?'未设置':noEditData.sendMode ===1?'实时':'定时'}}</span>
                <el-radio-group v-else v-model="editData.sendMode">
                  <el-radio :label="1">实时</el-radio>
                  <el-radio :label="2">定时</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              :span="24"
              v-if="editData.sendMode === 2"
              :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}"
            >
              <el-form-item label="定时推送开始时间：" style="margin-bottom: 20px;" prop="sendStartTime">
                <span
                  v-if="!isWechatEdit"
                  :class="[{'no-selected': !noEditData.sendStartTime}]"
                >{{!noEditData.sendStartTime?'未设置':noEditData.sendStartTime}}</span>
                <!-- <el-input v-else v-model="editData.sendStartTime" style="width: 200px"  size='small'></el-input> -->
                <el-time-picker
                  placeholder="开始时间"
                  v-else
                  size="small"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width: 200px"
                  :disabled="editData.sendMode===1"
                  v-model="editData.sendStartTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="24"
              v-if="editData.sendMode === 2"
              :style="{'margin-bottom':!isWechatEdit?0:'14px','height': '40px'}"
            >
              <el-form-item label="定时推送结束时间：" prop="sendEndTime">
                <span
                  v-if="!isWechatEdit"
                  :class="[{'no-selected': !noEditData.sendEndTime}]"
                >{{!noEditData.sendEndTime?'未设置':noEditData.sendEndTime}}</span>
                <el-time-picker
                  placeholder="结束时间"
                  v-else
                  size="small"
                  :disabled="editData.sendMode===1"
                  style="width: 200px"
                  format="HH:mm"
                  value-format="HH:mm"
                  v-model="editData.sendEndTime"
                  :picker-options="{
                    selectableRange: (editData.sendStartTime||'00:00') + ':00 - 23:59:59'
                  }"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="content-footer" v-has="'messageBusinessManage_modify'">
        <el-button
          size="small"
          style="width: 116px;border:1px solid #2F87FE;color:#2F87FE;"
          v-if="!isWechatEdit"
          @click="changeBusiness"
        >修改消息业务</el-button>
        <el-button
          size="small"
          style="width: 80px;margin-right:10px;"
          class="el-button--primary"
          v-if="isWechatEdit"
          type="primary"
          @click="saveBusiness"
        >保存</el-button>
        <el-button size="small" style="width: 80px;" v-if="isWechatEdit" @click="passBusiness">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import _ from "lodash";
import dayjs from "dayjs";

export default {
  name: "msg-bs-manage",
  components: {},
  data() {
    return {
      ops: window.scrollOps, // 滚动条
      noEditData: {
        bizName: "",
        notifyType: 1, // 1:微信  2 短信
        isOpen: 0, // 1 代表开启  0代表关闭
        sendMode: 1, // 1: 实时 2 定时
        sendStartTime: "",
        sendEndTime: ""
      },
      editData: {
        bizName: "",
        notifyType: 1, // 1:微信  2 短信
        isOpen: 0,
        sendMode: 1, // 1: 实时 2 定时
        sendStartTime: "",
        sendEndTime: ""
      },
      wechatRules: {
        sendStartTime: [
          {
            required: true,
            message: "定时推送开始时间不能为空",
            trigger: "change"
          }
        ],
        sendEndTime: [
          {
            required: true,
            message: "定时推送结束时间不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  props: {
    isWechatEdit: {
      type: Boolean,
      default: false
    },
    wechatDetails: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {},
  watch: {
    wechatDetails: {
      handler(newName, oldName) {
        // ...
        this.noEditData = { ...newName };
        this.editData = { ...newName };
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    changeBusiness() {
      let _data = _.cloneDeep(this.noEditData);
      for (let i in _data) {
        if (i === "isOpen" && _data[i] === null) {
          _data[i] = 1;
        } else if (i === "sendMode" && _data[i] === null) {
          _data[i] = 1;
        } else if (i === "delaySendStartTime") {
          _.set(_data, "sendStartTime", _data[i]);
        } else if (i === "delaySendEndTime") {
          _.set(_data, "sendEndTime", _data[i]);
        }
      }
      this.editData = _data;
      this.$emit("changeIsEdit");
    },
    saveBusiness() {
      this.$refs.rulewechatRulesForm.validate(valid => {
        if (valid) {
          this.$emit("savaWechatDetails", this.editData);
        }
      });
    },
    passBusiness() {
      let _noEditData = _.cloneDeep(this.noEditData);
      this.editData = _noEditData;
      this.$refs.rulewechatRulesForm.resetFields();
      this.$emit("changeIsEdit");
    },
    clearCheckInformation() {
      this.$refs.rulewechatRulesForm.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 10px;
}
::v-deep .el-form-item {
  margin-bottom: 14px;
}
::v-deep .el-form-item__error {
  line-height: 8px;
}
.wechat-bs-wrap {
  height: 100%;
  width: 100%;
  .wechat-bs-title {
    height: 36px;
    border-bottom: 1px solid rgba(170, 178, 193, 0.2);
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 550;
    color: rgba(34, 34, 34, 1);
    padding: 0 14px 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .columnIcon {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
  .wechat-bs-content {
    height: calc(100% - 36px);
    padding: 10px 10px 0;
    .content-details {
      height: calc(100% - 40px);
      overflow: auto;
      .no-selected {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: rgba(201, 201, 201, 1);
      }
    }
    .content-footer {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>