<template>
  <div class="fill">
    <div class="content tenant-list">
      <div class="none-box" v-if="!tenantList.length">
        <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
        <div>暂无租户</div>
      </div>
      <el-form
        ref="search"
        :model="searchData"
        :rules="searchRules"
        @submit.native.prevent
        class="s-box">
        <el-form-item class="search-box" prop="nameLike">
          <el-input
            placeholder="请输入内容"
            @keyup.enter.native.stop="getList(1)"
            v-model="searchData.nameLike"
            class
            size="small"
          >
            <div slot="prepend">租户名称</div>
            <el-button @click="getList(1)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <div class="row-add">
          <el-button
            @click="addTenant"
            type="primary"
            plain
            size="small"
            v-has="'新增租户'"
          >新增租户</el-button>
          <el-button
            size="small"
            class="multiple-selection"
            :disabled="tenantList.length==0"
            @click="multipleStatus=false"
            v-show="multipleStatus==true&&userGrade!=2"
          >复 选</el-button>
          <el-button
            size="small"
            class="multiple-selection"
            :disabled="tenantList.length==0&&userGrade!=2"
            @click="cancelSelect"
            v-show="multipleStatus==false"
          >取消复选</el-button>
          <div class="select-number" v-if="multipleStatus==false&&userGrade!=2" @click="drawerShow">
            <img src="@/assets/imgs/select-number.png" alt />
            <span v-if="multipleSelection.length!=0">{{multipleSelection.length}}</span>
          </div>
        </div>
      </el-form>
      <el-table
        class="table"
        :data="tenantList"
        v-if="tenantList.length"
        @row-click="goDetail"
        @selection-change="handleSelectionChange"
        ref="multipleTable">
        <el-table-column type="selection" width="45" v-if="multipleStatus==false"></el-table-column>
        <el-table-column prop="name" label="租户名称" width="170"></el-table-column>
        <el-table-column prop="state" label="租户状态" width="80"></el-table-column>
        <el-table-column prop="subdomain" label="域名" width="260"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="company_name" label="企业名称" width="180"></el-table-column>
        <el-table-column prop="contact" label="联系人" width="100"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width></el-table-column>
      </el-table>
      <div class="fenye" v-if="tenantList.length">
        <el-pagination
          class="pageLeft"
          background
          @size-change="sizeChange"
          @current-change="getList"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout="slot,sizes,total"
          :total="total"
        >
          <span class="fontSize">显示</span>
        </el-pagination>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page.sync="page"
          @current-change="getList"
          :page-size="size"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 批量消息业务配置抽屉效果 -->
    <el-drawer :visible.sync="drawer" :modal-append-to-body="false">
      <span slot="title" class="drawer-title">
        <img src="~@/assets/imgs/select-number.png" alt />
        <i>批量租户操作</i>
      </span>
      <div class="drawer-content">
        <div class="content-show">
          <div class="user-item" v-for="(item,index) in multipleSelection" :key="item.id">
            <div class="text">
              <div class="sequence">
                <span>{{index+1}}</span>
              </div>
              <div class="user-info">
                <div>{{item.name}}</div>
                <div>
                  租户状态：
                  <span>{{item.state}}</span>
                </div>
              </div>
            </div>
            <div class="remove" @click="removeItem(index,item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-guanbi" />
              </svg>
            </div>
          </div>
        </div>
        <div class="content-footer">
          <div class="mul-configure">
            <el-button plain @click="openDialog2">批量消息业务配置</el-button>
          </div>
          <div class="all-clear" @click="removeAll">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#el-icon-shanchu" />
            </svg>
            <span>一键清除</span>
          </div>
        </div>
      </div>
    </el-drawer>
    <div class="message-service">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="640px"
        :before-close="handleClose2"
        class="dialogdialog"
      >
        <span slot="title" class="dialog-title">
          <img src="~@/assets/imgs/infoIcon.png" alt />
          <i>批量消息业务配置</i>
        </span>
        <!-- dialog的内容区 -->
        <vue-scroll :ops="ops" ref="vs">
          <el-form
            :model="ruleForm2"
            :rules="rules2"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            :validate-on-rule-change="false"
            v-if="dialogVisible"
          >
            <el-form-item label="业务名称：" prop="businessName">
              <el-select
                v-model="ruleForm2.businessName"
                placeholder="请选择业务名称"
                @visible-change="getBusinessName"
                :popper-append-to-body="false"
                popper-class="select-option"
              >
                <template>
                  <div class="optionHeader">
                    <span>业务名称</span>
                  </div>
                </template>
                <el-option
                  v-for="item in businessOptions"
                  :key="item.notifyBizId"
                  :label="item.bizName"
                  :value="item.notifyBizId"
                  :disabled="item.disabled"
                ></el-option>
                <div class="fenye-block">
                  <div class="total">
                    <span>共</span>
                    <i>{{businessNamePage.total}}</i>条
                  </div>
                  <div class="pagenation">
                    <img
                      src="@/assets/imgs/fenye/left-unavaiable.png"
                      alt
                      v-if="businessNamePage.page==1"
                      :class="[businessNamePage.page==1?'unavaiable':'']"
                    />
                    <img src="@/assets/imgs/fenye/left-avaiable.png" alt v-else @click="preChange3" />
                    <span class="currentpage">{{businessNamePage.page}}</span>
                    <span>/</span>
                    <span class="totalpage">{{businessNamePage.pages}}</span>
                    <img
                      src="@/assets/imgs/fenye/right-unavaiable.png"
                      v-if="businessNamePage.page == businessNamePage.pages"
                      :class="[businessNamePage.page == businessNamePage.pages?'unavaiable':'']"
                      alt
                    />
                    <img
                      src="@/assets/imgs/fenye/right-avaiable.png"
                      alt
                      v-else
                      @click="nextChage3"
                    />
                  </div>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="模板类型：" prop="templateType">
              <el-radio-group v-model="ruleForm2.templateType">
                <el-radio :label="1">微信</el-radio>
                <el-radio :label="2">短信</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="消息模板编号：" prop="templateNumber">
              <el-select
                v-model="ruleForm2.templateNumber"
                placeholder="请选择消息模板编号"
                popper-class="select-option"
                :popper-append-to-body="false"
                @visible-change="getTemplateNo2"
                @change="selectChange"
              >
                <template>
                  <div class="optionHeader">
                    <span>消息模板编号</span>
                    <span>消息模板名称</span>
                  </div>
                </template>
                <el-option
                  v-for="item in templateNoOptions"
                  :key="item.msgTemplateCode"
                  :label="item.msgTemplateCode"
                  :value="item.msgTemplateId"
                  :disabled="item.disabled"
                >
                  <span style="float: left">{{ item.msgTemplateCode}}</span>
                  <span style="float: left">{{ item.msgTemplateName }}</span>
                </el-option>
                <div class="fenye-block">
                  <div class="total">
                    <span>共</span>
                    <i>{{messageTemplateNoPage.total}}</i>条
                  </div>
                  <div class="pagenation">
                    <img
                      src="@/assets/imgs/fenye/left-unavaiable.png"
                      alt
                      v-if="messageTemplateNoPage.page==1"
                      :class="[messageTemplateNoPage.page==1?'unavaiable':'']"
                    />
                    <img src="@/assets/imgs/fenye/left-avaiable.png" alt v-else @click="preChange" />
                    <span class="currentpage">{{messageTemplateNoPage.page}}</span>
                    <span>/</span>
                    <span class="totalpage">{{messageTemplateNoPage.pages}}</span>
                    <img
                      src="@/assets/imgs/fenye/right-unavaiable.png"
                      v-if="messageTemplateNoPage.page == messageTemplateNoPage.pages"
                      :class="[messageTemplateNoPage.page == messageTemplateNoPage.pages?'unavaiable':'']"
                      alt
                    />
                    <img src="@/assets/imgs/fenye/right-avaiable.png" alt v-else @click="nextChage" />
                  </div>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="消息模板名称：" class="fixed is-required">
              <span v-if="msgTemplateName!=''">{{msgTemplateName}}</span>
              <span v-else>根据模板编号的选择自动带出</span>
            </el-form-item>
            <el-form-item label="短信签名名称：" prop="signName" v-if="ruleForm2.templateType==2">
              <el-select
                v-model="ruleForm2.signName"
                placeholder="请选择短信签名名称"
                @visible-change="getMsgSignName"
                :popper-append-to-body="false"
                popper-class="select-option"
              >
                <template>
                  <div class="optionHeader">
                    <span>短信签名名称</span>
                  </div>
                </template>
                <el-option
                  v-for="item in signNameOptions"
                  :key="item.msgSignId"
                  :label="item.msgSignName"
                  :value="item.msgSignId"
                  :disabled="item.disabled"
                ></el-option>
                <div class="fenye-block">
                  <div class="total">
                    <span>共</span>
                    <i>{{msgSignNamePage.total}}</i>条
                  </div>
                  <div class="pagenation">
                    <img
                      src="@/assets/imgs/fenye/left-unavaiable.png"
                      alt
                      v-if="msgSignNamePage.page==1"
                      :class="[msgSignNamePage.page==1?'unavaiable':'']"
                    />
                    <img src="@/assets/imgs/fenye/left-avaiable.png" alt v-else @click="preChange2" />
                    <span class="currentpage">{{msgSignNamePage.page}}</span>
                    <span>/</span>
                    <span class="totalpage">{{msgSignNamePage.pages}}</span>
                    <img
                      src="@/assets/imgs/fenye/right-unavaiable.png"
                      v-if="msgSignNamePage.page == msgSignNamePage.pages"
                      :class="[msgSignNamePage.page == msgSignNamePage.pages?'unavaiable':'']"
                      alt
                    />
                    <img
                      src="@/assets/imgs/fenye/right-avaiable.png"
                      alt
                      v-else
                      @click="nextChage2"
                    />
                  </div>
                </div>
              </el-select>
            </el-form-item>
          </el-form>
        </vue-scroll>
        <span slot="footer" class="dialog-footer more">
          <el-button type="primary" @click="submitForm2('ruleForm')">确定批量配置</el-button>
          <el-button @click="cancel2">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import index from "./index.js";
import messageService from "../detail/messageService"; //消息业务配置
export default {
  name: "tenantConfig-list",
  components: {},
  mixins: [index, messageService],
  props: {},
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
@import "../detail/messageService.scss";
</style>