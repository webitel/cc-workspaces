<template>
  <div class="contact-list-wrapper">
    <div v-if="props.list.length">
      <contact-header
        :isNext="isNext"
        :isPrev="isPrev"
        :lenght="props.list?.length"
        :index="index"
        @next="next"
        @prev="prev"
      ></contact-header>
      <contact-card
        :size="size"
        :contact="currentContact"
        :linked="!!props.linkedContact?.id"
        @link="linkedContact"
      ></contact-card>
      </div>
    <empty-contact v-if="props.list.length && props.mode === ContactMode.VIEW"></empty-contact>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

function linkedContact() {
  try {
    emit('link', currentContact.value);
    index.value = 0;
  } catch (e) {
    console.error(e);
  }
}

function next() {
  index.value += 1;
}

function prev() {
  index.value -= 1;
}
</script>

<style scoped lang="scss">
.contact-list-wrapper {
  padding: var(--spacing-xs);
}
</style>
