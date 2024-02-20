<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :queue-name="task.queue.name"
  >
    <template v-slot:icon>
      <wt-icon
        icon="call-ringing"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ task.displayName }}
    </template>

    <template v-slot:subtitle>
      {{ task.displayNumber }}
    </template>

    <template v-slot:timer>
      {{ wait }}
    </template>

    <template v-slot:quick-action>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        rounded
        size="md"
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
    :queue-name="task.queue.name"
  >
    <template v-slot:icon>
      <wt-icon
        icon="call-ringing"
        size="sm"
      ></wt-icon>
    </template>

    <template v-slot:tooltip-title>
      {{ task.displayName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ task.displayNumber }}
    </template>

    <template v-slot:title>
      {{ task.displayName }}
    </template>

    <template v-slot:subtitle>
      {{ wait }}
    </template>

    <template v-slot:actions>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        rounded
        size="sm"
        @click="emit('accept', task)"
      ></wt-rounded-action>
    </template>

    <template v-slot:footer>
      <manual-deadline-progress-bar
        :deadline="task.deadline"
      ></manual-deadline-progress-bar>
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
import { computed } from 'vue';
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
