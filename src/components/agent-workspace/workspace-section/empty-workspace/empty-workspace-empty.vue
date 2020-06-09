<template>
  <div class="empty-workspace__content-wrap">
    <img
      class="workspace-pic"
      src="../../../../assets/agent-workspace/empty-ws/empty-ws-empty.svg"
      alt="workspace is empty"
    >
    <h1 class="empty-workspace__heading">{{$t('emptyWorkspace.empty.heading')}}</h1>
    <p class="empty-workspace__text">{{$t('emptyWorkspace.empty.text')}}</p>
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
