<script setup>
import { ref, computed } from 'vue';
import ContactCard from './contact-card.vue';
import ContactHeader from './contact-header.vue';

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
    default: 'md',
  },
});

const emit = defineEmits([
  'link',
]);

const index = ref(0);

const isNext = computed(() => index.value < props.list.length - 1);
const isPrev = computed(() => index.value > 0);

const currentContact = computed(() => props.list[index.value]);

function next() {}
function prev() {}
</script>

<template>
  <contact-header></contact-header>
  <contact-card
    :contact="currentContact"
    :linked="currentContact.id === linkedContact.id"
    @link="emit('link', currentContact)"
  ></contact-card>
</template>

<style scoped lang="scss">

</style>
