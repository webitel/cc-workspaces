<template>
  <contacts-list-wrapper
    :mode="props.mode"
    :size="props.size"
    :list="listedContacts"
    :linked-contact="contact"
    :isLoading="props.isLoading"
    @link="linkContact"
    @add="add"
  ></contacts-list-wrapper>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
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
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

const contact = computed(() => getNamespacedState(store.state, props.namespace).contact);
const contactsByDestination = computed(() => getNamespacedState(store.state, props.namespace).contactsByDestination);
const listedContacts = computed(() => {
  return contact.value ? [contact.value] : [...contactsByDestination.value];
});

const emit = defineEmits(['add']);

function add() {
  emit('add');
}

function linkContact(contact) {
  store.dispatch(`${props.namespace}/LINK_CONTACT`, contact);
}
</script>

<style scoped lang="scss">

</style>
