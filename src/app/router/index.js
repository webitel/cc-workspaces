import Auth from '@webitel/ui-sdk/src/modules/Userinfo/components/the-auth.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AgentWorkspace from '../../ui/components/the-agent-workspace.vue';

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/',
    name: 'agent-ws',
    component: AgentWorkspace,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // component: notFound
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access-token');
  if (!(to.fullPath === '/auth')) {
    if (!token) {
      next('/auth');
    }
  }
  next();
});

export default router;
