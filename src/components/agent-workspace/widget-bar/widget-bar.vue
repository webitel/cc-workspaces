<template>
  <aside class="widget-bar">
    <widget></widget>
    <widget></widget>
    <widget></widget>
    <widget></widget>
    <button class="icon-btn settings">
      <icon>
        <svg class="icon icon-settings-md md">
          <use xlink:href="#icon-settings-md"></use>
        </svg>
      </icon>
    </button>
  </aside>
</template>

<script>
  import Widget from './widget.vue';

  export default {
    name: 'widget-bar',
    components: {
      Widget,
    },
  };
</script>

<style lang="scss" scoped>
  .widget-bar {
    position: relative;
    display: flex;
    justify-content: center;
    padding: calcVH(14px) calcVH(20px);
    background: #fff;
    border-radius: $border-radius;
  }

  .widget {
    margin: 0 calcVH(31px); // 63px / 2
  }

  .settings {
    position: absolute;
    right: calcVH(20px);

    &:hover .icon {
      fill: #000;
      stroke: #000;
    }
  }
</style>
