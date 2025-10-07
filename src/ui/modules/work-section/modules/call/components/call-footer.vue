<template>
  <task-footer>
    <wt-rounded-action
      :active="isOnNumpad"
      :class="{
          'hidden': !isNumpad,
         }"
      :size="size"
      class="call-action"
      color="secondary"
      icon="numpad"
      rounded
      wide
      @click="$emit('openTab', CallTab.Numpad)"
    ></wt-rounded-action>
    <wt-rounded-action
      :active="isOnHold"
      :class="{
          'hidden': !isHold,
          'hold': isOnHold,
        }"
      :color="isOnHold ? 'hold' : 'secondary'"
      :size="size"
      class="call-action"
      icon="hold"
      rounded
      wide
      @click="toggleHold"
    ></wt-rounded-action>
    <wt-rounded-action
      :active="isOnMuted"
      :class="{
          'hidden': !isMuted,
        }"
      :icon="isOnMuted ? 'mic-muted' : 'mic'"
      :size="size"
      class="call-action call-action__mic"
      color="secondary"
      rounded
      wide
      @click="toggleMute"
    ></wt-rounded-action>
  </task-footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import TaskFooter from '../../_shared/components/task-footer/task-footer.vue';
import { CallTab } from '../enums/CallTab.enum';

export default {
  name: 'CallFooter',
  components: { TaskFooter },
  mixins: [sizeMixin],
  props: {
    currentTab: {
      type: String,
    },
  },

  data: () => ({
    hotkeyUnsubscribers : [],
    // Made CallTab available in template (required for Options API)
    CallTab: CallTab,
  }),

  computed: {
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
      isNewCall: 'IS_NEW_CALL',
    }),

    // controls Active state
    isOnNumpad() {
      return this.currentTab === CallTab.Numpad;
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
    ...mapActions('features/call', {
      toggleMute: 'TOGGLE_MUTE',
      toggleHold: 'TOGGLE_HOLD',
    }),
    setupHotkeys() {
      const subscribers = [
        {
          event: HotkeyAction.MUTE,
          callback: this.toggleMute,
        },
        {
          event: HotkeyAction.HOLD,
          callback: this.toggleHold,
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscribers);
    },
  },

  mounted() {
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
</style>
