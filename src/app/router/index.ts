import { WtApplication } from '@webitel/ui-sdk/enums';
import { createRouter, createWebHistory } from 'vue-router';
import { createAuthGuard } from './authGuard';

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

export const initRouter = async ({
	beforeEach = [],
	onUnauthorized = () => {},
} = {}) => {
	router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),

		scrollBehavior() {
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

	const authGuard = createAuthGuard({
		onUnauthorized,
	});

	router.beforeEach((to, from, next) => {
		if (excludeRouteAuth.includes(to.name)) {
			next();
			return;
		}
		authGuard(to, from, next);
	});

	beforeEach.forEach((guard) => {
		router.beforeEach(guard);
	});

	return router;
};
