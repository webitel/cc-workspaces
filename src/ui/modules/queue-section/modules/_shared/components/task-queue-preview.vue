<template>
  <article
    :class="{ 'queue-preview--opened': opened }"
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
import displayInfo from '../../../../../mixins/displayInfoMixin';
import QueuePreviewTimer from './queue-preview-timer.vue';

export default {
  name: 'task-queue-preview',
  components: { QueuePreviewTimer },
  mixins: [displayInfo],
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  box-sizing: border-box;
  position: relative;
  padding: var(--spacing-xs);
  margin-bottom: 1px;
  border: 1px solid transparent;
  background: var(--main-color);
  border-radius: var(--border-radius);
  cursor: pointer;

  &--opened, &:focus {
    border-color: var(--accent-color);
  }

  @media screen and (max-width: 1336px) {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs);
    height: 36px;

    .call-status-chip {
      position: static;
      margin-right: var(--spacing-xs);
    }
  }
}

.queue-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 0; // prevents queue-preview-header content overflowing

  &__name {
    @extend %typo-subtitle-1;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @media screen and (max-width: 1336px) {
      display: none;
    }
  }
  .wt-icon {
    margin-right: var(--spacing-xs);
  }
}

//.offline-queue .queue-preview-header__name {
//  @media screen and (max-width: 1336px) {
//    display: block;
//  }
//}

.queue-preview-body {
  @extend %typo-body-2;
  color:var(--text-outline-color);
  @media screen and (max-width: 1336px) {
    display: none;
  }
}

.queue-preview-chips {
  @media screen and (max-width: 1336px) {
    display: none;
  }
}

.queue-preview-footer {
  @media screen and (max-width: 1336px) {
    display: none;
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
