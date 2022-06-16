<template>
  <task-queue-preview
    :task="task"
    :title="task.displayName"
    :opened="opened"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <status-chip :state="computePreviewStatusClass" />
    </template>
    <template v-slot:title>
      {{ task.displayName | truncate(27) }}
    </template>
    <template v-slot:body>
      {{ task.displayNumber | truncateFromEnd(33) }}
    </template>
    <template
      v-slot:actions
      v-if="isRinging"
    >
      <wt-button
        color="success"
        @click.prevent="$emit('answer', task)"
        @keydown.enter.prevent="$emit('answer', task)"
      >
        {{ $t('reusable.answer') }}
      </wt-button>
      <wt-button
        color="danger"
        @click.prevent="$emit('hangup', task)"
        @keydown.enter.prevent="$emit('hangup', task)"
      >
        {{ $t('reusable.reject') }}
      </wt-button>
    </template>
  </task-queue-preview>
</template>

<script>
import StatusChip from '../call-status-icon-chip.vue';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'active-queue-preview',
  mixins: [taskPreviewMixin],
  components: { StatusChip },
  computed: {
    isHold() {
      return this.task.isHold;
    },

    isRinging() {
      return isIncomingRinging(this.task);
    },

    computePreviewStatusClass() {
      return this.task.isHold ? 'hold' : 'call';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
