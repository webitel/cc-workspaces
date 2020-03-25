<template>
  <div class="empty-workspace__content-wrap">
    <img
      class="workspace-pic"
      src="../../../../assets/agent-workspace/empty-ws/empty-ws-empty.svg"
      alt="workspace is empty"
    >
    <h1 class="empty-workspace__heading">There are currently no calls or chats</h1>
    <p class="empty-workspace__text">Please wait! Have a nice work!</p>
  </div>
</template>

<script>
  export default {
    name: 'empty-workspace-empty',
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/empty-workspace/empty-workspace';
</style>
