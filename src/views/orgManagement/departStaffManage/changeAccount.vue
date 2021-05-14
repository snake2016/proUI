 <template>
  <el-dialog
    class="createPermissDialog"
    :visible.sync="isShowModal"
    width="640px"
    top="20vh"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closedDialog"
  >
    <div slot="title" class="header-title">
      <img class="columnIcon" src="@/assets/imgs/账户icon.png" />
      <span class="title-age">修改密码</span>
    </div>
    <div class="dialog_changeDTU" style="padding-right: 20px">
      <el-form
        ref="changeAccountForm"
        label-width="100px"
        label-position="left"
        :rules="changeResourceFormRules"
        :model="permissJson"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="登录账号：" style="padding-right: 10px;" prop="loginAccount">
              <el-input
                disabled
                v-model="permissJson.loginAccount"
                placeholder="请输入登录账号"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="登录密码：" style="padding-right: 10px;" prop="newPwd">
              <el-input
                type="password"
                v-model="permissJson.newPwd"
                style="width: 200px"
                placeholder="请输入登录密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button style="width: 80px;" class="el-button--primary" size="small" @click="sureOk">确定修改</el-button>
      <el-button style="width: 80px;" size="small" @click="closedDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { changeAccountPassword } from "@/api/departStaffManage.js";
import { getTenantOrgList } from "@/api/roleManage.js";
import $ from "jquery";
import _ from "lodash";

export default {
  name: "create-permiss-dialog",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      permissJson: {
        loginAccount: "", // 账号
        newPwd: "" // 密码
      },
      changeResourceFormRules: {
        loginAccount: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "change"
          }
        ],
        newPwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 18) {
                callback("请勿超过18字数");
                return;
              }
              callback();
            }
          }
        ]
      },
      isShowModal: false
    };
  },
  props: ["showAccountDialog", "details"],
  created() {},
  watch: {
    showAccountDialog(val) {
      this.isShowModal = val;
      if (val) {
        this.permissJson = {
          loginAccount: this.details.account_name, // 账号
          newPwd: "" // 密码
        };
      }
    }
  },
  mounted() {},
  methods: {
    sureOk() {
      this.$refs.changeAccountForm.validate(valid => {
        if (valid) {
          changeAccountPassword(this.permissJson)
            .then(res => {
              if (res.data.code == "00") {
                this.$message.success("修改密码成功");
                this.closedDialog();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    closedDialog() {
      this.permissJson = {
        loginAccount: "", // 账号
        newPwd: "" // 密码
      };
      this.isShowModal = false;
      this.$refs.changeAccountForm.resetFields();
      this.$emit("closedAccountPassword");
    }
  }
};
</script> 
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  .dialog_changeDTU {
    padding: 20px 35px 0 40px;
    min-height: 210px;
    max-height: 390px;
  }
}
.header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.columnIcon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}
.dialog-footer {
  text-align: left;
}
.select-resources-box {
  position: relative;
  .select-resources-input {
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .select-resources-options {
    position: absolute;
    left: 0;
    top: 42px;
    width: 500px;
    height: 360px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    z-index: 100;
  }
  .page-nations {
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: right;
  }
}

.operation {
  color: #ababab;
  font-size: 14px;
  margin-top: 30px;
  .operation_div {
    display: inline-block;
    margin-right: 20px;
  }
}
</style>  