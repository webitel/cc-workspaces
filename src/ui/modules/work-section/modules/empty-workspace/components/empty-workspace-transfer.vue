<template>
  <div class="empty-workspace__content-wrap">
    <img
      class="workspace-pic"
      src="../assets/empty-ws-transfer.svg"
      alt="workspace is empty"
    >
    <h1 class="empty-workspace__heading typo-subtitle-1">{{$t('emptyWorkspace.transfer.heading')}}</h1>
    <p class="empty-workspace__text typo-caption">{{$t('emptyWorkspace.transfer.text')}}</p>
  </div>
</template>

<script>
  export default {
    name: 'EmptyWorkspaceTransfer',
  };
</script>

<style lang="scss" scoped>
  @import '../css/empty-workspace';
</style>
