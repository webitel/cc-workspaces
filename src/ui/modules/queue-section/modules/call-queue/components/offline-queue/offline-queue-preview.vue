<template>
  <component
    :is="component"
    @click="emit('click', task)"
  >

    <wt-tooltip v-if="size === 'sm'">
      <template v-slot:activator>
        <wt-icon-btn
          color="info"
          icon="rounded-info"
          size="sm"
        ></wt-icon-btn>
      </template>
      <span
        class="queue-preview--offline-queue__name"
      >{{ displayName }}
      </span>
      <div
        v-if="displayQueueName"
      >
        <wt-chip color="secondary">
          {{ displayQueueName }}
        </wt-chip>
      </div>
    </wt-tooltip>

    <div class="queue-preview--offline-queue__icon">
      <wt-icon
        icon="call"
        size="md"
      ></wt-icon>
    </div>


    <section class="queue-preview--offline-queue__title">
      {{ displayName }}
    </section>
    <offline-queue-preview-callback
      :task="task"
      :size="size"
    />
  </component>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import offlineQueuePreviewCallback from './offline-queue-preview-callback.vue';

export default {
  name: 'offline-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  components: { offlineQueuePreviewCallback },

  computed: {
    displayName() {
      return this.task.name;
    },
    displayQueueName() {
      return this.task.queue?.name;
    },
  },
};
</script>

<!--// removed "scoped" to style a tooltip content-->
<style lang="scss">
.queue-preview {
  &.queue-preview--offline-queue {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    gap: var(--spacing-2xs);
  }

  .queue-preview--offline-queue__title {
    overflow: hidden;
    @extend %typo-subtitle-1;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.queue-preview--sm {
    .queue-preview--offline-queue__title {
      text-align: center;
    }
  }

  .queue-preview--offline-queue__icon {
    display: flex;
  }

  .queue-preview--offline-queue__callback-container {
    display: flex;
    justify-content: center;

    .wt-context-menu__option {
      padding: 0;
    }

    .queue-preview--offline-queue__callback-button {
      padding: var(--spacing-xs);
    }
  }

  .wt-tooltip {
    align-self: flex-end;
  }

  &--md.queue-preview--offline-queue {
    flex-direction: row;
  }

  &--sm {
    .queue-preview--offline-queue__title {
      @extend %typo-body-2;
    }
  }
}

.queue-preview--offline-queue__name {
  @extend %typo-subtitle-1;
}
</style>
