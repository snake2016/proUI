<!--
 * @Author: spp
 * @Date: 2021-04-12 16:47:17
 * @LastEditors: spp
 * @LastEditTime: 2021-05-08 16:17:01
 * @FilePath: \proUI\src\views\login\sign.vue
-->

<template>
  <el-input v-model="val" placeholder=""></el-input>
</template>

<script>
export default {
    data(){
       return {
           a:'w',
       } 
    },
    methods:{
        getname(){
            let a='dsd'
            return a.replace('sd','')
        }
    }
}
</script>

<style>

</style>