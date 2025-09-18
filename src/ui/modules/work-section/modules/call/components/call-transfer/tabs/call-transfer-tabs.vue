<template>
  <wt-tabs
    class="transfer-tabs"
    :current="currentTab"
    :tabs="tabs"
    @change="currentTab = $event.value;"
  ></wt-tabs>
  <call-transfer-container :size="size" :currentTab="currentTab"/>
</template>
<script setup lang="ts">
import callTransferContainer from '../call-transfer-container.vue';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const { t } = useI18n();
const currentTab = ref('users');
interface CallTransferTabsProps {
  size: string;
}


const tabs = computed(() => ([
  {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
  },
  {
    text: t('WebitelApplications.admin.sections.agents', 2),
    value: 'agents',
  },
  {
    text: t('WebitelApplications.admin.sections.queues', 2),
    value: 'queues',
  },
]));

defineProps<CallTransferTabsProps>()
</script>

<style scoped lang="scss">
  .transfer-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: var(--spacing-sm);
  }
</style>
