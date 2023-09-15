<template>
  <component
    :is="`task-queue-preview-${size}`"
    class="queue-preview--missed"
  >
    <template
      v-slot:icon
    >
      <wt-icon
        color="danger"
        icon="call-missed"
        :size="size"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-avatar size="sm"></wt-avatar>
    </template>
    <template v-slot:timer>
      <span class="missed-preview__task-time">
        {{ displayTime }}
      </span>
    </template>
    <template v-slot:title>
      {{ displayName }}
    </template>
    <template v-slot:body>
      {{ displayNumber }}
    </template>
    <template v-slot:footer>
      <div class="queue-preview--missed__callback-wrapper">
        <wt-rounded-action
          :size="size"
          color="success"
          icon="call--filled"
          rounded
          @click="call"
        ></wt-rounded-action>
      </div>
    </template>
  </component>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import { mapActions } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'missed-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],

  computed: {
    displayName() {
      return this.task.from?.name || '';
    },
    displayNumber() {
      return this.task.from?.number || '';
    },
    displayTime() {
      return prettifyTime(this.task.createdAt);
    },
  },
  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    call() {
      const { number } = this.task.from;
      return this.makeCall({ number });
    },
  },
};
</script>

<style lang="scss" scoped>
.queue-preview--missed {
  &.queue-preview--md {
    flex-direction: row;
    :deep .missed-preview__task-time {
      text-align: end;
    }
  }
  &.queue-preview--sm {
    .queue-preview--missed__callback-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :deep .missed-preview__task-time {
      text-align: center;
      display: block;
    }
  }
}

.missed-preview__task-time {
  @extend %typo-body-2;
  overflow: hidden;
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
