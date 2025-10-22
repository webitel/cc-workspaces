<template>
  <chat-queue-preview-md
    v-if="size === 'md'"
    :task="task"
    :status="ChatTypes.Manual"
    :opened="opened"
    @click="emit('click', task)"
  >
    <template #icon="{ iconColor }">
      <wt-icon
        :icon="displayIcon"
        :color="iconColor"
        size="md"
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
  </chat-queue-preview-md>

  <chat-queue-preview-sm
    v-else-if="size === 'sm'"
    :task="task"
    :opened="opened"
    :status="ChatTypes.Manual"
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
  </chat-queue-preview-sm>
</template>

<script setup>
import { computed, ref } from 'vue';

import ManualDeadlineProgressBar
  from '../../../../../../../features/modules/call/modules/manual/components/manual-deadline-progress-bar.vue';
import ChatQueuePreviewSm from '../chat-queue-preview-sm.vue';
import ChatQueuePreviewMd from '../chat-queue-preview-md.vue';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';
import { ChatTypes } from '../../enums/ChatStatus.enum';

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
