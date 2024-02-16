<template>
  <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
  ></wt-tabs>
  <component
      :is="currentTab.component"
      :size="size"
  ></component>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import CallContactsContainer from '../call-contacts/call-contacts-container.vue';
import CallUsersContainer from '../call-users/call-users-container.vue';

const { t } = useI18n();
const store = useStore();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
    required: true,
  },
});

const tabsObject = computed(() => ({
  CallContactsTab: {
    text: t('WebitelApplications.crm.sections.contacts', 2),
    value: 'contacts',
    component: CallContactsContainer,
  },
  CallUsersTab: {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
    component: CallUsersContainer,
  },
}));

const scope = computed(() => getNamespacedState(store.state, 'ui/userinfo').scope);

const hasLicenseOnCrm = computed(() => scope.value.some(item => item.class === 'contacts'));

const tabs = computed(() => {
  const tabs = [tabsObject.value.CallUsersTab];
  if (hasLicenseOnCrm.value) tabs.unshift(tabsObject.value.CallContactsTab);
  return tabs;
});

const currentTab = ref(tabs.value[0]);

function changeTab(tab) {
  currentTab.value = tab;
}
</script>

<style lang="scss" scoped>
.wt-tabs {
  margin-bottom: var(--spacing-sm);

  &:deep(button) {
    width: 100%;
  }
}
</style>
