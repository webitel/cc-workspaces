<template>
  <article class="queue-preview">
    <status-badge/>

    <header class="preview-header">
      <span class="preview-header__name">{{displayName}}</span>
    </header>
  </article>
</template>

<script>
  import StatusBadge from '../call-status-icon-badge.vue';

  export default {
    name: 'offline-queue-preview',
    components: {
      StatusBadge,
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/queue-section/queue-call-preview';
</style>
