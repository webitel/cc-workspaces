<template>
  <wt-tabs
    class="transfer-tabs"
    :current="currentTab"
    :tabs="tabs"
    @change="$emit('changeTab', $event)"
  ></wt-tabs>
  <transfer-lookup-item
    v-for="(item, key) of dataList"
    :key="`${item.id}${key}`"
    :item="item"
    :size="size"
    :showStatus
    :showTeamName
    :showUserNameAvatar
  >
    <template #actions>
      <slot name="actions" :item="item"></slot>
    </template>
  </transfer-lookup-item>
</template>
<script setup lang="ts">
import TransferLookupItem
  from '../../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import { transferItem } from '../../../../_shared/components/lookup-item/types/transfer-lookup-item.js';

interface CallTransferTabsProps {
  dataList: transferItem[];
  size: string;
  tabs: tab[];
  currentTab: string;
  showStatus?: boolean;
  showTeamName?: boolean;
  showUserNameAvatar?: boolean;
}

interface CallTransferTabsEmits {
  (e: 'changeTab', tab: tab): void;
}

interface tab {
  text: string;
  value: string;
}

defineProps<CallTransferTabsProps>()
defineEmits<CallTransferTabsEmits>()
</script>

<style scoped lang="scss">
  .transfer-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
