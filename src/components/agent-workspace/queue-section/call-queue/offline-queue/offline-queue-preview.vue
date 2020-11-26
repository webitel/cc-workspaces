<template>
  <article class="queue-preview offline-queue" :class="{'opened': isOpened}">
    <status-badge/>

    <header class="preview-header">
      <span class="preview-header__name">{{member.name}}</span>
    </header>
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
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
