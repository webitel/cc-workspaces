<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    class="closed-queue-preview"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <div
        v-if="props.notProcessed && showRemoveIcon"
        @mouseleave="mouseMove"
        @click.stop="markChatAsProcessed"
      >
        <wt-icon
          icon="close--filled"
        />
      </div>
      <div
        v-else
        @mouseenter="mouseMove"
      >
        <wt-icon
          :icon="displayIcon"
        />
      </div>
    </template>

    <template v-slot:title>
      {{ displayTaskName }}
    </template>

    <template v-slot:subtitle>
      {{ lastMessagePreview }}
    </template>

    <template v-slot:timer>
      {{ duration }}
    </template>

    <template v-slot:icon-status>
      <wt-icon
        :icon="closeReasonIcon"
        color="error"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <div
        v-if="props.notProcessed && showRemoveIcon"
        @mouseleave="mouseMove"
        @click.stop="markChatAsProcessed"
      >
        <wt-icon
          icon="close--filled"
          :size="size"
        />
      </div>
      <div
        v-else
        @mouseenter="mouseMove"
      >
        <wt-icon
          :icon="displayIcon"
          :size="size"
        />
      </div>
    </template>

    <template v-slot:tooltip-title>
      {{ displayTaskName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ lastMessagePreview }}
    </template>

    <template v-slot:title>
      {{ displayTaskName }}
    </template>

    <template v-slot:subtitle>
      {{ duration }}
    </template>

    <template v-slot:footer>
      <div class="closed-queue-preview__footer">
        <wt-icon
          :icon="closeReasonIcon"
          color="error"
        />
      </div>
    </template>

  </task-queue-preview-sm>
</template>

<script setup>

import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ChatCloseReason
  from '../../../../../../../features/modules/chat/modules/closed/enums/ChatCloseReason.enum.js';
import TaskQueuePreviewSm from '../../../_shared/components/task-preview/task-queue-preview-sm.vue';
import TaskQueuePreviewMd from '../../../_shared/components/task-preview/task-queue-preview-md.vue';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  notProcessed: {
    type: Boolean,
    default: false
  }
});

const store = useStore();

const showRemoveIcon = ref(false);

const displayIcon = computed(() => messengerIcon(props.task.gateway?.type));
const displayTaskName = computed(() => props.task.title);
const displayQueueName = computed(() => props.task.queue?.name);

const duration = computed(() => {
  const sec = (props.task.closedAt - props.task.startedAt) / 10 ** 3;
  return convertDuration(sec);
});

const lastMessagePreview = computed(() => {
  const lastMessage = props.task.lastMessage || {};
  return lastMessage.file ? lastMessage.file.name : lastMessage.text;
});

const closeReasonIcon = computed(() => {
  switch (props.task.closeReason) {

    case ChatCloseReason.AGENT_LEAVE:
    case ChatCloseReason.TRANSFER:
      return 'wt-agent-disconnection';

    case ChatCloseReason.CLIENT_LEAVE:
      return 'wt-client-disconnection';

    default:
      return 'wt-timeout-disconnection';
  }
});

const mouseMove = () => {
  if (props.notProcessed) showRemoveIcon.value = !showRemoveIcon.value;
}

const markChatAsProcessed = async () => await store.dispatch('features/chat/closed/MARK_AS_PROCESSED', { chatId: props.task.id });

</script>

<style lang="scss" scoped>
.closed-queue-preview__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
