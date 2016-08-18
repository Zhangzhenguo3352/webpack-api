# webpack-api

```
.gitignore  文件 不需要 提交到github的文件写在这个目录下
     node_modules  忽略不提交
     .idea                  忽略不提交
     lib                      忽略不提交

—save-dev              开发依赖里面 -》 就是 开发时需要 上线是不需要
 --save                     生产依赖里面 -》 就是你上线之后还需要，

一般情况下
          src        => 目录存放源码
          build     => 目录存放编译打包之后的资源

安装细节
      sudo npm install webpack --save-dev   管理员方式安装 webpack 到开发环境
入口文件 解释
          index.js      如果入口文件没有，走下面的方法
          package.json => main:’xxx’       找main 写的内容
nodes     实现commjs写法
          例子：nodejs/commjs写法
          index.js  文件
               require(‘./component.js');
          component.js 文件
               module.exports = ‘xxx'
web pack     一个文件打包到另一个文件下,
           webpack index.js build.js

                    打包的文件  ，打包到哪里文件（到时候会新建）
初始化 项目 简洁版
          nam install -y
命令中出现main 的含义

          当只有一个入口文件 它这是main

 命令行参数

    - webpack 开发环境下编译
    - webpack -p 生产环境下编译，会压缩生成后的文件
    - webpack -w 开发环境下持续的监听文件>变动来进行编译
    - webpack -d 生成map映射文件,会在控制台的Sources页签中出现存放打包前原始文件的webpack://目录，可以打断点，帮助调试 `webpack index.js bundle.js -d'
    - webpack --progress 显示构建百分比进度
    - webpack --display-error-details 显示打包过程中的出错信息(比如 webpack寻找模块的过程)
    - webpack --profile 输出性能数据，可以看到每一步的耗时

module.exprots = {}
               导出一个对象
全局安装卸载
          npm uninstall wegpack -g
babel  是一种通用的多用途javascript编辑器 ，能够转译
          babel-loader来解析es6写成的模块

安装loader
          babel-loader可以将ES6的代码转为ES5的代码
           sudo npm install babel-loader babel-core --save-dev

           sudo npm install babel-preset-es2015 babel-preset-stage-0 --save-dev

```
