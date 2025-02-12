<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <div ref="chat-messages-items" class="chat-messages-items" v-chat-scroll>
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        :show-avatar="showAvatar(index)"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
        </template>
        <template v-slot:after-message>
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
import { mapActions, mapGetters } from 'vuex';
import { useChatMessages } from '../message/composables/useChatMessages.js';
import Message from '../message/chat-message.vue';
import ChatDate from '../components/chat-date.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import chatScroll from '../../../../../../../app/directives/chatScroll';

export default {
  name: 'current-chat',
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
  data: () => ({
    isMounted: false,
  }),
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
  methods: {
    ...mapActions('features/chat/chatMedia', {
      openMedia: 'OPEN_MEDIA',
      attachPlayer: 'ATTACH_PLAYER_TO_CHAT',
      cleanChatPlayers: 'CLEAN_CHAT_PLAYERS',
    }),
  },
  mounted() {
    this.isMounted = true;
  },
  destroyed() {
    this.cleanChatPlayers();
  },
};
</script>

<style lang="scss" scoped>
</style>
