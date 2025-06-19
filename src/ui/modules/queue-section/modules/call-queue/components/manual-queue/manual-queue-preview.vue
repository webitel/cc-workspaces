<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :queue-name="task.queue.name"
  >
    <template #icon>
      <wt-icon
        icon="call-ringing"
      />
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ task.displayNumber }}
    </template>

    <template #timer>
      {{ wait }}
    </template>

    <template #quick-action>
      <wt-rounded-action
        :loading="showLoader"
        color="success"
        icon="call--filled"
        rounded
        size="md"
        @click="accept"
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
    :queue-name="task.queue.name"
  >
    <template #icon>
      <wt-icon
        icon="call-ringing"
        size="sm"
      />
    </template>

    <template #tooltip-title>
      {{ task.displayName }}
    </template>

    <template #tooltip-subtitle>
      {{ task.displayNumber }}
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ wait }}
    </template>

    <template #actions>
      <wt-rounded-action
        :loading="showLoader"
        color="success"
        icon="call--filled"
        rounded
        size="sm"
        @click="accept"
      />
    </template>

    <template #footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      />
    </template>
  </task-queue-preview-sm>

  <div
    v-else
  >unknown task size
    <br>
    {{ task }}
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import ManualDeadlineProgressBar
  from '../../../../../../../features/modules/call/modules/manual/components/manual-deadline-progress-bar.vue';
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
const showLoader = ref(false);

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
