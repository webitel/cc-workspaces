<template>
  <component
    :is="`task-queue-preview-${size}`"
    :task="task"
    @click="$emit('click', task)"
  >
    <template
      v-if="size === 'md'"
      v-slot:icon
    >
      <wt-icon
        color="danger"
        icon="call-disconnect"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-icon
        color="danger"
        icon="call-disconnect"
      ></wt-icon>
    </template>
    <template v-slot:timer>
      <span class="missed-preview__task-time">
        {{ displayTime }}
      </span>
    </template>
    <template v-slot:title>
      {{ displayName }}
    </template>
    <template v-slot:body>
      {{ displayNumber | truncateFromEnd(18) }}
    </template>
  </component>
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
  text-align: center;
}
</style>
