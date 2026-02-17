<template>
  <chat-queue-preview-md
    v-if="size === 'md'"
    :task="task"
    :status="chatStatus"
    :opened="opened"
    @click="$emit('click', task)"
  >
    <template #icon="{ iconColor }">
      <wt-icon
        :icon="displayIcon"
        :color="iconColor"
        size="md"
      />
    </template>
    <template #title>
      {{ displayChatName }}
    </template>

    <template #subtitle>
      <last-message-container
        :icon="lastMessageSenderIcon"
        :message="textLastMessage"
      />
    </template>
    <template #timer>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </chat-queue-preview-md>

  <chat-queue-preview-sm
    v-else-if="size === 'sm'"
    :task="task"
    :opened="opened"
    :status="chatStatus"
    @click="$emit('click', task)"
  >

    <template #icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      />
    </template>

    <template #tooltip-title>
      {{ displayChatName }}
    </template>

    <template #tooltip-subtitle>
      {{ textLastMessage }}
    </template>

    <template #title>
      {{ displayChatName }}
    </template>

    <template #subtitle>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </chat-queue-preview-sm>
</template>

<script>
import { ConversationState } from 'webitel-sdk';
import { ChatStatus } from '../../enums/ChatStatus.enum';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';

import LastMessageContainer from '../_shared/last-message-container.vue';
import ChatQueuePreviewMd from '../chat-queue-preview-md.vue';
import ChatQueuePreviewSm from '../chat-queue-preview-sm.vue';

export default {
  name: 'ActiveQueuePreview',
  components: { LastMessageContainer, ChatQueuePreviewMd, ChatQueuePreviewSm },
  mixins: [taskPreviewMixin, sizeMixin, displayInfoMixin],
  computed: {
    lastMessage() {
      return this.task.messages[this.task.messages.length - 1] || {};
    },
    textLastMessage() {
      return this.lastMessage.file ? this.lastMessage.file.name : this.lastMessage.text;
    },
    lastMessageSenderIcon() {
      if(!this.lastMessage.member) return 'bot';
      if(this.lastMessage.member?.self) return 'agent';
      if(this.lastMessage.member?.type) return 'contacts';
    },
    displayIcon() {
      const member = this.task.members[0];
      return messengerIcon(member.type);
    },
    chatStatus() {
      // Check if chat is closed
      if (this.task.closedAt && this.task.closeReason) {
        return ChatStatus.Closed;
      }

      // Check if chat is new (invite state) or active
      return this.task.state === ConversationState.Invite ? ChatStatus.New : ChatStatus.Active;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
