<template>
  <div class="IC-card-type-main-wrap">
    <div class="query1">
      <el-input
        placeholder="请输入内容"
        @keyup.enter.native="findList(1,10)"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <div style="width: 90px" slot="prepend">IC卡类型名称</div>
        <el-button slot="append" icon="el-icon-search" @click="findList(1,10)"></el-button>
      </el-input>
      <el-button v-has="'ICcardType_add'" class="add-btn" size="small" @click="addICType">新增IC卡类型</el-button>
    </div>
    <div class="titleData1">
      <el-table
        :height="tableHeight"
        :data="tableData"
        class="tables"
        :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
        @filter-change="filterChange"
      >
        <template slot="empty" class="noData">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </template>
        <el-table-column prop="name" label="IC卡类型名称"></el-table-column>
        <el-table-column prop="code" label="IC卡类型编码"></el-table-column>
        <el-table-column
          prop="manufacturerName"
          label="厂商名称"
          :filter-multiple="false"
          :column-key="'manufacturerName'"
          :filters="filterStatus"
        ></el-table-column>
        <el-table-column prop="secretKey" label="IC卡密钥"></el-table-column>
        <el-table-column prop="capacity" label="IC卡容量"></el-table-column>
        <el-table-column prop="icCardNoLength" label="IC卡号长度"></el-table-column>
        <el-table-column prop="initalBuyNum" label="初始购气次数"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="60px">
          <template slot-scope="scope,data">
            <span
              style="color: rgba(47, 135, 254, 1);cursor: pointer"
              @click="changeIcCardType(scope.row)"
            >{{isShow?'修改':'详情'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="tableData.length > 0">
        <el-pagination
          class="pageLeft"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="slot,sizes,total"
          :total="dataNum"
        >
          <span class="fontSize">显示</span>
        </el-pagination>
        <el-pagination
          class="pageRight"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="dataNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      custom-class="create-ic-card-type-main"
      :visible.sync="showICTypeDialog"
      width="920px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearDialogData"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/ic卡icon.png" />
        <span class="title-age">{{isEdit?(isShow?'修改IC卡类型':'详情'):'新增IC卡类型'}}</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          ref="icCardTypeMainForm"
          label-width="140px"
          label-position="left"
          class="create-ic-card-type-main-form"
          :model="details"
          :rules="ICCardTypeRule"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="IC卡类型名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="name"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.name"
                  placeholder="请输入IC卡类型名称"
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="IC卡类型编码："
                style="padding-right: 20px;"
                class="item item-right"
                prop="code"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.code"
                  placeholder="请输入IC卡类型名称"
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="厂商名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="manufacturerId"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.manufacturerId"
                  placeholder="请选择厂商"
                  style="width: 210px"
                >
                  <el-option
                    v-for="item in vendorList"
                    :key="item.manufacturerId"
                    :label="item.manufacturerName"
                    :value="item.manufacturerId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="IC卡密钥："
                style="padding-right: 20px;"
                class="item item-right"
                prop="secretKey"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.secretKey"
                  placeholder="请输入IC卡密钥"
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="IC容量："
                style="padding-right: 20px;"
                class="item item-right"
                prop="capacity"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  placeholder="请输入IC容量"
                  v-model="details.capacity"
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="IC卡号长度："
                style="padding-right: 20px;"
                class="item item-right"
                prop="icCardNoLength"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  placeholder="请输入IC卡号长度"
                  v-model="details.icCardNoLength"
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="初始购气次数："
                style="padding-right: 20px;"
                class="item item-right"
                prop="initalBuyNum"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  placeholder="请输入初始购气次数"
                  v-model="details.initalBuyNum"
                  style="width:210px"
                >
                  <span slot="suffix">次</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isShow">
        <el-button
          style="width: 80px;"
          class="el-button--primary"
          size="small"
          @click="sureOnOk"
        >{{isEdit?"确认修改":"确认新增"}}</el-button>
        <el-button style="width: 80px;" size="small" @click="clearDialogData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getIcCardTypeList,
  getManufacturerList,
  updateIcCardType,
  addNewicCardType,
  getIcCardDetails
} from "@/api/tableInfoMaintain.js";

export default {
  name: "IC-card-type-main",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      filterStatus: [],
      manufacId: "",
      //当前页
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      dataNum1: 0,
      //每页显示多少条
      pageSize: 10,
      // 列表数据
      tableData: [],
      // 查询下拉数据
      query: "archivesIdentity",
      querys: [
        {
          value: "userName",
          label: "ID"
        },
        {
          value: "addressName",
          label: "资源描述"
        },
        {
          value: "archivesNo",
          label: "路径"
        },
        {
          value: "archivesIdentity",
          label: "操作"
        }
      ],
      showICTypeDialog: false,
      isEdit: false,
      details: {
        name: "", //ic卡类型名称,长度限制32
        code: "", //ic卡类型编码,长度限制32
        manufacturerId: "", // 厂商Id
        secretKey: "", //IC卡秘钥
        capacity: "", //IC卡容量
        icCardNoLength: "", //IC卡号长度范围为4-20
        initalBuyNum: "" // 初始购气次数
      },
      ICCardTypeRule: {
        name: [
          {
            required: true,
            message: "IC卡类型名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("IC卡类型名称不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        code: [
          {
            required: true,
            message: "IC卡类型编码不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == null || value.toString().trim() == "") {
                callback("IC卡类型编码不能为空");
                return;
              }
              if (value.toString().trim().length > 32) {
                callback("请勿超过32字数");
                return;
              }
              callback();
            }
          }
        ],
        manufacturerId: [
          {
            required: true,
            message: "请选择厂商",
            trigger: "change"
          }
        ],
        icCardNoLength: [
          {
            required: true,
            message: "IC卡号长度不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              let _test = /^(\d|[1-9]\d)$/;
              if (
                !_test.test(value) ||
                parseInt(value) < 4 ||
                parseInt(value) > 20
              ) {
                callback("请输入4-20的整数");
                return;
              }
              callback();
            }
          }
        ],
        initalBuyNum: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /^(\d|[1-9]+\d)$/;
              if (!_test.test(value)) {
                callback("请输入数字");
                return;
              }
              if (value > 16777215) {
                callback("范围0~16777215");
                return;
              }
              callback();
            }
          }
        ],
        capacity: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /^(\d|[1-9]+\d)$/;
              if (!_test.test(value)) {
                callback("请输入数字");
                return;
              }
              if (value > 16777215) {
                callback("范围0~16777215");
                return;
              }
              callback();
            }
          }
        ]
      },
      fileTerm: "",
      ops: window.scrollOps, // 滚动条
      vendorList: [],
      userRoleName: "",
      isShow: true
    };
  },
  computed: {},
  components: {},
  created() {
    this.findList(1, 10);
    this.userRoleName = this.$ls.get("userGradeName");
    //  厂商列表
    getManufacturerList({
      current: 1,
      size: 50
    }).then(res => {
      if (res.data.code == 0) {
        this.vendorList = res.data.data.records || [];
        this.filterStatus = (res.data.data.records || []).map(item => {
          return {
            text: item.manufacturerName,
            value: item.manufacturerId
          };
        });
      }
    });
    this.isShow = this.$_has("ICcardType_modify");
  },
  methods: {
    filterChange(attr) {
      if (attr.manufacturerName.length === 0) {
        this.manufacId = "";
      } else {
        this.manufacId = attr.manufacturerName[0];
      }
      this.findList(1, this.pageSize);
    },
    // 输入查询内容
    queryFun(val) {
      this.fileTerm = "";
    },
    // 精准查询列表
    findList(page, size) {
      // 传参
      let attr = {
        current: page,
        size: size,
        name: this.fileTerm.trim(),
        manufacturerId: this.manufacId
      };
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getIcCardTypeList(attr)
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.tableData = res.data.data.records || [];
            this.dataNum = res.data.data.total || 0;
          } else {
            this.tableData = [];
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.tableData = [];
          this.$message.error("查询数据失败-接口请求错误");
        });
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.findList(this.currentPage, size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.findList(currentPage, this.pageSize);
    },
    // 新增ic卡类型
    addICType() {
      this.showICTypeDialog = true;
    },
    //
    clearDialogData() {
      this.details = {
        name: "", //ic卡类型名称,长度限制32
        code: "", //ic卡类型编码,长度限制32
        manufacturerId: "", // 厂商Id
        secretKey: "", //IC卡秘钥
        capacity: "", //IC卡容量
        icCardNoLength: "", //IC卡号长度范围为4-20
        initalBuyNum: "" // 初始购气次数
      };
      this.$refs.icCardTypeMainForm.resetFields();
      this.showICTypeDialog = false;
      this.isEdit = false;
    },
    // 点击OK
    sureOnOk() {
      for (let i in this.details) {
        if (
          typeof this.details[i] == "string" &&
          this.details[i].constructor == String
        ) {
          this.details[i] = this.details[i].trim();
        }
      }
      this.$refs.icCardTypeMainForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (this.isEdit) {
            let attr = {
              icCardTypeId: this.details.icCardTypeId,
              name: this.details.name, //ic卡类型名称,长度限制32
              code: this.details.code, //ic卡类型编码,长度限制32
              manufacturerId: this.details.manufacturerId, // 厂商Id
              secretKey: this.details.secretKey, //IC卡秘钥
              capacity: this.details.capacity
                ? parseInt(this.details.capacity)
                : "", //IC卡容量
              icCardNoLength: this.details.icCardNoLength
                ? parseInt(this.details.icCardNoLength)
                : "", //IC卡号长度范围为4-20
              initalBuyNum: this.details.initalBuyNum
                ? parseInt(this.details.initalBuyNum)
                : "" // 初始购气次数
            };
            updateIcCardType(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  this.$message.success("修改成功");
                  this.findList(this.currentPage, this.pageSize);
                  this.clearDialogData();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          } else {
            let attr = {
              name: this.details.name, //ic卡类型名称,长度限制32
              code: this.details.code, //ic卡类型编码,长度限制32
              manufacturerId: this.details.manufacturerId, // 厂商Id
              secretKey: this.details.secretKey, //IC卡秘钥
              capacity: this.details.capacity
                ? parseInt(this.details.capacity)
                : "", //IC卡容量
              icCardNoLength: this.details.icCardNoLength
                ? parseInt(this.details.icCardNoLength)
                : "", //IC卡号长度范围为4-20
              initalBuyNum: this.details.initalBuyNum
                ? parseInt(this.details.initalBuyNum)
                : "" // 初始购气次数
            };
            addNewicCardType(attr)
              .then(res => {
                loading.close();
                if (res.data.code == 0) {
                  this.$message.success("新增成功");
                  this.findList(this.currentPage, this.pageSize);
                  this.clearDialogData();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                loading.close();
                this.$message.error(err.message);
              });
          }
        } else {
        }
      });
    },
    //
    changeIcCardType(attr) {
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getIcCardDetails({
        icCardTypeId: attr.icCardTypeId
      })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.details = res.data.data;
            this.showICTypeDialog = true;
            this.isEdit = true;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
          this.$message.error(err.message);
        });
    }
  },
  // watch: {
  //   data2: function(val, oldval) {
  //     if (val) {
  //       this.getAreaDataVal(val);
  //       this.address.data3 = "";
  //     }
  //   }
  // },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .el-dialog__body {
  .dialog_content_wrap {
    .form-item-col {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      .form-label {
        width: 130px;
        padding-right: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span:nth-of-type(1) {
          width: 20px;
          display: inline-block;
          height: 100%;
          color: #f56c6c;
        }
      }
      .form-content {
        flex: 1;
      }
    }
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .create-ic-card-type-main .el-dialog__body {
  .dialog_changeDTU {
    width: 100%;
    min-height: 210px;
    max-height: 390px;
    padding: 24px 40px 0;
    position: relative;
    overflow: auto;
    .create-ic-card-type-main-form {
      height: calc(100% - 54px);
    }
    .operation {
      color: #ababab;
      font-size: 14px;
      margin-bottom: 0;
      margin-top: 26px;
      .operation_div {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
}
</style>