<template>
  <article
    :class="[
      'chat-card',
      `chat-card--${status}`,
      {
        'chat-card--hover': isHovered,
        'chat-card--selected': isSelected,
      }
    ]"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="chat-card__icon">
      <wt-icon
        :icon="isSelected ? 'chat--filled': 'chat'"
        size="md"
        class="chat-card__icon--selected"
        :color="getStatusColor(status)"
      />
    </div>

    <div class="chat-card__content">
      <div class="chat-card__header">
        <div class="chat-card__icon--messenger">
          <wt-icon
            v-if="showIcon"
            :icon="icon"
            :color="iconColor"
            size="md"
          />
        </div>
        <h3 class="chat-card__title">
          <slot name="title">{{ title }}</slot>
        </h3>
        <div class="chat-card__timer">
          <slot name="timer"></slot>
        </div>
      </div>

      <div class="chat-card__body">
        <p class="chat-card__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
        <div class="chat-card__queue">
          <wt-chip
            v-if="queueName"
            color="secondary"
            size="sm"
          >
            {{ queueName }}
          </wt-chip>
        </div>
      </div>
    </div>

    <div class="chat-card__actions">
      <wt-icon-btn
        v-if="showCloseButton"
        icon="close--filled"
        color="error"
        size="sm"
        class="chat-card__close-btn"
        @click.stop="$emit('close', task)"
      />
      <slot name="actions"></slot>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
    validator: (value) => ['new', 'active', 'self-assigned', 'closed'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  queueName: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'chat',
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click', 'close']);

const isHovered = ref(false);

const isSelected = computed(() => props.selected);

const showIcon = computed(() => {
  // Self-assigned chats don't show icon in default state
  return props.status !== 'self-assigned' || isSelected.value;
});

const showCloseButton = computed(() => {
  // Show close button for active chats that are not selected
  return props.status === 'active' && !isSelected.value;
});

const iconColor = computed(() => {
  if (isSelected.value) {
    return getStatusColor(props.status);
  }
  return 'secondary';
});

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

<style lang="scss" scoped>
.chat-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  background: var(--content-wrapper);
  cursor: pointer;
  transition: all var(--transition);
  min-height: 60px;

  &--new {
    border-color: var(--success-color);
  }

  &--active {
    border-color: var(--warning-color);
  }

  &--self-assigned {
    border-color: var(--secondary-color);
  }

  &--closed {
    border-color: var(--secondary-color);
  }

  &--hover {
    background: var(--content-wrapper-hover-color);
  }

  &--selected {
    box-shadow: 0 0 0 2px var(--current-border-color);

    &.chat-card--new {
      --current-border-color: var(--success-color);
    }

    &.chat-card--active {
      --current-border-color: var(--warning-color);
    }

    &.chat-card--self-assigned {
      --current-border-color: var(--secondary-color);
    }

    &.chat-card--closed {
      --current-border-color: var(--secondary-color);
    }
  }

  &:focus {
    outline-offset: 2px;
  }
}

.chat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;

  &--messenger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
}

.chat-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.chat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.chat-card__title {
  @extend %typo-subtitle-2;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
}

.chat-card__timer {
  @extend %typo-body-2;
  flex-shrink: 0;
}

.chat-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.chat-card__subtitle {
  @extend %typo-body-2;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.chat-card__queue {
  display: flex;
  align-items: center;
}

.chat-card__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
  flex-shrink: 0;
}

.chat-card__close-btn {
  opacity: 0;
  transition: var(--transition);
}

.chat-card:hover .chat-card__close-btn {
  opacity: 1;
}
</style>
