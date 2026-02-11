<template>
  <task-header
    :size="size"
  >
    <template #end-section>
      <wt-rounded-action
        v-show="isTransferAction"
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

    <queue-name-chip
      v-if="displayQueueName"
      :name="displayQueueName"
    />
  </task-header>
</template>

<script lang="ts" setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';

import QueueNameChip from '../../_shared/components/queue-name-chip/queue-name-chip.vue';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

interface ChatContact {
  id?: string | number;
  name?: string;
}

const props = withDefaults(
  defineProps<{
    size?: ComponentSize;
    chatContact?: ChatContact;
  }>(),
  {
    size: ComponentSize.MD,
    chatContact: {},
  },
);

const emit = defineEmits<{
  openTab: [string];
}>();


const store = useStore();

const chat = computed(() =>
  store.getters['features/chat/CHAT_ON_WORKSPACE'],
);

const isCloseAction = computed(() =>
  store.getters['features/chat/ALLOW_CHAT_CLOSE'],
);

const isTransferAction = computed(() =>
  store.getters['features/chat/ALLOW_CHAT_TRANSFER'],
);

const contactLink = computed(() =>
  store.getters['ui/infoSec/client/contact/CONTACT_LINK'],
);

const displayChatName = computed(() => {
  const currentChat = chat.value;

  if (props.chatContact?.id) return props.chatContact?.name;

  if (currentChat?.members?.length) {
    return currentChat.members.map((member: any) => member.name).join(', ');
  }

  if (currentChat?.title) return currentChat.title;

  return 'unknown';
});

const displayName = computed(() => chat.value?.displayName);
const displayNumber = computed(() => chat.value?.displayNumber);
const displayQueueName = computed(() => getQueueName(chat.value),);


const close = () => store.dispatch('features/chat/CLOSE');
const openTransferTab = () => { emit('openTab', 'transfer');};

let hotkeyUnsubscribers: Array<() => void> = []; ///??????

const setupHotkeys = () => {
  hotkeyUnsubscribers = useHotkeys([
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
  hotkeyUnsubscribers.forEach((unsubscribe) => unsubscribe());
});
</script>


<style scoped>
.chat-header-title {
  color: var(--text-main-color);
}

a:hover {
  text-decoration: underline;
}
</style>
