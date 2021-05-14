<!--
 * @Author: spp
 * @Date: 2021-04-19 14:49:34
 * @LastEditors: spp
 * @LastEditTime: 2021-05-08 16:55:49
 * @FilePath: \proUI\src\views\workBench\index.vue
-->
<template>
<div>工作台
    {{f | supportHourReading }}
    <el-button v-has="'account-open-set-config'">v-has</el-button>
</div>
</template>

<script>

export default {
  name:'',
  data() {
    return {
        f:1
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang='scss' scoped>

</style>