<script setup>
const props = defineProps({
  contact: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});
</script>

<template>
{{ contact }}
</template>

<style scoped lang="scss">

</style>
