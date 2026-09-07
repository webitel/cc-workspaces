<template>
  <task-header :size="props.size" :avatar-title="avatarTitle">
    <template #task-header-actions>
      <wt-button
        v-show="isTransferAction"
        :variant="isOnTransfer ? 'active' : 'outlined'"
        :size="size"
        color="transfer"
        icon="chat-transfer--filled"
        rounded
        wide
        class="task-header__button"
        @click="openTransferTab"
      />
      <chat-header-close-action
        v-show="isCloseAction && isChatActive"
        :size="size"
        class="task-header__button"
        @click="close"
      />
    </template>
    <template #info>
    <task-header-info
     :contact-name="contactName"
     :contact-link="contactLink"
     :title="extraTitle"
     :queue-name="displayQueueName"
     :avatar-title="avatarTitle"
     :size="size"
    />
    </template>
  </task-header>
</template>

<script lang="ts" setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import getDisplayChatName from '../../../../../../features/modules/chat/scripts/getDisplayChatName';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import { useContactStore } from '../../../../info-section/modules/client-info/modules/contact/store/contact';
import { useUserinfoStore } from '../../../../userinfo/userinfoStore';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import TaskHeaderInfo from '../../_shared/components/task-header/task-header-info.vue';
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
const contactStore = useContactStore();

const { readOnlyContactLink } = contactStore;

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

const isChatActive = computed(
	() => store.getters['features/chat/IS_CHAT_ACTIVE'],
);

const userinfoStore = useUserinfoStore();
const { userId } = storeToRefs(userinfoStore);

const displayChatName = computed(() =>
	getDisplayChatName({
		chat: chat.value,
		contact: props.contact,
		userId: userId.value,
	}),
);

const contactName = computed(() => displayChatName.value.contactName);

const extraTitle = computed(() => {
	const { contactName, extraNames } = displayChatName.value;
	if (!extraNames) return '';
	if (!contactName) return extraNames;

	return `, ${extraNames}`;
});

const contactLink = computed(() => readOnlyContactLink(props.contact?.etag));

const avatarTitle = computed(
	() => props.contact?.name || displayChatName.value.fullName,
);

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

<style scoped>
.task-header__button {
	flex: 1 1 50%;
}
</style>
