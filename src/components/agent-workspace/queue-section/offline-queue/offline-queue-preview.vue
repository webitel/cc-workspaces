<template>
  <article class="queue-preview">
    <status-badge/>

    <header class="preview-header">
      <span class="preview-header__name">{{member.name}}</span>
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

    props: {
      member: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/queue-section/queue-call-preview';
</style>
