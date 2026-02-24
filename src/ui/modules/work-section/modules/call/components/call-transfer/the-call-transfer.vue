<template>
  <div class="call-transfer-container">
    <wt-tabs
      v-if="hasCallCenterLicense"
      class="call-transfer-tabs"
      :current="currentTab"
      :tabs="tabs"
      @change="currentTab = $event"
    ></wt-tabs>
    <component
      :is="currentTab.component"
      :size="size"
      @transfer-complete="$emit('transfer-complete')"
    />
  </div>
</template>
<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { WebitelLicense } from '@webitel/ui-sdk/modules/Userinfo';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useUserinfoStore } from '../../../../../../modules/userinfo/userinfoStore';
import AgentsCallTransfer from './components/agents-call-transfer.vue';
import QueuesCallTransfer from './components/queues-call-transfer.vue';
import UsersCallTransfer from './components/users-call-transfer.vue';

const { t } = useI18n();
const store = useStore();

interface CallTransferTabsProps {
	size: ComponentSize;
}

defineProps<CallTransferTabsProps>();

const emit = defineEmits([
  'transfer-complete',
]);


const userinfoStore = useUserinfoStore();
const { hasLicense } = userinfoStore;

const hasCallCenterLicense = computed(() =>
	hasLicense(WebitelLicense.CallCenter),
);

const tabs = computed(() => [
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
]);

const currentTab = ref(tabs.value[0]);
</script>

<style scoped lang="scss">
.call-transfer {

  &-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--spacing-xs);
  }

  &-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: var(--spacing-sm);
  }

}
</style>
