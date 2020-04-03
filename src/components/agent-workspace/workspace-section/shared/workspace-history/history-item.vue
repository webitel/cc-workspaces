<template>
  <div class="ws-worksection__item ws-history-item">
    <img class="ws-worksection__item__pic"
         src="../../../../../assets/agent-workspace/default-avatar.svg"
         alt="client photo">
    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-history-item__number">{{computeDestination}}</div>
        <div class="ws-history-item__time">{{computeDuration}}</div>
      </div>
      <div class="flex-wrap">
        <div class="ws-history-item__date">{{computeDate}}</div>
        <div class="ws-history-item__location"></div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
      <icon>
        <svg
          class="icon md"
          :class="[`icon-${computeStatusIcon}-md`, computeStatusColor]"
        >
          <use :xlink:href="`#icon-${computeStatusIcon}-md`"></use>
        </svg>
      </icon>
    </div>
  </div>
</template>

<script>
  import { CallDirection } from 'webitel-sdk';

  export default {
    name: 'history-item',

    props: {
      item: {
        type: Object,
        required: true,
      },
    },

    computed: {
      computeDestination() {
        if (this.item.direction === CallDirection.Outbound) {
          if (this.item.to.number) {
            return `${this.item.to.name} (${this.item.to.number})`;
          }
          return this.item.destination;
        }
        return `${this.item.from.name} (${this.item.from.number})`;
      },

      computeDate() {
        const day = 24 * 60 * 60 * 10 ** 3;
        if ((Date.now() - this.item.createdAt) < day) return 'Today';
        if ((Date.now() - this.item.createdAt) < day * 2) return 'Yesterday';
        return new Date(+this.item.createdAt).toLocaleDateString();
      },

      computeDuration() {
        const duration = this.item.hangupAt - this.item.answeredAt;
        return new Date(duration || 0).toISOString().substr(11, 8);
      },

      computeStatusIcon() {
        if (this.item.direction === CallDirection.Inbound) {
          if (!this.item.answeredAt) return 'missed-call';
          return 'incoming-call';
        }
        return 'call-transfer';
      },

      computeStatusColor() {
        if (this.item.direction === CallDirection.Inbound) {
          if (!this.item.answeredAt) return 'missed';
          return 'inbound';
        }
        return 'outbound';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ws-history-item {
    cursor: pointer;

    &:hover {
      background: $page-bg-color;
    }
  }

  .flex-wrap {
    height: 50%; // 2 flex-wraps in text container

    &:first-child {
      align-items: flex-start;
    }

    &:last-child {
      align-items: flex-end;
    }
  }

  .ws-history-item__number {
    @extend .typo-heading-sm;
  }

  .ws-history-item__time {
    @extend .typo-body-md;
  }

  .ws-history-item__date {
    @extend .typo-body-sm;
  }

  .ws-history-item__location {
    @extend .typo-body-sm;
  }


  .ws-worksection__item__status {
    .outbound {
      stroke: $call-color;
      fill: $call-color;
    }

    .missed {
      stroke: $disconnect-color;
      fill: $disconnect-color;
    }

    .inbound {
      stroke: $icons-color;
      fill: $icons-color;
    }
  }
</style>
