<template>
  <div class="navbar">
    <el-dropdown trigger="hover" placement="bottom-end" style="width:100%">
      <div class="avatar-wrapper">
        <img :src="LogoSvg" class="user-avatar" />
        <div class="name-box">
          <span class="loginName" :title="loginName">{{loginName}}</span>
          <span class="loginName zh" v-if="sysCheckedTenant.name">{{sysCheckedTenant.name}}</span>
        </div>
        <i class="el-icon-caret-bottom" style="color:#fff;" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isOmUser">
          <div style="width:118px;" @click="showOm(true)">
            <img
              src="@/assets/imgs/切换.png"
              style=" vertical-align: middle;display: inline-block;width: 12px;height: 12px;margin-right: 5px;"
            />
            切换组织机构
          </div>
        </el-dropdown-item>
        <el-dropdown-item v-if="changeTenantAble">
          <div style="width:118px;" @click="sw_changeTenant(1)">
            <img
              src="@/assets/imgs/切换.png"
              style=" vertical-align: middle;display: inline-block;width: 12px;height: 12px;margin-right: 5px;"
            />
            切换租户
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div style="width:118px;" @click="passDialog=true">
            <img
              src="@/assets/imgs/密码.png"
              style=" vertical-align: middle;display: inline-block;width: 12px;height: 12px;margin-right: 5px;"
            />
            修改密码
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div style="width:118px;" @click="dialogVisible = true">
            <img
              src="@/assets/imgs/exitLogin.png"
              style=" vertical-align: middle;display: inline-block;width: 12px;height: 12px;margin-right: 5px;"
            />
            退出登录
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      :visible.sync="dialogVisible"
      width="300px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      class="exit-login"
    >
      <div class="exit-content">
        <img src="@/assets/imgs/temp/alarm-blue.png" alt />
        <span>您确定要退出系统吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="logout">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 切换组织机构 -->
    <el-dialog
      class="zuzhi"
      :visible.sync="omShow"
      :closeOnClickModal="false"
      :show-close="false"
      width="640px"
    >
      <span slot="title" class="dialog-title">
        <img src="@/assets/imgs/permissNameIcon.png" alt />
        <span>切换组织机构</span>
      </span>
      <div class="content">
        <el-tree
          ref="orgTree"
          :data="orgsTemplateTree"
          :props="leftProps"
          default-expand-all
          :default-checked-keys="orgDefaultKey"
          node-key="id"
          show-checkbox
          highlight-current
          :check-strictly="true"
          @check-change="orgCheckChange"
          :expand-on-click-node="false"
          :check-on-click-node="true"
        ></el-tree>
      </div>
      <div class="footer-box">
        <el-button size="small" type="primary" class="p-r" @click="orgstrutureSet">确认切换</el-button>
        <el-button size="small" @click="showOm(false)">取消</el-button>
      </div>
    </el-dialog>
    <!-- 切换租户 -->
    <el-dialog
      class="zuzhi swzh"
      :visible.sync="changeTenantDialog"
      :closeOnClickModal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="640px"
    >
      <span slot="title" class="dialog-title">
        <img src="@/assets/imgs/permissNameIcon.png" alt />
        <span>切换租户</span>
      </span>
      <div class="content">
        <div class="nameBox">
          <el-form ref="search" :model="tenantListSearch" :rules="searchRules" @submit.native.prevent class="s-f">
            <el-form-item class="search-box" prop="nameLike">
              <el-input               
                placeholder="请输入内容"
                @keyup.enter.native.stop="getTenantList(1)"
                v-model="tenantListSearch.nameLike"
                class
                size="small"
              >
                <div slot="prepend">租户名称</div>
                <el-button @click="getTenantList(1)" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="checkList">
          <el-checkbox-group v-model="sysCheckedTenantId" @change="tenantChangeEmit">
            <el-checkbox :label="item.id" v-for="item in tenantList" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="fenye">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="page_tenant.page"
            @current-change="getTenantList"
            :total="page_tenant.total"
          ></el-pagination>
        </div>
      </div>
      <div class="footer-box">
        <el-button size="small" type="primary" class="p-r" @click="changeTenant">确认切换</el-button>
        <el-button size="small" @click="changeTenant(0)">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码的弹窗 -->
    <el-dialog
      :visible.sync="passDialog"
      :close-on-click-modal="false"
      width="640px"
      :append-to-body="true"
      class="update-password"
      :before-close="handleUpdateClose"
      @open="openDialog"
    >
      <div slot="title">
        <img src="~@/assets/imgs/账户icon.png" alt />
        <span>修改密码</span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="原始密码：" prop="oriPassword">
          <el-input
            v-model="ruleForm.oriPassword"
            type="password"
            style="position:fixed;bottom:-9999px;display:none;"
          ></el-input>
          <el-input
            v-model="ruleForm.oriPassword"
            :type="ori?'text':'password'"
            auto-complete="new-password"
          ></el-input>
          <img :src="ori ? imgUrl1:imgUrl2" alt class="password-visi" @click="ori=!ori" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model="ruleForm.newPassword"
            type="password"
            style="position:fixed;bottom:-9999px;display:none;"
          ></el-input>
          <el-input
            v-model="ruleForm.newPassword"
            :type="newpass?'text':'password'"
            @focus="textVisi=true"
            @blur="textVisi=false"
            auto-complete="new-password"
          ></el-input>
          <img
            :src=" newpass ? imgUrl1:imgUrl2"
            alt
            class="password-visi"
            @click="newpass=!newpass"
          />
          <span :style="{display:textVisi?'inline-block':'none'}" class="input-text">长度在18个字符内</span>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPassword">
          <el-input
            v-model="ruleForm.confirmPassword"
            type="password"
            style="position:fixed;bottom:-9999px;display:none;"
          ></el-input>
          <el-input
            v-model="ruleForm.confirmPassword"
            :type="confirm?'text':'password'"
            auto-complete="new-password"
          ></el-input>
          <img :src="confirm ? imgUrl1:imgUrl2" alt class="password-visi" @click="confirm=!confirm" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { postlogout } from "@/api/loginAPI";
import omSelect from "../om-select.js";
import updatePassword from "../update-password";
export default {
  data() {
    return {
      dialogVisible: false,
      LogoSvg: require("@/assets/imgs/woman.png"),
      loginName: this.$ls.get("userInfo").staffName || "",
      isOmUser: this.$ls.get("userInfo").isCrossDomain
    };
  },
  mixins: [omSelect, updatePassword],
  components: {},
  computed: {},
  mounted() {
    if (this.$ls.get("userInfo").isCrossDomain) {
      this.isOmUser = true;
    } else {
      this.isOmUser = false;
    }
  },
  methods: {
    logout() {
      this.dialogVisible = false;
    //   this.$store.commit("CLEAR_UESR");
    //   this.$router.push("/login");
      postlogout()
        .then(res => {
            this.$store.commit("CLEAR_UESR");
            // 加入了客户端认证必须刷新页面
            location.reload()
        })
        .catch(err => {
          console.error("退出登录接口调用失败", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./om-select.scss";
.navbar {
  float: right;
  line-height: 58px;
  min-width: 120px;
  margin-left: 10px;
  height: 100%;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #28a6fa !important;
  }
  img {
    display: inline-block;
    width: 35px;
    height: 35px;
    margin-right: 12px;
    vertical-align: middle;
  }
}
.exit-login {
  ::v-deep {
    .el-dialog__header {
      height: 35px;
      border-bottom: none;
    }
    .el-dialog__body {
      padding: 0px 0 20px 60px;
      .exit-content {
        span {
          color: #222222;
          line-height: 16px;
          vertical-align: middle;
          margin-left: 8px;
        }
        img {
          vertical-align: middle;
        }
      }
    }
    .el-dialog__footer {
      text-align: left;
      padding: 14px 0 25px 60px;
      .el-button {
        padding: 0;
        width: 80px;
        height: 32px;
      }
    }
  }
}
</style>
