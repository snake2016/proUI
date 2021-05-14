<template>
  <div class="fill">
    <!-- <vue-scroll :ops="ops" ref="vs"> -->
      <header class="header a">
        <div class="tab" :class="tabIndex==1 ? 'active' : ''" @click="tabIndex=1">批量缴费</div>
        <div class="tab" :class="tabIndex==2 ? 'active' : ''" @click="sw_tab(2)">批量缴费记录</div>
      </header>
      <div class="body" v-if="tabIndex == 1">
        <div class="section2">
          <div class="box-header">
            <img src="@/assets/imgs/batchCreate/batchCreate-upload.png" alt />
            <span>上传文件</span>
          </div>
          <div class="c">
            <div class="tipBox">
              <div class="tip">
                <img src="@/assets/imgs/batchCreate/batchCreate-tip.png" alt />
                <span>上传前请先下载一份模板进行编辑，再执行上传功能</span>
              </div>
            </div>
            <div class="downBox">
              <div class="r">
                <div class="title">模板下载：</div>
                <div class="t2">
                  <img src="@/assets/imgs/batchCreate/batchCreate-xls.png" alt />
                  <span>“批量充值” 模板</span>
                </div>
                <a class="down" download="批量充值模板.xlsm" :href="`${publicPath}excel/批量充值模板.xlsm`">下载</a>
              </div>
              <div class="r" style="margin-bottom:0;">
                <div class="title"></div>
                <div class="t2">
                  <img src="@/assets/imgs/batchCreate/batchCreate-xls.png" alt />
                  <span>“批量补气” 模板</span>
                </div>
                <a class="down" download="批量补气模板.xlsm" :href="`${publicPath}excel/批量补气模板.xlsm`">下载</a>
              </div>
            </div>
            <div class="sec2-box3">
              <div class="imgBox">
              </div>
              <el-button type="primary" class="aniu" plain size="small" @click="showCreate">批量缴费</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="body tab2" v-if="tabIndex == 2">
        <div
          class="tab2-sec2"
          v-loading="recordList_loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
        >
          <div class="tb_wrap">
          <div class="none-box b" v-if="!recordList.length">
            <img src="@/assets/imgs/recharge/暂无缴费信息.png" alt />
            <div>暂无数据</div>
          </div>
          <vue-scroll :ops="ops" ref="vs">
            <el-table class="table" :data="recordList" v-if="recordList.length">
              <el-table-column prop="createTime" label="操作时间" min-width></el-table-column>
              <el-table-column
                prop="operatorType"
                label="操作类型"
                :formatter="operatorTypeFormat"
                min-width
              ></el-table-column>
              <el-table-column prop="createStaffName" label="操作人员" min-width></el-table-column>
              <el-table-column label="上传状态" min-width>
                <template slot-scope="scope">
                  <span class="state-success" v-if="!scope.row.fail">上传成功</span>
                  <span class="state-fail" v-else>上传失败</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <a
                    class="fail"
                    v-if="scope.row.fail"
                    @click="downFailRecord(scope.row.recordId)"
                  >下载错误记录</a>
                  <span v-else>/</span>
                </template>
              </el-table-column>
            </el-table>
          </vue-scroll>
          </div>
          <div class="fenye" v-if="recordList.length">
            <el-pagination
              class="pageLeft"
              background
              @size-change="sizeChange"
              @current-change="getRecordList"
              :current-page.sync="record_page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="record_size"
              layout="slot,sizes,total"
              :total="record_total">
              <span class="fontSize">显示</span>
            </el-pagination>
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page.sync="record_page"
              @current-change="getRecordList"
              :page-size="record_size"
              :total="record_total"
            ></el-pagination>
          </div>
        </div>
      </div>

      <el-dialog
        :visible.sync="dialog_selectFile"
        :closeOnClickModal="false"
        @closed="dialog_upload_close"
        width="600px"
      >
        <div slot="title" class="box-header" style="padding-left: 0;">
          <img src="@/assets/imgs/batchCreate/batchCreate-upload.png"/>
          <span>上传文件</span>
        </div>
        <div class="dialogContent">
          <img
            src="@/assets/imgs/batchCreate/batchCreate-file-select.png"
            class="img"
            v-if="uploadStep == 1"
          />
          <img
            src="@/assets/imgs/batchCreate/batchCreate-upload-xls.png"
            alt
            class="img"
            v-if="uploadStep == 2"
          />
          <img src="@/assets/imgs/batchCreate/上传成功.png" style="height: 144px;" class="img" v-if="uploadStep == 3" />
          <img src="@/assets/imgs/batchCreate/上传失败.png" style="height: 144px;" class="img" v-if="uploadStep == 4" />
          <div class="msg" v-if="uploadMsgShow">{{uploadMsg}}</div>
          <div class="msg fail" v-if="uploadStep==4" @click="downFailRecord(false)">
            <img src="@/assets/imgs/batchCreate/fail-xls.png" alt />
            <span>下载错误记录</span>
          </div>
          <div class="annius" v-if="uploadStep == 1 || uploadStep == 2">
            <el-upload class="upload" action :auto-upload="false" :on-change="fileChange" style="margin-right:0;">
              <el-button
                v-if="selectBtShow"
                size="small"
                class="bt"
                type="primary"
                plain
              >{{selectText}}</el-button>
            </el-upload>
            <el-button
              v-if="uploadBtShow"
              size="small"
              style="margin-left: 10px;"
              class="bt"
              type="primary"
              @click="uploadSheet"
            >上传</el-button>
          </div>
          <div class="annius" v-if="uploadStep == 3 || uploadStep == 4">
            <el-button
              size="small"
              class="bt"
              type="primary" plain
              @click="dialog_upload_close"
            >{{uploadStep == 3 ? '完成' : '关闭'}}</el-button>
          </div>
        </div>
      </el-dialog>
    <!-- </vue-scroll> -->
  </div>
</template>

<script>
import indexMix from './index.js';
export default {
  name: "batch-recharge",
  mixins: [indexMix],
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>