<template>
  <section class="workspace-section">
    <call-preview
      v-for="(call, key) of callList"
      :item-instance="call"
      :index="key"
      :key="key"
      @click.native.prevent="openCall(key)"
    ></call-preview>
    <!--    <message-preview></message-preview>-->
    <!--    <message-preview></message-preview>-->
    <rounded-action
      @click.native="openCall()"
    >new call</rounded-action>
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
    .rounded-action {
      position: fixed;
      bottom: 30px;
      left: 30px;
    }
  }
</style>
