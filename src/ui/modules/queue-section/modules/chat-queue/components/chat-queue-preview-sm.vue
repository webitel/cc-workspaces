<template>
  <article
    :class="[
      { 'chat-queue-preview-sm--opened': opened },
      `chat-queue-preview-sm--${status}`,
    ]"
    class="chat-queue-preview-sm"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter="emit('click')"
  >

    <header class="chat-queue-preview-sm__header">
      <div class="chat-queue-preview-sm__icon">
        <slot name="close-icon"></slot>

        <wt-icon
          :icon="opened ? 'chat--filled': 'chat'"
          size="sm"
          :color="ChatColorsMap[status]"
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
          >
            <slot name="tooltip-title"></slot>
          </span>
          <span
            v-if="$slots['tooltip-subtitle']"
          >
            <slot name="tooltip-subtitle"></slot>
          </span>
          <div
            v-if="queueName"
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
import { computed, ref } from 'vue';
import { ChatColorsMap } from '../enums/ChatStatus.enum';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
  opened: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['click']);

const queueName = computed(() => props.task?.queue?.name || '');
</script>

<style lang="scss" scoped>
// styles should be unscoped due to tooltip contents styling
@import '../../_shared/css/queue-preview';

.chat-queue-preview-sm {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  background: var(--content-wrapper);
  transition: all var(--transition);
  cursor: pointer;

  &--opened {
    border-color: var(--primary-color);
  }

  &:hover {
    background: var(--content-wrapper-hover-color);
    transform: translateY(-1px);
  }

  &--opened {
    border-color: var(--current-border-color);
    outline: 2px solid var(--current-border-color);
    outline-offset: 2px;
    background: var(--content-wrapper-hover-color);
  }

  .chat-queue-preview-sm__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: var(--spacing-xs);
  }

  .chat-queue-preview-sm__icon {
    flex: 0 0 var(--icon-sm-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-queue-preview-sm__icon-status {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-queue-preview-sm__avatar {
    margin: auto;
  }

  .chat-queue-preview-sm__title,
  .chat-queue-preview-sm__subtitle {
    text-align: center;
    margin: var(--spacing-2xs) 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }


  .chat-queue-preview-sm__actions {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }

  // Status-based border colors
  &--new {
    border-color: var(--success-color);

    &.chat-queue-preview-sm--opened {
      border-color: var(--success-color);
      outline-color: var(--success-color);
    }
  }

  &--active {
    border-color: var(--warning-color);

    &.chat-queue-preview-sm--opened {
      border-color: var(--warning-color);
      outline-color: var(--warning-color);
    }
  }

  &--manual {
    border-color: var(--secondary-color);

    &.chat-queue-preview-sm--opened {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  &--closed {
    border-color: var(--secondary-color);

    &.chat-queue-preview-sm--opened {
      border-color: var(--secondary-color);
      outline-color: var(--secondary-color);
    }
  }

  .chat-queue-preview-sm__messenger-icon {
    margin: var(--spacing-xs) auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-queue-preview-sm__footer {
    margin-top: var(--spacing-xs);
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

// tooltip content styling
.chat-queue-preview-sm__tooltip-content {
  display: flex;
  flex-direction: column;
  max-width: var(--ws-task-queue-tooltip-max-width-sm);
  gap: var(--spacing-2xs);
}

</style>
