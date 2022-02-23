import { mapActions, mapGetters, mapState } from 'vuex';
import isIncomingRinging from '../store/modules/call/scripts/isIncomingRinging';

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
    ...mapState('call', {
      callList: (state) => state.callList,
    }),
    ...mapGetters('notifications', {
      isSoundPlaying: 'IS_PLAYING',
    }),

    isAnyRinging() {
      // every on empty array is true
      return this.callList.length && this.callList.every((call) => isIncomingRinging(call));
    },
  },

  methods: {
    ...mapActions('notifications', {
      playRinging: 'RING_CALL',
      stopPlaying: 'STOP_PLAYING',
      resetUnreadCount: 'RESET_UNREAD_COUNT',
    }),

    handleClosing() {
      if (this.isSoundPlaying) {
        this.stopPlaying();
      }

      document.documentElement.removeEventListener('click', () => {
        this.resetUnreadCount();
      });

      window.removeEventListener('storage', (value) => {
        if (!localStorage.getItem('windowId')) {
          localStorage.setItem('windowId', value);
        }
      });

      localStorage.removeItem('windowId');
    },
  },

  beforeRouteEnter(from, to, next) {
    if (to.fullPath === '/auth') {
      if (window.Notification.permission !== 'granted') window.Notification.requestPermission();
    }
    next();
  },

  beforeDestroy() {
    this.handleClosing();
  },
};
