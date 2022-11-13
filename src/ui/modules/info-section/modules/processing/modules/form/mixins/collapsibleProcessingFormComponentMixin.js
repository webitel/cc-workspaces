export default {
  props: {
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    collapsed: true,
  }),
  methods: {
    handleCollapse() {
      this.collapsed = !this.collapsed;
    },
  },
};
