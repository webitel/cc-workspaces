import { mapState } from 'vuex';

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
      return this.computeHourMinSecTime(sec);
    },
  },

  methods: {
    computeHourMinSecTime(time) {
      let hour = Math.floor(time / 60 ** 2);
      let min = Math.floor(time / 60);
      let sec = Math.floor(time % 60);
      hour = hour < 10 ? `0${hour}` : hour;
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      return `${hour}:${min}:${sec}`;
    },
  },
};
