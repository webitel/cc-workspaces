<template>
  <section class="workspace-section">
    <call-preview
      v-for="(call, key) of callList"
      :item-instance="call"
      :key="key"
      @answer="answer(key)"
      @reject="hangup(key)"
      @click.native="openCall(key)"
    ></call-preview>
    <!--    <message-preview></message-preview>-->
    <!--    <message-preview></message-preview>-->
  </section>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import CallPreview from './queue-call-preview.vue';
  // import MessagePreview from './queue-message-preview.vue';

  export default {
    name: 'the-operator-queue-section',
    components: {
      CallPreview,
      // MessagePreview,
    },
    data: () => ({}),
    computed: {
      ...mapState('operator', {
        callList: (state) => state.callList,
      }),
    },

    methods: {
      ...mapActions('operator', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
        openCall: 'OPEN_CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>

</style>
