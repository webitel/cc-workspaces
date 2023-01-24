<template>
  <article
    :class="[
      { 'queue-preview--opened': opened },
    ]"
    class="queue-preview queue-preview--md"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >

    <header class="queue-preview-header">
      <div class="queue-review-header__icon">
        <slot name="icon"></slot>
      </div>
      <div class="queue-preview-header__text-wrapper">
      <span class="queue-preview-header__title">
        <slot name="title"></slot>
      </span>
        <p class="queue-preview-header__subtitle">
          <slot name="body"></slot>
        </p>
      </div>

      <slot name="timer">
        <queue-preview-timer
          :task="task"
        ></queue-preview-timer>
      </slot>
    </header>

    <section
      v-if="displayQueueName"
      class="queue-preview-chips"
    >
      <wt-chip color="secondary">
        {{ displayQueueName }}
      </wt-chip>
    </section>

    <footer
      v-if="$slots.footer || $slots.actions"
      class="queue-preview-footer"
    >
      <slot name="footer">
        <div class="queue-preview-actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </footer>

  </article>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfo from '../../../../../../mixins/displayInfoMixin';
import QueuePreviewTimer from '../queue-preview-timer.vue';

export default {
  name: 'task-queue-preview',
  components: { QueuePreviewTimer },
  mixins: [displayInfo, sizeMixin],
  props: {
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/queue-preview';

.queue-preview--md {
    .queue-review-header__icon {
    flex: 0 0 24px;
  }

  .queue-preview-header__text-wrapper {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: var(--spacing-2xs);
    min-width: 0; // prevents content overflowing
  }

  .queue-preview-actions {
    display: flex;

    .wt-button {
      flex-grow: 1;

      &:first-child {
        margin-right: var(--spacing-xs);
      }
    }
  }
}

</style>
