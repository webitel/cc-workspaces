<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="task.queue.name"
    @click="emit('click', task)"
  >
    <template #icon>
      <wt-icon
        :icon="displayIcon"
      />
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ lastMessage }}
    </template>

    <template #timer>
      {{ wait }}
    </template>

    <template #quick-action>
      <wt-rounded-action
        size="md"
        color="transfer"
        icon="chat-join"
        :loading="showLoader"
        rounded
        @click="accept(task)"
      />
    </template>

    <template #footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="task.queue.name"
    @click="emit('click', task)"
  >
    <template #icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      />
    </template>

    <template #tooltip-title>
      {{ task.displayName }}
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ wait }}
    </template>

    <template #actions>
      <wt-rounded-action
        size="md"
        color="transfer"
        icon="chat-join"
        :loading="showLoader"
        rounded
        @click="accept(task)"
      />
    </template>

    <template #footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      />
    </template>
  </task-queue-preview-sm>
</template>

<script setup>
import { computed, ref } from 'vue';

import ManualDeadlineProgressBar
  from '../../../../../../../features/modules/call/modules/manual/components/manual-deadline-progress-bar.vue';
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
    default: 'md',
  },
});

const emit = defineEmits(['click', 'accept']);
const showLoader = ref(false);

const lastMessage = computed(() => {
  return props.task.message;
});
const displayIcon = computed(() => {
  const type = props.task.chat;
  return messengerIcon(type);
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

function accept(task) {
  if (showLoader.value) return;

  showLoader.value = true;
  emit('accept', task);
  showLoader.value = false;
}
</script>

<style lang="scss" scoped>

</style>
