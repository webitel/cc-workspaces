<template>
  <wt-expansion-panel
    :size="props.size"
    collapsed>
    <template #title>{{ t('infoSec.contacts.communications') }}</template>
    <template #default>
      <div class="contact-card-communications">
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        ></wt-tabs>
        <component
          :is="currentTab.component"
          :size="props.size"
          :contact="props.contact"
        ></component>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ContactCardEmails from './contact-card-emails.vue';
import ContactCardMessaging from './contact-card-messaging.vue';
import ContactCardPhones from './contact-card-phones.vue';

const props = defineProps({
  size: {
    type: String,
    default: ComponentSize.MD,
  },
  contact: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const tabs = computed(() => [
  {
    text: t('vocabulary.phones', 2),
    value: 'phones',
    component: ContactCardPhones,
  },
  {
    text: t('vocabulary.messaging', 2),
    value: 'messaging',
    component: ContactCardMessaging,
  },
  {
    text: t('vocabulary.emails', 2),
    value: 'emails',
    component: ContactCardEmails,
  },
]);

const currentTab = ref(tabs.value[0]);

function changeTab(tab) {
  currentTab.value = tab;
}
</script>

<style lang="scss" scoped>
.contact-card-communications {
  padding: var(--spacing-xs);
}
</style>
