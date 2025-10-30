import { createRouter, createWebHistory } from 'vue-router';
import { eventBus } from '@webitel/ui-sdk/scripts';
import i18n from '../locale/i18n'
import { nextTick } from 'vue';

import AgentWorkspace from '../../ui/components/the-agent-workspace.vue';
import FeedbackPage from '../../ui/modules/feedback-page/components/feedback-page.vue';

const routes = [
  {
    path: '/',
    name: 'agent-ws',
    component: AgentWorkspace,
  },
  {
    path: '/feedback-page',
    name: 'feedback-page',
    component: FeedbackPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // component: notFound
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },
  routes,
});

const excludeRouteAuth = ['feedback-page'];

router.beforeEach((to, from, next) => {
  if (excludeRouteAuth.includes(to.name)) {
    next();
    return;
  }

  if (!localStorage.getItem('access-token') && !to.query.accessToken) {
    const desiredUrl = encodeURIComponent(window.location.href);
    const authUrl = import.meta.env.VITE_AUTH_URL;
    window.location.href = `${authUrl}?redirectTo=${desiredUrl}`;
  } else if (to.query.accessToken) {
    // assume that access token was set from query before app initialization in main.js
    const newQuery = { ...to.query };
    delete newQuery.accessToken;
    next({ ...to, query: newQuery });
  } else {
    next();
  }
});

router.afterEach(async () => {
  const passwordExpirationDays = localStorage.getItem('passwordExpirationDays');

  await nextTick();

  if (passwordExpirationDays) {
    const { t } = i18n.global;
    eventBus.$emit('notification', {
      type: 'info',
      text: t('systemNotifications.info.passwordExpirationMessage', { days: passwordExpirationDays }),
    });

    setTimeout(() => {
      localStorage.removeItem('passwordExpirationDays')
    }, 5000);
  }
});

export default router;
