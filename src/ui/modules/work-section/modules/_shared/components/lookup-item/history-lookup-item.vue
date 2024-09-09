<template>
  <lookup-item
    :size="size"
    :key="item.id"
    @click="handleInput">
    <template v-slot:before>
      <div class="history-lookup-item-wrapper">
        <wt-avatar :size="size"></wt-avatar>
        <wt-icon
          :icon="statusIcon"
          :color="statusIconColor"
          :size="size"
        ></wt-icon>
      </div>
    </template>
    <template v-slot:title>
      {{ shownDestination }}
    </template>

    <template v-slot:subtitle>
      {{ destinationForNumber }}
    </template>

    <template v-slot:info-title>
      {{ date }}
    </template>

    <template v-slot:info-subtitle>
      ({{ duration }})
    </template>

    <template v-slot:after>
      <div class="history-lookup-item-after">
        <wt-rounded-action
          icon="call--filled"
          color="success"
          rounded
          :size="size"
          wide
          @click="call"
        />
        <wt-context-menu
            class="history-lookup-item-options"
            :options="contextMenuOptions"
            :visible="isContextMenuVisible"
            :key="item.id"
            @click="$event.option.handler()"
          >
            <template #activator>
              <wt-icon
                icon="options"
                :size="size"
              />
            </template>
            <template #option="option">
              <div class="history-lookup-item-options__card">
                <a :href="historyIdLink">
                  <wt-icon
                    :icon="option.icon"
                    :size="size"
                  />
                  {{ option.text }}
                </a>
              </div>
            </template>
          </wt-context-menu>
      </div>
    </template>
  </lookup-item>
</template>

<script>
import { mapActions } from 'vuex';
import { CallDirection } from 'webitel-sdk';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import lookupItemMixin from './mixins/lookupItemMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'history-lookup-item',
  mixins: [lookupItemMixin, sizeMixin],
  props: {
    forNumber: {
      type: String,
      required: false,
    },
  },
  data(){
    return{
      isContextMenuVisible: false
    }
  },

  computed: {
    shownDestination() {
      return this.destination;
    },

    destinationForNumber() {
      if (this.item.from.number !== this.forNumber) return this.item.from.number;
      return this.item.to.number || this.item.destination;
    },

    destination() {
      if (this.item.direction === CallDirection.Outbound) {
        if (this.item.to.number) {
          return this.item.to.name;
        }
        return this.item.destination;
      }
      return this.item.from.name;
    },

    historyIdLink(){
      return `${import.meta.env.VITE_HISTORY_URL}/${this.item.id}`
    },

    date() {
      const createdAt = new Date(+this.item.createdAt);
      return createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
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
        if (!this.item.answeredAt) return 'error';
        return 'warning';
      }
      return 'success';
    },

    contextMenuOptions(){
      return [
        {
          text: this.$t('history.openInHistory'),
          icon: 'link',
          disabled: false,
          handler: () => this.goToHistoryItem(),
        },
      ]
    },
  },
  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    call() {
      let number;

      if (this.item.direction === CallDirection.Inbound) {
        number = this.item.from.number;
      } else {
        number = this.item.to.number || this.item.destination;
      }

      return this.makeCall({ number });
    },
    goToHistoryItem() {
      window.open(this.historyIdLink, '_blank')
    },
  },
};
</script>

<style lang="scss" scoped>
  .lookup-item {
    cursor: pointer;
  }

  .history-lookup-item{
    &-wrapper{
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    &-after{
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);

      :deep(.wt-context-menu__option){
        padding: 0;
      }
      :deep(.wt-tooltip .wt-tooltip-floating){
        z-index: 10;
      }
    }

    &-options{
      &__card a{
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--wt-context-menu-option-padding);
      }
    }
  }
</style>

