<template>
  <component
    :is="`task-queue-preview-${size}`"
    :opened="opened"
    :task="task"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <img
        alt=""
        src="../../../../../../../app/assets/call-sonars/active-sonar.svg"
      >
    </template>
    <template v-slot:title>
      {{ task.displayName }}
    </template>
    <template v-slot:body>
      {{ task.displayNumber | truncateFromEnd(33) }}
    </template>
    <template
      v-if="isRinging"
      v-slot:actions
    >
      <component
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="success"
        icon="call-ringing"
        :size="size"
        @click.prevent="$emit('answer', task)"
        @keydown.enter.prevent="$emit('answer', task)"
      >
        {{ $t('reusable.answer') }}
      </component>
      <component
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="danger"
        icon="call-end"
        :size="size"
        @click.prevent="$emit('hangup', task)"
        @keydown.enter.prevent="$emit('hangup', task)"
      >
        {{ $t('reusable.reject') }}
      </component>
    </template>
  </component>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import StatusChip from '../call-status-icon-chip.vue';

export default {
  name: 'active-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
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
