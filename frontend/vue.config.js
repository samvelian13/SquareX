const path = require('path')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL
      }
    }
  },
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
