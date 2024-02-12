<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
      ></wt-icon>
    </template>

    <template v-slot:title>
      {{ displayChatName }}
    </template>

    <template v-slot:subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:timer>
      <queue-preview-timer
        :task="task"
      ></queue-preview-timer>
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      ></wt-icon>
    </template>

    <template v-slot:tooltip-title>
      {{ displayChatName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:title>
      {{ displayChatName }}
    </template>

    <template v-slot:subtitle>
      <queue-preview-timer
        :task="task"
      ></queue-preview-timer>
    </template>
  </task-queue-preview-sm>
</template>

<script>
import MessengerType from 'webitel-sdk/esm2015/enums/messenger-type.enum';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'active-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin, displayInfoMixin],
  computed: {
    lastMessage() {
      const lastMessage = this.task.messages[this.task.messages.length - 1];
      return lastMessage.file ? lastMessage.file.name : lastMessage.text;
    },
    displayIcon() {
      const member = this.task.members[0];
      switch (member.type) {
        case MessengerType.TELEGRAM:
          return 'messenger-telegram';
        case MessengerType.VIBER:
          return 'messenger-viber';
        case 'whatsapp':
          return 'messenger-whatsapp';
        case MessengerType.WEB_CHAT:
          return 'messenger-web-chat';
        case MessengerType.INSTAGRAM:
          return 'instagram';
        case 'facebook':
          return 'messenger-facebook';
        default:
          return member.type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
