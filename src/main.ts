import './app/css/main.scss';

import deepmerge from 'deepmerge';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { setConfig as setApiServicesConfig } from '@webitel/api-services';
import { setConfig as setChatsServicesConfig } from '@webitel/ui-chats';
import { eventBus } from '@webitel/ui-sdk/scripts';

import { createUserAccessControl } from './app/composables/useUserAccessControl';
import i18n from './app/locale/i18n';
import BreakpointPlugin from './app/plugins/breakpoint.plugin';
import { plugin as WebitelUi, options as WebitelUiOptions } from './app/plugins/webitel/ui-sdk';
import { initRouter, router } from './app/router';
import store from './app/store';
import './app/assets/icons/sprite';
import App from './app/the-app.vue';
import { useUserinfoStore } from './ui/modules/userinfo/userinfoStore';

const setTokenFromUrl = () => {
	try {
		const queryMap: {
			accessToken?: string;
		} = window.location.search
			.slice(1)
			.split('&')
			.reduce((obj, query) => {
				const [key, value] = query.split('=');
				obj[key] = value;
				return obj;
			}, {});

		if (queryMap.accessToken) {
			localStorage.setItem('access-token', queryMap.accessToken);
		}
	} catch (err) {
		console.error('Error restoring token from url', err);
	}
};

const fetchConfig = async () => {
  const electronConfig = window._config || {}; // Electron sets config to window
  const fileResponse = await fetch(`${import.meta.env.BASE_URL}/config.json`);
  const fileConfig = (await fileResponse.json()) || {};
  const apiResponse = async () => {
    try {
      const response = await fetch('/api/user/settings/phone', {
        headers: {
          'X-Webitel-Access': localStorage.getItem('access-token') || '',
        },
      });
      const body = await response.json();
      return {
        CLI: {
          registerWebDevice: body.webrtc,
          stun: body.stun,
        },
      };
    } catch (error) {
      return {};
    }
  };
  return deepmerge(fileConfig, await apiResponse(), electronConfig);
};

setApiServicesConfig({
  eventBus,
});
setChatsServicesConfig({
  i18n,
});

const pinia = createPinia();

const initApp = async () => {
  const app = createApp(App)
    .use(i18n)
    .use(pinia)
    .use(store)
    .use(BreakpointPlugin);

  const { initialize, routeAccessGuard } = useUserinfoStore();
  try {
    await initialize();
    createUserAccessControl(useUserinfoStore);
    await initRouter({
      beforeEach: [routeAccessGuard],
    });
  } catch (err) {
    console.error('Error initializing app', err);
  }


  app.use(router);
  app.use(WebitelUi, {
    ...WebitelUiOptions,
    router,
  }); // setup webitel ui after router init

  return app;
};

// init IIFE
(async () => {
  let config;
  try {
    setTokenFromUrl();
    config = await fetchConfig();
    await store.dispatch('SET_CONFIG', config);
    localStorage.setItem('CONFIG', JSON.stringify(config));
    await store.dispatch('features/notifications/LOAD_NOTIFICATION_SETTINGS');
  } finally {
    const app = await initApp();
    app.provide('$config', config);
    app.mount('#app');
  }
})();
