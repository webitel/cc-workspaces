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
    />
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

import CallTransferUsers from './tab-items/call-transfer-users.vue';
import CallTransferAgents from './tab-items/call-transfer-agents.vue';
import CallTransferQueues from './tab-items/call-transfer-queues.vue';

const { t } = useI18n();

interface CallTransferTabsProps {
  size: string;
}

defineProps<CallTransferTabsProps>();

const tabs = computed(() => ([
  {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
    component: CallTransferUsers,
  },
  {
    text: t('WebitelApplications.admin.sections.agents', 2),
    value: 'agents',
    component: CallTransferAgents,
  },
  {
    text: t('WebitelApplications.admin.sections.queues', 2),
    value: 'queues',
    component: CallTransferQueues,
  },
]));

const currentTab = ref(tabs.value[0]);

</script>

<style scoped lang="scss">
  .transfer-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: var(--spacing-sm);
  }
</style>
