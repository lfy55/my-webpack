'use strict'

// 多页应用页面配置
// name 页面名称
// entryJS  入口JS  相对于src文件夹目录
// title  页面标题
// myVendor 选填  期望单独打包的第三方库  ['libName']  相对于src/lib文件夹目录
// ps：从node_modules引入的第三方库会自动单独打包成vendor.xx.js

module.exports = [{
  name: 'page1',
  entryJS: 'entry/app.js',
  title: '测试页面',
  // myVendor: ['test.js'],
}, ]
