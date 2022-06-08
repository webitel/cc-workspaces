<template>
  <article
    :class="{ 'queue-preview--opened': opened }"
    class="queue-preview"
    @click="$emit('click', call)"
  >
    <header class="queue-preview-header">
      <status-chip :state="computePreviewStatusClass" />
      <span class="queue-preview-header__name">{{ displayName | truncate(27) }}</span>
      <queue-preview-timer :bold="!isRinging" :task="call" />
    </header>
    <section class="queue-preview-body">
      <div class="active-preview__number">
        {{ displayNumber | truncateFromEnd(33) }}
      </div>
    </section>
    <section v-if="displayQueueName" class="queue-preview-chips">
      <wt-chip color="secondary">
        {{ displayQueueName }}
      </wt-chip>
    </section>
    <footer v-if="isRinging" class="queue-preview-footer">
      <div
        class="queue-preview-actions"
      >
        <wt-button
          color="success"
          @click.prevent="$emit('answer', call)"
        >
          {{ $t('reusable.answer') }}
        </wt-button>
        <wt-button
          color="danger"
          @click.prevent="$emit('hangup', call)"
        >
          {{ $t('reusable.reject') }}
        </wt-button>
      </div>
    </footer>
  </article>
</template>

<script>
import StatusChip from '../call-status-icon-chip.vue';
import QueuePreviewTimer from '../../../shared/queue-preview-timer.vue';
import displayInfo from '../../../../../../mixins/displayInfoMixin';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';

export default {
  name: 'active-queue-preview',
  mixins: [displayInfo],
  components: { StatusChip, QueuePreviewTimer },
  props: {
    // item is for UI computing
    call: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isHold() {
      return this.call.isHold;
    },

    isRinging() {
      return isIncomingRinging(this.call);
    },

    computePreviewStatusClass() {
      return this.call.isHold ? 'hold' : 'call';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-preview';
</style>
