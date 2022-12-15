<template>
  <article
    :class="[
      { 'queue-preview--opened': opened },
      `queue-preview--${size}`
    ]"
    class="queue-preview"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >
    <header class="queue-preview-header">
      <slot name="icon"></slot>
      <span class="queue-preview-header__name">
        <slot name="title">
          {{ title | truncate(22) }}
        </slot>
      </span>
      <slot name="timer">
        <queue-preview-timer :task="task" bold />
      </slot>
    </header>
    <section class="queue-preview-body">
      <slot name="body"></slot>
    </section>
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
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import displayInfo from '../../../../../mixins/displayInfoMixin';
import QueuePreviewTimer from './queue-preview-timer.vue';

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
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.queue-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-bottom: 1px;
  padding: var(--spacing-xs);
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  background: var(--main-color);
  gap: var(--spacing-xs);

  &--opened, &:focus {
    border-color: var(--accent-color);
  }

  .queue-preview-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-width: 0; // prevents queue-preview-header content overflowing
    .wt-icon {
      margin-right: var(--spacing-xs);
    }
  }

  .queue-preview-header__name {
    @extend %typo-subtitle-1;
    overflow: hidden;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .queue-preview-body {
    @extend %typo-body-2;
    color: var(--text-outline-color);
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

  &--sm {
    display: flex;
    align-items: center;
    height: 36px;
    padding: var(--spacing-xs);

    .call-status-chip {
      position: static;
      margin-right: var(--spacing-xs);
    }

    .queue-preview-header__name {
      display: none;
    }

    .queue-preview-body {
      display: none;
    }

    .queue-preview-chips {
      display: none;
    }

    .queue-preview-footer {
      display: none;
    }
  }
}

</style>
