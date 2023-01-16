export default {
  data: () => ({
    queueSecCollapsed: false,
    workspaceSecCollapsed: true,
    infoSecCollapsed: false,
  }),
  computed: {
    queueSecSize() {
      if (this.collapsible && this.queueSecCollapsed) return 'sm';
      if (this.$breakpoint.md) return 'sm';
      if (this.$breakpoint.lg) return 'md';
      return 'md';
    },
    workspaceSecSize() {
      if (this.collapsible && !this.workspaceSecCollapsed) return 'md';
      if (this.$breakpoint.md) return 'sm';
      if (this.$breakpoint.lg) return 'sm';
      return 'sm';
    },
    infoSecSize() {
      if (this.collapsible && this.infoSecCollapsed) return 'sm';
      if (this.$breakpoint.mdAndDown) return 'sm';
      if (this.$breakpoint.lg) return 'md';
      return 'md';
    },
    collapsible() {
      return this.$breakpoint.mdAndUp;
    },
  },
  methods: {
    resizeQueuePanel() {
      this.queueSecCollapsed = !this.queueSecCollapsed;
    },
    resizeWorkspacePanel() {
      this.workspaceSecCollapsed = !this.workspaceSecCollapsed;
      this.infoSecCollapsed = !this.workspaceSecCollapsed;
    },
    resizeInfoPanel() {
      this.infoSecCollapsed = !this.infoSecCollapsed;
      this.workspaceSecCollapsed = !this.infoSecCollapsed;
    },
  },
};
