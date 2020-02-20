<template>
  <section class="workspace-section">
    <client-info></client-info>
  </section>
</template>

<script>
  import ClientInfo from './client-info-tab.vue';

  export default {
    name: 'the-operator-info-section',
    components: {
      ClientInfo,
    },
  };
</script>

<style lang="scss" scoped>
  .client-info {
    padding: 20px;
  }
</style>
