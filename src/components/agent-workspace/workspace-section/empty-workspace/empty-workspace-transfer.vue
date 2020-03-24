<template>
  <div class="empty-workspace__content-wrap">
    <img
      class="workspace-pic"
      src="../../../../assets/agent-workspace/empty-ws/empty-ws-transfer.svg"
      alt="workspace is empty"
    >
    <h1 class="empty-workspace__heading">Thanks You!</h1>
    <p class="empty-workspace__text">Call has been transferred to another operator</p>
  </div>
</template>

<script>
  export default {
    name: 'empty-workspace-transfer',
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/empty-workspace/empty-workspace';
</style>
