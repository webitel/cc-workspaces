<template>
  <div class="call-contacts-container">
    <wt-tabs
      v-if="tabs.length > 1"
      :current="currentTab"
      :tabs="tabs"
      wide
      @change="changeTab"
    ></wt-tabs>
    <component
      :is="currentTab.component"
      class="call-contacts-container-content"
      :size="size"
    ></component>
  </div>
</template>

<script setup>
import { SpecialGlobalAction } from '@webitel/ui-sdk/src/modules/Userinfo/v2/enums/index';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserinfoStore } from '../../../../../userinfo/userinfoStore.js';
import ContactsContainer from './contacts/contacts-container.vue';
import UsersContainer from './users/users-container.vue';

const { t } = useI18n();
const store = useStore();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});

const { hasSpecialGlobalActionAccess } = useUserinfoStore();
const isLimitContactsGranted = hasSpecialGlobalActionAccess(SpecialGlobalAction.LimitWorkspaceContacts);

const currentTab = ref({});

const tabsObject = computed(() => ({
  CallContactsTab: {
    text: t('WebitelApplications.crm.sections.contacts', 2),
    value: 'contacts', // tracked by wt-tabs
    component: ContactsContainer,
  },
  CallUsersTab: {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users', // tracked by wt-tabs
    component: UsersContainer,
  },
}));

const scope = computed(() => getNamespacedState(store.state, 'ui/userinfo').scope);

const hasLicenseOnCrm = computed(() => scope.value.some(item => item.class === 'contacts'));

const tabs = computed(() => {
  const tabs = [tabsObject.value.CallUsersTab];
  if (hasLicenseOnCrm.value && !isLimitContactsGranted) {
    tabs.unshift(tabsObject.value.CallContactsTab);
  }
  return tabs;
});

function changeTab(tab) {
  currentTab.value = tab;
}

changeTab(tabs.value[0]);
</script>

<style lang="scss" scoped>
.call-contacts-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-xs);

  .call-contacts-container-content {
    flex: 1;
  }
}

</style>
