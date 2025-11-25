<template>
  <task-footer>
    <wt-rounded-action
      :size="size"
      class="call-action"
      icon="video-cam"
      rounded
      wide
      @click="toggleVideo"
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
  }),

  computed: {
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
      isNewCall: 'IS_NEW_CALL',
    }),


    // controls Active state
    isOnMuted() {
      return this.call.muted;
    },

    // controls btn visibility
    isMuted() {
      return !this.isNewCall;
    },
  },

  methods: {
    ...mapActions('features/call', {
      toggleMute: 'TOGGLE_MUTE',
      toggleVideo: 'VIDEO_TOGGLE',
    }),
    setupHotkeys() {
      const subscribers = [
        {
          event: HotkeyAction.MUTE,
          callback: this.toggleMute,
        },
        {
          event: HotkeyAction.VIDEO_TOGGLE,
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
