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
    padding: 14px 20px;
    background: #fff;
    border-radius: $border-radius;

    @media screen and (max-height: 768px) {
      padding: 9px 20px;
    }
  }

  .widget {
    margin: 0 31px; // 63px / 2
  }

  .settings {
    position: absolute;
    right: (20px);

    &:hover .icon {
      fill: #000;
      stroke: #000;
    }
  }
</style>
