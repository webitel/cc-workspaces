<template>
  <section class="queue-task-container">
    <active-preview
      v-for="(call, key) of callList"
      :call="call"
      :opened="call === taskOnWorkspace"
      :index="key"
      :key="key"
      @click="openCall"
      @answer="answer({ callId: call.id })"
      @hangup="hangup({ callId: call.id })"
    ></active-preview>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
  import ActivePreview from './active-queue-preview.vue';

  export default {
    name: 'active-queue-container',
    components: {
      ActivePreview,
    },

    computed: {
      ...mapState('features/call', {
        callList: (state) => state.callList,
      }),
      ...mapGetters('workspace', {
        taskOnWorkspace: 'TASK_ON_WORKSPACE',
      }),
    },

    methods: {
      ...mapActions('features/call', {
        openCall: 'OPEN_ACTIVE_CALL',
        answer: 'ANSWER',
        hangup: 'HANGUP',
      }),
    },
  };
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-container';
</style>
