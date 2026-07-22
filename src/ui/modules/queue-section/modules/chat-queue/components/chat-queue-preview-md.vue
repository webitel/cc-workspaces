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
      <div class="chat-queue-preview-md-main">
        <div class="chat-queue-preview-md-details">
          <div class="chat-queue-preview-md-header">
            <div
              v-if="showIcon"
              class="chat-queue-preview-md-header__icon"
            >
              <div class="queue-preview-icon">
                <slot name="close-icon"></slot>
                <wt-icon
                  :class="{ 'chat-queue-preview-md__icon--hidden': $slots?.['close-icon'] }"
                  :icon="opened ? 'chat--filled' : 'chat'"
                  size="md"
                  :color="ChatColorsMap[status] || 'secondary'"
                />
                <wt-badge
                  v-if="unseen"
                  color-variable="error-color"
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

            <h3 class="chat-queue-preview-md-header__title typo-subtitle-2">
              <slot name="title">{{ title }}</slot>
            </h3>

            <div class="chat-queue-preview-md-header__timer typo-body-2">
              <slot name="timer"></slot>
            </div>
          </div>

          <div class="chat-queue-preview-md-body">
            <p class="chat-queue-preview-md-body__subtitle typo-body-2">
              <slot name="subtitle">{{ subtitle }}</slot>
            </p>
          </div>
        </div>
        <div v-if="$slots.actions" class="chat-queue-preview-md-actions">
          <slot name="actions"></slot>
        </div>
      </div>

      <div class="chat-queue-preview-md-footer">
        <div class="chat-queue-preview-md-footer__queue">
          <p v-if="queueName" class="chat-queue-preview-md-footer__queue-name typo-body-2">
            <span class="typo-body-2-bold">{{ $t('infoSec.generalInfo.queue') }}: </span>{{ queueName }}
          </p>
        </div>

        <div v-if="$slots['icon-status']" class="chat-queue-preview-md-footer__icons">
          <slot name="icon-status"></slot>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

import { ChatColorsMap, ChatTypes } from '../enums/ChatStatus.enum';

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
	unseen: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'click',
	'close',
]);

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
@use '@webitel/ui-sdk/src/css/main' as *;

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
    border-color: var(--p-success-color);
  }
  &--active {
    border-color: var(--p-warn-color);
  }
  &--manual {
    border-color: var(--p-secondary-color);
  }
  &--closed {
    border-color: var(--p-secondary-color);
  }

  &:hover {
    background: var(--content-wrapper-hover-color);
  }

  &--opened {
    border-color: var(--current-border-color);
    outline: 2px solid var(--current-border-color);

    &.chat-queue-preview-md--new {
      --current-border-color: var(--p-success-color);
    }
    &.chat-queue-preview-md--active {
      --current-border-color: var(--p-warn-color); }
    &.chat-queue-preview-md--manual {
      --current-border-color: var(--p-secondary-color);
    }
    &.chat-queue-preview-md--closed {
      --current-border-color: var(--p-secondary-color);
    }
  }

  &:focus {
    outline-offset: 0;
  }
}

.chat-queue-preview-md {
  &__icon--hidden {
    visibility: visible;
  }

  &:hover {
    .chat-queue-preview-md__icon--hidden {
      visibility: hidden;
    }
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

  .queue-preview-icon {
    align-items: flex-start;
  }

  &__title {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
  }

  &__timer {
    flex-shrink: 0;
  }
}

.chat-queue-preview-md-main {
  display: flex;
  gap: var(--spacing-xs);
}

.chat-queue-preview-md-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: var(--spacing-2xs);
}

.chat-queue-preview-md-body {
  &__subtitle {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.chat-queue-preview-md-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-2xs);

  &__queue {
    min-width: 0;
    &-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
    flex-shrink: 0;
  }
}

.chat-queue-preview-md-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.chat-queue-preview-md-actions {
  display: flex;
  align-items: start;
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
