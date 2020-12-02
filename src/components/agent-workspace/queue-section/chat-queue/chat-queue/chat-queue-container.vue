<template>
  <section class="queue-task-container">
    <chat-preview
      v-for="task of taskList"
      :key="task.id"
      :task="task"
      @click.native.prevent="openTask(task)"
    ></chat-preview>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ChatPreview from './chat-queue-preview.vue';

export default {
  name: 'chat-queue-container',
  components: {
    ChatPreview,
  },

  computed: {
    ...mapState('chat', {
      taskList: (state) => state.chatList,
    }),
  },
  methods: {
    ...mapActions('chat', {
      openTask: 'OPEN_CHAT',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-container';
</style>
