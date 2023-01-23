<template>
  <component
    :is="`task-queue-preview-${size}`"
    :task="task"
    :opened="opened"
    @click="$emit('click', task)"
  >
    <template
      v-slot:icon
      v-if="size === 'md'"
    >
      <wt-icon
        :icon="displayIcon"
        size="sm"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-icon
        :icon="displayIcon"
        size="md"
      ></wt-icon>
    </template>
    <template v-slot:title>
      {{ displayName }}
    </template>
    <template v-slot:body>
      {{ lastMessage }}
    </template>
  </component>
</template>

<script>
import MessengerType from 'webitel-sdk/esm2015/enums/messenger-type.enum';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../_shared/mixins/task-preview-mixin';

export default {
  name: 'chat-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  computed: {
    displayName() {
      return this.task.members.map((member) => member.name).join(', ');
    },
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
        case MessengerType.FACEBOOK:
          return 'messenger-facebook';
        case MessengerType.WHATSAPP:
          return 'messenger-whatsapp';
        case MessengerType.WEB_CHAT:
          return 'messenger-web-chat';
        case MessengerType.INSTAGRAM:
          return 'instagram';
        default:
          return member.type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
