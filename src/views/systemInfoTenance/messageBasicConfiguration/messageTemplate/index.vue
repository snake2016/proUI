<template>
  <div class="content">
    <div class="input-search">
      <el-input
        placeholder="请输入消息模板名称"
        v-model="templateName"
        class="input-with-select"
        @keyup.enter.native="findTemplateList(1, 10)"
      >
        <span slot="prepend">消息模板名称</span>
        <el-button slot="append" icon="el-icon-search" @click="findTemplateList(1, 10)"></el-button>
      </el-input>
      <div class="add" v-has="'messageTemplate_add'">
        <el-button @click="dialogVisible=true">新增消息模板</el-button>
      </div>
    </div>
    <div class="show">
      <div class="add-empty-box" v-if="tableData.length==0">
        <img class="empty-pic" src="~@/assets/imgs/temp/noData.png" alt />
        <div>暂无数据</div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        v-if="tableData.length!=0"
      >
        <!-- <template slot="empty">
          <img class="empty-pic" src="~@/assets/imgs/temp/noData.png" alt />
          <div>
            <span>暂无数据</span>
          </div>
        </template>-->
        <el-table-column label="消息模板编号" min-width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.msgTemplateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消息模板名称" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.msgTemplateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板类别" min-width="180">
          <template slot="header" slot-scope="scope">
            <el-dropdown trigger="click" class="template-category" @command="typeChange">
              <span class="select-span">
                模板类别
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">全部</el-dropdown-item>
                <el-dropdown-item command="duanxin">短信</el-dropdown-item>
                <el-dropdown-item command="weixin">微信</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.msgTemplateCategory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="短信模板参数格式" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.msgTemplateParam }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" v-if="isShow">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
            <span class="delete" @click="handleDelete(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block pagination" v-if="tableData.length!=0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="slot,sizes,total"
          :total="total"
        >
          <span class="fontSize">显示</span>
        </el-pagination>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClose"
        class="template-dialog"
      >
        <span slot="title" class="dialog-title">
          <img src="~@/assets/imgs/template.png" alt />
          <span>新增消息模板</span>
        </span>
        <vue-scroll :ops="ops" ref="vs">
          <div class="dialog-content">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="136px"
              class="demo-ruleForm"
              v-if="dialogVisible"
            >
              <el-form-item label="模板类型：" prop="templateType">
                <el-radio-group v-model="ruleForm.templateType">
                  <el-radio :label="2">短信</el-radio>
                  <el-radio :label="1">微信</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="短信类型：" prop="messageType" v-if="ruleForm.templateType==2">
                <el-radio-group v-model="ruleForm.messageType">
                  <el-radio :label="2">短信通知</el-radio>
                  <el-radio :label="1">验证码</el-radio>
                  <el-radio :label="3">推广短信</el-radio>
                  <el-radio :label="4">群发助手</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="消息模板编号：" prop="templateNo">
                <el-input v-model="ruleForm.templateNo" placeholder="请填写"></el-input>
              </el-form-item>
              <el-form-item label="消息模板名称：" prop="templateName">
                <el-input v-model="ruleForm.templateName" placeholder="请填写"></el-input>
              </el-form-item>
              <el-form-item prop="desc" label="消息模板参数格式：" class="desc">
                <el-input type="textarea" v-model="ruleForm.desc" placeholder="请填写"></el-input>
                <span>{{ruleForm.desc.length}}/255</span>
              </el-form-item>
            </el-form>
          </div>
        </vue-scroll>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确定新增</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </span>
      </el-dialog>
      <!-- 删除对应的弹窗 -->
      <el-dialog
        :visible.sync="deleteDialogVisible"
        :close-on-click-modal="false"
        width="300px"
        :show-close="false"
        class="delete"
      >
        <div class="content">
          <div class="confirm">
            <img src="~@/assets/imgs/alarm.png" alt />
            <span>您确定要将该条消息模板删除吗？</span>
          </div>
          <div class="warn">
            <span>删除后将不可恢复</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="confirmDelete">确 定</el-button>
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { messageTemplateNo } from "@/api/tenant.js";
import { addTemplate, deleteTemplate } from "@/api/messageBaseConfig.js";
export default {
  name: "message-template",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      templateName: "",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      ruleForm: {
        templateType: 2, //模板类型
        messageType: 2, //短信类型
        templateNo: "", //消息模板编号
        templateName: "", //消息模板名称
        desc: "" //短信模板参数格式
      },
      rules: {
        templateType: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        messageType: [
          { required: true, message: "请选择短信类型", trigger: "change" }
        ],
        templateNo: [
          {
            required: true,
            message: "请输入消息模板编号",
            trigger: "blur"
          },
          {
            pattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            message: "请输入消息模板编号",
            trigger: "blur"
          }
        ],
        templateName: [
          { required: true, message: "请输入消息模板名称", trigger: "blur" },
          {
            min: 0,
            max: 30,
            message: "消息模板名称的长度不能超过30",
            trigger: "blur"
          },
          {
            pattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            message: "请输入消息模板名称",
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: "请填写短信模板参数格式",
            trigger: "blur"
          },
          {
            min: 0,
            max: 255,
            message: "短信模板参数的长度不能超过255",
            trigger: "blur"
          },
          {
            pattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            message: "请填写短信模板参数格式",
            trigger: "blur"
          }
        ]
      },
      // 传递参数携带的参数集
      queryData: {},
      // 新增消息模板参数集
      templateParams: {},
      //删除对应的弹窗
      deleteDialogVisible: false,
      //当前对应的删除的元素
      currentRow: "",
      ops: window.scrollOps, // 滚动条
      isShow: true
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 点击操作中的删除按钮
    handleDelete(index, row) {
      this.deleteDialogVisible = true;
      this.currentRow = row;
    },
    confirmDelete() {
      this.deleteDialogVisible = false;
      this.deleteTemplate({
        templateId: this.currentRow.msgTemplateId
      });
    },
    // 翻页操作
    handleSizeChange(size) {
      this.pageSize = size;
      this.queryData["size"] = size;
      this.currentPage = 1;
      this.queryData["current"] = this.currentPage;
      this.getTemplateList(this.queryData);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.queryData["current"] = page;
      this.getTemplateList(this.queryData);
    },
    // 关闭弹窗
    handleClose(done) {
      this.dialogVisible = false;
      this.$refs["ruleForm"].resetFields();
    },
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.templateParams = {};
          this.templateParams[
            "msgTemplateCategory"
          ] = this.ruleForm.templateType;
          this.templateParams["msgTemplateCode"] = this.ruleForm.templateNo;
          this.templateParams["msgTemplateName"] = this.ruleForm.templateName;
          this.templateParams["msgTemplateParam"] = this.ruleForm.desc;
          if (this.ruleForm.templateType == 2) {
            this.templateParams["msgTemplateType"] = this.ruleForm.messageType;
          } else {
            this.templateParams["msgTemplateType"] = "";
          }
          for (let i in this.templateParams) {
            if (
              typeof this.templateParams[i] == "string" &&
              this.templateParams[i].constructor == String
            ) {
              this.templateParams[i] = this.templateParams[i].trim();
            }
          }
          this.addTemplate(this.templateParams);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 获取消息模板列表
    getTemplateList(obj) {
      const loading = this.$loading({
        target: ".content",
        background: "rgba(255,255,255,0.7)"
      });
      return messageTemplateNo(obj)
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            if (res.data && res.data.data) {
              this.currentPage = res.data.data.current;
              this.pageSize = res.data.data.size;
              this.total = res.data.data.total;
              if (res.data.data.records) {
                if (
                  res.data.data.current != 1 &&
                  res.data.data.records.length == 0
                ) {
                  this.currentPage = res.data.data.current - 1;
                  this.queryData["current"] = this.currentPage;
                  this.getTemplateList(this.queryData);
                } else {
                  let middleData = res.data.data.records;
                  middleData.map(item => {
                    for (let key in item) {
                      if (key == "msgTemplateCategory" && item[key] != null) {
                        if (item[key] == 1) {
                          item[key] = "微信";
                        } else {
                          item[key] = "短信";
                        }
                      }
                      if (item[key] == null || item[key] === "") {
                        item[key] = "--";
                      }
                    }
                  });
                  this.tableData = middleData;
                }
              } else {
                this.tableData = [];
              }
            } else {
              this.$message.error(`消息模板列表查询失败`);
            }
          } else {
            this.$message.error(`消息模板列表查询发生错误-${res.data.message}`);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("消息模板列表查询发生错误-接口请求失败");
        });
    },
    // 筛选
    findTemplateList(page, size) {
      this.queryData = {};
      this.queryData["current"] = page;
      this.queryData["size"] = size;
      this.queryData["templateName"] = this.templateName;
      for (let i in this.queryData) {
        if (
          typeof this.queryData[i] == "string" &&
          this.queryData[i].constructor == String
        ) {
          this.queryData[i] = this.queryData[i].trim();
        }
      }
      this.getTemplateList(this.queryData);
    },
    // 增加消息模板
    addTemplate(obj) {
      return addTemplate(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.dialogVisible = false;
            this.$message.success(`消息模板增加成功`);
            this.findTemplateList(this.currentPage, this.pageSize);
            // 将数据恢复默认状态
            this.ruleForm = {
              templateType: 2, //模板类型
              messageType: 2, //短信类型
              templateNo: "", //消息模板编号
              templateName: "", //消息模板名称
              desc: "" //短信模板参数格式
            };
          } else {
            this.$message.error(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("增加消息模板失败-接口请求失败");
        });
    },
    // 删除消息模板
    deleteTemplate(obj) {
      return deleteTemplate(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(`消息模板删除成功`);
            // this.findTemplateList(this.currentPage, this.pageSize);
            this.getTemplateList(this.queryData);
          } else {
            this.$message.error(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("删除消息模板失败-接口请求失败");
        });
    },
    // 根据表头中的下拉菜单选择对应的模板类别
    typeChange(item) {
      this.queryData = {};
      // 模板类别发生变化以后重新从第一页开始展示
      this.queryData["current"] = 1;
      this.queryData["size"] = 10;
      this.queryData["templateName"] = this.templateName;
      if (item == "all") {
        this.queryData["templateCategory"] = "";
      } else if (item == "duanxin") {
        this.queryData["templateCategory"] = 2;
      } else if (item == "weixin") {
        this.queryData["templateCategory"] = 1;
      }
      this.getTemplateList(this.queryData);
    }
  },
  created() {
    this.findTemplateList(this.currentPage, this.pageSize);
    this.isShow = this.$_has("messageTemplate_delete");
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>