import { createRouter, createWebHistory } from 'vue-router';

import WebitelApplications
  from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import store from '../store';
import AgentWorkspace from '../../ui/components/the-agent-workspace.vue';
import FeedbackPage from '../../ui/modules/feedback-page/components/feedback-page.vue';
import NotFoundPage from '../../ui/components/not-found-page.vue';

const routes = [
  {
    path: '/',
    name: 'agent-ws',
    component: AgentWorkspace,
    meta: { appAccess: WebitelApplications.AGENT },
  },
  {
    path: '/feedback-page',
    name: 'feedback-page',
    component: FeedbackPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },
  routes,
});

const excludeRouteAuth = ['feedback-page', 'not-found'];

router.beforeEach((to, from, next) => {
  if (excludeRouteAuth.includes(to.name)) {
    next();
    return;
  }

  if (!localStorage.getItem('access-token') && !to.query.accessToken) {
    const desiredUrl = encodeURIComponent(window.location.href);
    const authUrl = import.meta.env.VITE_AUTH_URL;
    window.location.href = `${authUrl}?redirectTo=${desiredUrl}`;
    return;
  }
  if (to.query.accessToken) {
    // assume that access token was set from query before app initialization in main.js
    const newQuery = { ...to.query };
    delete newQuery.accessToken;
    return next({ ...to, query: newQuery });
  }

  const requiredApp = to.meta.appAccess;
  if (requiredApp) {
    const checkAppAccess = store.getters['ui/userinfo/CHECK_APP_ACCESS'];
    const hasAccess = checkAppAccess(requiredApp);

    if (!hasAccess) {
      return next({ name: 'not-found', query: { type: '403' } });
    }
  }

  next();
});

export default router;
