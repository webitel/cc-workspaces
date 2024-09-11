<template>
  <article class="chat-started">
    <wt-divider />
      <div class="chat-started__content">
        <wt-icon
          icon="chat"
          color="success"
          size="sm"
        />
        <p> {{ $t('workspaceSec.chat.chatStarted') }} </p>
        <wt-hint v-if="props.provider">
          <template>
            <div class="chat-started-provider">
              <wt-icon :icon="iconType[props.provider]" />
              <p> {{ props.gateway }} </p>
            </div>
          </template>
        </wt-hint>
      </div>
    <wt-divider />
  </article>
</template>

<script setup>

import iconType from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ProviderIconType.enum';

const props = defineProps({
  provider: {
    type: String,
    default: '',
  },
  gateway: {
    type: String,
    default: '',
  },

});

</script>

<style lang="scss" scoped>

.chat-started {
  display: flex;
  gap: var(--spacing-2xs);
  align-items: center;

  &__content {
    display: flex;
    cursor: default;
    gap: var(--spacing-2xs)
  }

  p {
    @extend %typo-caption;
    min-width: 63px;
  }
}

.chat-started-provider {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

</style>
