<template>
  <chat-queue-preview-md
    v-if="size === 'md'"
    :task="task"
    :status="chatStatus"
    :queue-name="displayQueueName"
    :icon="displayIcon"
    :selected="opened"
    @click="$emit('click', task)"
  >
    <template #title>
      {{ displayChatName }}
    </template>

    <template #subtitle>
      {{ lastMessage }}
    </template>
    <template #timer>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </chat-queue-preview-md>

  <chat-queue-preview-sm
    v-else-if="size === 'sm'"
    :selected="opened"
    :status="chatStatus"
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
  </chat-queue-preview-sm>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';
import ChatQueuePreviewMd from '../chat-queue-preview-md.vue';
import ChatQueuePreviewSm from '../chat-queue-preview-sm.vue';

export default {
  name: 'ActiveQueuePreview',
  components: { ChatQueuePreviewMd, ChatQueuePreviewSm },
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
