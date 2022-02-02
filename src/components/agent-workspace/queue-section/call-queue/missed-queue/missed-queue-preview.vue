<template>
  <article class="queue-preview">
    <status-chip :state="previewStatusClass"/>

    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{displayName | truncate(18)}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="missed-preview__call-time">
        {{$t('queueSec.call.at')}}: {{displayTime}}
      </div>
    </header>

    <section class="queue-preview-body">
      <div class="missed-preview__number">
        {{ displayNumber | truncateFromEnd(18) }}
      </div>
    </section>
    <footer class="queue-preview-footer"></footer>
  </article>
</template>

<script>
  // import { mapState, mapActions } from 'vuex';
  import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
  import StatusChip from '../call-status-icon-chip.vue';

  export default {
    name: 'missed-queue-preview',
    components: {
      StatusChip,
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
        return prettifyTime(this.call.createdAt);
      },

      previewStatusClass() {
        return 'missed';
      },
    },

    methods: {},
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
  .missed-preview__call-time {
    @extend %typo-body-md;
  }
</style>
