process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'https://dev.webitel.com/api';

process.env.VUE_APP_AUTH_MODULE_URL = process.env.NODE_ENV === 'production' ? '/app/auth' : 'https://dev.webitel.com/app/auth';
process.env.VUE_APP_ADMIN_URL = process.env.NODE_ENV === 'production' ? '/admin' : 'https://dev.webitel.com/admin';
process.env.VUE_APP_AGENT_URL = process.env.NODE_ENV === 'production' ? '/workspace' : 'https://dev.webitel.com/workspace';
process.env.VUE_APP_SUPERVISOR_URL = process.env.NODE_ENV === 'production' ? '/supervisor' : 'https://dev.webitel.com/supervisor';
process.env.VUE_APP_AUDIT_URL = process.env.NODE_ENV === 'production' ? '/audit' : 'https://dev.webitel.com/audit';
process.env.VUE_APP_HISTORY_URL = process.env.NODE_ENV === 'production' ? '/history' : 'https://dev.webitel.com/history';
process.env.VUE_APP_GRAFANA_URL = process.env.NODE_ENV === 'production' ? '/grafana' : 'https://dev.webitel.com/grafana';
process.env.VUE_APP_SETTINGS_URL = process.env.NODE_ENV === 'production' ? '/settings' : 'https://dev.webitel.com/settings';

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  publicPath: '/workspace',
  lintOnSave: false,
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
  chainWebpack: (config) => {
    // exclude sprites default building
    config.module.rule('svg').exclude.add(/^(.*sprites).*\.svg/);

    // use svg-sprite-loader to process icons sprite
    config.module.rule('svg-sprite').test(/^(.*sprites).*\.svg/)
      .use('svg-sprite-loader').loader('svg-sprite-loader').options({ symbolId: () => '' });
  },
};
