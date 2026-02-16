<template>
  <lookup-item>
    <template #before>
      <wt-avatar
        :status="userStatus"
        :size="size"
        badge
      ></wt-avatar>
    </template>

    <template #title>
      {{ item.name || item.username }}
    </template>

    <template #subtitle>
      {{ item.extension }}
    </template>

    <template #after>
      <wt-rounded-action
        :size="size"
        :loading="showLoader"
        icon="call--filled"
        color="success"
        rounded
        @click="handleInput"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import AgentStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import parseUserStatus from '../../../../../../../features/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../../../features/modules/agent-status/statusUtils/UserStatus';
import lookupItemMixin from './mixins/lookupItemMixin';

export default {
	name: 'UserLookupItem',
	mixins: [
		lookupItemMixin,
		sizeMixin,
	],
	emits: [
		'input',
	],
	data: () => ({
		showLoader: false,
	}),
	computed: {
		// NOTE: this computed is needed to return user status by priority because user can have several statuses. See this task https://my.webitel.com/browse/WTEL-3798
		userStatus() {
			const status = parseUserStatus(this.item.presence);
			if (status[UserStatus.DND]) return AbstractUserStatus.DND;
			if (status[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
			if (
				(this.item.status === AgentStatus.OFFLINE || !this.item.status) &&
				(status[UserStatus.SIP] || status[UserStatus.WEB])
			) {
				return AbstractUserStatus.ACTIVE;
			}
			if (this.item.status === AgentStatus.ONLINE)
				return AbstractUserStatus.ONLINE;
			if (this.item.status === AgentStatus.PAUSE)
				return AbstractUserStatus.PAUSE;
			return AbstractUserStatus.OFFLINE;
		},
	},
	methods: {
		handleInput() {
			if (this.showLoader) return;

			this.showLoader = true;
			this.$emit('input', this.item);
			this.showLoader = false;
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
