<template>
  <article
    :class="[
      { 'queue-preview--hover': isHovered },
      { 'queue-preview--selected': selected },
      `queue-preview--${status}`,
    ]"
    class="queue-preview queue-preview-sm"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >

    <header class="queue-preview-header">
      <div class="queue-preview-icon">
        <slot name="close-icon"></slot>

        <wt-icon
          :icon="opened ? 'chat--filled': 'chat'"
          size="sm"
          class="chat-card__icon--selected"
          :color="getStatusColor(status)"
        />

      </div>

      <div class="queue-preview-icon-status">
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

        <div class="queue-preview-tooltip-content">
          <span
            v-if="$slots['tooltip-title']"
            class="queue-preview-tooltip-title"
          >
            <slot name="tooltip-title"></slot>
          </span>
          <span
            v-if="$slots['tooltip-subtitle']"
            class="queue-preview-tooltip-subtitle"
          >
            <slot name="tooltip-subtitle"></slot>
          </span>
          <div
            v-if="queueName"
            class="queue-preview-tooltip-chips"
          >
            <wt-chip color="secondary">
              {{ queueName }}
            </wt-chip>
          </div>
        </div>
      </wt-popover>
    </header>

    <div class="queue-messenger-icon">
      <slot name="icon"></slot>
    </div>
    <div
      v-if="$slots.title"
      class="queue-preview-title"
    >
      <slot name="title"></slot>
    </div>

    <div
      v-if="$slots.subtitle"
      class="queue-preview-subtitle"
    >
      <slot name="subtitle"></slot>
    </div>

    <section class="queue-preview-avatar">
      <slot name="avatar">
        <wt-avatar
          size="sm"
        ></wt-avatar>
      </slot>
    </section>

    <div
      v-if="$slots.actions"
      class="queue-preview-actions"
    >
      <slot name="actions"></slot>
    </div>

    <footer
      v-if="$slots.footer"
      class="queue-preview-footer"
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

const isHovered = ref(false);

function getStatusColor(status) {
  const colors = {
    new: 'success',
    active: 'warning',
    'self-assigned': 'secondary',
    closed: 'secondary',
  };
  return colors[status] || 'secondary';
}
</script>

<style lang="scss">
// styles should be unscoped due to tooltip contents styling
@import '../../_shared/css/queue-preview';

.queue-preview {
  position: relative;
  border: 2px solid transparent;
  transition: all var(--transition);
  cursor: pointer;

  &.queue-preview--opened {
    border-color: var(--primary-color);
  }

  &.queue-preview--hover {
    background: var(--content-wrapper-hover-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.queue-preview--selected {
    border-color: var(--current-border-color);
    outline: 2px solid var(--current-border-color);
    outline-offset: 2px;
    background: var(--content-wrapper-hover-color);
  }

  .queue-preview-icon {
    flex: 0 0 var(--icon-sm-size);
    display: flex;
    align-items: center;
    justify-content: center;

    .closed-queue-preview__close {
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

    &.queue-preview--selected {
      border-color: var(--success-color);
      outline-color: var(--success-color);
    }
  }

  &--active {
    border-color: var(--warning-color);

    &.queue-preview--selected {
      border-color: var(--warning-color);
      outline-color: var(--warning-color);
    }
  }

  &--self-assigned {
    border-color: var(--secondary-color);

    &.queue-preview--selected {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  &--closed {
    border-color: var(--secondary-color);

    &.queue-preview--selected {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  .queue-messenger-icon {
    margin: auto;
  }
}

// tooltip content styling
.queue-preview-tooltip-content {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: var(--spacing-2xs);
}

</style>
