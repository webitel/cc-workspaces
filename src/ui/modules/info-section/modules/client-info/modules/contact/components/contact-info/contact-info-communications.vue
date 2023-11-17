<template>
  <wt-expansion-panel :size="props.size">
    <template v-slot:title>{{ t('infoSec.contacts.communications') }}</template>
    <template>
      <div class="contact-info-communications">
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @click="currentTab === $event"
        ></wt-tabs>
        <component
          :is="currentTab.component"
          :size="props.size"
        ></component>
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ContactInfoPhones from './contact-info-phones.vue';
import ContactInfoEmails from './contact-info-emails.vue';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});

const tabs = computed(() => [
  {
    text: t('vocabulary.phones', 2),
    value: 'phones',
    component: ContactInfoPhones,
  },
  {
    text: t('vocabulary.emails', 2),
    value: 'emails',
    component: ContactInfoEmails,
  },
]);

const currentTab = reactive(tabs.value[0]);
</script>

<style lang="scss" scoped>
.contact-info-communications {
  padding: var(--spacing-xs);
}
</style>
