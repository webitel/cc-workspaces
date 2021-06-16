<template>
  <div class="queue-preview" :class="{'queue-preview--opened': opened}">
    <div class="queue-preview-wrapper">

      <div class="queue-header-wrapper">
        <status-badge :state="computePreviewStatusClass"/>
        <header class="queue-preview-header">

          <span class="queue-preview-header__name">{{ displayName | truncate(18) }}</span>
          <queue-preview-timer :task="call" :bold="!isRinging"/>

          <section class="queue-preview-body">
            <div class="active-preview__number">
              {{ displayNumber | truncateFromEnd(18) }}
            </div>
          </section>
        </header>
      </div>
      <!--Badge with queue name-->
      <wt-badge v-if="displayQueueName">
        {{ displayQueueName }}
      </wt-badge>

      <footer class="queue-preview-footer">
        <div
          v-if="isRinging"
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
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import StatusBadge from '../call-status-icon-badge.vue';
import QueuePreviewTimer from '../../shared/queue-preview-timer.vue';
import displayInfo from '../../../../../mixins/displayInfoMixin';
import isIncomingRinging from '../../../../../store/modules/call/scripts/isIncomingRinging';

export default {
  name: 'active-queue-preview',
  mixins: [displayInfo],
  components: {StatusBadge, QueuePreviewTimer},
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
    // queueName() {
    //   return this.call.task?.queue?.name;
    // },
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
@import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
