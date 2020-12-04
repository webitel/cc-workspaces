<template>
  <article class="queue-preview offline-queue" :class="{'queue-preview--opened': isOpened}">
    <status-badge/>

    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{displayName}}</span>
    </header>

    <section class="queue-preview-body"></section>
    <footer class="queue-preview-footer"></footer>
  </article>
</template>

<script>
  import { mapState } from 'vuex';
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

    computed: {
      ...mapState('member', {
        memberOnWorkspace: (state) => state.memberOnWorkspace,
      }),

      isOpened() {
        return this.member === this.memberOnWorkspace;
      },

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
