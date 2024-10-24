<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
      />
    </template>

    <template v-slot:title>
      {{ displayTaskName }}
    </template>

    <template v-slot:subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:timer>
      {{ duration }}
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      />
    </template>

    <template v-slot:tooltip-title>
      {{ displayTaskName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:title>
      {{ displayTaskName }}
    </template>

    <template v-slot:subtitle>
      {{ duration }}
    </template>
  </task-queue-preview-sm>
</template>

<script setup>

import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime.js';
import { computed } from 'vue';
import TaskQueuePreviewSm from '../../../_shared/components/task-preview/task-queue-preview-sm.vue';
import TaskQueuePreviewMd from '../../../_shared/components/task-preview/task-queue-preview-md.vue';
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

const lastMessage = computed(() => {
  const lastMessage = props.task.lastMessage;
  return lastMessage.file ? lastMessage.file.name : lastMessage.text;
})

const displayIcon = computed(() => messengerIcon(props.task.gateway.type));

const displayTaskName = computed(() => props.task.title);

const displayQueueName = computed(() => props.task.queue.name);

const duration = computed(() => {
  const sec = props.task.closedAt - props.task.startedAt;
  return prettifyTime(sec);
})

</script>

<style lang="scss" scoped>
</style>
