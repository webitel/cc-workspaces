<template>
  <article
    class="queue-preview queue-preview--offline-queue"
    :class="`queue-preview--${size}`"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >

    <wt-tooltip v-if="size === 'sm'">
      <template v-slot:activator>
        <wt-icon-btn
          color="secondary"
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

    <wt-icon
      size="md"
      color="hold"
      icon="call"
    ></wt-icon>

    <section class="queue-preview--offline-queue__title">
      {{ displayName }}
    </section>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'offline-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],

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

// removed "scoped" to style a tooltip content
<style lang="scss">
.queue-preview {
&.queue-preview--offline-queue {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--spacing-2xs);
}

  .queue-preview--offline-queue__title {
    @extend %typo-subtitle-1;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
