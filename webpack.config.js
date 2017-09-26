var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')

var templatePath = path.resolve(__dirname, 'src/html/index.html')

var pages = [
  {
    name: 'page1',
    entryPath: './src/pages/app.js',
    title: '页面一',
  }, {
    name: 'page2',
    entryPath: './src/pages/app2.js',
    title: '页面二',
  }
]

var entrys = {}, pluginsHTML = []

entrys.vendors = ['vue', 'vuex']
pluginsHTML.push(new webpack.optimize.CommonsChunkPlugin({
  name: ['vendors'] // 增加'manifest'可以解决每次build引起的vendors包hask值变化的问题，但是会产生一个多余的manifest.js文件
}));

// 多页面应用编译html的方法
pages.forEach(item => {
  entrys[item.name] = item.entryPath
  pluginsHTML.push(new htmlWebpackPlugin({
    filename: item.name + '.html',
    template: templatePath,
    inject: 'body',
    title: item.title,
    chunks: [item.name, 'vendors']
  }))
})

module.exports = {
  // 配置页面入口js文件
  entry: entrys,
  // 配置打包输出相关
  output: {
    // 打包输出目录
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/', //process.env.NODE_ENV === 'development' ? '/dist/' : './',
    // 入口js的打包输出文件名
    filename: 'js/[name]-[hash:8].js',
    chunkFilename: 'js/[name]-[hash:8].js',
  },
  plugins: pluginsHTML,
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

// 解决 dev 和 build 的warning
process.noDeprecation = true

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
  // 控制是否输出 .map 文件
  // module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // 当环境为线上环境时为process.env.NODE_ENV设置值为development
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      beautify: true,
      comments: true,
      compress: {
        warnings: false,
        drop_console: true,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
