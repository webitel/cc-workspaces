import { mapActions, mapGetters, mapState } from 'vuex';

// ATTENTION! Mixin must be imported into the-agent-workspace to correctly notify new call ringing!
// This mixin is needed for watcher to watch ringing; it is not possible to watch inside store

export default {
  watch: {
    isAnyRinging(value) {
      console.warn('is any ringing', value);
      if (value) this.playRinging();
      else this.stopPlaying();
    },
  },

  computed: {
    ...mapGetters('features/call', {
      isAnyRinging: 'IS_ANY_RINGING',
    }),
  },

  methods: {
    ...mapActions('features/notifications', {
      playRinging: 'HANDLE_ANY_CALL_RINGING',
      stopPlaying: 'STOP_SOUND',
    }),
  },
};
