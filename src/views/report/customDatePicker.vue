<!--
 * @Author: spp
 * @Date: 2020-12-23 18:45:07
 * @LastEditors: spp
 * @LastEditTime: 2021-01-18 16:00:35
 * @FilePath: \ui\src\views\report\customDatePicker.vue
-->
<template>
  <div class="cusFilter">
    <el-date-picker
      v-model="values"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      range-separator="L"
      :clearable="true"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :picker-options="pickerOptions"
      @change="this.onchange"
      :default-time="['00:00:00', '23:59:59']"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'customDatePicker',
  props:{
    value:{
        type: Array
    },
  },
  watch:{
      value(newVal){
          this.values=newVal
      }
  },
  data() {
    return {
      values:this.value,
      pickerOptions:
       {
        shortcuts: [
          {
            text: '当天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              start.setHours(0, 0, 0);
              end.setHours(23, 59, 59);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      }
    };
  },
  methods:{
      onchange(val){
          this.$emit('change',val)
      }
  }
};
</script>

<style lang="scss" scoped>
.cusFilter ::v-deep {
  .el-select > .el-input {
    height: 32px;
  }
}
.cusFilter ::v-deep .el-range-editor {
  width: 238px !important;
  height: 64px !important;
  margin-bottom: 0 !important;
  display: block;
  padding: 6px 10px 10px;
}
.cusFilter ::v-deep {
  .el-date-editor .el-range__icon {
    line-height: 24px;
    height: 24px;
    line-height: 24px !important;
    float: left;
  }
}
.cusFilter ::v-deep {
  .el-range-editor .el-range-input {
    width: 192px;
    height: 24px;
    float: left;
    text-align: left;
    text-indent: 2px;
  }
}
.cusFilter ::v-deep {
  .el-date-editor .el-range-separator {
    line-height: 24px;
    float: left;
    width: 25px;
    height: 24px;
    padding: 0;
    margin-left: -5px;
    font-size: 12px;
    color: #c0c4cc;
  }
}
.cusFilter ::v-deep {
  .el-date-editor .el-range__close-icon {
    height: 24px;
    line-height: 24px;
    float: left;
    margin-left: -24px;
    text-align: right;
  }
}
</style>
