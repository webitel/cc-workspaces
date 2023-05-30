<template>
  <component
    :is="`task-queue-preview-${size}`"
    :opened="opened"
    :task="task"
    @click="$emit('click', task)"
  >
    <template
      v-if="size === 'md'"
      v-slot:icon
    >
      <wt-icon
        color="job"
        icon="job"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-icon
        color="job"
        icon="job"
      ></wt-icon>
    </template>
    <template v-slot:title>
      {{ task.displayName }}
    </template>
    <template v-slot:body>
      {{ task.displayNumber }}
    </template>
    <template
      v-if="task.allowAccept"
      v-slot:actions
    >
      <component
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="job"
        icon="job--accept"
        size="sm"
        wide
        @click.prevent="$emit('accept', task)"
        @keydown.enter.prevent="$emit('accept', task)"
      >
        {{ $t('reusable.accept') }}
      </component>
      <wt-button
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="danger"
        icon="job--end"
        size="sm"
        wide
        @click.prevent="$emit('decline', task)"
        @keydown.enter.prevent="$emit('decline', task)"
      >
        {{ $t('reusable.decline') }}
      </wt-button>
    </template>
  </component>
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
