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
      return this.computeMinSecTime(sec);
    },
  },

  methods: {
    setTimeNowTimer() {
      this.interval = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },

    computeMinSecTime(time) {
      let min = Math.floor(time / 60);
      let sec = Math.floor(time % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      return `${min}:${sec}`;
    },
  },

};
