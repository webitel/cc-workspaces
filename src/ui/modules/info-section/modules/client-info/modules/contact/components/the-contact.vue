<template>
  <article
    class="contact"
  >
    <wt-expansion-panel>
      <template v-slot:title>{{ t('infoSec.contacts.client') }}
        <div class="contact-actions">
          <wt-icon-btn
            icon="search"
            @click.stop="changeMode(ContactMode.SEARCH)"
          ></wt-icon-btn>
          <wt-icon-btn
            icon="plus"
            @click.stop="changeMode(ContactMode.ADD)"
          ></wt-icon-btn>
        </div>
      </template>
      <template>
        <add-contact
          v-if="mode === ContactMode.ADD"
          :namespace="namespace"
          @close="changeMode(ContactMode.VIEW)"
        />
        <search-contact
          v-if="mode === ContactMode.SEARCH"
          :namespace="namespace"
          @close="changeMode(ContactMode.VIEW)"
        />
        <view-contact
          v-if="mode === ContactMode.VIEW && !isEmpty(props.task)"
          :mode="mode"
          :namespace="namespace"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import AddContact from './views/add-contact.vue';
import SearchContact from './views/search-contact.vue';
import ViewContact from './views/view-contact.vue';
import ContactMode from '../enums/ContactMode.enum';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();
const mode = ref(ContactMode.VIEW);
const namespace = 'ui/infoSec/client/contact';

const changeMode = (newMode) => {
  mode.value = newMode;
};

function initializeContact() {
  return store.dispatch(`${namespace}/INITIALIZE_CONTACT`);
}

function loadContact(contactId) {
  return store.dispatch(`${namespace}/LOAD_CONTACT`, contactId);
}

/*
  we need to watch both for task itself and for task.contactId, because we want to handle 2 cases:
  1. contactId appears after linking contact to task => we need to load this contact
  2. task is changes => we need to reset contact

  but we need to prevent both of these cases handlers fire at one time because if task changes, task.contactId changes too
  so there would be 2 calls of loadContact() and initializeContact() at one time
 */
watch([() => props.task, () => props.task.contactId], ([task, prevTask], [contactId, prevContactId]) => {
  if (task.id !== prevTask.id) {
    changeMode(ContactMode.VIEW);
    initializeContact();
    return;
  }

  if (task.id === prevTask.id && contactId !== prevContactId) {
    if (contactId) {
      loadContact(contactId);
      changeMode(ContactMode.VIEW);
    }
    return;
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  &-actions {
    display: flex;
    flex: 1;
    justify-content: end;
    gap: calc(var(--spacing-xs) / 2); ///спитати Женю
  }
}
</style>
