<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="300px"
    :show-close="false"
    custom-class="gc-confirm-wrap"
  >
    <div class="content">
      <div class="confirm">
        <img src="~@/assets/imgs/alarm.png" alt />
        <span>{{title||'确认删除'}}？</span>
      </div>
      <div class="warn">
        <span>{{subTitle||'删除后将无法恢复数据'}}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="coverData">确定</el-button>
      <el-button @click="noCoverData">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "gc-confirm-again",
  data() {
    return {
      dialogVisible: false
    };
  },
  props:{
    visible:{
      type: Boolean,
      defulte(){
        return false
      }
    },
    title:{
      type: String,
      defulte(){
        return ''
      }
    },
    subTitle:{
      type: String,
      defulte(){
        return ''
      }
    }
  },
  watch: {
    visible(newVal){
      this.dialogVisible = newVal
    }
  },
  mounted() {
  },
  updated() {},
  methods: {
    noCoverData(){
      this.$emit('onCancel')
    },
    coverData(){
      this.$emit('onOk')
    }
  }
};
</script>

<style lang="scss" scoped >
::v-deep .gc-confirm-wrap  {
  .el-dialog__header {
    height: 25px;
    border-bottom: none;
  }
  .content {
    .confirm {
      position: relative;
      img {
        position: absolute;
        left: -10px;
        top: 0;
        margin-left: -18px;
        vertical-align: top;
        padding-top: 4px;
      }
      span {
        color: #222222;
      }
    }
    .warn {
      margin-top: 6px;
      span {
        color: #ababab;
        font-size: 12px;
      }
    }
  }
}
::v-deep .gc-confirm-wrap  .el-dialog__footer {
  padding: 20px 40px 25px 60px;
  box-shadow: none;
  height: auto;
  .el-button {
    border: 1px solid #ec6b60;
    color: #ec6b60;
    padding: 0;
    width: 80px;
    height: 32px;
  }
}
::v-deep  .gc-confirm-wrap  .el-dialog__body {
  padding: 0 40px 0 70px;
}
</style>