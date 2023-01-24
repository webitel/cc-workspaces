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
      {{ displayName }}
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
  },
};
</script>

<style lang="scss" scoped>
.queue-preview {
  &.queue-preview--offline-queue {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: var(--spacing-2xs);
  }

  .queue-preview--offline-queue__title {
    @extend %typo-body-1;
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
</style>
