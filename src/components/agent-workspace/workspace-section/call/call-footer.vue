<template>
  <footer class="call-footer">
    <rounded-action
      class="call-action secondary"
      :class="{
      'hidden': !isNumpad,
      'active': isOnNumpad,
      }"
      @click.native="$emit('openTab', 'numpad')"
    >
      <icon>
        <svg class="icon icon-numpad-md md">
          <use xlink:href="#icon-numpad-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary call-action__mic"
      :class="{
      'hidden': !isMuted,
      'active': isOnMuted,
      }"
      @click.native="toggleMute"
    >
      <icon>
        <svg class="icon icon-mic-md md">
          <use xlink:href="#icon-mic-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      :class="{
      'hidden': !isHold,
      'hold': isOnHold,
      }"
      @click.native="toggleHold"
    >
      <icon>
        <svg class="icon icon-hold-md md">
          <use xlink:href="#icon-hold-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      :class="{
      'hidden': !isRecord,
      'active': isOnRecord,
      }"
    >
      <icon>
        <svg class="icon icon-rec-md md">
          <use xlink:href="#icon-rec-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      :class="{
      'hidden': !isNote,
      'active': isOnNote,
      }"
    >
      <icon>
        <svg class="icon icon-note-md md">
          <use xlink:href="#icon-note-md"></use>
        </svg>
      </icon>
    </rounded-action>
  </footer>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import CallStates from '../../../../store/modules/call/callUtils/CallStates';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-footer',
    components: {
      RoundedAction,
    },

    props: {
      currentTab: {
        type: String,
      },
    },

    data: () => ({
      CallStates,
    }),

    computed: {
      ...mapState('call', {
        callState: (state) => state.callState,
        call: (state) => state.callOnWorkspace,
      }),

      // controls Active state
      isOnNumpad() {
        return this.currentTab === 'numpad';
      },

      // controls btn Appearance
      isNumpad() {
        return true;
      },

      // controls Active state
      isOnMuted() {
        return this.call.muted;
      },

      // controls btn visibility
      isMuted() {
        return this.callState !== CallStates.NEW;
      },

      // controls Active state
      isOnHold() {
        return this.call.isHold;
      },

      // controls btn visibility
      isHold() {
        return this.callState !== CallStates.NEW;
      },

      // controls Active state
      isOnRecord() {
        return false;
      },

      // controls btn visibility
      isRecord() {
        return this.callState !== CallStates.NEW;
      },

      // controls Active state
      isOnNote() {
        return false;
      },

      // controls btn visibility
      isNote() {
        return this.callState !== CallStates.NEW;
      },
    },

    methods: {
      ...mapActions('call', {
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
    padding: calcVH(10px) 0;
    margin: 0 calcVH(20px);
  }
</style>
