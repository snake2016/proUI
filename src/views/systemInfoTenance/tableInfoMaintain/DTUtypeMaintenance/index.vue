<template>
  <div class="DTU-type-maintenance-wrap">
    <div class="query1">
      <el-input
        placeholder="请输入内容"
        @keyup.enter.native="findList(1,10)"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <div style="width: 90px" slot="prepend">DTU类型名称</div>
        <el-button slot="append" icon="el-icon-search" @click="findList(1,10)"></el-button>
      </el-input>
      <el-button v-has="'dtuType_add'" class="add-btn" size="small" @click="showDialogType">新增DTU类型</el-button>
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
        <el-table-column prop="dtuTypeName" label="DTU类型名称"></el-table-column>
        <el-table-column
          prop="manufacturerName"
          label="厂商名称"
          :filter-multiple="false"
          :column-key="'manufacturerName'"
          :filters="filterStatus"
        ></el-table-column>
        <el-table-column prop="protocolName" label="协议类型名称"></el-table-column>
        <el-table-column prop="iotPlatformProtocol" label="IOT平台协议"></el-table-column>
        <el-table-column prop="useYears" label="使用年限"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope,data">
            <span
              style="color: rgba(47, 135, 254, 1);margin-right: 20px;cursor:pointer"
              @click="changeDtuType(scope.row)"
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
      custom-class="create-dtu-type-main"
      :visible.sync="showDialogDtu"
      width="920px"
      top="20vh"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="clearDialogData"
    >
      <div slot="title" class="header-title">
        <img class="columnIcon" src="@/assets/imgs/addDtuIcon.png" />
        <span class="title-age">{{isEdit?(isShow?'修改DTU类型':'详情'):'新增DTU类型'}}</span>
      </div>
      <div class="dialog_changeDTU">
        <el-form
          ref="DTUtypeMaintenanceForm"
          label-width="140px"
          label-position="left"
          class="create-dtu-type-main-form"
          :model="details"
          :rules="DTUtypeMainRule"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="DTU类型名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="dtuTypeName"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  v-model="details.dtuTypeName"
                  placeholder="请输入DTU类型名称"
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
                label="协议类型名称："
                style="padding-right: 20px;"
                class="item item-right"
                prop="protocolType"
              >
                <el-select
                  size="small"
                  :disabled="!isShow"
                  v-model="details.protocolType"
                  placeholder="请选择协议类型名称"
                  style="width: 210px"
                  @change="changeProtocolType"
                >
                  <el-option
                    v-for="item in protocolList"
                    :key="item.protocolType"
                    :label="item.protocolName"
                    :value="item.protocolType"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IOT平台协议：" style="padding-right: 20px;" class="item item-right">
                <el-input
                  size="small"
                  v-model="details.iotPlatformProtocol"
                  placeholder="IOT平台协议"
                  disabled
                  style="width:210px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="使用年限："
                style="padding-right: 20px;"
                class="item item-right"
                prop="useYears"
              >
                <el-input
                  size="small"
                  :disabled="!isShow"
                  placeholder="请输入使用年限"
                  v-model="details.useYears"
                  style="width:210px"
                >
                  <span slot="suffix">年</span>
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
        >{{isEdit?'确认修改':'确认新增'}}</el-button>
        <el-button style="width: 80px;" size="small" @click="clearDialogData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDtuList,
  addNewDtu,
  updateDtu,
  getManufacturerList,
  getProtocolMappingList
} from "@/api/tableInfoMaintain.js";

export default {
  name: "DTU-type-maintenance",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      filterStatus: [],
      manufacId: "",
      //当前页
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 10,
      // 列表数据
      tableData: [],
      // 查询下拉数据
      query: "dtuTypeName",
      fileTerm: "",
      showDialogDtu: false,
      isEdit: false,
      ops: window.scrollOps, // 滚动条
      details: {
        dtuTypeName: "",
        manufacturerId: "",
        protocolType: "",
        iotPlatformProtocol: "",
        useYears: ""
      },
      DTUtypeMainRule: {
        dtuTypeName: [
          {
            required: true,
            message: "DTU类型名称不能为空",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback("请勿超过20字数");
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
        protocolType: [
          {
            required: true,
            message: "请选择协议类型",
            trigger: "change"
          }
        ],
        useYears: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /^(\d|[1-9]\d|99)$/;
              if (!_test.test(value)) {
                callback("请输入0-99");
                return;
              }
              callback();
            }
          }
        ],
        flowUpperLimit: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /(^\d{1,10}$)|(^\d{1,10}\.\d{1,4}$)/;
              if (!_test.test(value)) {
                callback("请输入0-9999999999.9999");
                return;
              }
              callback();
            }
          }
        ],
        meterRange: [
          {
            validator: (rule, value, callback) => {
              if (value === "" || value == null) {
                callback();
              }
              let _test = /(^\d{1,10}$)|(^\d{1,10}\.\d{1,4}$)/;
              if (!_test.test(value)) {
                callback("请输入0-9999999999.9999");
                return;
              }
              callback();
            }
          }
        ]
      },
      // 协议列表
      protocolList: [],
      // 厂商列表
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
    // 协议列表
    getProtocolMappingList({
      current: 1,
      size: 50
    }).then(res => {
      if (res.data.code == 0) {
        this.protocolList = (res.data.data.records || []).filter(item => {
          return item.type == 2;
        });
      }
    });
    this.isShow = this.$_has("dtuType_modify");
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
    // 协议类型名称
    changeProtocolType(attr) {
      let findprop = _.find(this.protocolList, item => {
        return item.protocolType === attr;
      });
      if (findprop) {
        this.details.iotPlatformProtocol = findprop.iotPlatformProtocol;
      } else {
        this.details.iotPlatformProtocol = "";
      }
    },
    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    // 精准查询列表
    findList(page, size) {
      let attr = {
        current: page,
        size: size,
        dtuTypeName: this.fileTerm.trim(),
        manufacturerId: this.manufacId
      };
      this.currentPage = page;
      this.pageSize = size;
      const loading = this.$loading({
        target: ".List",
        background: "rgba(255,255,255,0.7)"
      });
      getDtuList(attr)
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.tableData = res.data.data.records || 0;
            this.dataNum = res.data.data.total || 0;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          loading.close();
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
    showDialogType() {
      this.showDialogDtu = true;
    },
    clearDialogData() {
      this.details = {
        dtuTypeName: "",
        manufacturerId: "",
        protocolType: "",
        iotPlatformProtocol: "",
        useYears: ""
      };
      this.$refs.DTUtypeMaintenanceForm.resetFields();
      this.showDialogDtu = false;
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
      this.$refs.DTUtypeMaintenanceForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            target: ".List",
            background: "rgba(255,255,255,0.7)"
          });
          if (this.isEdit) {
            let attr = {
              dtuTypeId: this.details.dtuTypeId,
              dtuTypeName: this.details.dtuTypeName,
              manufacturerId: this.details.manufacturerId,
              protocolType: this.details.protocolType,
              useYears: parseInt(this.details.useYears)
            };
            updateDtu(attr)
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
              dtuTypeName: this.details.dtuTypeName,
              manufacturerId: this.details.manufacturerId,
              protocolType: this.details.protocolType,
              useYears: parseInt(this.details.useYears)
            };
            addNewDtu(attr)
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
    // 修改dtu类型
    changeDtuType(attr) {
      this.showDialogDtu = true;
      this.isEdit = true;
      this.details = _.cloneDeep(attr);
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
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  padding: 16px 40px;
}
::v-deep .create-dtu-type-main .el-dialog__body {
  .dialog_changeDTU {
    width: 100%;
    min-height: 210px;
    max-height: 390px;
    padding: 24px 40px 0;
    position: relative;
    overflow: auto;
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