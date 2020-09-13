// 路径模块：node内置的，不需下载，直接引用
let path = require("path");
// 插件都是类，开头都大写，进行new实例化使用
// 打包生成html模板：将打包后的js文件放在自定义模板html文件中，并且把此html模板文件放在打包的文件夹下。需下载。
let HtmlWebpackPlugin = require("html-webpack-plugin");
// 打包各css模块文件为一个css文件：1.多次使用时，会把多个css模块文件打包到一个css文件中。2. 想打包出多个Link外部样式表时，可在此多次let引入此插件。
let MiniCcssExtractPlugin = require("mini-css-extract-plugin");
// 压缩抽离出的css文件
let OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
// 当用此插件对打包出的css文件进行压缩时，原先在production模式下默认对打包生成的js文件压缩就失效了，故此时需添加其他插件在优化项中实现对JS文件的压缩
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// 通过"webpack"插件在每个JS模块中注入$对象
let webpack = require("webpack");

module.exports = {
  // 开发服务器的配置。webapck内置开发服务器，通过express实现静态服务：打包时并不会真正去打包文件，而在内存中进行打包。则在开发过程中，即可通过npm run webpack-dev-server配合HtmlWebpackPlugin在本地Localhost中访问"打包后"的html模板文件，而不用真正打包，提高开发效率。
  devServer: {
    port: 5000, // 需下载webpack-dev-server
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

  // plugins插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 目标html模板文件名
      filename: "index.html", // 打包后的html模板文件名。注意不能取其他名字，否则静态服务识别不了入口html
      // 对html模板文件的打包操作（压缩）
      minify: {
        removeAttributeQuotes: true, // 删除html模板文件中的双引号
        collapseWhitespace: true, // 变成一行
      },
      hash: true, // 给打包出来、在html模板文件中引入的含打包后的JS文件的路径中添加哈希戳（涉及缓存问题）
    }),
    new MiniCcssExtractPlugin({
      filename: "main.css", // 抽离css模块文件生成的css文件的名字
    }),
    new webpack.ProvidePlugin({
      // 暴露全局变量方式三：在各个JS模块下主动注入变量$，不再需模块化引入(import)。
      $: "jquery",
    }),
  ],
  // 如果模块导入了jquery，在打包时就忽略它
  // externals: {
  //   jquery: "$"
  // },

  // loader加载
  module: {
    // 规则
    rules: [
      // {
      //   // 暴露全局变量的方式二：在webpack.config.js中去配置expose-loader
      //   test: require.resolve("jquery"), //匹配到模块化引入jquery，使用expose-loader传参指代并暴露给window
      //   use: "expose-loader?$"
      // },
      // {

      //   test: /\.js$/,
      //   use: {
      //     loader: "eslint-loader",
      //     options: {
      //       enforce: "pre" // loader默认是从下到上执行的，所以需注意test相同匹配时的loader的顺序。也可在如此设置pre/post强制在之前(previous)执行
      //     }
      //   }
      // },
      // {
      //   test: /\.html$/,
      //   use: "html-withimg-loader"
      // },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: "style-loader",
          //   // Loader参数
          //   options: {
          //     // ？？？？？问一：无法识别insertAt
          //     insertAt: "top" // 将css模块文件形成的style内联样式插入到所有style内联样式的顶部（即插到html模板文件中自己定义的之前）
          //   }
          // },
          MiniCcssExtractPlugin.loader, // 将各css模块文件抽离为一个css文件（外部样式表），并在html模板文件中通过link引入
          "css-loader",
          "postcss-loader", // 解析css文件前的操作：如给抽离出来的css文件内的部分样式加上浏览器兼容前缀。？？？？为何没生效，mian.css中的transition中无浏览器前缀
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 此处未对less文件使用插件进行css压缩，所以less文件最终会以style内联样式表的形式存在于打包后的html模板文件汇总
          {
            loader: "style-loader",
          },
          "css-loader",
          "less-loader",
        ],
      },
      {
        // babel配置
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          // ES6→ES5
          options: {
            // 预设插件库集合
            presets: [
              "@babel/preset-env", // 其中包含ES6→ES5的模块
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-transform-runtime",
            ], // ES7→ES5
          },
        },
        exclude: /node_modules/, // 排除不识别的文件夹
        include: path.resolve(__dirname, "src"), // 设置识别的文件夹
      },
    ],
  },
  // 优化项：对生产环境有效
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 是否用缓存
        parallel: true, // 是否是并发打包的
        sourceMap: true, // 源码映射，便于调试：与ES6转化为ES5有关
      }),
      new OptimizeCssPlugin(), // 压缩打包后的css文件(main.css)
    ],
  },
};
