<template>
  <div class="empty-workspace__content-wrap">
    <div class="workspace-pic">
      <img src="../assets/empty-ws-empty.svg" alt="Workspace is empty"/>
    </div>
    <h1 class="empty-workspace__heading typo-subtitle-1">{{$t('emptyWorkspace.empty.heading')}}</h1>
    <p class="empty-workspace__text typo-caption">{{$t('emptyWorkspace.empty.text')}}</p>
  </div>
</template>

<script>
  export default {
    name: 'EmptyWorkspaceEmpty',
  };
</script>

<style lang="scss" scoped>
  @import '../css/empty-workspace';
</style>
