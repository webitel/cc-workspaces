<template>
  <wt-send-message-popup
    v-if="isOpenChatPopup"
    :item="selectItem"
    :user-id="userId"
    @close="closeChat" 
  />

  <div
class="contact-card-messaging"
       :class="[`contact-card-messaging--${props.size}`]">
    <ul>
      <li
        v-for="(item, idx) of chats"
        :key="item.id"
        class="contact-card-messaging-item"
      >
        <wt-divider v-if="idx"/>
        <div class="contact-card-messaging__wrapper">
          <div class="contact-card-messaging-protocol">
            <wt-icon
              :icon="iconType[item.protocol]"
            />
            <p> {{ $t(`objects.messengers.${item.protocol}`) }} </p>
          </div>
          <p>{{ item.app.name }}</p>
          <wt-icon-btn
            class="contact-card-messaging__chat-btn"
            icon="chat"
            :disabled="isDisabledChatAction(item)"
            @click="openChat(item)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ChatGatewayProvider } from '@webitel/api-services/enums';
import { WtSendMessagePopup } from '@webitel/ui-sdk/components';
import iconType from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ProviderIconType.enum';
import { computed, ref } from 'vue';
import { useUserinfoStore } from '../../../../../../../userinfo/userinfoStore';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
		options: [
			'sm',
			'md',
		],
	},
	contact: {
		type: Object,
	},
});

const { userId } = useUserinfoStore();

const chats = computed(() => props.contact?.imclients?.data);

const isOpenChatPopup = ref(false);
const selectItem = ref(null);

const availableProviders = [
	ChatGatewayProvider.TELEGRAM_BOT,
	ChatGatewayProvider.VIBER,
	ChatGatewayProvider.MESSENGER,
	ChatGatewayProvider.PORTAL,
	ChatGatewayProvider.CUSTOM,
];

const openChat = (item) => {
	isOpenChatPopup.value = true;
	selectItem.value = item;
};

const closeChat = () => {
	isOpenChatPopup.value = false;
	selectItem.value = null;
};

const isDisabledChatAction = (item) => {
	return (
		!availableProviders.includes(item.protocol) &&
		(!access.hasRbacEditAccess || isReadOnly)
	);
};
</script>

<style lang="scss" scoped>
.contact-card-messaging {
  &-item {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: var(--spacing-xs);
  }

  &-protocol {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__chat-btn {
    justify-self: end;
  }

  &--sm {
    .contact-card-messaging__wrapper {
      display: block;
    }
  }
}
</style>
