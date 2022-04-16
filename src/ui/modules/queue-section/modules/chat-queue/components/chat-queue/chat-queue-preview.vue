<template>
  <article class="queue-preview" :class="{ 'queue-preview--opened': opened }">
    <header class="queue-preview-header">
      <wt-icon icon-prefix="messenger" :icon="displayIcon" size="sm"></wt-icon>
      <span class="queue-preview-header__name">{{ displayName | truncate(18) }}</span>
      <queue-preview-timer :task="task" bold/>
    </header>
    <section class="queue-preview-body">
      <div class="chat-preview__message">
        {{ lastMessage | truncate(30) }}
      </div>
    </section>
    <section class="queue-preview-chips" v-if="displayQueueName">
      <wt-chip color="secondary">
        {{ displayQueueName }}
      </wt-chip>
    </section>
    <!--    <footer class="queue-preview-footer"></footer>-->
  </article>
</template>

<script>
import MessengerType from 'webitel-sdk/esm2015/enums/messenger-type.enum';
import QueuePreviewTimer from '../../../shared/queue-preview-timer.vue';
import displayInfo from '../../../../../../mixins/displayInfoMixin';

export default {
  name: 'chat-queue-preview',
  components: { QueuePreviewTimer },
  mixins: [displayInfo],
  props: {
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
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
          return 'telegram';
        case MessengerType.VIBER:
          return 'viber';
        case MessengerType.FACEBOOK:
          return 'facebook';
        case MessengerType.WHATSAPP:
          return 'whatsapp';
        case MessengerType.WEB_CHAT:
          return 'web-chat';
        default:
          return member.type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-preview';
</style>
