<template>
  <div class="contact-list-wrapper">
    <div v-if="props.list.length">
      <contact-header
        :is-next="isNext"
        :is-prev="isPrev"
        :length="props.list?.length"
        :index="index"
        @next="next"
        @prev="prev"
      />
      <contact-card
        :size="props.size"
        :contact="currentContact"
        :linked="!!props.linkedContact?.id"
        @link="linkedContact"
      />
    </div>
    <empty-contact
      v-if="isEmptyContact"
      :size="props.size"
      :allow-addition="isTaskActive"
      @add="add"
    />
  </div>
</template>

<script setup lang="ts">
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import ContactMode from '../../enums/ContactMode.enum';
import { useContactStore } from '../../store/contactStore';
import ContactCard from '../contact-card/the-contact-card.vue';
import ContactHeader from './contact-header.vue';
import EmptyContact from './empty-contact.vue';

const props = withDefaults(
	defineProps<{
		list: WebitelContactsContact[];
		linkedContact?: WebitelContactsContact | null;
		size?: ComponentSize;
		mode?: string;
	}>(),
	{
		linkedContact: null,
		size: ComponentSize.MD,
	},
);

const emit = defineEmits<{
	link: [
		contact: WebitelContactsContact,
	];
	add: [];
}>();

const index = ref(0);
const store = useStore();
const contactStore = useContactStore();
const { isLoading } = storeToRefs(contactStore);

const isNext = computed(() => index.value < props.list.length - 1);
const isPrev = computed(() => index.value > 0);

const currentContact = computed(() => props.list[index.value]);
const isEmptyContact = computed(
	() =>
		!props.list.length && props.mode === ContactMode.VIEW && !isLoading.value,
);
const isTaskActive = computed(() => store.getters['workspace/IS_TASK_ACTIVE']);

function linkedContact() {
	emit('link', currentContact.value);
	index.value = 0;
}

function next() {
	index.value += 1;
}

function prev() {
	index.value -= 1;
}

function add() {
	emit('add');
}

watch(
	() => props.list,
	() => {
		index.value = 0;
	},
);
</script>

<style scoped lang="scss">
.contact-list-wrapper {
  padding: var(--spacing-xs);
  flex-grow: 1;
}
</style>
