<template>
  <section class="workspace-section">
    <call-preview></call-preview>
    <message-preview></message-preview>
    <message-preview></message-preview>
  </section>
</template>

<script>
  import CallPreview from './queue-call-preview.vue';
  import MessagePreview from './queue-message-preview.vue';

  export default {
    name: 'the-operator-queue-section',
    components: {
      CallPreview,
      MessagePreview,
    },
  };
</script>

<style lang="scss" scoped>

</style>
