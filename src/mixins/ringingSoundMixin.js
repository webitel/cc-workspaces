import { mapState } from 'vuex';
import isIncomingRinging from '../store/modules/call/scripts/isIncomingRinging';

const AUDIO_URL = require('../../public/ringing.mp3');

export default {
  data: () => ({
    ringingAudio: new Audio(AUDIO_URL),
  }),

  created() {
    this.ringingAudio.loop = true;
  },

  watch: {
    isEveryRinging(value) {
      if (value) {
        this.ringingAudio.play().catch();
      } else {
        this.ringingAudio.pause();
        this.ringingAudio.currentTime = 0;
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
