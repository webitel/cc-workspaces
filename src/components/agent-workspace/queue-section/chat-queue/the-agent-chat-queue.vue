<template>
  <section class="chat-queue">
    <header class="task-queue__header">
      <h2 class="task-queue__header__title">{{ $t('queueSec.chat.chats') }}</h2>
    </header>
    <chat-queue-container/>
  </section>
</template>

<script>
import ChatQueueContainer from './chat-queue/chat-queue-container.vue';

export default {
  name: 'the-agent-chat-queue',
  components: {
    ChatQueueContainer,
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../css/agent-workspace/queue-section/task-queue';
</style>
