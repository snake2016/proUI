<template>
  <div class="operation-records-page">
    <div class="query1">
      <el-input
        placeholder="请输入内容"
        @keyup.enter.native="findList('1','10')"
        v-model="fileTerm"
        class="input-with-select"
        size="small"
      >
        <el-select v-model="query" style="width: 120px" slot="prepend">
          <el-option key="action" label="操作" value="action"></el-option>
          <el-option key="before" label="操作前内容" value="before"></el-option>
          <el-option key="after" label="操作后内容" value="after"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="findList('1','10')"></el-button>
      </el-input>
    </div>
    <div class="titleData1">
      <el-table
        :height="tableHeight"
        :data="tableData"
        class="tables"
        :header-cell-style="{background:'#FAFAFA',color:'#222222'}"
      >
        <template slot="empty" class="noData">
          <img class="data-pic" src="@/assets/imgs/temp/noData.png" />
          <p style="margin:0px;">暂无数据</p>
        </template>
        <el-table-column prop="action" label="操作"></el-table-column>
        <el-table-column prop="before" label="操作前内容"></el-table-column>
        <el-table-column prop="after" label="操作后内容"></el-table-column>
        <el-table-column prop="account" label="操作人"></el-table-column>
        <el-table-column prop="operate_time" label="操作时间"></el-table-column>
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
  </div>
</template>
<script>
import { getOperationRecordsList } from "@/api/templateMaintain.js";
import { convertUTC } from "@/utils/index.js";
export default {
  name: "archives-list",
  data() {
    return {
      tableHeight: "calc(100% - 52px)",
      userType: "",
      createTime: "",
      // 表具地址查询参数
      address: {
        // data1: "",
        data2: "",
        data3: "",
        addressDetail: ""
      },
      archiveStatu: "",
      checked: true,
      addresRegion: "",
      fileTerm: "",
      //当前页
      currentPage: 1,
      //初始化总条数
      dataNum: 0,
      //每页显示多少条
      pageSize: 10,
      // 列表数据
      tableData: [],
      // 查询下拉数据
      query: "action",
      ops: window.scrollOps // 滚动条
    };
  },
  computed: {},
  components: {},
  mounted() {
    this.findList(1, 10);
  },
  methods: {
    // 切换查询条件
    queryFun(val) {
      this.fileTerm = "";
    },
    // 精准查询列表
    findList(page, size) {
      let _params = {
        page: page - 1,
        size: size,
        isSystem: true
      };
      this.currentPage = page;
      this.pageSize = size;
      _params[this.query] = this.fileTerm.trim();
      getOperationRecordsList(_params)
        .then(res => {
          if (res.data.code == "0") {
            this.tableData = (res.data.data || []).map(item => {
              item.operate_time = convertUTC(item.operate_time);
              item.before = JSON.stringify(item.before);
              item.after = JSON.stringify(item.after);
              return item;
            });
            this.dataNum = res.data.total_count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    //改变每页显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.findList(1, size);
    },
    //翻页方法
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.findList(currentPage, this.pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>