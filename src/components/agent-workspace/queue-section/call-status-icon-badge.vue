<template>
  <aside class="call-status-badge" :class="computeIconClass">
    <icon>
      <svg class="icon sm" :class="`icon-${computeIconClass}-sm`">
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
      computeIconClass() {
        switch (this.state) {
          case 'call': return 'call';
          case 'hold': return 'hold';
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
  }
</style>
