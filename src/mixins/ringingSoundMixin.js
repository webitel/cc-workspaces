import { mapState } from 'vuex';
import isIncomingRinging from '../store/modules/call/scripts/isIncomingRinging';

// this mixin needed for watcher to watch ringing calls; it is not possible to watch inside store

export default {
  watch: {
    isEveryRinging(value) {
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

    isEveryRinging() {
      // every on empty array is true
      return this.callList.length && this.callList.every((call) => isIncomingRinging(call));
    },
  },
};
