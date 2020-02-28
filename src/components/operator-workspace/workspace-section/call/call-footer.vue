<template>
  <footer class="call-footer">
    <rounded-action class="call-action">numpad</rounded-action>
    <rounded-action class="call-action">mute</rounded-action>
    <rounded-action class="call-action">pause</rounded-action>
    <rounded-action class="call-action">record</rounded-action>
    <rounded-action class="call-action">edit</rounded-action>
  </footer>
</template>

<script>
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-footer',
    components: {
      RoundedAction,
    },
  };
</script>

<style lang="scss" scoped>
  .call-footer {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0;
  }
</style>
