<template>
  <article class="queue-preview" :class="{'queue-preview--opened': opened}">
      <header class="queue-preview-header">
        <status-chip :state="computePreviewStatusClass"/>
        <span class="queue-preview-header__name">{{ displayName | truncate(27) }}</span>
        <queue-preview-timer :task="call" :bold="!isRinging"/>
      </header>
    <section class="queue-preview-body">
      <div class="active-preview__number">
        {{ displayNumber | truncateFromEnd(33) }}
      </div>
    </section>
    <section class="queue-preview-chips" v-if="displayQueueName">
      <wt-chip color="secondary">
        {{ displayQueueName }}
      </wt-chip>
    </section>
    <footer class="queue-preview-footer" v-if="isRinging">
      <div
        class="queue-preview-actions"
      >
        <wt-button
          color="success"
          @click="answer({ callId: call.id })"
        >
          {{ $t('reusable.answer') }}
        </wt-button>
        <wt-button
          color="danger"
          @click="hangup({ callId: call.id })"
        >
          {{ $t('reusable.reject') }}
        </wt-button>
      </div>
    </footer>
  </article>
</template>

<script>
import { mapActions } from 'vuex';
import StatusChip from '../call-status-icon-chip.vue';
import QueuePreviewTimer from '../../../shared/queue-preview-timer.vue';
import displayInfo from '../../../../../../mixins/displayInfoMixin';
import isIncomingRinging from '../../../../../../../features/call/scripts/isIncomingRinging';

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

  methods: {
    ...mapActions('call', {
      answer: 'ANSWER',
      hangup: 'HANGUP',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-preview';
</style>
