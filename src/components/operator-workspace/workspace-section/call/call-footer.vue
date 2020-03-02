<template>
  <footer class="call-footer">
    <rounded-action
      class="call-action secondary"
      :class="{'active': true}"
      @click.native="$emit('openTab', 'numpad')"
    >numpad
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      @click.native="toggleMute"
    >mute
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      @click.native="toggleHold"
    >hold
    </rounded-action>
    <rounded-action
      class="call-action secondary"
    >record
    </rounded-action>
    <rounded-action
      class="call-action secondary"
    >edit
    </rounded-action>
  </footer>
</template>

<script>
  import { mapActions } from 'vuex';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-footer',
    components: {
      RoundedAction,
    },

    methods: {
      ...mapActions('operator', {
        toggleMute: 'TOGGLE_MUTE',
        toggleHold: 'TOGGLE_HOLD',
      }),
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
