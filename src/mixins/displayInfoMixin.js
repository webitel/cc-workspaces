export default {
  computed: {
    displayName() {
      return this.call?.displayName || this.task?.displayName;
    },

    displayNumber() {
      return this.call?.displayNumber || this.task?.displayName;
    },
  },
};
