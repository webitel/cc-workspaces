import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('ui/now', {
      now: (state) => state.now,
    }),

    startTime() {
      const start = this.task.answeredAt
        ? this.task.answeredAt : this.task.createdAt;
      let sec = Math.round((this.now - start) / 10 ** 3);
      sec = sec <= 0 ? 0 : sec; // handles -1 time after answer
      return convertDuration(sec);
    },
  },
};
