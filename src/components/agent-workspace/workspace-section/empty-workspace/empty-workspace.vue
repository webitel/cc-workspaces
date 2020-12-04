<template>
  <section class="empty-workspace">
<!--    <transfer-ws v-if="false"/>-->
    <empty-ws/>
  </section>
</template>

<script>
  import EmptyWs from './empty-workspace-empty.vue';
  // import TransferWs from './empty-workspace-transfer.vue';

  export default {
    name: 'empty-workspace',
    components: {
      EmptyWs,
      // TransferWs,
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/empty-workspace/empty-workspace';
</style>
