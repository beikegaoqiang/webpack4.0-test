// 路径模块：node内置的，不需下载，直接引用
let path = require("path");
// 插件都是类，开头都大写，进行new实例化使用
// 打包生成html模板：将打包后的js文件放在自定义模板html文件中，并且把此html模板文件放在打包的文件夹下。需下载。
let HtmlWebpackPlugin = require("html-webpack-plugin");
// 抽离stye内联样式表为link外部样式表：多次使用时，会把涉及到的sytle内联样式表抽离"合并到一个link"中。想抽离出多个Link外部样式表时，可在此多次let引入此插件
let MiniCcssExtractPlugin = require("mini-css-extract-plugin");
// 压缩所抽离出的css文件
let OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
// 当用此插件对抽离出的css文件进行压缩时，原先production模式下默认对js文件压缩就失效了，故此时需添加其他插件在优化项中实现对JS文件的压缩
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devServer: {
    port: 5000,
    progress: true, // 打包的进度条显示
    contentBase: "./newdist", // 静态服务的入口文件夹
    compress: true, // 压缩
  },
  // 打包后的文件模式：①开发模式:未压缩 ②生产模式:压缩后的
  mode: "production", // production
  // 打包的入口文件 （相对路径）
  entry: "./src/index.js",
  output: {
    filename: "bundle.[hash:8].js", // 打包后的文件名，添加8位的哈希戳（涉及缓存问题）。使新增打包文件，且每次打包后的文件名都不同，防止覆盖（当打包的各JS模块文件没有发生改变时，因哈希值不变，则打包后不会新增打包文件）  哈希值：内容唯一标识，内容变了，哈希值就改变。
    // 打包后的文件夹：路径必须是个绝对路径
    path: path.resolve(__dirname, "newdist"), // __dirname代表当前路径
  },
  // 开发服务器的配置。webapck内置开发服务器，通过express实现静态服务：打包时并不会真正去打包文件，而在内存中进行打包。则在开发过程中，即可通过npm run webpack-dev-server配合HtmlWebpackPlugin在本地Localhost中访问"打包后"的html模板文件，而不用真正打包，提高开发效率。

  // plugins插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 目标html模板文件名
      filename: "index.html", // 打包后的html模板文件名。注意不能取其他名字，否则静态服务识别不了入口html
      // 对html模板文件的打包操作（压缩）
      // minify: {
      //   removeAttributeQuotes: true, // 删除html模板文件中的双引号
      //   collapseWhitespace: true // 变成一行
      // },
      // hash: true // 给打包出来、在html模板文件中引入的含打包后的JS文件的路径中添加哈希戳（涉及缓存问题）
    }),
    // new MiniCcssExtractPlugin({
    //   filename: "main.css", // 抽离css模块文件生成的css文件的名字
    // }),
  ],
  // loader加载
  module: {
    // 规则
    rules: [
      // less-loader: 把less模块文件转换成css文件    注：除了加载器还要安装less   yarn add less less-loader -D
      // sass: yarn add node-sass sass-loader -D        stylus:  yarn add stylus stylus-loader -D
      // css-loader：解析css模块文件中的@import模块导入语法
      // style-loader：把各css模块文件中一一对应style内联样式表插入到html模板文件的head标签中
      //        loader需要安装
      //        loader的特点：功能专一，便于通过数组进行组合使用
      //        loader加载的顺序：默认从右向左，从下到上
      //        各loader还可以写成对象形式，进行传参等独特配置
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: "style-loader",
          //   // Loader参数
          //   options: {
          //     //???????????????无法识别insertAt
          //     insertAt: "top" // 将css模块文件形成的style内联样式插入到所有style内联样式的顶部（即插到html模板文件中自己定义的之前）
          //   }
          // },
          MiniCcssExtractPlugin.loader, // 将各css模块文件抽离为一个css文件（外部样式表），并在html模板文件中通过link引入
          "css-loader",
          "postcss-loader", // 解析css文件前的操作：如给抽离出来的css文件内的部分样式加上浏览器兼容前缀。？？？？为何没有mian.css中无前缀
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
  // 优化项
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 是否用缓存
        parallel: true, // 是否是并发打包的
        sourceMap: true, // 源码映射，便于调试：与ES6转化为ES5有关.(生产模式下不要有源码映射，所以一般不在此插件内开启)
      }),
      new OptimizeCssPlugin(),
    ],
  },
};
