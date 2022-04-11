<template>
  <aside class="call-status-chip">
    <wt-icon
      :icon="icon"
      :color="iconColor"
      size="sm"
    ></wt-icon>
  </aside>
</template>

<script>
export default {
  name: 'call-status-icon-chip',
  props: {
    state: {
      type: String,
      default: 'call',
    },
  },

  computed: {
    icon() {
      switch (this.state) {
        case 'call':
          return 'call';
        case 'hold':
          return 'hold';
        case 'missed':
          return 'call-missed'; // missed -> missed
        default:
          return 'call';
      }
    },
    iconColor() {
      switch (this.state) {
        case 'call':
          return 'success';
        case 'hold':
          return 'hold';
        case 'missed':
          return 'danger'; // missed -> missed
        default:
          return 'success';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.call-status-chip {
  margin-right: var(--spacing-xs);
}
</style>
