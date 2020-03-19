<template>
  <div
    class="status-select"
    :class="{'opened': isOpened}"
    tabindex="0"
    @keypress.enter="isOpened = !isOpened"
    v-clickaway="close"
  >
    <div
      class="status-select__item status-select__item__selected"
      :class="{'hidden': isOpened}"
      @click="isOpened = true"
    >
        <span
          class="status-select__indicator"
          :class="computeCurrentStatusIndicatorClass()"
        ></span>
      <div class="status-select__item__text">{{duration}}</div>
      <icon class="status-select__arrow">
        <svg class="icon icon-arrow-down-md md">
          <use xlink:href="#icon-arrow-down-md"></use>
        </svg>
      </icon>
    </div>

    <ul
      class="status-select__options"
      :class="{'hidden': !isOpened}"
    >
      <li class="status-select__item" @click="close">
        <span
          class="status-select__indicator"
          :class="computeCurrentStatusIndicatorClass()"
        ></span>
        <div class="status-select__item__text">{{duration}}</div>
        <icon class="status-select__arrow">
          <svg class="icon icon-arrow-down-md md">
            <use xlink:href="#icon-arrow-down-md"></use>
          </svg>
        </icon>
      </li>
      <li class="status-select__item"
          v-for="(status, key) of computeAvailableStatus"
          :key="key"
          @click="changeStatus(status.value)"
      >
        <span
          class="status-select__indicator"
          :class="computeCurrentStatusIndicatorClass(status.value)"
        ></span>
        <div class="status-select__item__text">{{status.text}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { AgentStatus } from 'webitel-sdk';
  import clickaway from '../../directives/clickaway';

  export default {
    name: 'status-select',
    directives: { clickaway },

    data: () => ({
      AgentStatus,
      isOpened: false,
      agentStatusList: [
        {
          text: 'Active',
          value: AgentStatus.Waiting,
        },
        {
          text: 'Break',
          value: AgentStatus.Pause,
        },
      ],
      userStatusList: [
        {
          text: 'Active',
          value: 'active',
        },
        {
          text: 'DnD',
          value: 'dnd',
        },
      ],
    }),

    computed: {
      ...mapState('now', {
        now: (state) => state.now,
      }),

      ...mapState('status', {
        agent: (state) => state.agent,
      }),

      computeAvailableStatus() {
        return this.agentStatusList.filter((status) => status.value !== this.agent.status);
      },

      // FIXME to redo with lastStateChange getter from sdk, when it's ready
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
        setWaiting: 'SET_WAITING_STATUS',
        setPause: 'SET_PAUSE_STATUS',
        logout: 'LOGOUT',
      }),

      changeStatus(status) {
        switch (status) {
          case AgentStatus.Waiting:
            this.setWaiting();
            break;
          case AgentStatus.Pause:
            this.setPause();
            break;
          default:
            break;
        }
        this.close();
      },

      computeCurrentStatusIndicatorClass(status = this.agent.status) {
        switch (status) {
          case AgentStatus.Waiting:
            return 'status-select__indicator__active';
          case AgentStatus.Pause:
            return 'status-select__indicator__break';
          default:
            return '';
        }
      },

      close() {
        this.isOpened = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  $active-color: $true-color;
  $break-color: $hold-color;
  $stop-color: $false-color;
  $option-bg__hover: $page-bg-color;

  .status-select {
    position: relative;
    z-index: 100;

    &__item {
      display: flex;
      align-items: center;
      width: calcVH(130px);
      word-break: break-all;
      padding: calcVH(5px) calcVH(5px) calcVH(5px) calcVH(10px);
      background: #fff;
      transition: $transition;
      cursor: pointer;

      &__selected {
        border-radius: $border-radius;
      }

      &__text {
        @extend .typo-heading-sm;
      }
    }

    &__indicator {
      display: inline-block;
      width: calcVH(14px);
      height: calcVH(14px);
      margin-right: calcVH(9px);
      border-radius: 50%;

      &__active {
        background: $active-color;
      }

      &__break {
        background: $break-color;
      }

      &__stop {
        background: $stop-color;
      }
    }

    &__arrow {
      margin-left: auto;

      .icon {
        fill: #000;
        stroke: #000;
      }
    }

    .status-select__options {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    &.opened {
      .status-select__options {
        background: #fff;
        box-shadow: $box-shadow;
        border-radius: $border-radius;

        .status-select__item {
          &:first-child, &:last-child {
            border-radius: $border-radius;
          }

          &:hover {
            background: $option-bg__hover;
          }
        }
      }
    }
  }
</style>
