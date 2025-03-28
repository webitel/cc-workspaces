<template>
  <section class="empty-workspace">
    <component :is="`${type}-ws`"></component>
  </section>
</template>

<script>
  import EmptyWs from './components/empty-workspace-empty.vue';
  import TransferWs from './components/empty-workspace-transfer.vue';

  export default {
    name: 'empty-workspace',
    components: {
      EmptyWs,
      TransferWs,
    },
    props: {
      type: {
        type: String,
        default: 'empty',
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'css/empty-workspace';
</style>
