<template>
  <div class="call-contacts-container">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    ></wt-tabs>
    <component
      class="call-contacts-container-content"
      :is="currentTab.component"
      :size="size"
    ></component>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
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

const currentTab = ref({});

const tabsObject = computed(() => ({
  CallContactsTab: {
    text: t('get me contacts', 2),
    value: 'contacts', // tracked by wt-tabs
    component: ContactsContainer,
  },
  CallUsersTab: {
    text: t('get me users', 2),
    value: 'users', // tracked by wt-tabs
    component: UsersContainer,
  },
}));

const scope = computed(() => getNamespacedState(store.state, 'ui/userinfo').scope);

const hasLicenseOnCrm = computed(() => scope.value.some(item => item.class === 'contacts'));

const tabs = computed(() => {
  const tabs = [tabsObject.value.CallUsersTab];
  if (hasLicenseOnCrm.value) tabs.unshift(tabsObject.value.CallContactsTab);
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
