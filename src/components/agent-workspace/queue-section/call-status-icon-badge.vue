<template>
  <aside class="call-status-badge" :class="computeBadgeClass">
    <icon>
      <svg class="icon sm">
        <use :xlink:href="`#icon-${computeIconClass}-sm`"></use>
      </svg>
    </icon>
  </aside>
</template>

<script>
  export default {
    name: 'call-status-icon-badge',
    props: {
      state: {
        type: String,
        default: 'call',
      },
    },

    computed: {
      computeBadgeClass() {
        switch (this.state) {
          case 'call': return 'call';
          case 'hold': return 'hold';
          case 'missed': return 'missed'; // missed -> missed
          default: return 'call';
        }
      },
      computeIconClass() {
        switch (this.state) {
          case 'call': return 'call';
          case 'hold': return 'hold';
          case 'missed': return 'call'; // missed -> call icon
          default: return 'call';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .call-status-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calcVH(10px);
    left: calcVH(10px);
    width: calcVH(17px);
    height: calcVH(17px);
    border-radius: 50%;

    .icon-wrap {
      width: calcVH(17px);
      height: calcVH(17px);
    }

    .icon {
      fill: #fff;
      stroke: #fff;
    }

    &.call {
      background: $call-btn-color;
    }

    &.hold {
      background: $hold-btn-color;
    }

    &.missed {
      background: $disconnect-color;
    }
  }
</style>
