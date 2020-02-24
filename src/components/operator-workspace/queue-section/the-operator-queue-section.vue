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
    <rounded-action>new call</rounded-action>
  </section>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import CallPreview from './queue-call-preview.vue';
  import RoundedAction from '../../utils/rounded-action.vue';
  // import MessagePreview from './queue-message-preview.vue';

  export default {
    name: 'the-operator-queue-section',
    components: {
      CallPreview,
      // MessagePreview,
      RoundedAction,
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
  .workspace-section {
    position: relative;

    .rounded-action {
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
  }
</style>
