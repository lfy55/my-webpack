var path = require('path')
var webpack = require('webpack')

var configEntry = {
  'page1': './src/pages/app.js',
  'page2': './src/pages/app2.js',
};

/*
var pluginHTML = [];
configEntry.vendors = ['vue', 'vuex', './src/lib/juqery.js'];
pluginHTML.push(new webpack.optimize.CommonsChunkPlugin(
  name: ['vendors'] //'manifest'可以解决每次build引起的vendors包hask值变化的问题，但是会产生一个多余的manifest.js文件
));

// 多页面应用编译html的方法
pluginHTML.push(new htmlWebpackPlugin(
  filename: {name},
  template: {src},
  inject: 'position',
  title: {name}
  chunks: [name, vendors]
));
 */

module.exports = {
  // 配置页面入口js文件
  entry: configEntry,
  // 配置打包输出相关
  output: {
    // 打包输出目录
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    // 入口js的打包输出文件名
    filename: '[name]/entry.js'
  },
  // plugins: pluginHTML
  module: {
    /*
    配置各种类型文件的加载器, 称之为loader
    webpack当遇到import ... 时, 会调用这里配置的loader对引用的文件进行编译
    */
    rules: [
      // 使用vue-loader编译.vue文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      /*
        使用babel编译ES6/ES7/ES8为ES5代码
        使用正则表达式匹配后缀名为.js的文件
        */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        // 匹配.css文件
        test: /\.css$/,

        /*
        先使用css-loader处理, 返回的结果交给style-loader处理.
        css-loader将css内容存为js字符串, 并且会把background, @font-face等引用的图片,
        字体文件交给指定的loader打包, 类似上面的html-loader, 用什么loader同样在loaders对象中定义, 等会下面就会看到.
        */
        use: ['style-loader', 'css-loader']
      },
      {
        /*
        匹配各种格式的图片和字体文件
        上面html-loader会把html中<img>标签的图片解析出来, 文件名匹配到这里的test的正则表达式,
        css-loader引用的图片和字体同样会匹配到这里的test条件
        */
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,

        /*
        使用url-loader, 它接受一个limit参数, 单位为字节(byte)

        当文件体积小于limit时, url-loader把文件转为Data URI的格式内联到引用的地方
        当文件大于limit时, url-loader会调用file-loader, 把文件储存到输出目录, 并把引用的文件路径改写成输出后的路径

        比如 views/foo/index.html中
        <img src="smallpic.png">
        会被编译成
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAA...">

        而
        <img src="largepic.png">
        会被编译成
        <img src="/f78661bef717cf2cc2c2e5158f196384.png">
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: "images/[name].[hash:8].[ext]"
            }
          }
        ]
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },
  // 影响模块的解决方案
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '~': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
    // 可以在此处配置proxy解决跨域问题
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map'
}

console.log('环境--->', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  // 当环境为开发环境时为process.env.NODE_ENV设置值为development
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ])
} else if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // 当环境为线上环境时为process.env.NODE_ENV设置值为development
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
