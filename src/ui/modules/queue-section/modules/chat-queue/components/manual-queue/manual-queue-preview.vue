<template>
  <component
    :is="component"
    :task="task"
    :opened="opened"
    class="queue-preview--manual"
    @click="emit('click', task)"
  >
    <template
      v-slot:icon
      v-if="size === 'md'"
    >
      <wt-icon
        :icon="displayIcon"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-icon
        :icon="displayIcon"
        size="md"
      ></wt-icon>
    </template>
    <template v-slot:timer>
      <div class="queue-preview--manual__timer">
        {{ wait }}
      </div>
    </template>
    <template v-slot:title>
      {{ task.displayName }}
    </template>
    <template v-slot:body>
      {{ lastMessage }}
    </template>
    <template v-slot:footer>
      <wt-rounded-action
        :size="size"
        color="transfer"
        icon="chat-join"
        rounded
        @click="emit('accept', task)"
      ></wt-rounded-action>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      ></manual-deadline-progress-bar>
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import MessengerType from 'webitel-sdk/esm2015/enums/messenger-type.enum';
import ManualDeadlineProgressBar
  from '../../../../../../../features/modules/call/manual/components/manual-deadline-progress-bar.vue';
import TaskQueuePreviewMd from '../../../_shared/components/task-preview/task-queue-preview-md.vue';
import TaskQueuePreviewSm from '../../../_shared/components/task-preview/task-queue-preview-sm.vue';

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
});

const emit = defineEmits(['click', 'accept']);

const component = computed(() => {
  switch (props.size) {
    case 'md':
      return TaskQueuePreviewMd;
    case 'sm':
      return TaskQueuePreviewSm;
    default:
      return TaskQueuePreviewMd;
  }
});

const lastMessage = computed(() => {
  return props.task.message;
});

const displayIcon = computed(() => {
  const type = props.task.chat;
  switch (type) {
    case MessengerType.TELEGRAM:
      return 'messenger-telegram';
    case MessengerType.VIBER:
      return 'messenger-viber';
    case 'whatsapp':
      return 'messenger-whatsapp';
    case MessengerType.WEB_CHAT:
      return 'messenger-web-chat';
    case MessengerType.INSTAGRAM:
      return 'instagram';
    case 'facebook':
      return 'messenger-facebook';
    default:
      return type;
  }
});

const wait = computed(() => {
  const waitTime = props.task.wait;
  const minutes = Math.floor(waitTime / 60);
  let seconds = waitTime % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
});
</script>

<style lang="scss" scoped>
.queue-preview--manual {
  &.queue-preview--md {
    flex-direction: row;
  }

  &.queue-preview--sm {
    .wt-rounded-action {
      display: block;
      margin: auto;
    }
  }
}

.queue-preview--manual__timer {
  text-align: center;
}

.manual-deadline-progress-bar {
  margin-top: var(--spacing-xs);
}
</style>
