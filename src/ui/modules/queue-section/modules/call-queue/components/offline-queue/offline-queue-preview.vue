<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :queue-name="displayQueueName"
    @click="$emit('click')"

  >
    <template #icon>
      <wt-icon
        icon="call"
        size="md"
        color="warning"
      ></wt-icon>
    </template>

    <template #title>
      {{ displayName }}
    </template>

    <template #quick-action>
      <offline-queue-preview-callback
        :task="task"
        size="md"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :queue-name="displayQueueName"
    @click="$emit('click')"
  >
    <template #icon>
      <wt-icon
        icon="call"
        size="sm"
        color="warning"
      ></wt-icon>
    </template>

    <template #tooltip-title>
      {{ displayName }}
    </template>

    <template #title>
      {{ displayName }}
    </template>

    <template #actions>
      <offline-queue-preview-callback
        :task="task"
        size="sm"
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

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import OfflineQueuePreviewCallback from './offline-queue-preview-callback.vue';

export default {
  name: 'OfflineQueuePreview',
  components: { OfflineQueuePreviewCallback },
  mixins: [taskPreviewMixin, sizeMixin],
  emits: ['click'],
  computed: {
    displayName() {
      return this.task.name;
    },
    displayQueueName() {
      return this.task.queue?.name;
    },
  },
};
</script>


<style lang="scss" scoped>

</style>
