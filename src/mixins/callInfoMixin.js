export default {
  computed: {
    // computeDisplayName() {
    //   return this.itemInstance.displayName || 'undefined name';
    // },
    //
    // computeDisplayNumber() {
    //   return this.itemInstance.displayNumber || 'undefined number';
    // },

    computeCreatedTime() {
      const sec = Math.round((this.now - this.itemInstance.createdAt) / 10 ** 3);
      return this.computeMinSecTime(sec);
    },
  },

  methods: {
    computeMinSecTime(time) {
      let min = Math.floor(time / 60);
      let sec = Math.floor(time % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      return `${min}:${sec}`;
    },
  },
};
