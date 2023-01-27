<template>
  <lookup-item
    :active="active"
    :size="size"
    @click.native="handleInput">
    <template slot="before">
      <div class="history-lookup-item-wrapper">
        <wt-avatar :size="size"></wt-avatar>
        <wt-icon
          :icon="statusIcon"
          :color="statusIconColor"
          :size="size"
        ></wt-icon>
      </div>
    </template>
    <template slot="title">
      {{ shownDestination | truncateFromEnd(24) }}
    </template>

    <template slot="subtitle">
      {{ duration }}
    </template>

    <template slot="info-title">
      {{ date }}
    </template>

    <template slot="after">
      <wt-rounded-action
        icon="call--filled"
        color="success"
        rounded
        :size="size"
        wide
        @click="makeCall"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import { mapActions } from 'vuex';
import { CallDirection } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import lookupItemMixin from './mixins/lookupItemMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

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
  name: 'history-lookup-item',
  mixins: [lookupItemMixin, sizeMixin],
  props: {
    forNumber: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    shownDestination() {
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

    date() {
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
        if (!this.item.answeredAt) return 'call-disconnect--filled';
        return 'call-inbound--filled';
      }
      return 'call-outbound--filled';
    },

    statusIconColor() {
      if (this.item.direction === CallDirection.Inbound) {
        if (!this.item.answeredAt) return 'danger';
        return 'accent';
      }
      return 'success';
    },
  },
  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
  },
};
</script>

<style lang="scss" scoped>
  .lookup-item {
    cursor: pointer;
  }

  .history-lookup-item-wrapper{
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
