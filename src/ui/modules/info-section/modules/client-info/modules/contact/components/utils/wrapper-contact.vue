<template>
  <div>
    <header-contact
      :lenght="props.listContacts.length"
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
import { computed, onMounted, ref } from 'vue';
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
const currentIndex = ref(0);

function setCurrentContact(idx) {
  return store.dispatch(`${namespace}/SET_CURRENT_CONTACT`, props.listContacts[idx]);
}

function nextContact() {
  currentIndex.value += 1;
  setCurrentContact(currentIndex.value);
}

function prevContact() {
  currentIndex.value -= 1;
  setCurrentContact(currentIndex.value);
}

onMounted(() => {
  if (props.listContacts.length === 1) {
    setContact(props.listContacts[0].id);
  }
  setCurrentContact(currentIndex.value);
});

</script>

<style lang="scss" scoped>

</style>
