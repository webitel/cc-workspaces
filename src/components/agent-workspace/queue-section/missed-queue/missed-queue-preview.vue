<template>
  <article class="queue-preview">
    <status-badge :state="computePreviewStatusClass"/>

    <header class="preview-header">
      <span class="preview-header__name">{{displayName | truncate(18)}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="preview-header__time">
        {{$t('queueSec.at')}}: {{displayTime}}
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
      // index is for action calls
      index: {
        type: Number,
        required: true,
      },

      // item is for UI computing
      call: {
        type: Object,
        required: true,
      },
    },

    computed: {
      displayName() {
        return this.call.from.name;
      },
      displayNumber() {
        return this.call.from.number;
      },
      displayTime() {
        return new Date(+this.call.createdAt).toLocaleTimeString().slice(0, 5); // hh:mm
      },

      computePreviewStatusClass() {
        return 'missed';
      },
    },

    methods: {},
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/queue-section/queue-call-preview';
</style>
