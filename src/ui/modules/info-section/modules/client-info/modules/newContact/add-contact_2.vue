<script setup>
import { ref } from 'vue';

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

const emit = defineEmits([
  'close',
]);

const isSaving = ref(false);

function close() {
  emit('close');
}

async function save() {
  // await addContact(); // IN STORE
  close();
}

</script>

<template>
  <!--  HERE GOES FORM -->
  <wt-button>Save</wt-button>
  <wt-button>Close</wt-button>
</template>

<style scoped lang="scss">

</style>
