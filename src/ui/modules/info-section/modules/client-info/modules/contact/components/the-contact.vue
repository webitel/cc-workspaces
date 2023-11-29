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
let unwatchContactIdWatcher = null;
function setupWatchForContactId() {
  return watch(() => props.task.contactId, (contactId) => {
    if(contactId) loadContact(contactId);
  });
}

watch(() => props.task, () => {
  initializeContact();
  if (unwatchContactIdWatcher) unwatchContactIdWatcher();
  unwatchContactIdWatcher = setupWatchForContactId();
}, { immediate: true });

// onMounted(() => {
//   console.log('mounted')
//   initializeContact();
// });
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
