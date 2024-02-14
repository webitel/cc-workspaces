
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
import  { ref } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import CallContactsContainer from '../call-contacts/call-contacts-container.vue';
import CallUsersContainer from '../call-users/call-users-container.vue';
const tabs = computed(() => [
  {
    text: t('WebitelApplications.crm.sections.contacts', 2),
    value: 'contacts',
    component: CallContactsContainer,
  },
  {
    text: t('WebitelApplications.admin.sections.users', 2),
    value: 'users',
    component: CallUsersContainer,
  },
]);
function changeTab(tab) {
  currentTab.value = tab;
}

const currentTab = ref(tabs.value[0]);
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

</script>

<style lang="scss" scoped>
.wt-tabs:deep(button) {
  width: 100%;
}
</style>
