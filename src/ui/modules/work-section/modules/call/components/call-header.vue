<template>
  <task-header :size="props.size" :username="call?.contact ? displayName : undefined">
    <template #task-header-actions>
      <slot :name="CallTab.Contacts">
        <wt-button
          class="call-action"
          :variant="isOnContacts ? 'active' : 'outlined'"
          :size="size"
          icon="contacts"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Contacts)"
        />
      </slot>

      <slot :name="CallTab.History">
        <wt-button
          class="call-action"
          :variant="isOnHistory ? 'active' : 'outlined'"
          :size="size"
          icon="history"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.History)"
        />
      </slot>

      <slot :name="CallTab.Bridge">
        <wt-button
          v-if="isBridgeButtonVisible"
          class="call-action"
          :variant="isOnBridge ? 'active' : 'outlined'"
          :size="size"
          icon="call-add-to"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Bridge)"
        />
      </slot>

      <slot :name="CallTab.Transfer">
        <wt-button
          v-if="isTransferButtonVisible"
          class="call-action"
          :variant="isOnTransfer ? 'active' : 'outlined'"
          :size="size"
          icon="call-transfer--filled"
          color="transfer"
          rounded
          wide
          @click="emit('openTab', CallTab.Transfer)"
        />
      </slot>

      <slot name="chat">
        <wt-button
          v-if="isChatButtonVisible"
          class="call-action"
          :variant="isOnChat ? 'active' : 'outlined'"
          :disabled="!isCallChatExist"
          :size="size"
          :badge="videoCallChatUnseenBadge"
          badge-absolute-position
          badge-severity="warn"
          icon="chat"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', VideoCallTab.Chat)"
        />
      </slot>

      <slot name="hangup">
        <wt-button
          v-if="isHangupButtonVisible"
          variant="outlined"
          class="call-action"
          :size="size"
          icon="call-end--filled"
          color="error"
          rounded
          wide
          @click="hangup"
        />
      </slot>

      <slot name="call">
        <wt-button
          v-if="isCallButtonVisible"
          variant="outlined"
          class="call-action"
          :size="size"
          icon="call-ringing--filled"
          color="success"
          rounded
          wide
          :loading="loading"
          @click="makeCall"
        />
      </slot>
    </template>

    <template #info>
      <task-header-info
        v-if="call?.contact"
        :title="title"
        :queue-name="queueName"
        :username="displayName"
        :size="size"
        :phone-number="displayNumber"
      />
    </template>
  </task-header>
</template>

<script lang="ts" setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useLoader } from '../../../../../composables/useLoader';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import { useContactStore } from '../../../../info-section/modules/client-info/modules/contact/store/contact';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import TaskHeaderInfo from '../../_shared/components/task-header/task-header-info.vue';
import { CallTab } from '../enums/CallTab.enum';
import { VideoCallTab } from '../module/video-call/enums/VideoCallTab.enum';

const props = withDefaults(
	defineProps<{
		currentTab?: string;
		size?: ComponentSize;
	}>(),
	{
		currentTab: CallTab.Numpad,
		size: ComponentSize.MD,
	},
);

const emit = defineEmits<(e: 'openTab', value: string) => void>();

const store = useStore();
const contactStore = useContactStore();
const { contact } = storeToRefs(contactStore);
const { showLoader, runWithLoader } = useLoader();
const { t } = useI18n();

const callList = computed(() => store.state.features.call?.callList);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const isOnContacts = computed(() => props.currentTab === CallTab.Contacts);
const isOnHistory = computed(() => props.currentTab === CallTab.History);
const isOnBridge = computed(() => props.currentTab === CallTab.Bridge);
const isOnNumpad = computed(() => props.currentTab === CallTab.Numpad);
const isOnTransfer = computed(() => props.currentTab === CallTab.Transfer);
const isOnChat = computed(() => props.currentTab === VideoCallTab.Chat);
const isCall = computed(() => isNewCall.value && call.value?.newNumber);
const isVideoCall = computed(
	() => store.getters['features/call/videoCall/IS_VIDEO_CALL_ON_WORKSPACE'],
);

const isBridgeButtonVisible = computed(() => callList.value?.length > 1);
const isTransferButtonVisible = computed(
	() => call.value?.allowHangup && !isVideoCall.value,
);
const isChatButtonVisible = computed(() => isVideoCall.value);
const isHangupButtonVisible = computed(() => call.value?.allowHangup);
const isCallButtonVisible = computed(
	() => (isOnNumpad.value || isOnBridge.value) && isCall.value,
);
const videoCallChat = computed(
	() => store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'],
);
const videoCallChatMessages = computed(
	() => store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT_MESSAGES'],
);
const isCallChatExist = computed(() => !!videoCallChat.value);

const videoCallChatUnseenCount = computed(() =>
	store.getters['features/chat/unseen/UNSEEN_COUNT'](videoCallChat.value),
);
const videoCallChatUnseenBadge = computed(() =>
	videoCallChatUnseenCount.value
		? String(videoCallChatUnseenCount.value)
		: undefined,
);

/**
 * @author OleksandrPalonnyi
 *
 * the video-call chat's messages arrive by mutating the SDK Conversation
 * instance directly — there's no WS event to hook, so new messages are
 * detected the same way useChatScroll does: by watching message count
 *
 * [WTEL-8866](https://webitel.atlassian.net/browse/WTEL-8866)
 * */
watch(videoCallChatMessages, (messages, prevMessages) => {
	const isNewMessage = messages?.length - (prevMessages?.length ?? 0) === 1;
	if (!isNewMessage || isOnChat.value) return;

	const lastMessage = messages.at(-1);
	if (lastMessage?.member?.self) return;

	store.commit('features/chat/unseen/ADD_UNSEEN_CHAT', videoCallChat.value);
});

watch(isOnChat, (isActive) => {
	if (isActive) {
		store.dispatch('features/chat/unseen/MARK_CHAT_SEEN', videoCallChat.value);
	}
});

watch(videoCallChat, (chat, prevChat) => {
	if (!chat && prevChat) {
		store.commit('features/chat/unseen/REMOVE_UNSEEN_CHAT', prevChat);
	}
});

const queueName = computed(() => getQueueName(call.value));

//@author PolinaSukhorukova-webitel display queue nqme while consult call (https://webitel.atlassian.net/browse/WTEL-9399)
const displayName = computed(() => {
	if (isVideoCall.value && contact.value) return contact.value.name?.commonName;
	if (call.value?.isConsultToQueue && !call.value?.to)
		return call.value?.destination;
	return call.value?.displayName;
});

//@author PolinaSukhorukova-webitel don't display phone number while consult call (https://webitel.atlassian.net/browse/WTEL-9399)
const displayNumber = computed(() => {
	if (call.value?.isConsultToQueue && !call.value?.to) return '';
	return call.value?.displayNumber;
});

const loading = computed(() => showLoader(call.value?.newNumber));

const title = computed(
	() =>
		displayName.value ||
		t('workspaceSec.taskHeaderExpansionCard.unknownContact'),
);

const makeCall = () => {
	return runWithLoader(call.value?.newNumber, () =>
		store.dispatch('features/call/CALL'),
	);
};
const hangup = () => store.dispatch('features/call/HANGUP');

let hotkeyUnsubscribers: Array<() => void> = [];

const setupHotkeys = () => {
	hotkeyUnsubscribers = useHotkeys([
		{
			event: HotkeyAction.END,
			callback: hangup,
		},
	]);
};

onMounted(() => setupHotkeys());
onUnmounted(() =>
	hotkeyUnsubscribers.forEach((unsubscribe) => {
		unsubscribe();
	}),
);
</script>
