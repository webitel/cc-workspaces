<template>
  <div>
    <header-contact
      @next="nextContact"
      @prev="prevContact"
    ></header-contact>
    <contact-card
      :size="props.size"
      :contact="currentContact"
      :isOnSelection="contactId"
    ></contact-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ContactCard from '../contact-card/the-contact-card.vue';
import HeaderContact from './header-contact.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
  listContacts: {
    type: Array,
  },
});

const store = useStore();
const namespace = 'ui/infoSec/client/contact';

async function setContact(id) {
  return await call.value.setContact(Number(id));
}

const contactId = computed(() => store.getters['features/call/CALL_ON_WORKSPACE'].contactId);
const currentContact = computed(() => store.state.ui.infoSec.client.contact.currentContact);

function setCurrentContact(i) {
  return store.dispatch(`${namespace}/SET_CURRENT_CONTACT`, props.listContacts[i]);
}


onMounted(() => {
  if (props.listContacts.length === 1) {
    setContact(props.listContacts[0].id);
  }
  setCurrentContact(0);
});

</script>

<style lang="scss" scoped>

</style>
