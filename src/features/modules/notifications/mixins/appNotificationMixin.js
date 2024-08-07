import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

// ATTENTION! Mixin must be imported into the-agent-workspace to correctly notify new call ringing!
// This mixin is needed for watcher to watch ringing; it is not possible to watch inside store

export default {
  watch: {
    isAnyRinging(value) {
      if (value) this.playRinging();
      else {
        // need prevent stopPlaying() if we want play hangup sound after call end
        this.isHangupSoundAllowed
          ? this.setHangupSoundAllowance(false) // must turn back HangupSoundAllowance in default value
          : this.stopPlaying();
      }
    },
  },

  computed: {
    ...mapGetters('features/call', {
      isAnyRinging: 'IS_ANY_RINGING',
    }),
    ...mapState('features/notifications', {
      isHangupSoundAllowed: (state) => state.isHangupSoundAllowed,
    }),
  },

  methods: {
    ...mapActions('features/notifications', {
      playRinging: 'HANDLE_ANY_CALL_RINGING',
      stopPlaying: 'STOP_SOUND',
    }),
    ...mapMutations('features/notifications', {
      setHangupSoundAllowance: 'SET_HANGUP_SOUND_ALLOW',
    }),
  },
};
