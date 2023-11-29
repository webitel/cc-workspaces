<script setup>
import { computed } from 'vue';
import ContactsListWrapper from './contacts-list-wrapper_2.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const contact = computed(() => {
  // return contact from store
  return {};
});

const contactsByDestination = computed(() => {
  // return contacts from store
  return [];
});

const listedContacts = computed(() => {
  return contact.value ? [contact] : contactsByDestination;
});

function linkContact(contact) {
  // dispatch link action
}
</script>

<template>
<contacts-list-wrapper
  :list="listedContacts"
  :linked-contact="contact"
  @link="linkContact"
></contacts-list-wrapper>
</template>

<style scoped lang="scss">

</style>
