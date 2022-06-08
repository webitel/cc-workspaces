<template>
  <section class="queue-task-container">
    <chat-preview
      v-for="task of taskList"
      :task="task"
      :opened="task === taskOnWorkspace"
      :key="task.id"
      @click="openTask"
    ></chat-preview>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ChatPreview from './chat-queue-preview.vue';

export default {
  name: 'chat-queue-container',
  components: {
    ChatPreview,
  },

  computed: {
    ...mapState('features/chat', {
      taskList: (state) => state.chatList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      openTask: 'OPEN_CHAT',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-container';
</style>
