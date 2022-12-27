<template>
  <task-queue-preview
    :task="task"
    :title="displayName"
    :size="size"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <status-chip state="missed"/>
    </template>
    <template v-slot:timer>
      {{ $t('queueSec.call.at') }}: {{ displayTime }}
    </template>
    <template v-slot:body>
      {{ displayNumber | truncateFromEnd(18) }}
    </template>
  </task-queue-preview>
</template>

<script>
  import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
  import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
  import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
  import StatusChip from '../call-status-icon-chip.vue';

  export default {
    name: 'missed-queue-preview',
    mixins: [taskPreviewMixin, sizeMixin],
    components: {
      StatusChip,
    },

    computed: {
      displayName() {
        return this.task.from?.name || '';
      },
      displayNumber() {
        return this.task.from?.number || '';
      },
      displayTime() {
        return prettifyTime(this.task.createdAt);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .missed-preview__task-time {
    @extend %typo-body-2;
  }
</style>
