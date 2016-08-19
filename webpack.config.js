var path = require('path');

// 我感觉 这个函数 有两个用处
//    1, 能够编写假数据 使用
//    2, 还能 模拟用户 找不到 所找的文件，让它返回到 404 页面
function rewriteUrl(replacePath){
    return function(req,options){
        req.url = req.path.replace(options.path,replacePath);
    }
}


// var jqueryPath = path.join(__dirname,'lib/jquery.js')
var jqueryPath = path.resolve('lib/jquery.js')

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
  },

  // 如何解析不同后缀的文件
  resolve:{ // json
      // 自动补全后缀，注意第一个必须是空字符串，后缀一定以点开头
      extension:['','.js','.css','.jsx','.json'] ,// 指定文件扩展名,在引用是就不需要写全，自动补全
      alias:{ // 配置别名可以加快 webpack 查找模块的速度 ，可以是 json
        // 如果每当 引入 jquery 模块的时候，它会直接jqueryPath,二必须要从 node_modules文件夹中按模块的查找规则查找
          'jquery':jqueryPath
      }

  },
  // 指定 webpack-dev-server 的配置项
  devServer:{
    port:8081, // 配置端口号，默认 8080 ，
    contentBase:'./build', //配置webpack-dev-server 打开端口，去打开哪个文件
    // 模拟 后台接口
    proxy:[ // 数组
      // 这里 对 proxy 做重要说明
      /*
      1，
          path:/\/api\/(.+)/,  // 指定用来匹配请求URL的正则（就是我要访问 的路径）
          // 将此请求转发给哪个服务器
          target:'http://localhost:8081', // 请求转发给谁 ，为什么转发给它，因为我们只有这一个服务，只能这样
          rewrite:rewriteUrl('\/$1\.json'),  //这是个函数， 转换路径，把原路径转成目标路径
          changeOrigin:true  // 修改来源路径（true）
      2，
          // 我感觉 这个函数 有两个用处
          //    1, 能够编写假数据 使用
          //    2, 还能 模拟用户 找不到 所找的文件，让它返回到 404 页面
          function rewriteUrl(replacePath){
              return function(req,options){
                  req.url = req.path.replace(options.path,replacePath);
              }
          }
      3， 访问的方式 http://localhost:8081/api/aaaaa
          这个路径访问 呈现   Cannot GET /aaaaa.json   这个结果意思是 无法处理，但你会发现 路径变了
          变成   /aaaaa.json  了，也就是说 我们访问上面的端口时 变成这个路径了
          首先 我们要知道 我们 静态文件根目录这个 http://localhost:8081/  指向的是  build
          为什么是 build ,因为 是我们 自己制定的  contentBase:'./build' 服务器 打开的目录是 build
          因此 这个就是 文件 静态目录。  我们 只要在 build 文件夹 中建 aaaaa.json
          数据写  {"name":12,"age":25}  ,这时 我们再次 访问 http://localhost:8081/api/aaaaa
          会发现 得到了 数据  页面打印出  {"name":12,"age":25}。

      */
        {
            path:/\/api\/(.+)/,  // 指定用来匹配请求URL的正则（就是我要访问 的路径）
            // 将此请求转发给哪个服务器
            target:'http://localhost:8081', // 请求转发给谁 ，为什么转发给它，因为我们只有这一个服务，只能这样
            rewrite:rewriteUrl('\/$1\.json'),  //这是个函数， 转换路径，把原路径转成目标路径
            changeOrigin:true  // 修改来源路径（true）
        }
    ]
  },
  //配置模块,json形式
  module:{
    loaders:[ // 指定不同文件加载器，数组形式
        { //json
            // 点 需要 转移 \
            test:/\.js$/,   // 指定要处理那些文件,正则
            loader:'babel-loader'   // 指定加载器 , -loader 其实是可以省略的
        }

    ],
    //如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖
    noParse: [jqueryPath]
  }
}
