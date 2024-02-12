<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :queue-name="displayQueueName"
  >
    <template v-slot:icon>
      <wt-icon
        icon="call"
        size="md"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:quick-action>
      <offline-queue-preview-callback
        :task="task"
        size="md"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :queue-name="displayQueueName"
  >
    <template v-slot:icon>
      <wt-icon
        icon="call"
        size="sm"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:actions>
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
  name: 'offline-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  components: { OfflineQueuePreviewCallback },
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
