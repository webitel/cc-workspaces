<template>
  <article class="queue-preview offline-queue" :class="{'queue-preview--opened': opened}">
    <status-badge/>

    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{displayName}}</span>
    </header>

    <section class="queue-preview-body"></section>
    <footer class="queue-preview-footer"></footer>
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
      opened: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      displayName() {
        return this.member.name;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
  .queue-preview-header__name {
    @media screen and (max-width: 1336px) {
      display: block;
    }
  }
</style>
