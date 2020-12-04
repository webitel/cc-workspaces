<template>
  <div class="ws-worksection__item ws-history-item">
    <img class="ws-worksection__item__pic"
         src="../../../../../assets/agent-workspace/default-avatar.svg"
         alt="client photo">
    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-history-item__number">{{ computeDestination | truncateFromEnd(24) }}</div>
        <div class="ws-history-item__time">{{ duration }}</div>
      </div>
      <div class="flex-wrap">
        <div class="ws-history-item__date">{{ computeDate }}</div>
        <div class="ws-history-item__location"></div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
      <wt-icon
        :icon="statusIcon"
        :color="statusIconColor"
      ></wt-icon>
    </div>
  </div>
</template>

<script>
import { CallDirection } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';

const isTheSameDate = (date1, date2) => (
  date1.getDate() === date2.getDate()
  && date1.getMonth() === date2.getMonth()
  && date1.getFullYear() === date2.getFullYear()
);

const isToday = (createdAt) => {
  const date = new Date(+createdAt);
  const today = new Date();
  return isTheSameDate(today, date);
};

const isYesterday = (createdAt) => {
  const date = new Date(+createdAt);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isTheSameDate(yesterday, date);
};

export default {
  name: 'history-item',

  props: {
    item: {
      type: Object,
      required: true,
    },
    forNumber: {
      type: String,
      required: false,
    },
  },

  computed: {
    computeDestination() {
      return this.forNumber ? this.destinationForNumber : this.destination;
    },

    destinationForNumber() {
      if (this.item.from.number !== this.forNumber) return this.item.from.number;
      return this.item.to.number || this.item.destination;
    },

    destination() {
      if (this.item.direction === CallDirection.Outbound) {
        if (this.item.to.number) {
          return `${this.item.to.name} (${this.item.to.number})`;
        }
        return this.item.destination;
      }
      return `${this.item.from.name} (${this.item.from.number})`;
    },

    computeDate() {
      const createdAt = +this.item.createdAt;
      const date = new Date(createdAt).toLocaleDateString();
      const time = prettifyTime(createdAt);
      if (isToday(createdAt)) return `${this.$t('history.today')} ${time}`;
      if (isYesterday(createdAt)) return `${this.$t('history.yesterday')} ${time}`;
      return `${date} ${time}`;
    },

    duration() {
      return convertDuration(this.item.duration);
    },

    statusIcon() {
      if (this.item.direction === CallDirection.Inbound) {
        if (!this.item.answeredAt) return 'call-disconnect';
        return 'call-inbound';
      }
      return 'call-outbound';
    },

    statusIconColor() {
      if (this.item.direction === CallDirection.Inbound) {
        if (!this.item.answeredAt) return 'false';
        return 'accent';
      }
      return 'true';
    },
  },

  methods: {
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
