<template>
  <article
    :class="`queue-preview--${size}`"
    class="queue-preview queue-preview--offline-queue"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >

    <template v-if="size === 'sm'">
      <div class="queue-preview--offline-queue__header">
        <wt-icon
          :size="size"
          color="hold"
          icon="call"
        ></wt-icon>
        <wt-tooltip>
          <template v-slot:activator>
            <wt-icon-btn
              color="transfer"
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
      </div>
    </template>


    <div class="queue-preview--offline-queue__icon">
      <wt-icon
        v-if="size === 'md'"
        color="hold"
        icon="call"
        size="md"
      ></wt-icon>
      <wt-avatar
        v-else
        size="sm"
      ></wt-avatar>
    </div>


    <section class="queue-preview--offline-queue__title">
      {{ displayName }}
    </section>
    <offline-queue-preview-callback
      :size="size"
      :task="task"
    />
  </article>
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
    gap: var(--spacing-xs);
  }

  .queue-preview--offline-queue__header {
    display: flex;
    justify-content: space-between;
    width: 100%;
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
      @extend %typo-subtitle-2;
    }
  }
}

.queue-preview--offline-queue__name {
  @extend %typo-subtitle-1;
}
</style>
