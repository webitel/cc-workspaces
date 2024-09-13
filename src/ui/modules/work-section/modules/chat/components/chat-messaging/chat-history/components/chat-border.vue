<template>
  <article class="chat-border">
    <wt-divider />
      <div class="chat-border__content">
        <wt-icon
          :icon="props.chatEnded ? 'chat-end' : 'chat'"
          :color="props.chatEnded ? 'error' : 'success'"
          size="sm"
        />
        <p>
          {{ $t(`workspaceSec.chat.${ props.chatEnded ? 'chatEnded' : 'chatStarted' }`) }}
        </p>
        <wt-hint v-if="props.provider">
          <template>
            <div class="chat-border__provider">
              <wt-icon :icon="iconType[props.provider]" />
              <p> {{ props.gateway }} || {{ props.provider }} </p>
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
  chatEnded: {
    type: Boolean,
    default: false,
  },
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

.chat-border {
  display: flex;
  gap: var(--spacing-2xs);
  align-items: center;

  &__content {
    display: flex;
    cursor: default;
    gap: var(--spacing-2xs)
  }

  &__provider {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  p {
    @extend %typo-caption;
    min-width: 63px;
  }
}


</style>
