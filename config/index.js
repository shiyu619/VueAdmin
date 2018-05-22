'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    host: 'localhost',
    port: 9528,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false,

    proxyTable: {
      '/travel/system': {
        // target: "http://xdlx.365daoyou.cn/travel/",
        target: "http://localhost:8361/",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          // '^/api':'https://map.365daoyou.cn/web',
          '/travel/system': '',
          //'^/api':'https://map.365daoyou.cn:80/web/'
        },
        rewrite: function (req) {
          console.log(req.url);
          req.url = req.url.replace(/^\/travel\/system/, '');
        }
      },
      '/travel': {
        // target: "http://xdlx.365daoyou.cn/travel/",
        target: "https://www.easy-mock.com/mock/5afe482ab719b77df03ae296/cms/",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          // '^/api':'https://map.365daoyou.cn/web',
          '^/travel': '',
          //'^/api':'https://map.365daoyou.cn:80/web/'
        },
        rewrite: function (req) {
          console.log(req.url);
          req.url = req.url.replace(/^\/travel/, '');
        }
      }
    },
    useEslint: true,
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    cacheBusting: true,
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
