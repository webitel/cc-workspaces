<template>
  <task-header :size="props.size">
    <template #start-section>
      <slot :name="CallTab.Contacts">
        <wt-rounded-action
          class="call-action"
          :active="isOnContacts"
          :size="size"
          icon="contacts"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Contacts)"
        />
      </slot>

      <slot :name="CallTab.History">
        <wt-rounded-action
          class="call-action"
          :active="isOnHistory"
          :size="size"
          icon="history"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.History)"
        />
      </slot>
    </template>

    <template #end-section>
      <slot :name="CallTab.Bridge">
        <wt-rounded-action
          v-if="isBridge"
          class="call-action"
          :active="isOnBridge"
          :size="size"
          icon="call-add-to"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Bridge)"
        />
      </slot>

      <slot :name="CallTab.Transfer">
        <wt-rounded-action
          v-if="isTransfer"
          class="call-action"
          :size="size"
          icon="call-transfer--filled"
          color="transfer"
          rounded
          wide
          @click="emit('openTab', CallTab.Transfer)"
        />
      </slot>

      <slot name="chat">
        <wt-rounded-action
          v-if="isDisplayChatButton"
          class="call-action"
          :active="isOnChat"
          :disabled="!isCallChatExist"
          :size="size"
          icon="chat"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', VideoCallTab.Chat)"
        />
      </slot>

      <slot name="hangup">
        <wt-rounded-action
          v-if="isHangup"
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
        <wt-rounded-action
          v-if="isDisplayCallButton"
          class="call-action"
          :size="size"
          icon="call-ringing--filled"
          color="success"
          rounded
          wide
          @click="makeCall"
        />
      </slot>
    </template>

    <template #info>
      <task-header-expansion-card
        v-if="call?.displayName"
        :username="call?.displayName"
        :phone-number="call?.displayNumber"
        :queue-name="queueName"
      />
    </template>
  </task-header>
</template>

<script lang="ts" setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import { CallTab } from '../enums/CallTab.enum';
import { VideoCallTab } from '../module/video-call/enums/VideoCallTab.enum';
import TaskHeaderExpansionCard from '../../_shared/components/task-header-expansion-card/task-header-expansion-card.vue';

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

const callList = computed(() => store.state.features.call?.callList);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const isOnContacts = computed(() => props.currentTab === CallTab.Contacts);
const isOnHistory = computed(() => props.currentTab === CallTab.History);
const isOnBridge = computed(() => props.currentTab === CallTab.Bridge);
const isOnNumpad = computed(() => props.currentTab === CallTab.Numpad);
const isOnChat = computed(() => props.currentTab === VideoCallTab.Chat);
const isBridge = computed(() => callList.value?.length > 1);

const isTransfer = computed(() => call.value?.allowHangup);
const isHangup = computed(() => call.value?.allowHangup);
const isCall = computed(() => isNewCall.value && call.value?.newNumber);
const isDisplayCallButton = computed(
	() => (isOnNumpad.value || isOnBridge.value) && isCall.value,
);

const isDisplayChatButton = computed(
	() => store.getters['features/call/videoCall/IS_VIDEO_CALL'],
);
const isCallChatExist = computed(
	() => !!store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'],
);

const queueName = computed(() => getQueueName(call.value));

const makeCall = () => store.dispatch('features/call/CALL');
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
onUnmounted(() => hotkeyUnsubscribers.forEach((unsubscribe) => unsubscribe()));
</script>

<style lang="scss" scoped>
</style>
