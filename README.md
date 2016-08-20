```
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //  自动产出html
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin'); //自动打开浏览器
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //css 文件单独加载
var webpack = require('webpack');
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
  entry:{  // 入口文件
        index:path.resolve(__dirname, 'src/index.js'),
        vendor: ['jquery'], // 把 jquery 文件 抽取出来，让它形成缓存
        a:path.resolve('src/a.js'),
        b: path.resolve('src/b.js')
  },
  //设置输出
  output:{
    path: path.resolve(__dirname, 'build'),// 设置输出目录
    filename: '[name].[hash].js' //输出动态文件名
  },

  // 如何解析不同后缀的文件
  resolve:{ // json
      // 自动补全后缀，注意第一个必须是空字符串，后缀一定以点开头
      extensions:['','.js','.css','.jsx','.json','.less'] ,// 指定文件扩展名,在引用是就不需要写全，自动补全
      alias:{ // 配置别名可以加快 webpack 查找模块的速度 ，可以是 json
        // 如果每当 引入 jquery 模块的时候，它会直接jqueryPath,二必须要从 node_modules文件夹中按模块的查找规则查找
          'jquery':jqueryPath
      }

  },
  // 指定 webpack-dev-server 的配置项
  devServer:{
    inline:true,  // 设置自动刷新
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
        },
        {
            test:/\.less$/,  // 如果是 less 文件如何加载
            //  ! 分割符，把不同的 loader 分割开
            loader:ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")  // 从右往左执行，先把 less =》 css =》 style
        },
        {
          test:/\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        {
          //  .(woff|woff2|ttf|svg|eot)  以点 woff 或者 woff2 或者 ttf 或者 svg 或者 eot 结尾的文件
          test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,  // 图标 如何加载，这些内容可以看 bootstrap 字体图标 有哪些后缀的图标
          // ?limit=8192 解释
          loader: 'url?limit=8192'        // 指定加载器，图标 用 url 加载， limit 指定图标加载的大小(8k 左右)
        },
        {
          test:/\.(png|jpg)$/,  // 以点 png 或者 jpg 结尾的文件
          loader:'url?limit=8192' //指定url加载器加载，加载器加载 不大于 8192，
          // 也就是说 小于 8k 以外联 形式存在
          // 大于 8k 时 变成 base64 ，DataURL -》 图片被转换成base64编码的字符串形式，并存储在URL中
        },
        {
          test:/jquery\.js$/, // 如果 遇到jquery.js 为结尾的 脚本
          loader:'expose?jQuery' // 就暴露 jQuery 这个 全局对象，也就是 挂在到了 window下来，
          //  访问  window.jQuery 能够得到 jquery 这个方法
          /*
            <script>
                console.log(window.jQuery)
            </script>
          */
        }

    ],
    //如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖
    noParse: [jqueryPath],

  },
  plugins: [
      new webpack.optimize.CommonsChunkPlugin('common.js'),
      new HtmlWebpackPlugin({
        title: 'zhufeng-react',//标题
        template: './src/index.html', //模板文件,从哪个文件 拷贝过来的
        filename:'./index.[hash].html' //产出后的文件名称，生成之后的一个文件
      }),
      new HtmlWebpackPlugin({
        title: 'zhufeng-react',//标题
        template: './src/a.html', //模板文件,从哪个文件 拷贝过来的
        filename:'./a.[hash].html',
        chunks:['a','common.[hash].js']
      }),
      new HtmlWebpackPlugin({
        title: 'zhufeng-react',//标题
        template: './src/b.html', //模板文件,从哪个文件 拷贝过来的
        filename:'./b.[hash].html',
        chunks:['b','common.[hash].js']
      }),
      new openBrowserWebpackPlugin({ url: 'http://localhost:8081' }), // 自动打开浏览器的地址是
      new ExtractTextPlugin("bundle.css"), // css 文件单独加载 配置的，它就能实现 index.html 中的 css ,用link 单独引用
      //从index中分离出来,不再包含在打包出来的index.js中,会成生一个zfvendor.js文件
      //让它形成缓存，如果没有这句话，vendor只是一个普通的入口文件而矣,有了此语句会把vendor中的模块
      // 上面那个 更好
      // new webpack.optimize.CommonsChunkPlugin('vendor', 'zfvendor.js'),
      new webpack.optimize.UglifyJsPlugin({
                  compress: {
                      warnings: false
                  }
              }),
              new webpack.optimize.MinChunkSizePlugin({
                  compress: {
                      warnings: false
                  }
              }),
              // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
              new webpack.optimize.DedupePlugin(),
              // 按引用频度来排序 ID，以便达到减少文件大小的效果
              new webpack.optimize.OccurenceOrderPlugin(),
              new webpack.optimize.AggressiveMergingPlugin({
                  minSizeReduce: 1.5,
                  moveToParents: true
      })
  ]
}

```
