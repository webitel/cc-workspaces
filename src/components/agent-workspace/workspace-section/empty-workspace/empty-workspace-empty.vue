<template>
  <div class="empty-workspace__content-wrap">
    <div class="workspace-pic">
      <iframe
        :src="animationUrl"
      ></iframe>
    </div>
    <h1 class="empty-workspace__heading">{{$t('emptyWorkspace.empty.heading')}}</h1>
    <p class="empty-workspace__text">{{$t('emptyWorkspace.empty.text')}}</p>
  </div>
</template>

<script>
  export default {
    name: 'empty-workspace-empty',
    computed: {
      animationUrl() {
        const baseUrl = process.env.BASE_URL; // to resolve iframe equalizer path after build
        return `${baseUrl}animations/ws-empty/index.html`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/empty-workspace/empty-workspace';
</style>
