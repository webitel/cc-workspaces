<template>
  <div class="contact-card-messaging"
       :class="[`contact-card-messaging--${props.size}`]">
    <ul>
      <li
        v-for="({ id, protocol, app }, idx) of chats"
        :key="id"
        class="contact-card-messaging__item"
      >
        <wt-divider v-if="idx"/>
        <div class="contact-card-messaging__wrapper">
          <div class="contact-card-messaging__inner">
            <wt-icon
              :icon="iconType[protocol]"
            />
            <p> {{ $t(`objects.messengers.${protocol}`) }} </p>
          </div>
          <p>{{ app.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
  },
});

const chats = computed(() => props.contact.imclients.data);

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
.contact-card-messaging {
  &__item {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--spacing-xs);
  }

  &__inner {
    display: flex;
    gap: var(--spacing-xs);
  }

  &--sm {
    .contact-card-emails__wrapper {
      display: block;
    }
  }
}
</style>
