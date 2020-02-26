process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'https://dev.webitel.com/api';
process.env.VUE_APP_AUTH_MODULE_URL = process.env.NODE_ENV === 'production' ? '/app/auth' : 'http://10.10.10.117:8081/auth';
// http://192.168.177.199/api
// http://10.10.10.8:1907
// http://10.10.10.25:1907

module.exports = {
  // publicPath: '',
  // lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/css/main.scss";
        `,
      },
    },
  },
  configureWebpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.devtool = 'source-map';
  },
};
