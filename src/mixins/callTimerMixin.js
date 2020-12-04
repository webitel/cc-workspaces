import { mapState } from 'vuex';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';

export default {
  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),

    computeCreatedTime() {
      const start = this.call.answeredAt
        ? this.call.answeredAt : this.call.createdAt;
      let sec = Math.round((this.now - start) / 10 ** 3);
      sec = sec <= 0 ? 0 : sec; // handles -1 time after answer
      return convertDuration(sec);
    },
  },
};
