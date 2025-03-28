<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <div ref="chat-messages-items" class="chat-messages-items">
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        :show-avatar="showAvatar(index)"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
      >
        <template #before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
        </template>
        <template #after-message>
          <chat-activity-info
            v-if="isLastMessage(index)"
            ended
          />
        </template>
      </message>
    </div>
  </section>
</template>

<script>
import { nextTick } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import chatScroll from '../../../../../../../app/directives/chatScroll';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatDate from '../components/chat-date.vue';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages.js';

export default {
  name: 'CurrentChat',
  directives: { chatScroll },
  components: {
    Message,
    ChatDate,
    ChatActivityInfo,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  setup() {
    const {
      messages,

      showAvatar,
      showChatDate,
      focusOnInput,
      isLastMessage,
    } = useChatMessages();

    return {
      messages,

      showAvatar,
      showChatDate,
      focusOnInput,
      isLastMessage,
    };
  },
  data: () => ({
    isMounted: false,
  }),
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    chatId() {
      return this.chat.id;
    },
    messagesLength() {
      return this.messages?.length;
    },
    isLastMessageMy() {
      return this.messages[this.messages?.length - 1]?.member?.self;
    }
  },
  methods: {
    ...mapActions('features/chat/chatMedia', {
      openMedia: 'OPEN_MEDIA',
      attachPlayer: 'ATTACH_PLAYER_TO_CHAT',
      cleanChatPlayers: 'CLEAN_CHAT_PLAYERS',
    }),
    scrollToBottom() {
      const el = this.$refs['chat-messages-items'];
      el.scrollTop = el?.scrollHeight;
    }
  },
  watch: {
    chatId: {
      async handler() {
        await nextTick(() =>
          this.scrollToBottom()
        );
      },
      immediate: true,
    },
    messagesLength: {
      async handler(messagesLength, oldMessagesLength) {
        const newMessages = messagesLength - oldMessagesLength;

        if (!messagesLength || !oldMessagesLength) this.scrollToBottom();
        if (newMessages === 1 && this.isLastMessageMy) this.scrollToBottom();
      },
      flush: 'post',
    },
  },
  mounted() {
    this.isMounted = true;
  },
  unmounted() {
    this.cleanChatPlayers();
  },
};
</script>

<style lang="scss" scoped>
</style>
