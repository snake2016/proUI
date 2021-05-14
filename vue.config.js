/*
 * @Author: your name
 * @Date: 2020-11-13 09:39:15
 * @LastEditTime: 2021-05-06 15:58:08
 * @LastEditors: spp
 * @Description: In User Settings Edit
 * @FilePath: \proUI\vue.config.js
 */

 const path = require('path');
 const resolve = (dir) => path.join(__dirname, dir);
 const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
 const webpack = require('webpack');
 const TerserPlugin = require('terser-webpack-plugin');

 module.exports = {
   publicPath: IS_PROD ? process.env.VUE_APP_API_BASE_URL : "./", // 默认'/'，部署应用包时的基本 URL
   outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
   assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
   lintOnSave: !IS_PROD,
   runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
   productionSourceMap: !IS_PROD, // 生产环境的 source map
 
   devServer: {
     open: true,
     compress: true,
     proxy: {
       'api/': {
         target: 'http://tenant3.gciot.com:32080',
         changeOrigin: true,
         ws: false,
         pathRewrite: {
           '^/api': '',
         },
       },
     },
   },
 
   chainWebpack: (config) => {
     // 若热更新失效，修复HMR
     config.resolve.symlinks(true);
     config.resolve.alias
       .set('@', resolve('src'))
       .set('moment', resolve('dayjs'))
   },
   configureWebpack: (config) => {
     // webpack 配置
     config.devtool = 'source-map';
 
     // 公共代码抽离
     config.optimization = {
       minimizer: [
         new TerserPlugin({
           terserOptions: {
             compress: {
               drop_console: IS_PROD,
               drop_debugger: IS_PROD,
             },
           },
         }),
       ],
     };
   },
 };
 