<template>
  <task-header
    :size="size"
    :username="displayChatName"
  >
    <template #after-avatar>
      <wt-rounded-action
        v-show="isTransferAction"
        :size="size"
        color="transfer"
        icon="chat-transfer--filled"
        rounded
        wide
        @click="openTab"
      />
      <chat-header-close-action
        v-show="isCloseAction"
        :size="size"
        @click="close"
      />
    </template>
    <template #title>
      <a
        v-if="chatContact?.id"
        :href="contactLink(chatContact.id)"
        class="chat-header-title"
        target="_blank"
      >
        {{ chatContact.name }}
      </a>
      <span v-else>
        {{ displayChatName }}
      </span>
    </template>

    <template v-if="displayQueueName" #queue>
      <queue-name-chip :name="displayQueueName" />
    </template>
  </task-header>
</template>

<script>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { mapActions, mapGetters } from 'vuex';

import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName.js';
import QueueNameChip from '../../_shared/components/queue-name-chip/queue-name-chip.vue';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

export default {
	name: 'ChatHeader',
	components: {
		QueueNameChip,
		TaskHeader,
		ChatHeaderCloseAction,
	},
	props: {
		size: {
			type: String,
			default: ComponentSize.MD,
		},
		chatContact: {
			type: Object,
			default: () => ({}),
		},
	},
	data: () => ({
		hotkeyUnsubscribers: [],
	}),
	computed: {
		...mapGetters('features/chat', {
			chat: 'CHAT_ON_WORKSPACE',
			isCloseAction: 'ALLOW_CHAT_CLOSE',
			isTransferAction: 'ALLOW_CHAT_TRANSFER',
		}),
		...mapGetters('ui/infoSec/client/contact', {
			contactLink: 'CONTACT_LINK',
		}),
		displayChatName() {
			const chat = this.chat || this.task;

			if (this.chatContact?.id) return this.chatContact.name;

			if (chat?.members?.length) {
				return chat?.members?.map((member) => member.name).join(', ');
			}

			if (chat?.title) return chat.title;

			return 'unknown';
		},
		displayName() {
			return (this.task || this.call)?.displayName;
		},
		displayNumber() {
			return (this.task || this.call)?.displayNumber;
		},
		displayQueueName() {
			return getQueueName(this.chat);
		},
	},
	methods: {
		...mapActions('features/chat', {
			close: 'CLOSE',
		}),
		openTab() {
			this.$emit('openTab', 'transfer');
		},
		setupHotkeys() {
			const subscripers = [
				{
					event: HotkeyAction.END,
					callback: this.close,
				},
				{
					event: HotkeyAction.TRANSFER,
					callback: () => {
						if (this.isTransferAction) this.openTab();
					},
				},
			];
			this.hotkeyUnsubscribers = useHotkeys(subscripers);
		},
	},
	mounted() {
		this.setupHotkeys();
	},
	unmounted() {
		this.hotkeyUnsubscribers.forEach((unsubscribe) => unsubscribe());
	},
};
</script>

<style lang="scss" scoped>
.chat-header-title {
  color: var(--text-main-color);
}

a:hover {
  text-decoration: underline;
}

.task-header {
  margin-bottom: var(--spacing-xs);
}
</style>
