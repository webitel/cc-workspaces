import { mapActions, mapGetters, mapState } from 'vuex';

// ATTENTION! Mixin must be imported into the-agent-workspace to correctly notify new call ringing!
// This mixin is needed for watcher to watch ringing; it is not possible to watch inside store

export default {
  watch: {
    isAnyRinging(value) {
      if (value) {
        this.playRinging();
      } else {
        this.stopPlaying();
      }
    },
  },

  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapGetters('features/call', {
      isAnyRinging: 'IS_ANY_RINGING',
    }),
    ...mapGetters('features/notifications', {
      isSoundPlaying: 'IS_PLAYING',
    }),
  },

  methods: {
    ...mapActions('features/notifications', {
      playRinging: 'RING_CALL',
      stopPlaying: 'STOP_PLAYING',
      resetUnreadCount: 'RESET_UNREAD_COUNT',
      removeStorageId: 'REMOVE_STORAGE_ID',
    }),

    handleDestroy() {
      if (this.isSoundPlaying) {
        this.stopPlaying();
      }
      this.removeStorageId();
    },
  },

  beforeDestroy() {
    this.handleDestroy();
  },
};