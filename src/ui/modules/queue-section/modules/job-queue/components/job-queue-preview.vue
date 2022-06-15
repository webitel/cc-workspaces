<template>
  <task-queue-preview
    :task="task"
    :title="task.displayName"
    :opened="opened"
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
      <wt-button
        color="task"
        @click.prevent="$emit('accept', task)"
        @keydown.enter.prevent="$emit('accept', task)"
      >
        {{ $t('reusable.accept') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click.prevent="$emit('decline', task)"
        @keydown.enter.prevent="$emit('decline', task)"
      >
        {{ $t('reusable.decline') }}
      </wt-button>
    </template>
  </task-queue-preview>
</template>

<script>
import taskPreviewMixin from '../../_shared/mixins/task-preview-mixin';

export default {
  name: 'chat-queue-preview',
  mixins: [taskPreviewMixin],
};
</script>

<style lang="scss" scoped>
</style>
