<template>
  <task-header :size="props.size">
    <template #end-section>
      <wt-button
        v-show="isTransferAction"
				:variant="isOnTransfer ? 'active' : 'outlined'"
        :size="size"
        color="transfer"
        icon="chat-transfer--filled"
        rounded
        wide
        @click="openTransferTab"
      />
      <chat-header-close-action
        v-show="isCloseAction"
        :size="size"
        @click="close"
      />
    </template>
    <template #info>
      <task-header-expansion-card
        :username="displayChatName"
        :phone-number="displayNumber"
        :is-title-linked="!isChatTransferred"
        :contact-id="props.contact?.id"
        :queue-name="displayQueueName"
      />
    </template>
  </task-header>
</template>

<script lang="ts" setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import getDisplayChatName from '../../../../../../features/modules/chat/scripts/getDisplayChatName';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import TaskHeaderExpansionCard from '../../_shared/components/task-header-expansion-card/task-header-expansion-card.vue';
import { ChatContact } from '../../_shared/types/ChatContact.types';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		contact?: ChatContact;
		currentTab: string;
	}>(),
	{
		size: ComponentSize.MD,
		contact: () => ({}) as ChatContact,
	},
);

const emit = defineEmits<{
	openTab: [
		string,
	];
}>();

const store = useStore();

const hotkeyUnsubscribers = ref([]);

const isOnTransfer = computed(
	() => props.currentTab === 'chat-transfer-container',
);
const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
const isCloseAction = computed(
	() => store.getters['features/chat/ALLOW_CHAT_CLOSE'],
);
const isTransferAction = computed(
	() => store.getters['features/chat/ALLOW_CHAT_TRANSFER'],
);
const displayChatName = computed(() =>
	getDisplayChatName({
		chat: chat.value,
		contact: props.contact,
	}),
);

const isChatTransferred = computed(() => chat.value?.members?.length);

const displayNumber = computed(() => chat.value?.displayNumber);
const displayQueueName = computed(() => getQueueName(chat.value));

const close = () => store.dispatch('features/chat/CLOSE');
const openTransferTab = () => {
	emit('openTab', 'transfer');
};

const setupHotkeys = () => {
	hotkeyUnsubscribers.value = useHotkeys([
		{
			event: HotkeyAction.END,
			callback: close,
		},
		{
			event: HotkeyAction.TRANSFER,
			callback: () => {
				if (isTransferAction.value) openTransferTab();
			},
		},
	]);
};

onMounted(setupHotkeys);

onUnmounted(() => {
	hotkeyUnsubscribers.value?.forEach((unsubscribe) => {
		unsubscribe();
	});
});
</script>
