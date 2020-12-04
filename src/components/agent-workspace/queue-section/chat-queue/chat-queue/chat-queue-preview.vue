<template>
  <article class="queue-preview" :class="{ 'queue-preview--opened': isOpened }">
    <header class="queue-preview-header">
      <span class="queue-preview-header__name">{{displayName | truncate(18) }}</span>
      <queue-preview-timer :task="task" bold/>
    </header>

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
  components: { QueuePreviewTimer },
  mixins: [displayInfo],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isOpened() {
      return false;
    },
    displayName() {
      return this.task.members.map((member) => member.name).join(', ');
    },
    lastMessage() {
      return this.task.messages[this.task.messages.length - 1].value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
