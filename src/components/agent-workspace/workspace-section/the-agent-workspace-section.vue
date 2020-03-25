<template>
  <section class="workspace-section">
    <call/>
  </section>
</template>

<script>
  import Call from './call/the-call.vue';

  export default {
    name: 'the-agent-workspace-section',
    components: {
      Call,
    },
  };
</script>

<style lang="scss" scoped>
  .chat {
    height: 100%;
  }
</style>
