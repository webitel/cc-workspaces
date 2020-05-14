<template>
  <article class="queue-preview" :class="{'opened': isOpened}">
    <status-badge :state="computePreviewStatusClass"/>

    <header class="preview-header">
      <span class="preview-header__name">{{displayName | truncate(18)}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="preview-header__time"
           :class="{'preview-header__time__bold': !isRinging}"
      >
          <span
            class="preview-header__time-digit"
            v-for="(digit, key) of computeCreatedTime.split('')"
            :key="key"
          >{{digit}}</span>
      </div>
    </header>

    <span
      class="call-preview__number">{{displayNumber | truncateFromEnd(18)}}</span>
    <div
      v-if="isRinging"
      class="preview-actions"
    >
      <btn
        class="uppercase call"
        @click.native.stop="answer(index)"
      >
        {{$t('reusable.answer')}}
      </btn>
      <btn
        class="uppercase end"
        @click.native.stop="hangup(index)"
      >
        {{$t('reusable.reject')}}
      </btn>
    </div>
  </article>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { CallActions, CallDirection } from 'webitel-sdk';
  import StatusBadge from '../call-status-icon-badge.vue';
  import Btn from '../../../utils/btn.vue';
  import callTimer from '../../../../mixins/callTimerMixin';
  import displayInfo from '../../../../mixins/displayInfoMixin';

  export default {
    name: 'active-queue-preview',
    mixins: [callTimer, displayInfo],
    components: {
      StatusBadge,
      Btn,
    },

    props: {
      // index is for action calls
      index: {
        type: Number,
        required: true,
      },

      // item is for UI computing
      call: {
        type: Object,
        required: true,
      },
    },

    computed: {
      ...mapState('call', {
        callOnWorkspace: (state) => state.callOnWorkspace,
      }),

      isOpened() {
        return this.call === this.callOnWorkspace;
      },

      isHold() {
        return this.call.isHold;
      },

      isRinging() {
        const isPreviewDialer = this.call.queue && this.call.queue.queue_type === 'preview';
        return this.call.state === CallActions.Ringing // Inbound ringing
          && (
            this.call.direction === CallDirection.Inbound
            || (this.call.direction === CallDirection.Outbound // Outbound preview dialer
              && isPreviewDialer)
          );
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
  @import '../../../../css/agent-workspace/queue-section/queue-call-preview';
</style>
