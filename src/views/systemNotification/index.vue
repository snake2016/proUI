<template>
  <div class="system_content">
    <div class="HeaderBox">
      <img src="~@/assets/imgs/notification.png" />
      <span class="title">系统公告</span>
    </div>
    <div class="content_form">
      <div class="form">
        <vue-scroll :ops="ops" ref="vs">
          <el-form
            :model="ruleForm_notification"
            :rules="rules_notification"
            ref="rule_notification"
            label-width="100px"
            label-position="left"
            class="ruleForm"
          >
            <el-form-item label="公告标题：" prop="title" required>
              <span v-show="!edit" class="spanS">{{ ruleForm_notification.title }}</span>
              <el-input
                v-model="ruleForm_notification.title"
                v-show="edit"
                placeholder="请填写公告标题，20字以内"
              ></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" prop="context" required>
              <span v-show="!edit" class="spanS">{{ruleForm_notification.context }}</span>
              <el-input
                placeholder="请填写公告内容"
                type="textarea"
                v-show="edit"
                maxlength="512"
                show-word-limit
                class="input_text"
                v-model="ruleForm_notification.context"
              ></el-input>
            </el-form-item>
            <el-form-item label="生效时间：" prop="effectiveTime1" required>
              <span v-show="!edit" class="spanS">{{ ruleForm_notification.effectiveTime }}</span>
              <el-date-picker
                type="datetime"
                v-show="edit"
                placeholder="选择生效时间"
                v-model="ruleForm_notification.effectiveTime1"
                :picker-options="pickerEffectiveTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间：" prop="uselessTime1" required>
              <span v-show="!edit" class="spanS">{{ ruleForm_notification.uselessTime }}</span>
              <el-date-picker
                type="datetime"
                v-show="edit"
                placeholder="选择失效时间"
                v-model="ruleForm_notification.uselessTime1"
                :picker-options="pickerUselessTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="重发次数：" prop="retryTime" required>
              <span v-show="!edit" class="spanS">{{ ruleForm_notification.retryTime }}</span>
              <el-input
                v-show="edit"
                v-model="ruleForm_notification.retryTime"
                type="number"
                placeholder="请填写重发次数"
              >
                <span slot="suffix">次</span>
              </el-input>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="form-btn">
        <el-button
          size="small"
          type="primary"
          class="btn"
          v-show="edit"
          @click="publish('rule_notification')"
        >发布</el-button>
        <el-button size="small" class="btn" v-show="edit" @click="cancelForm">取消</el-button>
        <el-button size="small" class="btn" v-show="edit" @click="resetForm('rule_notification')">重置</el-button>
        <el-button
          size="small"
          plain
          class="btn btn-b"
          v-show="!edit"
          style="margin-left:0px;"
          @click="changeFun()"
        >编辑</el-button>
        <el-button
          size="small"
          plain
          class="btn btn-r"
          v-show="!edit"
          @click="dialogVisible = true"
        >删除</el-button>
      </div>
      <div>
        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="300px"
          :show-close="false"
        >
          <div class="content">
            <div class="confirm">
              <img src="~@/assets/imgs/alarm.png" alt />
              <span>您确定要删除该条已发布系统公告？</span>
            </div>
            <div class="warn">
              <span>删除后将不可更改</span>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDealte">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAnnouncement,
  addAnnouncement,
  deleteAnnouncement
} from "@/api/archivesAPI";
export default {
  name: "systemNotification",
  data() {
    return {
      edit: true,
      ruleForm_notification: {
        title: "",
        context: "",
        effectiveTime1: new Date(),
        uselessTime1: "",
        retryTime: "1"
      },
      rules_notification: {
        title: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value == "") {
                callback(new Error("请输入公告标题"));
                return;
              }
              if (value.length > 20) {
                callback(new Error("最多20个字符"));
                return;
              }
              callback();
            }
          }
        ],
        context: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value == "") {
                callback(new Error("请输入公告内容"));
                return;
              }
              if (value.length > 512) {
                callback(new Error("最多512个字符"));
                return;
              }
              callback();
            }
          }
        ],
        effectiveTime1: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value == "") {
                callback(new Error("请选择生效时间"));
                return;
              }
              let val = value.getTime();
              if (this.ruleForm_notification.uselessTime1) {
                let useless = this.ruleForm_notification.uselessTime1.getTime();
                if (val >= useless) {
                  callback(new Error("生效时间小于失效时间"));
                  return;
                }
                if (val < useless) {
                  this.$refs.rule_notification.clearValidate("uselessTime1");
                  callback();
                  return;
                }
              }
              callback();
            }
          }
        ],
        uselessTime1: [
          {
            validator: (rule, value, callback) => {
              if (value == null || value == "") {
                callback(new Error("请选择失效时间"));
                return;
              }
              let val = value.getTime();
              let effect = this.ruleForm_notification.effectiveTime1.getTime();
              if (val <= effect) {
                callback(new Error("失效时间大于生效时间"));
                return;
              }
              let dateTime = new Date().getTime();
              if (val < dateTime) {
                callback(new Error("失效时间大于当前时间"));
                return;
              }
              callback();
            }
          }
        ],
        retryTime: [
          {
            validator: (rule, value, callback) => {
              let val = value;
              if (val == null || val == "") {
                callback(new Error("请输入重发次数"));
                return;
              }
              if (val < 1 || val > 5) {
                //不能超出范围
                callback(new Error("重发次数不能小于1大于5"));
                return;
              }
              callback();
            }
          }
        ]
      },
      pickerEffectiveTime: {
        disabledDate: time => {
          let uselessTime1 = this.ruleForm_notification.uselessTime1;
          if (uselessTime1) {
            return (
              time.getTime() > uselessTime1.getTime() ||
              time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
          }
        }
      },
      pickerUselessTime: {
        disabledDate: time => {
          let effectiveTime1 = this.ruleForm_notification.effectiveTime1;
          if (effectiveTime1) {
            return (
              time.getTime() < effectiveTime1.getTime() - 24 * 60 * 60 * 1000
            );
          }
        }
      },
      dialogVisible: false,
      ops: window.scrollOps // 滚动条
    };
  },
  computed: {},
  components: {},
  methods: {
    // 获取公告详情
    getNotification() {
      getAnnouncement().then(res => {
        let data = res.data.data;
        if (data == null) {
          this.edit = true;
          this.resetForm("rule_notification");
        } else {
          this.edit = false;
          Object.keys(data).map((key, index) => {
            if (data.hasOwnProperty(key)) {
              this.ruleForm_notification[key] = data[key];
            }
          });
        }
      });
    },
    // 编辑
    changeFun() {
      this.edit = true;
      this.ruleForm_notification.effectiveTime1 = new Date(
        this.ruleForm_notification.effectiveTime
      );
      this.ruleForm_notification.uselessTime1 = new Date(
        this.ruleForm_notification.uselessTime
      );
    },
    // 发布
    publish(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 生效时间小于当前时间，及时生效
          let effectiveTNow = new Date().getTime();
          let notEffectiveTime = this.ruleForm_notification.effectiveTime1.getTime();
          let effectiveDate = "";
          if (notEffectiveTime < effectiveTNow) {
            effectiveDate = new Date();
          } else {
            effectiveDate = this.ruleForm_notification.effectiveTime1;
          }
          let uselessDate = this.ruleForm_notification.uselessTime1;
          let effectiveTime = new Date(effectiveDate).toJSON();
          // 生效时间格式化
          effectiveTime = new Date(+new Date(effectiveDate) + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, " ")
            .replace(/\.[\d]{3}Z/, "");
          let uselessTime = new Date(uselessDate).toJSON();
          // 失效时间格式化
          uselessTime = new Date(+new Date(uselessDate) + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, " ")
            .replace(/\.[\d]{3}Z/, "");
          this.ruleForm_notification["effectiveTime"] = effectiveTime;
          this.ruleForm_notification["uselessTime"] = uselessTime;
          addAnnouncement(this.ruleForm_notification).then(res => {
            if (res.data.code == 0) {
              this.$message.success("公告发布成功！");
              this.getNotification();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          // console.log("验证未通过");
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm_notification.effectiveTime1 = new Date();
      this.ruleForm_notification.effectiveTime = "";
      this.ruleForm_notification.uselessTime = "";
    },

    // 取消
    cancelForm() {
      this.$refs["rule_notification"].clearValidate();
      this.getNotification();
    },
    // 删除公告
    confirmDealte() {
      deleteAnnouncement().then(res => {
        if (res.data.code == 0) {
          this.dialogVisible = false;
          this.$message.success("删除成功");
          this.getNotification();
        } else {
          this.$message.error("删除失败");
        }
      });
    }
  },
  mounted() {
    this.getNotification();
  }
};
</script>

<style lang="scss" scoped>
.system_content {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .HeaderBox {
    height: 50px;
    line-height: 50px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(170, 178, 193, 0.2);
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
    }
  }
  .content_form {
    width: 100%;
    height: calc(100% - 64px);
    padding: 24px 5px 24px 24px;
    .form {
      height: calc(100% - 60px);
      .el-form-item {
        width: 50%;
      }
      .ruleForm {
        height: 100%;
      }
    }
    .form-btn {
      margin-top: 25px;
      .btn {
        width: 80px;
      }
      .btn-b {
        width: 80px;
        color: #2f87fe;
        border-color: #2f87fe;
      }
      .btn-r {
        width: 80px;
        color: #ec6b60;
        border-color: #ec6b60;
      }
    }
    .input_text ::v-deep .el-textarea__inner {
      height: 192px;
    }
    ::v-deep .el-input {
      width: 90% !important;
    }
    ::v-deep .el-textarea {
      width: 90% !important;
    }
  }
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 0 25px 0 40px;
    }
    .el-dialog__header {
      height: 25px;
      border-bottom: none;
    }
    .content {
      .confirm {
        img {
          margin-left: -18px;
          vertical-align: bottom;
          padding-top: 4px;
        }
        span {
          color: #222222;
          margin-left: 10px;
        }
      }
      .warn {
        margin-top: 6px;
        span {
          margin-left: 10px;
          color: #ababab;
          font-size: 12px;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px 40px 25px 60px;
      .el-button {
        border: 1px solid #ec6b60;
        color: #ec6b60;
        padding: 0;
        width: 80px;
        height: 32px;
      }
    }
  }
}
</style>