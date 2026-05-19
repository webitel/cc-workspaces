<template>
  <wt-notifications-bar />
  <router-view />
</template>

<script>
import { computed, provide } from 'vue';
import { useStore } from 'vuex';
import { useUserinfoStore } from '../ui/modules/userinfo/userinfoStore.ts';

export default {
	name: 'TheApp',

	setup() {
		const store = useStore();
		const { showUserNotifications } = useUserinfoStore();
		// @author o.chorpita
		// Provide darkMode for ui-sdk components
		const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);
		provide('darkMode', darkMode);
		return {
			showUserNotifications,
		};
	},

	created() {
		this.setLanguage();
		// destroy does not execute on F5 as per answer below: https://my.webitel.com/browse/DEV-2144
		// https://stackoverflow.com/a/34443314/17748106

		// we have to listen to the window event:

		window.addEventListener('unload', () => {
			this.$store.dispatch('workspace/CLOSE_SESSION');
		});
	},
	mounted() {
		this.showUserNotifications();
	},

	methods: {
		setLanguage() {
			const lang = localStorage.getItem('lang');
			if (lang) this.$i18n.locale = lang;
			const fallbackLang = localStorage.getItem('fallbackLang');
			if (fallbackLang) this.$i18n.fallbackLocale = fallbackLang;
		},
	},
};
</script>

<style lang="scss"></style>
