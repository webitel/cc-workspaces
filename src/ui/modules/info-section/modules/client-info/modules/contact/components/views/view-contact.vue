<template>
  <contacts-list-wrapper
    :list="listedContacts"
    :linked-contact="contact"
    :mode="props.mode"
    @link="linkContact"
  ></contacts-list-wrapper>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
  mode: {
    type: String,
  },
});

const store = useStore();

// const index = ref(0);
const contact = computed(() => store.state.ui.infoSec.client.contact.contact);
const contactsByDestination = computed(() => store.state.ui.infoSec.client.contact.contactsByDestination);

const listedContacts = computed(() => {
  return contact.value ? [contact.value] : [...contactsByDestination.value];
});

function linkContact(contact) {
    store.dispatch(`${props.namespace}/LINK_CONTACT`, contact);
}
</script>

<style scoped lang="scss">

</style>
