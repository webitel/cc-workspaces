<template>
  <wt-switcher
    v-tooltip="$t('header.dnd.tooltip')"
    :label="$t('header.dnd.label')"
    :model-value="isDnd"
    @update:model-value="toggleDnd"
  ></wt-switcher>
</template>

<script>
import { UserPresenceStatus } from '@webitel/ui-sdk/enums';
import { mapActions, mapState } from 'vuex';

export default {
	name: 'UserDndSwitcher',
	computed: {
		...mapState('features/status', {
			user: (state) => state.user,
		}),
		isDnd() {
			return !!this.user?.status?.[UserPresenceStatus.Dnd];
		},
	},
	methods: {
		...mapActions('features/status', {
			toggleDnd: 'TOGGLE_USER_DND',
		}),
	},
};
</script>

<style lang="scss" scoped>

</style>
