import { WtApplication } from '@webitel/ui-sdk/enums';
import { createRouter, createWebHistory } from 'vue-router';

const AgentWorkspace = () =>
	import('../../ui/components/the-agent-workspace.vue');
const FeedbackPage = () =>
	import('../../ui/modules/feedback-page/components/feedback-page.vue');
const ErrorPage = () => import('../../ui/components/error-page.vue');

const routes = [
	{
		path: '/',
		name: 'agent-ws',
		component: AgentWorkspace,
		meta: {
			WtApplication: WtApplication.Agent,
		},
	},
	{
		path: '/feedback-page',
		name: 'feedback-page',
		component: FeedbackPage,
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'error-page',
		component: ErrorPage,
	},
];

export let router = null;

export const initRouter = async ({ beforeEach = [], afterEach = [] } = {}) => {
	router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),

		scrollBehavior(to, from, savedPosition) {
			return {
				left: 0,
				top: 0,
			};
		},
		routes,
	});

	const excludeRouteAuth = [
		'feedback-page',
		'error-page',
	];

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
			const newQuery = {
				...to.query,
			};
			delete newQuery.accessToken;
			return next({
				...to,
				query: newQuery,
			});
		}

		next();
	});

	beforeEach.forEach((guard) => {
		router.beforeEach(guard);
	});

	afterEach.forEach((guard) => {
		router.afterEach(guard);
	});

	return router;
};
