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

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import ContactMode from '../../enums/ContactMode.enum';
import ContactCard from '../contact-card/the-contact-card.vue';
import ContactHeader from './contact-header.vue';
import EmptyContact from './empty-contact.vue';

const props = defineProps({
	list: {
		type: Array,
		required: true,
	},
	linkedContact: {
		type: Object,
		default: null,
	},
	size: {
		type: String,
		default: ComponentSize.MD,
	},
	mode: {
		type: String,
	},
	namespace: {
		type: String,
		required: true,
	},
});

const emit = defineEmits([
	'link',
	'add',
]);

const index = ref(0);
const store = useStore();

const isLoading = computed(
	() => getNamespacedState(store.state, props.namespace).isLoading,
);

const isNext = computed(() => index.value < props.list.length - 1);
const isPrev = computed(() => index.value > 0);

const currentContact = computed(() => props.list[index.value]);
const isEmptyContact = computed(
	() =>
		!props.list.length && props.mode === ContactMode.VIEW && !isLoading.value,
);
const isTaskActive = computed(() => store.getters['workspace/IS_TASK_ACTIVE']);

function linkedContact() {
	try {
		emit('link', currentContact.value);
		index.value = 0;
	} catch (err) {
		throw err;
	}
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
	() => (index.value = 0),
);
</script>

<style scoped lang="scss">
.contact-list-wrapper {
  padding: var(--spacing-xs);
  flex-grow: 1;
}
</style>
