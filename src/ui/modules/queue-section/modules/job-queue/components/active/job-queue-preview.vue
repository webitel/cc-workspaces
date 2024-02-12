<template>
  <task-queue-preview-md
    :opened="opened"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        color="job"
        icon="job"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ task.displayName }}
    </template>

    <template v-slot:subtitle>
      {{ task.displayNumber }}
    </template>

    <template
      v-if="task.allowAccept"
      v-slot:actions
    >
      <component
        :is="size === 'sm' ? 'wt-rounded-action' : 'wt-button'"
        color="job"
        icon="job--accept"
        size="sm"
        :wide="size === 'md'"
        :rounded="size === 'sm'"
        @click.prevent="$emit('accept', task)"
        @keydown.enter.prevent="$emit('accept', task)"
      >
        {{ $t('reusable.accept') }}
      </component>
      <wt-button
        :is="size === 'sm' ? 'wt-rounded-action' : 'wt-button'"
        color="error"
        icon="job--end"
        size="sm"
        :wide="size === 'md'"
        :rounded="size === 'sm'"
        @click.prevent="$emit('decline', task)"
        @keydown.enter.prevent="$emit('decline', task)"
      >
        {{ $t('reusable.decline') }}
      </wt-button>
    </template>
  </task-queue-preview-md>


  <task-queue-preview-sm
    :opened="opened"
    @click="$emit('click', task)"
    >
    <template v-slot:icon>
      <wt-icon
        color="job"
        icon="job"
        size="sm"
      ></wt-icon>
    </template>

    <template v-slot:tooltip-title>
      {{ task.displayName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ task.displayNumber }}
    </template>
  </task-queue-preview-sm>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'chat-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
};
</script>

<style lang="scss" scoped>
</style>
