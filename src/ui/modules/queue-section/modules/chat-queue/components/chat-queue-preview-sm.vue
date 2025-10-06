<template>
  <article
    :class="[
      { 'chat-queue-preview-sm--selected': selected },
      `chat-queue-preview-sm--${status}`,
    ]"
    class="chat-queue-preview-sm"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
  >

    <header class="chat-queue-preview-sm__header">
      <div class="chat-queue-preview-sm__icon">
        <slot name="close-icon"></slot>

        <wt-icon
          :icon="opened ? 'chat--filled': 'chat'"
          size="sm"
          class="chat-queue-preview-sm__icon--selected"
          :color="getStatusColor(status)"
        />

      </div>

      <div class="chat-queue-preview-sm__icon-status">
        <slot name="icon-status"></slot>
      </div>

      <wt-popover>
        <template #activator="{ show, hide }">
          <div @pointerenter="show" @pointerleave="hide">
            <wt-icon-btn
              color="info"
              icon="rounded-info"
              size="sm"
            ></wt-icon-btn>
          </div>
        </template>

        <div class="chat-queue-preview-sm__tooltip-content">
          <span
            v-if="$slots['tooltip-title']"
            class="chat-queue-preview-sm__tooltip-title"
          >
            <slot name="tooltip-title"></slot>
          </span>
          <span
            v-if="$slots['tooltip-subtitle']"
            class="chat-queue-preview-sm__tooltip-subtitle"
          >
            <slot name="tooltip-subtitle"></slot>
          </span>
          <div
            v-if="queueName"
            class="chat-queue-preview-sm__tooltip-chips"
          >
            <wt-chip color="secondary">
              {{ queueName }}
            </wt-chip>
          </div>
        </div>
      </wt-popover>
    </header>

    <div class="chat-queue-preview-sm__messenger-icon">
      <slot name="icon"></slot>
    </div>
    <div
      v-if="$slots.title"
      class="chat-queue-preview-sm__title"
    >
      <slot name="title"></slot>
    </div>

    <div
      v-if="$slots.subtitle"
      class="chat-queue-preview-sm__subtitle"
    >
      <slot name="subtitle"></slot>
    </div>

    <section class="chat-queue-preview-sm__avatar">
      <slot name="avatar">
        <wt-avatar
          size="sm"
        ></wt-avatar>
      </slot>
    </section>

    <div
      v-if="$slots.actions"
      class="chat-queue-preview-sm__actions"
    >
      <slot name="actions"></slot>
    </div>

    <footer
      v-if="$slots.footer"
      class="chat-queue-preview-sm__footer"
    >
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  queueName: {
    type: String,
    default: '',
  },
  status: {
    type: String,
  },
  selected: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['click']);

function getStatusColor(status) {
  const colors = {
    new: 'success',
    active: 'warning',
    'manual': 'secondary',
    closed: 'secondary',
  };
  return colors[status] || 'secondary';
}
</script>

<style lang="scss" scoped>
// styles should be unscoped due to tooltip contents styling
@import '../../_shared/css/queue-preview';

.chat-queue-preview-sm {
  position: relative;
  border: 2px solid transparent;
  transition: all var(--transition);
  cursor: pointer;

  &--opened {
    border-color: var(--primary-color);
  }

  &:hover {
    background: var(--content-wrapper-hover-color);
    transform: translateY(-1px);
  }

  &--selected {
    border-color: var(--current-border-color);
    outline: 2px solid var(--current-border-color);
    outline-offset: 2px;
    background: var(--content-wrapper-hover-color);
  }

  .chat-queue-preview-sm__icon {
    flex: 0 0 var(--icon-sm-size);
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.closed-queue-preview__close) {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      transition: var(--transition);
    }
  }

  .queue-preview-avatar {
    margin: auto;
  }

  .queue-preview-title,
  .queue-preview-subtitle {
    text-align: center;
  }

  .queue-preview-actions {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }

  // Status-based border colors
  &--new {
    border-color: var(--success-color);

    &.chat-queue-preview-sm--selected {
      border-color: var(--success-color);
      outline-color: var(--success-color);
    }
  }

  &--active {
    border-color: var(--warning-color);

    &.chat-queue-preview-sm--selected {
      border-color: var(--warning-color);
      outline-color: var(--warning-color);
    }
  }

  &--manual {
    border-color: var(--secondary-color);

    &.chat-queue-preview-sm--selected {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  &--closed {
    border-color: var(--secondary-color);

    &.chat-queue-preview-sm--selected {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  .chat-queue-preview-sm__messenger-icon {
    margin: auto;
  }
}

// tooltip content styling
.chat-queue-preview-sm__tooltip-content {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: var(--spacing-2xs);
}

</style>
