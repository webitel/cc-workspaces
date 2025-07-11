<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :class="[{ 'closed-queue-preview--processed': processed }]"
    :opened="opened"
    :queue-name="displayQueueName"
    class="closed-queue-preview"
    @click="$emit('click', task)"
  >

    <template #icon>
      <wt-icon-btn
        v-if="!processed"
        :size="size"
        class="closed-queue-preview__close"
        icon="close--filled"
        @click.stop="markChatAsProcessed"
      />
      <wt-icon
        :icon="displayIcon"
        :size="size"
        class="closed-queue-preview__provider"
      />
    </template>

    <template #title>
      {{ displayTaskName }}
    </template>

    <template #subtitle>
      {{ lastMessagePreview }}
    </template>

    <template #timer>
      {{ duration }}
    </template>

    <template #icon-status>
      <wt-icon
        :icon="closeReasonIcon"
        icon-prefix="ws"
        color="error"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :class="[{ 'closed-queue-preview--processed': processed }]"
    :opened="opened"
    :queue-name="displayQueueName"
    class="closed-queue-preview"
    @click="$emit('click', task)"
  >

    <template #icon>
      <wt-icon-btn
        v-if="!processed"
        :size="size"
        class="closed-queue-preview__close"
        icon="close--filled"
        @click.stop="markChatAsProcessed"
      />
      <wt-icon
        :icon="displayIcon"
        :size="size"
        class="closed-queue-preview__provider"
      />
    </template>

    <template #tooltip-title>
      {{ displayTaskName }}
    </template>

    <template #tooltip-subtitle>
      {{ lastMessagePreview }}
    </template>

    <template #title>
      {{ displayTaskName }}
    </template>

    <template #subtitle>
      {{ duration }}
    </template>

    <template #footer>
      <div class="closed-queue-preview__footer">
        <wt-icon
          :icon="closeReasonIcon"
          icon-prefix="ws"
          color="error"
        />
      </div>
    </template>

  </task-queue-preview-sm>
</template>

<script setup>

import { ComponentSize } from '@webitel/ui-sdk/enums';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { computed } from 'vue';
import { useStore } from 'vuex';

import ChatCloseReason
  from '../../../../../../../features/modules/chat/modules/closed/enums/ChatCloseReason.enum.js';
import TaskQueuePreviewMd from '../../../_shared/components/task-preview/task-queue-preview-md.vue';
import TaskQueuePreviewSm from '../../../_shared/components/task-preview/task-queue-preview-sm.vue';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';

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
    default: ComponentSize.MD,
  },
  processed: { // if false - chat will be in active queue tab, if true - in closed queue tab
    type: Boolean,
    default: false,
  },
});

const store = useStore();

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
      return 'agent-disconnection';

    case ChatCloseReason.CLIENT_LEAVE:
      return 'client-disconnection';

    default:
      return 'timeout-disconnection';
  }
});

const markChatAsProcessed = () => store.dispatch('features/chat/closed/MARK_AS_PROCESSED', props.task);

</script>

<style lang="scss" scoped>
.closed-queue-preview {
  &__footer {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .closed-queue-preview__close {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition);
  }

  .closed-queue-preview__provider {
    position: absolute; // for exactly the same placing as close icon
    opacity: 1;
    transition: var(--transition);
  }

  &--processed {
    // https://webitel.atlassian.net/browse/WTEL-5477?focusedCommentId=640209
    position: relative;
    z-index: var(--ws-tooltip-z-index);
    mix-blend-mode: luminosity;
  }

  &:not(&--processed):hover {
    .closed-queue-preview__close {
      opacity: 1;
      pointer-events: auto;
    }

    .closed-queue-preview__provider {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
