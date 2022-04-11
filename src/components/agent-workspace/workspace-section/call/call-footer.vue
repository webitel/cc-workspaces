<template>
  <footer class="call-footer">
    <wt-divider/>
    <div class="call-footer__actions">
      <wt-rounded-action
        class="call-action"
        :class="{
          'hidden': !isNumpad,
         }"
        :active="isOnNumpad"
        icon="numpad"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', 'numpad')"
      ></wt-rounded-action>
      <wt-rounded-action
        class="call-action"
        :class="{
          'hidden': !isHold,
          'hold': isOnHold,
        }"
        icon="hold"
        :color="isOnHold ? 'hold' : 'secondary'"
        :active="isOnHold"
        rounded
        wide
        @click="toggleHold"
      ></wt-rounded-action>
      <wt-rounded-action
        class="call-action call-action__mic"
        :class="{
          'hidden': !isMuted,
        }"
        :icon="isOnMuted ? 'mic-muted' : 'mic'"
        :active="isOnMuted"
        color="secondary"
        rounded
        wide
        @click="toggleMute"
      ></wt-rounded-action>
<!--      <wt-rounded-action-->
<!--        class="call-action"-->
<!--        :class="{-->
<!--          'hidden': !isRecord,-->
<!--          'active': isOnRecord,-->
<!--        }"-->
<!--        :icon="isOnRecord ? 'rec-off' : 'rec'"-->
<!--        color="secondary"-->
<!--      ></wt-rounded-action>-->
<!--      <wt-rounded-action-->
<!--        class="call-action"-->
<!--        :class="{-->
<!--          'hidden': !isNote,-->
<!--          'active': isOnNote,-->
<!--        }"-->
<!--        icon="note"-->
<!--        color="secondary"-->
<!--      ></wt-rounded-action>-->
    </div>
  </footer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'call-footer',
  props: {
    currentTab: {
      type: String,
    },
  },

  computed: {
    ...mapState('call', {
      call: (state) => state.callOnWorkspace,
    }),
    ...mapGetters('call', {
      isNewCall: 'IS_NEW_CALL',
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
      return !this.isNewCall;
    },

    // controls Active state
    isOnHold() {
      return this.call.isHold;
    },

    // controls btn visibility
    isHold() {
      return !this.isNewCall;
    },

    // controls Active state
    isOnRecord() {
      return false;
    },

    // controls btn visibility
    isRecord() {
      return !this.isNewCall;
    },

    // controls Active state
    isOnNote() {
      return false;
    },

    // controls btn visibility
    isNote() {
      return !this.isNewCall;
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
  flex-direction: column;
}

.call-footer__actions {
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0;
  gap: 10px;
  margin: 0 20px;
}
</style>
