<template>
  <article class="queue-preview">
    <status-badge :state="computePreviewStatusClass"/>

    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{displayName | truncate(18)}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="queue-preview-header__time">
        {{$t('queueSec.call.at')}}: {{displayTime}}
      </div>
    </header>

    <span
      class="call-preview__number">{{displayNumber | truncateFromEnd(18)}}</span>
  </article>
</template>

<script>
  // import { mapState, mapActions } from 'vuex';
  import StatusBadge from '../call-status-icon-badge.vue';

  export default {
    name: 'missed-queue-preview',
    components: {
      StatusBadge,
    },

    props: {
      // item is for UI computing
      call: {
        type: Object,
        required: true,
      },
    },

    computed: {
      displayName() {
        return this.call.from?.name || '';
      },
      displayNumber() {
        return this.call.from?.number || '';
      },
      displayTime() {
        const time = new Date(+this.call.createdAt);
        return `${time.getHours()}:${time.getMinutes()}`;
      },

      computePreviewStatusClass() {
        return 'missed';
      },
    },

    methods: {},
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
