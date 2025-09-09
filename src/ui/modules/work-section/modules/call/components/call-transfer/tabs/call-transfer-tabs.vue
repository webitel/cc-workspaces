<template>
  <wt-tabs
    class="transfer-tabs"
    :current="currentTab"
    :tabs="tabs"
    @change="$emit('changeTab', $event)"
  ></wt-tabs>
  <transfer-lookup-item
    v-for="(item, key) of dataList"
    :id="`scroll-item-${key}`"
    :key="`${item.id}${key}`"
    :item="item"
    :size="size"
    :showConsultationTransfer
    :showTransferButton
    :showStatus
    @input="$emit('transfer', $event)"
    @consultation="$emit('consultation', $event)"
  ></transfer-lookup-item>
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
  showConsultationTransfer: boolean;
  showTransferButton: boolean;
  showStatus?: boolean;
}

interface CallTransferTabsEmits {
  (e: 'transfer', item: transferItem): void;
  (e: 'changeTab', tab: tab): void;
  (e: 'consultation', item: transferItem): void;
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
