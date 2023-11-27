<template>
  <wt-expansion-panel :size="props.size">
    <template v-slot:title>{{ t('infoSec.contacts.communications') }}</template>
    <template>
      <div class="contact-info-communications">
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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ContactCardPhones from './contact-card-phones.vue';
import ContactCardEmails from './contact-card-emails.vue';

const { t } = useI18n();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
  },
});

const tabs = computed(() => [
  {
    text: t('vocabulary.phones', 2),
    value: 'phones',
    component: ContactCardPhones,
  },
  {
    text: t('vocabulary.emails', 2),
    value: 'emails',
    component: ContactCardEmails,
  },
]);

const currentTab = ref({});

function changeTab(tab) {
  currentTab.value = tab;
}

onMounted(() => changeTab(tabs.value[0]));
</script>

<style lang="scss" scoped>
.contact-info-communications {
  padding: var(--spacing-xs);
}
</style>
