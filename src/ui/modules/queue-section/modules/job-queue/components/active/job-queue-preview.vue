<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="task.distribute.queue_name"
    @click="$emit('click', task)"
  >
    <template #icon>
      <wt-icon
        color="job"
        icon="job"
      ></wt-icon>
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ task.displayNumber }}
    </template>

    <template #timer>
      <queue-preview-timer :task="task" />
    </template>

    <template
      v-if="task.allowAccept"
      #actions
    >
      <wt-button
        color="job"
        wide
        @click.prevent="$emit('accept', task)"
        @keydown.enter.prevent="$emit('accept', task)"
      >
        {{ $t('reusable.accept') }}
      </wt-button>
      <wt-button
        color="error"
        wide
        @click.prevent="$emit('decline', task)"
        @keydown.enter.prevent="$emit('decline', task)"
      >
        {{ $t('reusable.decline') }}
      </wt-button>
    </template>
  </task-queue-preview-md>


  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="task.distribute.queue_name"
    @click="$emit('click', task)"
    >
    <template #icon>
      <wt-icon
        color="job"
        icon="job"
        size="sm"
      ></wt-icon>
    </template>

    <template #tooltip-title>
      {{ task.displayName }}
    </template>

    <template #tooltip-subtitle>
      {{ task.displayNumber }}
    </template>

    <template #subtitle>
      <queue-preview-timer :task="task" />
    </template>

    <template
      v-if="task.allowAccept"
      #actions
    >
      <wt-rounded-action
        color="job"
        size="sm"
        icon="job--accept"
        rounded
        @click.prevent="$emit('accept', task)"
        @keydown.enter.prevent="$emit('accept', task)"
      >
        {{ $t('reusable.accept') }}
      </wt-rounded-action>
      <wt-rounded-action
        color="error"
        size="sm"
        icon="job--end"
        rounded
        @click.prevent="$emit('decline', task)"
        @keydown.enter.prevent="$emit('decline', task)"
      >
        {{ $t('reusable.decline') }}
      </wt-rounded-action>
    </template>
  </task-queue-preview-sm>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
	name: 'JobQueuePreview',
	mixins: [
		taskPreviewMixin,
		sizeMixin,
	],
};
</script>

<style lang="scss" scoped>
</style>
