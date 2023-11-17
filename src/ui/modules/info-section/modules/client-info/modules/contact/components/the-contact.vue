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
        <contact-info :size="props.size" />
        <!--        <add-contact v-if="showContact === 3" :size="props.size"/>-->
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
import ContactInfo from './contact-info/the-contact-info.vue';
import EmptyContact from './utils/empty-contact.vue';
import AddContact from './utils/add-contact.vue';
import SearchContact from './utils/search-contact.vue';
import { useStore } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import ContactsAPI from '../api/ContactsAPI';

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
const hideContact = computed(() => store.getters['features/call/CALL_ON_WORKSPACE'].hideContact);

const searchKey = ref('');
const searchValue = ref('');

const number = computed(() => call.value.from.number);
const namespace = 'ui/infoSec/client/contact';
const selectedContact = computed(() => store.state.ui.infoSec.client.contact.selectedContact);
const listContact = computed(() => store.state.ui.infoSec.client.contact.listContact);

// function updateSearchKey({ key, value }) {
//   searchKey.value = key;
//   searchValue.value = value;
// }

async function loadContact() {
  if (contactId.value) {
    const contact = await ContactsAPI.get({ itemId: contactId.value });
    return store.dispatch(`${namespace}/LOAD_CONTACT`, contact);
  } else {
    const listContacts = await ContactsAPI.getList({ fields: ['managers', 'labels', 'about'], qin: 'emails,phones', q: `${number.value}*` });
    if (listContacts.items.length === 1) {
      const setContact = await call.value.setContact(383);
      return store.dispatch(`${namespace}/LOAD_CONTACT`, listContacts.items[0]);
    } else {
      return store.dispatch(`${namespace}/LOAD_LIST_CONTACTS`, listContacts);
    }
  }
}

onMounted(() => {
  loadContact();
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
