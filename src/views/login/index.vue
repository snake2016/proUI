<template>
<div @click="login">登录</div>
  <!-- <div class="wrapBox">
    <div class="om-box" @click.ctrl="goOmLogin">运维登录</div>
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      :hide-required-asterisk="1==1"
      label-width="80px"
      class="login-box"
      label-position="top"
    >
      <div class="login-title">
        <img class="login-img" src="~@/assets/imgs/real-logo.png" />
        <div class="login-name">金卡云</div>
      </div>
      <el-form-item prop="username">
        <span class="loginBtn" slot="label">账号</span>
        <el-input type="text" placeholder="请输入账号" v-model="form.username" style="width: 280px;" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="loginBtn" slot="label">密码</span>
        <el-input show-password placeholder="请输入密码" v-model="form.password" style="width: 280px;" />
      </el-form-item>
      <el-form-item prop="code" class="code-input">
        <span class="loginBtn" slot="label">验证码</span>
        <el-input
          placeholder="请输入验证码"
          @keyup.enter.native.stop="onSubmit('loginForm',true)"
          v-model="form.code"
          style="width: 280px;"
        >
          <template slot="append">
            <img :src="codeImg" class="codeImg" alt="验证码" @click="loadCodeImg" title="点击刷新验证码" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="text-align: center" class="login-button">
        <el-button
          type="primary"
          v-on:click="onSubmit('loginForm')"
          :loading="subLoading"
          class="submitBtn"
        >{{btnText}}</el-button>
      </el-form-item>
    </el-form>
    <div
      class="remarks"
    >
    <div class="certifyInfo" v-show="isNeedCertify">
        登录机构：<span id="output"></span>
    </div>
    Copyright © {{new Date().getFullYear()}} 金卡智能 All Rights Reserved ｜ 浙ICP备05008091号-10</div>
  </div> -->
</template>
<script>
// import Login from "./login.js";
export default {
//   mixins: [Login],
  data() {
    return {};
  },
  created: function() {},
  methods:{
      login(){
          this.$store.dispatch('permission/login')
          .then(() => {
            this.$router.push({
                path: this.$store.state.permission.menulist[0].path,
            });
        })
      }
  }
};
</script>
<style lang="scss">
.wrapBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
//   background: url("~@/assets/imgs/login_bg.jpg") no-repeat center;
  background-size: cover;
  position: relative;
}
.login-box {
  width: 330px;
  height: 481px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px 25px 35px 25px;
  background-color: #fff;
  border-radius: 4px;
  .el-form-item {
    margin-bottom: 25px;
  }
  .el-form-item__label {
    padding: 0;
    // height: 35px;
    line-height: 13px;
    padding-bottom: 10px;
    &:before {
      content: "";
      color: #fff;
      margin-right: 0px;
    }
  }
  .codeImg {
    margin: 0px -20px;
    width: 95px;
    height: 38px;
    display: block;
    cursor: pointer;
    border-radius: 0 3px 3px 0;
  }
  .loginBtn {
    font-weight: 500;
    color: rgba(34, 34, 34, 1);
  }
  .code-input {
    margin-bottom: 35px;
  }
}
.login-img {
  margin: 0 auto;
  width: 134px;
}
.login-name {
  width: 138px;
  margin: 7px auto;
  letter-spacing: 2px;
  color: rgba(47, 135, 254, 1);
  font-size: 14px;
  text-align: center;
}
.login-title {
  text-align: center;
  margin: 0 auto 32px auto;
  color: #303133;
}
.submitBtn {
  width: 282px;
}
.login-button {
  height: 32px;
  .el-form-item__content {
    height: 100%;
    line-height: 32px;
    .el-button {
      padding: 0;
      line-height: 32px;
    }
  }
}
.om-box {
  position: absolute;
  right: 0;
  top: 0;
  color: #fff;
  width: 80px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  cursor: default;
  transition: 0.5s opacity;
}
.remarks {
  position: absolute;
  bottom: 18px;
  line-height: 20px;
  color: rgba($color: #fff, $alpha: 0.8);
  .certifyInfo{
      text-align: center;
  }
}
</style>