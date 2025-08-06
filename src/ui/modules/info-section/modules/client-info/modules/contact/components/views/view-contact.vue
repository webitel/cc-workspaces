<template>
  <div>
    <wt-replace-transition duration="normal" >
      <wt-loader v-if="isLoading"/>
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
    </wt-replace-transition>
  </div>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';

import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';

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
</style>
