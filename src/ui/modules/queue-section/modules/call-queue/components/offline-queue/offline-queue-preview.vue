<template>
  <task-queue-preview
    :task="task"
    :title="displayName"
    :opened="opened"
    :size="size"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <status-chip/>
    </template>
  </task-queue-preview>
</template>

<script>
  import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
  import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
  import StatusChip from '../call-status-icon-chip.vue';

  export default {
    name: 'offline-queue-preview',
    mixins: [taskPreviewMixin, sizeMixin],
    components: {
      StatusChip,
    },

    computed: {
      displayName() {
        return this.task.name;
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
