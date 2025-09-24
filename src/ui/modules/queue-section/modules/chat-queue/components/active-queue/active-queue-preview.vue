<template>
  <chat-card
    v-if="size === 'md'"
    :task="task"
    :status="chatStatus"
    :title="displayChatName"
    :subtitle="lastMessage"
    :queue-name="displayQueueName"
    :icon="displayIcon"
    :selected="opened"
    @click="$emit('click', task)"
  >
    <template #timer>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </chat-card>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="displayQueueName"
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
      {{ lastMessage }}
    </template>

    <template #title>
      {{ displayChatName }}
    </template>

    <template #subtitle>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </task-queue-preview-sm>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';
import ChatCard from '../chat-card.vue';

export default {
  name: 'ActiveQueuePreview',
  components: { ChatCard },
  mixins: [taskPreviewMixin, sizeMixin, displayInfoMixin],
  computed: {
    lastMessage() {
      const lastMessage = this.task.messages[this.task.messages.length - 1] || {};
      return lastMessage.file ? lastMessage.file.name : lastMessage.text;
    },
    displayIcon() {
      const member = this.task.members[0];
      return messengerIcon(member.type);
    },
    chatStatus() {
      return this.task.closedAt && this.task.closeReason 
        ? 'closed' 
        : this.task.state === 'invite' 
          ? 'new' 
          : 'active';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
