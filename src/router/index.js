import Vue from 'vue';
import VueRouter from 'vue-router';
import OperatorWorkspace from '../components/operator-workspace/the-operator-workspace.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/workspace',
    name: 'operator-ws',
    component: OperatorWorkspace,
  },
  {
    path: '*',
    name: 'not-found',
    // component: notFound
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
