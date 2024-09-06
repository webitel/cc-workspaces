<template>
  <article class="chat-started">
    <wt-divider />
    <wt-icon
      icon="chat"
      color="success"
    />
    <p> {{ $t('workspaceSec.chat.chatStarted') }} </p>
    <wt-tooltip>
      <div v-if="props.provider" class="chat-protocol">
        <wt-icon :icon="iconType[props.provider]" />
        <p> {{ $t(`objects.messengers.${props.provider}`) }} </p>
      </div>
<!--      винести в окремий компонент протокол-інфо ?-->
    </wt-tooltip>
    <wt-divider />
  </article>
</template>

<script setup>

import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import ChatAgent from './chat-agent.vue';

const props = defineProps({
  provider: {
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

  p {
    %typo-caption;
  }
}

</style>
