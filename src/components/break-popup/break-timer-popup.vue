<template>
  <popup class="break-timer-popup">
    <template slot="popup-header">
      <h1 class="popup__title">
        <span class="popup-indicator__break"></span>
        {{$t('agentStatus.breakTimer.heading')}}
      </h1>
    </template>
    <template slot="popup-main">
      <div class="break-timer-wrap__timer-wrap">
        <div class="break-timer-wrap__timer">
            <span
              class="break-timer-wrap__timer__digit"
              v-for="(digit, key) of duration.split('')"
              :key="key"
            >
              {{digit}}
            </span>
        </div>
      </div>
    </template>
    <template slot="popup-footer">
      <div class="popup-actions">
        <btn
          class="popup-action true uppercase"
          @click.native="setAgentWaiting"
        >{{$t('agentStatus.breakTimer.continueWork')}}
        </btn>
        <btn
          class="popup-action false uppercase"
          @click.native="agentLogout"
        >{{$t('reusable.logout')}}
        </btn>
      </div>
    </template>
  </popup>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import Btn from '../utils/btn.vue';
  import Popup from '../utils/popup-container.vue';

  export default {
    name: 'break-timer-popup',
    components: {
      Btn,
      Popup,
    },
    computed: {
      ...mapState('now', {
        now: (state) => state.now,
      }),

      ...mapState('status', {
        agent: (state) => state.agent,
      }),

      duration() {
        if (this.now) {
          return new Date((this.agent.stateDuration || 0) * 1000).toISOString()
            .substr(11, 8);
        }
        return '00:00:00';
      },
    },

    methods: {
      ...mapActions('status', {
        setAgentWaiting: 'SET_AGENT_WAITING_STATUS',
        agentLogout: 'AGENT_LOGOUT',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .typo-timer-digits {
    font-family: 'Montserrat Semi', monospace;
    @include fontSize(82px);
    @include lineHeight(82px);
  }

  .popup__title {
    @extend .typo-heading-lg;
    text-align: center;
  }

  .break-timer-wrap__timer-wrap {
    padding: calcVH(27px) calcVH(51px);
    background: $accent-color;
    border-radius: $border-radius;
  }

  .break-timer-wrap__timer {
    width: fit-content;
    width: -moz-fit-content;
    margin: auto;
  }

  .break-timer-wrap__timer__digit {
    @extend .typo-timer-digits;
    text-align: center;
    display: inline-block;
    width: calcVH(55px);
    color: #000;

    /*semicolons*/
    &:nth-child(3), &:nth-child(6) {
      width: calcVH(28px);
    }
  }

  .popup-indicator__break {
    display: inline-block;
    width: calcVH(14px);
    height: calcVH(14px);
    margin-right: calcVH(11px);
    border-radius: 50%;
    background: $break-color;
  }

  .popup-action {
    min-width: calcVH(180px);
    height: calcVH(42px);

    &.false {
      margin-left: calcVH(30px);
    }
  }
</style>
