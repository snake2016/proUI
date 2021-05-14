<template>
  <div class="fill">
    <div class="left-box">
      <section class="panel">
        <div class="head-box">
          控制台登录
          <div class="flex-box-right">
            <el-button size="small" plain type="primary" @click="consoleAddShow = true" v-if="showConsoleAddBt">新增账号</el-button>
          </div>
        </div>
        <div class="content">
          <div class="user">
            <div class="label">账号：</div>
            <div class="val">{{consoleUser.user}}</div>
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="head-box">
          编程访问
          <div class="flex-box-right">
            <el-button size="small" plain type="primary" @click="accessAdd" v-if="showAccessAddBt">新增账号</el-button>
          </div>
        </div>
        <div class="content">
          <div class="user">
            <div class="label">AccessKey ID：</div>
            <div class="val">{{programAccess.id}}</div>
          </div>
        </div>
      </section>
    </div>
    <div class="right-box">
        <div class="head-box">
          白名单管理
          <div class="flex-box-right">
            <el-button size="small" plain type="primary" @click="enableUser">{{whiteListShow ? "禁用" : "开启"}}</el-button>
            <el-button size="small" plain type="primary" @click="saveWhiteList">{{whiteListEdit ? "保存" : "编辑"}}</el-button>
          </div>
        </div>
        <div class="content">
          <div class="noData" v-if="!whiteListShow">暂无数据</div>
          <div class="list-box" v-else>
            <el-form v-if="whiteListEdit" ref="whiteListUsername" class="username" :model="{}" :rules="whiteListUsernameRules" @submit.native.prevent>
              <el-form-item class="fo-item" prop="username">
                <el-input
                  v-model="whiteListUsername"
                  @keyup.enter.native="addWhiteUser"
                  placeholder="请在此处输入白名单账号后按回车添加"
                  class="addUser"
                  size="medium"></el-input>
              </el-form-item>
            </el-form>
            <ul>
              <li v-for="(item, index) in whiteList" :key="index">
                <div class="name">{{item}}</div>
                <div class="flex-box-right rm-box" v-show="whiteListEdit" @click="removeWhiteUser(index)">移除</div>
              </li>
            </ul>
          </div>
        </div>
    </div>
    <!-- 控制台登录-新增账号 -->
    <el-dialog
      class="add-dialog"
      :visible.sync="consoleAddShow"
      :close-on-click-modal="false"
      @closed="consoleAddClose"
      width="640px">
      <span slot="title" class="dialog-title">新增账号</span>
      <div class="d-box">
        <el-form ref="consoleUser" :model="consoleUser" :rules="consoleUserRules">
          <el-form-item class="fo-item" prop="user">
            <div class="label require">账号：</div>
            <el-input
              v-model="consoleUser.user"
              class
              size="small"></el-input>
          </el-form-item>
          <el-form-item class="fo-item" prop="pw">
            <div class="label require">密码：</div>
            <el-input
              v-model="consoleUser.pw"
              class
              size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="consoleAdd">确定</el-button>
        <el-button size="small" @click="consoleAddShow = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 编程访问-新增账号 -->
    <el-dialog
      class="add-dialog"
      :visible.sync="accessAddShow"
      :close-on-click-modal="false"
      @closed="closeAccessDialog"
      width="640px">
      <span slot="title" class="dialog-title">新增账号</span>
      <div class="d-box">
        <el-form>
          <el-form-item class="fo-item">
            <div class="label long require">AccessKey ID：</div>
            <div class="value">{{programAccess.id}}</div>
          </el-form-item>
          <el-form-item class="fo-item" prop="pw">
            <div class="label long require">AccessKey Secret：</div>
            <div class="value">{{programAccess.secret}}</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" id="copyIt" :data-clipboard-text="'AccessKey ID:'+programAccess.id+' '+'AccessKey Secret:'+programAccess.secret">复制</el-button>
        <el-button size="small" @click="closeAccessDialog">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import indexMix from './index.js';
export default {
  name: "system-user-set-detail",
  mixins: [indexMix]
}
</script>

<style scoped lang="scss">
// @import "@/assets/css/el-form-reset.scss";
@import "./index.scss";
@import "./style.scss";
</style>