var path = require('path');
module.exports = { //导出一个对象
  //设置入口文件
  // 入口文件的绝对路径
  // path.resolve()                    /Users/zhangzhenguo/muip/webpack-api
  // path.resolve('src/index.js')      /Users/zhangzhenguo/muip/webpack-api/src/index.js
  entry:path.resolve('src/index.js'),     // 入口文件
  //设置输出
  output:{
    path:'./build',       // 设置输出目录
    filename:'builde.js'  // 设置输出保存的文件名
  }
}
