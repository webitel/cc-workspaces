<template>
  <section class="workspace-section">
    <call-preview></call-preview>
    <message-preview></message-preview>
    <message-preview></message-preview>
    <rounded-action>new call</rounded-action>
  </section>
</template>

<script>
  import CallPreview from './queue-call-preview.vue';
  import MessagePreview from './queue-message-preview.vue';
  import RoundedAction from '../../utils/rounded-action.vue';

  export default {
    name: 'the-operator-queue-section',
    components: {
      CallPreview,
      MessagePreview,
      RoundedAction,
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
