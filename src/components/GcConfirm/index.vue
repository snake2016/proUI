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
        <span>是否覆盖已存在的同名角色？</span>
      </div>
      <div class="warn">
        <span>覆盖后将不可恢复之前的版本</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="coverData">覆盖</el-button>
      <el-button @click="noCoverData">不覆盖</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "gc-confirm",
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