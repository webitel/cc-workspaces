<template>
  <article class="queue-preview" :class="{ 'queue-preview--opened': opened }">
    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{ displayName | truncate(18) }}</span>
      <queue-preview-timer :task="task" bold/>
    </header>

    <wt-badge color="secondary" v-if="displayQueueName">
      {{ displayQueueName }}
    </wt-badge>

    <section class="queue-preview-body">
      <div class="chat-preview__message">
        {{ lastMessage | truncate(30) }}
      </div>
    </section>

    <footer class="queue-preview-footer"></footer>
  </article>
</template>

<script>
import QueuePreviewTimer from '../../shared/queue-preview-timer.vue';
import displayInfo from '../../../../../mixins/displayInfoMixin';

export default {
  name: 'chat-queue-preview',
  components: {QueuePreviewTimer},
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
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
