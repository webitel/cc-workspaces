<template>
  <div class="contact-communications-item">
    <div class="contact-communications-item__before">
      <wt-icon
          :icon="phonesList.primary ? 'chat-message-status-sent' : ''"
          :size="size"
          color="success"
      />
    </div>
    <div class="contact-communications-item__main">
      <span class="contact-communications-item__title">{{ phonesList.number }}</span>
    </div>
    <div class="contact-communications-item__after">
      <button
          class="contact-communications-item__call"
          @click="makeCall({ user: item, number: phonesList.number })"
      >
        <wt-icon
            :size="size"
            color="success"
            icon="call--filled"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'contact-communication-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'sm',
    },
    phonesList: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
  },
};
</script>

<style lang="scss" scoped>
.contact-communications-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs);
  transition: var(--transition);
  border: 1px solid transparent;
  border-radius: var(--spacing-xs);
  gap: 8px;

  &:hover {
    border-color: var(--primary-color);

    .contact-communications-item__call {
      display: flex;
    }
  }

  &__before {
    display: flex;
    min-width: 16px;
  }

  &__main {
    flex-grow: 1;
    line-height: 1;
  }

  &__title {
    @extend %typo-body-2;
    overflow-wrap: anywhere;
  }

  &__call {
    display: none;
  }
}
</style>
