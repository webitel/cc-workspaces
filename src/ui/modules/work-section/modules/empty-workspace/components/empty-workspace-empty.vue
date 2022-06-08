<template>
  <div class="empty-workspace__content-wrap">
    <div class="workspace-pic">
      <img src="../assets/empty-ws-empty.svg" alt="Workspace is empty"/>
    </div>
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
  @import '../css/empty-workspace';
</style>
