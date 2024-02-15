<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="task.queue.name"
    @click="emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ task.displayName }}
    </template>

    <template v-slot:subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:timer>
      {{ wait }}
    </template>

    <template v-slot:quick-action>
      <wt-rounded-action
        size="md"
        color="transfer"
        icon="chat-join"
        rounded
        @click="emit('accept', task)"
      ></wt-rounded-action>
    </template>

    <template v-slot:footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      ></manual-deadline-progress-bar>
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="task.queue.name"
    @click="emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      ></wt-icon>
    </template>

    <template v-slot:tooltip-title>
      {{ task.displayName }}
    </template>

    <template v-slot:title>
      {{ task.displayName }}
    </template>

    <template v-slot:subtitle>
      {{ wait }}
    </template>

    <template v-slot:actions>
      <wt-rounded-action
        size="md"
        color="transfer"
        icon="chat-join"
        rounded
        @click="emit('accept', task)"
      ></wt-rounded-action>
    </template>

    <template v-slot:footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      ></manual-deadline-progress-bar>
    </template>
  </task-queue-preview-sm>
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

</style>
