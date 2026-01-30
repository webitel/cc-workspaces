<template>
  <div class="view-contact-wrapper">
    <div v-if="!isLoading" class="view-contact-wrapper__loader">
      <wt-loader />
    </div>
    <contacts-list-wrapper
      v-else
      :mode="props.mode"
      :size="props.size"
      :list="listedContacts"
      :linked-contact="contact"
      :namespace="props.namespace"
      @link="linkContact"
      @add="add"
    />
  </div>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';

import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: ComponentSize.MD,
  },
  mode: {
    type: String,
  },
});

const store = useStore();

const contact = computed(() => getNamespacedState(store.state, props.namespace).contact);
const isLoading = computed(() => getNamespacedState(store.state, props.namespace).isLoading);
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
.view-contact-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.view-contact-wrapper__loader {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
