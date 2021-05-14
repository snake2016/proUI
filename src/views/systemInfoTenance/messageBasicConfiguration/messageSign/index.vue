<template>
  <div class="content">
    <div class="input-search">
      <el-input
        placeholder="请输入签名名称"
        v-model="signName"
        class="input-with-select"
        @keyup.enter.native="findSignList(1,10)"
      >
        <span slot="prepend">签名名称</span>
        <el-button slot="append" icon="el-icon-search" @click="findSignList(1,10)"></el-button>
      </el-input>
      <div class="add" v-has="'messageSign_add'">
        <el-button @click="dialogVisible=true">新增短信签名</el-button>
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
        <el-table-column label="短信签名名称" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.msgSignName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" v-if="isShow">
          <template slot-scope="scope">
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
        class="template-dialog sign-dialog"
      >
        <span slot="title" class="dialog-title">
          <img src="~@/assets/imgs/sign.png" alt />
          <span>新增短信签名</span>
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
              <el-form-item label="短信签名名称：" prop="signName">
                <el-input v-model="ruleForm.signName" placeholder="请填写"></el-input>
              </el-form-item>
              <el-form-item label="使用场景：" prop="scene">
                <el-radio-group v-model="ruleForm.scene">
                  <el-radio :label="2">通用</el-radio>
                  <el-radio :label="1">验证码</el-radio>
                </el-radio-group>
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
            <span>您确定要将该条短信签名删除吗？</span>
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
import { msgSignName } from "@/api/tenant.js";
import { addSign, deleteSign } from "@/api/messageBaseConfig.js";
export default {
  name: "message-sign",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      signName: "",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      ruleForm: {
        signName: "", //短信签名名称
        scene: 2 //使用场景
      },
      rules: {
        signName: [
          { required: true, message: "请输入短信签名名称", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "短信签名名称长度不能小于2，不能大于12",
            trigger: "blur"
          },
          {
            pattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            message: "请输入短信签名名称",
            trigger: "blur"
          }
        ],
        sign: [{ required: true, message: "请选择使用场景", trigger: "change" }]
      },
      queryData: {},
      signParams: {},
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
    // 翻页操作
    handleSizeChange(size) {
      this.pageSize = size;
      this.queryData["size"] = size;
      this.currentPage = 1;
      this.queryData["current"] = this.currentPage;
      this.getSignList(this.queryData);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.queryData["current"] = page;
      this.getSignList(this.queryData);
    },
    // 删除操作
    handleDelete(index, row) {
      this.deleteDialogVisible = true;
      this.currentRow = row;
    },
    confirmDelete() {
      this.deleteDialogVisible = false;
      this.deleteSign({
        signId: this.currentRow.msgSignId
      });
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
          // alert("submit!");
          this.signParams = {};
          this.signParams["signName"] = this.ruleForm.signName;
          this.signParams["useType"] = this.ruleForm.scene;
          for (let i in this.signParams) {
            if (
              typeof this.signParams[i] == "string" &&
              this.signParams[i].constructor == String
            ) {
              this.signParams[i] = this.signParams[i].trim();
              if (this.signParams["signName"].length < 2) {
                this.$message.error("短信签名名称长度不能小于2，不能大于12！");
                return false;
              }
            }
          }
          this.addSign(this.signParams);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 获取短信签名列表
    getSignList(obj) {
      const loading = this.$loading({
        target: ".content",
        background: "rgba(255,255,255,0.7)"
      });
      return msgSignName(obj)
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
                  this.getSignList(this.queryData);
                } else {
                  let middleData = res.data.data.records;
                  middleData.map(item => {
                    for (let key in item) {
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
              this.$message.error(`短信签名列表查询失败`);
            }
          } else {
            this.$message.error(`短信签名列表查询发生错误-${res.data.message}`);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error("短信签名列表查询发生错误-接口请求失败");
        });
    },
    // 筛选
    findSignList(page, size) {
      this.queryData = {};
      this.queryData["current"] = page;
      this.queryData["size"] = size;
      this.queryData["signName"] = this.signName;
      for (let i in this.queryData) {
        if (
          typeof this.queryData[i] == "string" &&
          this.queryData[i].constructor == String
        ) {
          this.queryData[i] = this.queryData[i].trim();
        }
      }
      this.getSignList(this.queryData);
    },
    // 增加短信签名
    addSign(obj) {
      return addSign(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.dialogVisible = false;
            this.$message.success(`短信签名增加成功`);
            this.findSignList(this.currentPage, this.pageSize);
            // 将数据恢复默认状态
            this.ruleForm = {
              signName: "", //短信签名名称
              scene: 2 //使用场景
            };
          } else {
            this.$message.error(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("增加短信签名失败-接口请求失败");
        });
    },
    // 删除短信签名
    deleteSign(obj) {
      return deleteSign(obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(`短信签名删除成功`);
            this.findSignList(this.currentPage, this.pageSize);
          } else {
            this.$message.error(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$message.error("删除短信签名失败-接口请求失败");
        });
    }
  },
  created() {
    this.findSignList(this.currentPage, this.pageSize);
    this.isShow = this.$_has("messageSign_delete");
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>