<template>
  <article
    class="contact"
  >
    <wt-expansion-panel>
      <template v-slot:title>{{ $t('infoSec.contacts.client') }}
        <div class="contact-actions">
          <wt-icon-btn
            icon="search"
          ></wt-icon-btn>
          <wt-icon-btn
            icon="plus"
          ></wt-icon-btn>
        </div>
      </template>
      <template>
        <wrapper-contact
          v-if="currentViewState === viewStateList.VIEW"
          :size="props.size"
          :listContact="listContacts">
        </wrapper-contact>
<!--        <contact-card-->
<!--          v-if="currentViewState === viewStateList.VIEW"-->
<!--          :size="props.size"-->
<!--          :contact="currentContact"/>-->
<!--        <add-contact-->
<!--          v-if="isAddContact"-->
<!--          :size="props.size"-->
<!--          @close="closeAddContact"/>-->
        <!--        <empty-contact-->
        <!--          v-if="showContact === 2"-->
        <!--          :size="props.size"-->
        <!--        />-->
        <!--        <search-contact v-if="showContact === 4" :size="props.size" @search="updateSearchKey({key, value})"/>-->
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import WorkspaceStates from '../../../../../../../enums/WorkspaceState.enum';
import ContactCard from './contact-card/the-contact-card.vue';
import EmptyContact from './utils/empty-contact.vue';
import AddContact from './utils/add-contact.vue';
import SearchContact from './utils/search-contact.vue';
import { useStore } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import ContactsAPI from '../api/ContactsAPI';
import WrapperContact from './utils/wrapper-contact.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
});

const { t } = useI18n();
const store = useStore();

const call = computed(() => store.state.features.call.callList[0]);
const contactId = computed(() => store.getters['features/call/CALL_ON_WORKSPACE'].contactId);

const number = computed(() => call.value.from.number);
const currentContact = computed(() => store.state.ui.infoSec.client.contact.currentContact);
const listContacts = computed(() => store.state.ui.infoSec.client.contact.listContacts);
const viewStateList = Object.freeze({
  SEARCH: 'search',
  ADD: 'add',
  VIEW: 'view',
});
const currentViewState = ref('');

const namespace = 'ui/infoSec/client/contact';

async function getCurrentContact(id) {
  const contact = await ContactsAPI.get({ itemId: id });
  return store.dispatch(`${namespace}/SET_CURRENT_CONTACT`, contact);
}
async function setContact(id) {
  return await call.value.setContact(Number(id));
}

// async function closeAddContact(id) {
//   await setContact(id);
//   await getCurrentContact(id);
//   isAddContact.value = !isAddContact.value;
// }

async function initContacts() {
  // if (contactId.value) {
  //   getCurrentContact(contactId.value);
  // } else {
    const listContacts = await ContactsAPI.getList({ fields: ['variables', 'mode', 'timezones', 'phones', 'emails', 'name', 'managers', 'labels', 'about'], qin: 'emails,phones', q: `${number.value}*` });
    // if (listContacts.length === 1) {
    //   setContact(listContacts[0].id);
    //   return store.dispatch(`${namespace}/SET_CURRENT_CONTACT`, listContacts[0]);
    // } else {
      return store.dispatch(`${namespace}/SET_LIST_CONTACTS`, listContacts);
  //   }
  // }
}

onMounted(() => {
  initContacts();
  currentViewState.value = viewStateList.VIEW;
});
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
    gap: calc(var(--spacing-xs) / 2);
  }
}
</style>
