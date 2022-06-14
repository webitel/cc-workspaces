<template>
  <task-queue-preview-wrapper
    :task="task"
    :title="task.displayName"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        icon="task"
        color="task"
      ></wt-icon>
    </template>
    <template v-slot:body>
      {{ task.displayNumber }}
    </template>
    <template
      v-slot:actions
      v-if="task.allowAccept"
    >
      <wt-button color="task" @click="task.accept()">
        {{ $t('reusable.accept') }}
      </wt-button>
      <wt-button color="secondary" @click="task.decline()">
        {{ $t('reusable.decline') }}
      </wt-button>
    </template>
  </task-queue-preview-wrapper>
</template>

<script>
import TaskQueuePreviewWrapper from '../../shared/task-queue-preview-wrapper.vue';

export default {
  name: 'chat-queue-preview',
  components: { TaskQueuePreviewWrapper },
  props: {
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
