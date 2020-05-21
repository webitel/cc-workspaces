import { mapState } from 'vuex';
import { CallActions, CallDirection } from 'webitel-sdk';

const AUDIO_URL = 'http://dl7.dwld.ru/download/start/219259510_456240245/pskv-syntpop.mp3';

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
      return this.callList.length && this.callList.every((call) => {
        const isPreviewDialer = call.queue && call.queue.queue_type === 'preview';
        return call.state === CallActions.Ringing // Inbound ringing
          && (
            call.direction === CallDirection.Inbound
            || (call.direction === CallDirection.Outbound // Outbound preview dialer
              && isPreviewDialer)
          );
      });
    },
  },
};
