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
      </div>
    <wt-hint v-if="props.protocol">
      <template>
        <div class="chat-started-protocol">
          <wt-icon :icon="iconType[props.protocol]" />
          <p> {{ props.gateway }} </p>
        </div>
      </template>
    </wt-hint>
<!--      винести в окремий компонент протокол-інфо ?-->
    <wt-divider />
  </article>
</template>

<script setup>

import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';

const props = defineProps({
  protocol: {
    type: String,
    default: '',
  },
  gateway: {
    type: String,
    default: '',
  },

});

const iconType = {
  [ChatGatewayProvider.TELEGRAM_BOT]: 'telegram-bot',
  [ChatGatewayProvider.TELEGRAM_APP]: 'messenger-telegram',
  [ChatGatewayProvider.MESSENGER]: 'meta',
  [ChatGatewayProvider.VIBER]: 'messenger-viber',
  [ChatGatewayProvider.WEBCHAT]: 'messenger-web-chat',
  [ChatGatewayProvider.INFOBIP]: 'messenger-infobip',
  [ChatGatewayProvider.CUSTOM]: 'custom-chat-gateway',
};

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

.chat-started-protocol {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

</style>
