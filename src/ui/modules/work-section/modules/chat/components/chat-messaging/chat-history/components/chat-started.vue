<template>
  <article class="chat-started">
    <wt-icon
      icon="attention"
      color="success"
    />
    Chat Started локаль
    <wt-tooltip>
<!--    якщо є шлюз-->
    <div class="chat-protocol">
      <wt-icon
        :icon="iconType[protocol]"
      />
      <p> {{ $t(`objects.messengers.${protocol}`) }} </p>
    </div>
<!--      винести в окремий компонент протокол-інфо ?-->
    </wt-tooltip>
    <chat-agent v-if="agent" :agent="agent" />
  </article>
</template>

<script setup>

import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import ChatAgent from './chat-agent.vue';

const props = defineProps({
  agent: {
    type: String,
  },
// + шлюз
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
