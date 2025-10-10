<template>
    <wt-tabs
      class="transfer-tabs"
      :current="currentTab"
      :tabs="tabs"
      @change="currentTab = $event"
    ></wt-tabs>
    <component
      :is="currentTab.component"
      :size="size"
      @onTransfer="transferClick"
    />
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

import AgentsCallTransfer from './components/agents-call-transfer.vue';
import QueuesCallTransfer from './components/queues-call-transfer.vue';
import UsersCallTransfer from './components/users-call-transfer.vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';

const { t } = useI18n();

interface CallTransferTabsProps {
  size: ComponentSize;
}

defineProps<CallTransferTabsProps>();
const emits = defineEmits(['openCall'])

const transferClickCount = ref(0)

const tabs = computed(() => ([
  {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
    component: UsersCallTransfer,
  },
  {
    text: t('WebitelApplications.admin.sections.agents', 2),
    value: 'agents',
    component: AgentsCallTransfer,
  },
  {
    text: t('WebitelApplications.admin.sections.queues', 2),
    value: 'queues',
    component: QueuesCallTransfer,
  },
]));

const currentTab = ref(tabs.value[0]);

const transferClick = () => {
  if (transferClickCount.value < 1) return transferClickCount.value++
  emits('openCall')
  return transferClickCount.value = 0
}

</script>

<style scoped lang="scss">
  .transfer-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: var(--spacing-sm);
  }
</style>
