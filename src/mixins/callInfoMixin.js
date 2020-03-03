export default {
  data: () => ({
    now: Date.now(),
    interval: null,
  }),

  mounted() {
    this.setTimeNowTimer();
  },

  destroy() {
    clearInterval(this.interval);
  },

  computed: {
    computeDisplayName() {
      return this.itemInstance.displayName || 'undefined name';
    },

    computeDisplayNumber() {
      return this.itemInstance.displayNumber || 'undefined number';
    },

    computeCreatedTime() {
      const start = this.itemInstance.answeredAt
        ? this.itemInstance.answeredAt : this.itemInstance.createdAt;
      const sec = Math.round((this.now - start) / 10 ** 3);
      return this.computeHourMinSecTime(sec);
    },
  },

  methods: {
    setTimeNowTimer() {
      this.interval = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },

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
