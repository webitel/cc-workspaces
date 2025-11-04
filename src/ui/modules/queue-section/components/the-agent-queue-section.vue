<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';
import { ComponentSize } from '@webitel/ui-sdk/enums';

import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import HotkeyAction from '../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../hotkeys/useHotkeys';
import CallQueue from '../modules/call-queue/components/the-agent-call-queue.vue';
import ChatQueue from '../modules/chat-queue/components/the-agent-chat-queue.vue';
import JobQueue from '../modules/job-queue/components/the-agent-job-queue.vue';
import isIncomingRinging from '../../../../features/modules/call/scripts/isIncomingRinging.js';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  size: {
    type: ComponentSize,
    default: ComponentSize.MD,
  },
});

const emit = defineEmits(['resize']);

const store = useStore();
const currentTab = ref({});
const hotkeyUnsubscribers = ref([]);
const chatMessagesLengthMap = ref({});

const callList = computed(() => store.state.features?.call?.callList || []);
const manualCallsList = computed(() => store.state.features?.call?.manual?.manualList || []);
const chatList = computed(() => store.state.features?.chat?.chatList || []);
const manualChatList = computed(() => store.state.features?.chat?.manual?.manualList || []);
const jobList = computed(() => store.state.features?.job?.jobList || []);

const isCallWorkspace = computed(() => store.getters['workspace/IS_CALL_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);

const isActiveCall = (call) => {
  const isActiveState = [CallActions.Active, CallActions.Hold].includes(call.state);
  const isOutgoingRinging = call.state === CallActions.Ringing && !isIncomingRinging(call);
  return isActiveState || isOutgoingRinging;
};

const countActiveCalls = (calls = []) =>
  calls.filter(isActiveCall).length;

const countIncomingRingingCalls = (calls = []) =>
  calls.filter(isIncomingRinging).length;

const countByStates = (list = [], states = []) =>
  list.filter((item) => states.includes(item.state)).length;

const activeCallCount = computed(() => countActiveCalls(callList.value));
const incomingCallCount = computed(
  () => countIncomingRingingCalls(callList.value) + (manualCallsList.value?.length ?? 0),
);

const activeChatCount = computed(() => countByStates(chatList.value, [ConversationState.Active]));
const incomingChatCount = computed(
  () => countByStates(chatList.value, [ConversationState.Invite]) + (manualChatList.value?.length ?? 0),
);

const activeJobCount = computed(() =>
  countByStates(jobList.value, [JobState.Bridged, JobState.Processing]),
);
const incomingJobCount = computed(() =>
  countByStates(jobList.value, [JobState.Distribute, JobState.Offering]),
);

const hasNewChatMessages = computed(() => {
  const chats = chatList.value ?? [];
  let hasNewMessage = false;
  const nextState = { ...chatMessagesLengthMap.value };

  chats.forEach((chat) => {
    const id = chat.id;
    const messageLength = chat.messages ? chat.messages.length : 0;
    const prevLength = chatMessagesLengthMap.value[id] ?? messageLength;
    if (messageLength > prevLength) {
      hasNewMessage = store.getters['features/chat/CHAT_ON_WORKSPACE']?.id !== id;
    }

    nextState[id] = messageLength;
  });

  chatMessagesLengthMap.value = nextState;

  return hasNewMessage;
});

const tabs = computed(() => [
  {
    value: 'call',
    icon: 'call',
    iconColor: 'success',
    countActive: activeCallCount.value,
    component: CallQueue,
    showIndicator: !!incomingCallCount.value,
  },
  {
    value: 'chat',
    icon: 'chat',
    iconColor: 'chat',
    countActive: activeChatCount.value,
    component: ChatQueue,
    showIndicator: !!incomingChatCount.value || hasNewChatMessages.value,
  },
  {
    value: 'job',
    icon: 'job',
    iconColor: 'job',
    countActive: activeJobCount.value,
    component: JobQueue,
    showIndicator: !!incomingJobCount.value,
  },
]);

const isNewCallButton = computed(() => !isNewCall.value || !isCallWorkspace.value);

const openNewCall = () => store.dispatch('features/call/OPEN_NEW_CALL');
const closeNewCall = () => store.dispatch('features/call/CLOSE_NEW_CALL');

const toggleNewCall = () => isNewCallButton.value ? openNewCall() : closeNewCall();

const setupHotkeys = () => {
  const subscribers = [
    {
      event: HotkeyAction.NEW_CALL,
      callback: toggleNewCall,
    },
  ];
  hotkeyUnsubscribers.value = useHotkeys(subscribers);
};

onMounted(() => {
  currentTab.value = tabs.value[0];
  setupHotkeys();
});

onUnmounted(() => {
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});
</script>
