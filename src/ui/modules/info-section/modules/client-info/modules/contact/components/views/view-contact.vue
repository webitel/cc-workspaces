<template>
  <div>
      <wt-loader v-if="isLoading"/>
      <contacts-list-wrapper
        v-else
        :mode="props.mode"
        :size="props.size"
        :list="listedContacts"
        :linked-contact="contact"
        @link="linkContact"
        @add="add"
      />
  </div>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';

import { useContactStore } from '../../store/contactStore';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';
import { storeToRefs } from 'pinia';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		mode?: string;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const contactStore = useContactStore();
const { contact, isLoading, contactsByDestination } = storeToRefs(contactStore);
const { linkContact } = contactStore;

const listedContacts = computed(() => {
	return contact.value
		? [
				contact.value,
			]
		: [
				...contactsByDestination.value,
			];
});

const emit = defineEmits<{
	add: [];
}>();

function add() {
	emit('add');
}
</script>

<style scoped lang="scss">
</style>
