<template>
  <task-queue-preview
    :task="task"
    :title="task.displayName"
    :opened="opened"
    :size="size"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        icon="job"
        color="job"
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
        color="job"
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
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../_shared/mixins/task-preview-mixin';

export default {
  name: 'chat-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
};
</script>

<style lang="scss" scoped>
</style>
