<template>
  <article
    :class="[
      'chat-queue-preview-md',
      `chat-queue-preview-md--${status}`,
      {
        'chat-queue-preview-md--opened': opened,
      }
    ]"
    tabindex="0"
    @click="emit('click', task)"
    @keydown.enter="emit('click', task)"
  >
    <div class="chat-queue-preview-md-content">
      <div class="chat-queue-preview-md-header">
        <div class="chat-queue-preview-md-header__icon">
          <div class="queue-preview-icon">
            <slot name="close-icon"></slot>
            <wt-icon
              v-if="showIcon"
              :icon="opened ? 'chat--filled' : 'chat'"
              size="md"
              :color="ChatColorsMap[status] || 'secondary'"
            />
          </div>
        </div>

        <div class="chat-queue-preview-md-header__icon--messenger">
          <slot name="icon" :iconColor="iconColor">
            <wt-icon
              :icon="icon"
              :color="iconColor"
              size="md"
            />
          </slot>
        </div>

        <h3 class="chat-queue-preview-md-header__title">
          <slot name="title">{{ title }}</slot>
        </h3>

        <div class="chat-queue-preview-md-header__timer">
          <slot name="timer"></slot>
        </div>
      </div>

      <div class="chat-queue-preview-md-body">
        <div class="chat-queue-preview-md-body__content">
          <p class="chat-queue-preview-md-body__subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
          <div class="chat-queue-preview-md-body__queue">
            <wt-chip v-if="queueName" color="secondary" size="sm">
              {{ queueName }}
            </wt-chip>
          </div>
        </div>

        <div class="chat-queue-preview-md-body__icons">
          <slot name="icon-status"></slot>
        </div>
      </div>
    </div>

    <div class="chat-queue-preview-md-actions">
      <slot name="actions"></slot>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { ChatColorsMap, ChatTypes } from '../enums/ChatStatus.enum'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'chat',
  },
  opened: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click', 'close']);

const queueName = computed(() => props.task?.queue?.name || '');

const showIcon = computed(() => {
  // Manual chats don't show icon in default state
  return props.status !== ChatTypes.Manual;
});

const iconColor = computed(() => {
  if (props.opened) {
    return ChatColorsMap[props.status] || 'secondary';
  }
  return 'secondary';
});
</script>

<style lang="scss" scoped>
.chat-queue-preview-md {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  margin: 0 var(--spacing-3xs);
  padding: var(--spacing-xs);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  background: var(--content-wrapper);
  cursor: pointer;
  transition: all var(--transition);
  outline: 0;

  &--new {
    border-color: var(--success-color);
  }
  &--active {
    border-color: var(--warning-color);
  }
  &--manual {
    border-color: var(--secondary-color);
  }
  &--closed {
    border-color: var(--secondary-color);
  }

  &:hover {
    background: var(--content-wrapper-hover-color);
  }

  &--opened {
    border-color: var(--current-border-color);
    outline: 2px solid var(--current-border-color);

    &.chat-queue-preview-md--new {
      --current-border-color: var(--success-color);
    }
    &.chat-queue-preview-md--active {
      --current-border-color: var(--warning-color); }
    &.chat-queue-preview-md--manual {
      --current-border-color: var(--secondary-color);
    }
    &.chat-queue-preview-md--closed {
      --current-border-color: var(--secondary-color);
    }
  }

  &:focus {
    outline-offset: 0;
  }
}

.chat-queue-preview-md-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);

  &__icon,
  &__icon--messenger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__title {
    @extend %typo-subtitle-2;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
  }

  &__timer {
    @extend %typo-body-2;
    flex-shrink: 0;
  }
}

.chat-queue-preview-md-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--spacing-sm);

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
    flex: 1;
    min-width: 0;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
    flex-shrink: 0;
  }

  &__subtitle {
    @extend %typo-body-2;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__queue {
    display: flex;
    align-items: center;
  }
}

.chat-queue-preview-md-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.chat-queue-preview-md-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
  flex-shrink: 0;
}

.chat-queue-preview-md__close-btn {
  opacity: 0; transition: var(--transition);
}
.chat-queue-preview-md:hover .chat-queue-preview-md__close-btn {
  opacity: 1;
}
</style>
