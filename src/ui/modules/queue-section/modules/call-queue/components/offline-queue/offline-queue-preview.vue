<template>
  <component
    :is="component"
    :task="task"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <wt-icon
        :size="size"
        icon="call"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:chips>
      <wt-chip
        v-if="displayQueueName"
        color="secondary"
      >
        {{ displayQueueName }}
      </wt-chip>
    </template>

    <template v-slot:quick-action>
      <offline-queue-preview-callback
        :size="size"
        :task="task"
      />
    </template>
  </component>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueuePreviewMd from '../../../_shared/components/task-preview/task-queue-preview-md.vue';
import TaskQueuePreviewSm from '../../../_shared/components/task-preview/task-queue-preview-sm.vue';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import offlineQueuePreviewCallback from './offline-queue-preview-callback.vue';

export default {
  name: 'offline-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  components: { offlineQueuePreviewCallback },
  emits: ['click'],
  computed: {
    displayName() {
      return this.task.name;
    },
    displayQueueName() {
      return this.task.queue?.name;
    },
    component() {
      return this.size === 'sm' ? TaskQueuePreviewSm : TaskQueuePreviewMd;
    },
  },
};
</script>

<!--// removed "scoped" to style a tooltip content-->
<style lang="scss">
//.queue-preview {
//  &.queue-preview--offline-queue {
//    display: flex;
//    align-items: center;
//    flex-wrap: nowrap;
//    justify-content: center;
//    gap: var(--spacing-2xs);
//  }
//
//  .queue-preview--offline-queue__title {
//    overflow: hidden;
//    @extend %typo-subtitle-1;
//    width: 100%;
//    white-space: nowrap;
//    text-overflow: ellipsis;
//  }
//
//  &.queue-preview--sm {
//    .queue-preview--offline-queue__title {
//      text-align: center;
//    }
//  }
//
//  .queue-preview--offline-queue__icon {
//    display: flex;
//  }
//
//  .queue-preview--offline-queue__callback-container {
//    display: flex;
//    justify-content: center;
//
//    .wt-context-menu__option {
//      padding: 0;
//    }
//
//    .queue-preview--offline-queue__callback-button {
//      padding: var(--spacing-xs);
//    }
//  }
//
//  .wt-tooltip {
//    align-self: flex-end;
//  }
//
//  &--md.queue-preview--offline-queue {
//    flex-direction: row;
//  }
//
//  &--sm {
//    .queue-preview--offline-queue__title {
//      @extend %typo-body-2;
//    }
//  }
//}
//
//.queue-preview--offline-queue__name {
//  @extend %typo-subtitle-1;
//}
</style>
