process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'https://dev.webitel.com/api';
process.env.VUE_APP_WSS_URL = process.env.NODE_ENV === 'production' ? '/ws' : 'wss://dev.webitel.com/ws';
process.env.VUE_APP_AUTH_MODULE_URL = process.env.NODE_ENV === 'production' ? '/app/auth' : 'https://dev.webitel.com/app/auth';

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
